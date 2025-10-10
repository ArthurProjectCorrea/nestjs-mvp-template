/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { CleanupService } from './cleanup.service';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

describe('CleanupService', () => {
  let service: CleanupService;
  let prismaService: PrismaService;
  let redisService: RedisService;

  beforeEach(async () => {
    const prismaMock = {
      token: {
        findMany: jest.fn(),
        update: jest.fn(),
        count: jest.fn(),
      },
      auditLog: {
        deleteMany: jest.fn(),
      },
    };

    const redisMock = {
      getClient: jest.fn().mockReturnValue({
        setex: jest.fn(),
        zrem: jest.fn(),
        del: jest.fn(),
        sadd: jest.fn(),
        expire: jest.fn(),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CleanupService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: RedisService, useValue: redisMock },
      ],
    }).compile();

    service = module.get<CleanupService>(CleanupService);
    prismaService = module.get(PrismaService);
    redisService = module.get(RedisService);

    // Set test environment variables
    process.env.AUDIT_RETENTION_DAYS = '365';
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.AUDIT_RETENTION_DAYS;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('cleanupExpiredTokens', () => {
    it('should revoke expired tokens and update Redis', async () => {
      const expiredTokens = [
        {
          id: 1,
          userId: 1,
          refreshTokenHash: 'hash1',
          jti: 'jti1',
          expiresAt: new Date(Date.now() - 1000), // Expired
          ip: '127.0.0.1',
        },
        {
          id: 2,
          userId: 2,
          refreshTokenHash: 'hash2',
          jti: 'jti2',
          expiresAt: new Date(Date.now() - 2000), // Expired
          ip: '127.0.0.1',
        },
      ];

      (prismaService.token.findMany as jest.Mock).mockResolvedValue(
        expiredTokens,
      );
      (prismaService.token.update as jest.Mock).mockResolvedValue({});

      const redisClient = redisService.getClient();

      await service.cleanupExpiredTokens();

      // Should update each expired token in database
      expect(prismaService.token.update).toHaveBeenCalledTimes(2);
      expect(prismaService.token.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { isRevoked: true },
      });
      expect(prismaService.token.update).toHaveBeenCalledWith({
        where: { id: 2 },
        data: { isRevoked: true },
      });

      // Should add to Redis blacklist (only refresh tokens)
      expect(redisClient.setex).toHaveBeenCalledTimes(2); // 2 refresh tokens
      expect(redisClient.setex).toHaveBeenCalledWith(
        'bl:refresh:hash1',
        86400, // 24 hours in seconds
        '1',
      );
      expect(redisClient.setex).toHaveBeenCalledWith(
        'bl:refresh:hash2',
        86400,
        '1',
      );

      // Should remove from sessions
      expect(redisClient.zrem).toHaveBeenCalledTimes(2);
      expect(redisClient.zrem).toHaveBeenCalledWith('sessions:1', '1');
      expect(redisClient.zrem).toHaveBeenCalledWith('sessions:2', '2');

      // Should delete session metadata
      expect(redisClient.del).toHaveBeenCalledTimes(2);
      expect(redisClient.del).toHaveBeenCalledWith('session:token:1');
      expect(redisClient.del).toHaveBeenCalledWith('session:token:2');
    });

    it('should handle no expired tokens', async () => {
      (prismaService.token.findMany as jest.Mock).mockResolvedValue([]);

      await service.cleanupExpiredTokens();

      expect(prismaService.token.update).not.toHaveBeenCalled();
    });

    it('should handle tokens with different expiration times', async () => {
      const tokens = [
        {
          id: 1,
          userId: 1,
          refreshTokenHash: 'hash1',
          jti: 'jti1',
          expiresAt: new Date(Date.now() - 1000), // Expired 1 second ago
          ip: '127.0.0.1',
        },
      ];

      (prismaService.token.findMany as jest.Mock).mockResolvedValue(tokens);
      (prismaService.token.update as jest.Mock).mockResolvedValue({});

      await service.cleanupExpiredTokens();

      // Should calculate TTL correctly (expiresAt is in past, so use fallback TTL)
      const redisClient = redisService.getClient();
      expect(redisClient.setex).toHaveBeenCalledWith(
        'bl:refresh:hash1',
        86400, // 24 hours fallback
        '1',
      );
    });
  });

  describe('cleanupOldAuditLogs', () => {
    it('should delete audit logs older than retention period', async () => {
      const cutoffDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
      (prismaService.auditLog.deleteMany as jest.Mock).mockResolvedValue({
        count: 10,
      });

      await service.cleanupOldAuditLogs();

      expect(prismaService.auditLog.deleteMany).toHaveBeenCalledWith({
        where: { createdAt: { lt: cutoffDate } },
      });
    });

    it('should use default retention period when env var not set', async () => {
      delete process.env.AUDIT_RETENTION_DAYS;

      await service.cleanupOldAuditLogs();

      // Should use default 365 days
      const expectedCutoff = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
      expect(prismaService.auditLog.deleteMany).toHaveBeenCalledWith({
        where: { createdAt: { lt: expectedCutoff } },
      });
    });

    it('should handle custom retention period', async () => {
      process.env.AUDIT_RETENTION_DAYS = '90';

      await service.cleanupOldAuditLogs();

      const expectedCutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      expect(prismaService.auditLog.deleteMany).toHaveBeenCalledWith({
        where: { createdAt: { lt: expectedCutoff } },
      });
    });
  });
});
