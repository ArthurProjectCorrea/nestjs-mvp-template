import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { RequestResetDto } from './dto/request-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

describe('AuthService', () => {
  let service: AuthService;
  let usersMock: {
    findByEmail: jest.Mock;
    updateByEmail: jest.Mock;
    findOne: jest.Mock;
  };
  let jwtMock: { sign: jest.Mock };
  let prismaMock: {
    token: {
      create: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      updateMany: jest.Mock;
    };
  };

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
        update: jest.fn(),
        updateMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersMock },
        { provide: JwtService, useValue: jwtMock },
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
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

      // make findByEmail return user with hashed password in DB
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
        BadRequestException,
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
      dto.newPassword = 'newpass';

      const res = await service.resetPassword(dto);

      expect(res).toHaveProperty('message');
      expect(usersMock.updateByEmail).toHaveBeenCalledWith(
        user.email,
        expect.objectContaining({ password: expect.any(String) } as Record<
          string,
          unknown
        >),
      );
    });

    it('throws when token invalid', async () => {
      const dto = new ResetPasswordDto();
      dto.token = 'invalid';
      dto.newPassword = 'x';
      await expect(service.resetPassword(dto)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });

  describe('getProfile and logout', () => {
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

    it('logout returns message', () => {
      const res = service.logout();
      expect(res).toHaveProperty('message');
    });
  });

  describe('generateTokens', () => {
    it('generates access and refresh tokens', async () => {
      const userId = 1;
      const user = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
      };
      usersMock.findOne.mockResolvedValue(user);
      prismaMock.token.create.mockResolvedValue({} as any);

      const result = await service.generateTokens(userId);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(typeof result.accessToken).toBe('string');
      expect(typeof result.refreshToken).toBe('string');
    });
  });

  describe('validateRefreshToken', () => {
    it('validates valid refresh token', async () => {
      const user = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
      };
      const token = {
        id: 1,
        userId: 1,
        refreshToken: 'valid-token',
        isRevoked: false,
        expiresAt: new Date(Date.now() + 100000),
        user,
      };
      prismaMock.token.findUnique.mockResolvedValue(token);

      const result = await service.validateRefreshToken('valid-token');
      expect(result).toEqual(user);
    });

    it('throws on invalid refresh token', async () => {
      prismaMock.token.findUnique.mockResolvedValue(null);

      await expect(
        service.validateRefreshToken('invalid-token'),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });

  describe('revokeToken', () => {
    it('revokes refresh token', async () => {
      prismaMock.token.updateMany.mockResolvedValue({} as any);

      await expect(service.revokeToken('token')).resolves.toBeUndefined();
      expect(prismaMock.token.updateMany).toHaveBeenCalledWith({
        where: { refreshToken: 'token' },
        data: { isRevoked: true },
      });
    });
  });

  describe('revokeAllTokens', () => {
    it('revokes all tokens for user', async () => {
      prismaMock.token.updateMany.mockResolvedValue({ count: 2 });

      await expect(service.revokeAllTokens(1)).resolves.toBeUndefined();
      expect(prismaMock.token.updateMany).toHaveBeenCalledWith({
        where: { userId: 1, isRevoked: false },
        data: { isRevoked: true },
      });
    });
  });

  describe('refreshTokens', () => {
    it('refreshes tokens successfully', async () => {
      const user = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
      };
      const token = {
        id: 1,
        userId: 1,
        refreshToken: 'old-token',
        isRevoked: false,
        expiresAt: new Date(Date.now() + 100000),
        user,
      };
      prismaMock.token.findUnique.mockResolvedValue(token);
      prismaMock.token.updateMany.mockResolvedValue({} as any);
      usersMock.findOne.mockResolvedValue(user);
      prismaMock.token.create.mockResolvedValue({} as any);

      const result = await service.refreshTokens('old-token');

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  });
});
