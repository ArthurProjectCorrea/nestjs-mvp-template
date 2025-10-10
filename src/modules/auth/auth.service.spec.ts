import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../common/redis/redis.service';
import * as bcrypt from 'bcryptjs';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { RequestResetDto } from './dto/request-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

describe('AuthService', () => {
  let service: AuthService;
  let usersMock: {
    findByEmail: jest.Mock;
    updateByEmail: jest.Mock;
    findOne: jest.Mock;
  };
  let jwtMock: { sign: jest.Mock };
  let prismaMock: any;
  let redisMock: any;

  beforeEach(async () => {
    usersMock = {
      findByEmail: jest.fn(),
      updateByEmail: jest.fn(),
      findOne: jest.fn(),
    };

    jwtMock = {
      sign: jest.fn().mockReturnValue('signed-token'),
    };

    prismaMock = {
      token: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
        count: jest.fn(),
      },
      auditLog: {
        create: jest.fn(),
      },
      passwordHistory: {
        findMany: jest.fn().mockResolvedValue([]),
        create: jest.fn(),
        count: jest.fn().mockResolvedValue(0),
        deleteMany: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    redisMock = {
      getClient: jest.fn().mockReturnValue({
        zadd: jest.fn(),
        zrange: jest.fn(),
        zrem: jest.fn(),
        setex: jest.fn(),
        get: jest.fn(),
        hset: jest.fn(),
        del: jest.fn(),
        expire: jest.fn(),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersMock },
        { provide: JwtService, useValue: jwtMock },
        { provide: PrismaService, useValue: prismaMock },
        { provide: RedisService, useValue: redisMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    // Mock environment variables
    process.env.JWT_SECRET = 'test-secret';
    process.env.REFRESH_EXPIRES_IN_DAYS = '30';
    process.env.MAX_SESSIONS_PER_USER = '5';
    process.env.ROTATE_REFRESH_TOKENS = 'true';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('returns user when credentials are valid', async () => {
      const password = 'secret';
      const hashed = await bcrypt.hash(password, 10);
      const user = {
        id: 1,
        email: 'a@a.com',
        password,
        name: 'u',
        role: 'user',
      };

      usersMock.findByEmail.mockResolvedValue({
        ...user,
        password: hashed,
      });

      const result = await service.validateUser(user.email, password);

      expect(result).toHaveProperty('id', 1);
      expect(result).toHaveProperty('email', user.email);
      expect(result).toHaveProperty('name', user.name);
      expect(result).toHaveProperty('role', user.role);
    });

    it('throws on invalid credentials', async () => {
      usersMock.findByEmail.mockResolvedValue(null);

      await expect(
        service.validateUser('no@no.com', 'x'),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });

  describe('generateTokensAndPersist', () => {
    it('generates and persists tokens successfully', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
      };
      const meta = { ip: '127.0.0.1', userAgent: 'Test Agent' };

      prismaMock.token.create.mockResolvedValue({
        id: 1,
        userId: 1,
        refreshTokenHash: 'hash',
        jti: 'jti-123',
        expiresAt: new Date(),
      });

      redisMock.getClient().zadd.mockResolvedValue(1);

      const result = await service.generateTokensAndPersist(user, meta);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(prismaMock.token.create).toHaveBeenCalled();
      expect(redisMock.getClient().zadd).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('logs in user and creates tokens', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
      };
      const meta = { ip: '127.0.0.1', userAgent: 'Test Agent' };
      const loginDto = { email: user.email, password: 'password' };

      usersMock.findByEmail.mockResolvedValue(user);
      prismaMock.token.create.mockResolvedValue({
        id: 1,
        userId: 1,
        refreshTokenHash: 'hash',
        jti: 'jti-123',
        expiresAt: new Date(),
      });

      const result = await service.login(loginDto, meta);

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
      expect(result).toHaveProperty('user');
      expect(result.user).toHaveProperty('id', 1);
      expect(prismaMock.auditLog.create).toHaveBeenCalledWith({
        data: {
          userId: 1,
          event: 'LOGIN',
          ip: '127.0.0.1',
          meta: { userAgent: 'Test Agent' },
        },
      });
    });
  });

  describe('refresh', () => {
    it('refreshes tokens successfully', async () => {
      const tokenRecord = {
        id: 1,
        userId: 1,
        refreshTokenHash: 'hash',
        jti: 'jti-123',
        isRevoked: false,
        expiresAt: new Date(Date.now() + 100000),
      };
      const user = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
      };
      const meta = { ip: '127.0.0.1', userAgent: 'Test Agent' };

      prismaMock.token.findUnique.mockResolvedValue(tokenRecord);
      prismaMock.user.findUnique.mockResolvedValue(user);
      prismaMock.token.create.mockResolvedValue({
        id: 2,
        userId: 1,
        refreshTokenHash: 'new-hash',
        jti: 'jti-456',
        expiresAt: new Date(),
      });

      const result = await service.refresh('refresh-token', meta);

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
      expect(prismaMock.auditLog.create).toHaveBeenCalled();
    });

    it('throws on revoked token', async () => {
      const tokenRecord = {
        id: 1,
        userId: 1,
        refreshTokenHash: 'hash',
        jti: 'jti-123',
        isRevoked: true,
        expiresAt: new Date(Date.now() + 100000),
      };

      prismaMock.token.findUnique.mockResolvedValue(tokenRecord);

      await expect(
        service.refresh('refresh-token', { ip: '127.0.0.1' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('throws on expired token', async () => {
      const tokenRecord = {
        id: 1,
        userId: 1,
        refreshTokenHash: 'hash',
        jti: 'jti-123',
        isRevoked: false,
        expiresAt: new Date(Date.now() - 100000),
      };

      prismaMock.token.findUnique.mockResolvedValue(tokenRecord);

      await expect(
        service.refresh('refresh-token', { ip: '127.0.0.1' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('logs out user successfully', async () => {
      const tokenRecord = {
        id: 1,
        userId: 1,
        refreshTokenHash: 'hash',
        jti: 'jti-123',
        expiresAt: new Date(),
      };

      prismaMock.token.findUnique.mockResolvedValue(tokenRecord);

      const result = await service.logout('refresh-token', { ip: '127.0.0.1' });

      expect(result).toHaveProperty('message');
      expect(prismaMock.token.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { isRevoked: true },
      });
      expect(redisMock.getClient().setex).toHaveBeenCalled();
    });
  });

  describe('logoutAll', () => {
    it('revokes all user tokens', async () => {
      const tokens = [
        {
          id: 1,
          userId: 1,
          refreshTokenHash: 'hash1',
          jti: 'jti1',
          expiresAt: new Date(),
        },
        {
          id: 2,
          userId: 1,
          refreshTokenHash: 'hash2',
          jti: 'jti2',
          expiresAt: new Date(),
        },
      ];

      prismaMock.token.findMany.mockResolvedValue(tokens);

      const result = await service.logoutAll(1, { ip: '127.0.0.1' });

      expect(result).toHaveProperty('message', 'All sessions logged out');
      expect(prismaMock.token.update).toHaveBeenCalledTimes(2);
      expect(redisMock.getClient().setex).toHaveBeenCalledTimes(2); // 1 refresh + 1 access per token
    });
  });

  describe('listSessions', () => {
    it('returns user sessions', async () => {
      redisMock.getClient().zrange.mockResolvedValue(['1', '2', '3']);

      const result = await service.listSessions(1);

      expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
      expect(redisMock.getClient().zrange).toHaveBeenCalledWith(
        'sessions:1',
        0,
        -1,
        'REV',
      );
    });
  });

  describe('revokeSession', () => {
    it('revokes specific session', async () => {
      const tokenRecord = {
        id: 1,
        userId: 1,
        refreshTokenHash: 'hash',
        jti: 'jti-123',
        expiresAt: new Date(),
      };

      prismaMock.token.findUnique.mockResolvedValue(tokenRecord);

      const result = await service.revokeSession(1, 1, { ip: '127.0.0.1' });

      expect(result).toHaveProperty('message');
      expect(prismaMock.token.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { isRevoked: true },
      });
    });

    it('throws when session belongs to different user', async () => {
      const tokenRecord = {
        id: 1,
        userId: 2, // Different user
        refreshTokenHash: 'hash',
        jti: 'jti-123',
        expiresAt: new Date(),
      };

      prismaMock.token.findUnique.mockResolvedValue(tokenRecord);

      await expect(
        service.revokeSession(1, 1, { ip: '127.0.0.1' }),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });
  });

  describe('isAccessRevoked', () => {
    it('returns true when token is revoked', async () => {
      redisMock.getClient().get.mockResolvedValue('1');

      const result = await service.isAccessRevoked('jti-123');

      expect(result).toBe(true);
      expect(redisMock.getClient().get).toHaveBeenCalledWith(
        'bl:access:jti-123',
      );
    });

    it('returns false when token is not revoked', async () => {
      redisMock.getClient().get.mockResolvedValue(null);

      const result = await service.isAccessRevoked('jti-123');

      expect(result).toBe(false);
    });
  });

  describe('enforceSessionLimit', () => {
    it('revokes oldest session when limit exceeded', async () => {
      const sessions = ['1', '2', '3', '4', '5', '6']; // 6 sessions
      const oldestToken = {
        id: 1,
        userId: 1,
        refreshTokenHash: 'hash',
        jti: 'jti-123',
        expiresAt: new Date(),
      };

      redisMock.getClient().zrange.mockResolvedValue(sessions);
      prismaMock.token.findFirst.mockResolvedValue(oldestToken);

      await service.enforceSessionLimit(1);

      expect(prismaMock.token.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { isRevoked: true },
      });
    });
  });

  describe('requestReset', () => {
    it('generates a reset token for existing user', async () => {
      const user = { id: 2, email: 'b@b.com' };
      usersMock.findByEmail.mockResolvedValue(user);

      const dto = new RequestResetDto();
      dto.email = user.email;

      const res = await service.requestReset(dto);
      expect(res).toHaveProperty('message');
      expect(res).toHaveProperty('token');
      expect(typeof res.token).toBe('string');
    });

    it('throws when user not found', async () => {
      usersMock.findByEmail.mockResolvedValue(null);
      const dto = new RequestResetDto();
      dto.email = 'x@x.com';
      await expect(service.requestReset(dto)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });
  });

  describe('resetPassword', () => {
    it('resets password when token valid', async () => {
      const user = { id: 3, email: 'c@c.com' };
      usersMock.findByEmail.mockResolvedValue(user);

      // request token
      const { token } = await service.requestReset({ email: user.email });

      // call reset
      usersMock.updateByEmail.mockResolvedValue(true);
      const dto = new ResetPasswordDto();
      dto.token = token;
      dto.newPassword = 'NewPassword123!';

      const res = await service.resetPassword(dto);

      expect(res).toHaveProperty('message');
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: user.id },
        data: {
          password: expect.any(String),
          passwordChangedAt: expect.any(Date),
        },
      });
      expect(prismaMock.passwordHistory.create).toHaveBeenCalledWith({
        data: { userId: user.id, hash: expect.any(String) },
      });
    });

    it('throws when token invalid', async () => {
      const dto = new ResetPasswordDto();
      dto.token = 'invalid';
      dto.newPassword = 'x';
      await expect(service.resetPassword(dto)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });
  });

  describe('getProfile', () => {
    it('returns profile without password', async () => {
      const userWithPassword = {
        id: 4,
        name: 'name',
        email: 'd@d.com',
        password: 'secret',
      };
      usersMock.findOne.mockResolvedValue(userWithPassword as any);

      const profile = await service.getProfile(4);
      expect(profile).toHaveProperty('id', 4);
      expect((profile as Record<string, unknown>).password).toBeUndefined();
    });
  });
});
