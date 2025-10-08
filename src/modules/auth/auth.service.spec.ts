import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
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

  beforeEach(async () => {
    usersMock = {
      findByEmail: jest.fn(),
      updateByEmail: jest.fn(),
      findOne: jest.fn(),
    };

    jwtMock = {
      sign: jest.fn().mockReturnValue('signed-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersMock },
        { provide: JwtService, useValue: jwtMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('returns token and user when credentials are valid', async () => {
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

      const dto = new LoginDto();
      dto.email = user.email;
      dto.password = password;

      const result = await service.login(dto);

      expect(result).toHaveProperty('access_token', 'signed-token');
      expect(result).toHaveProperty('user');
      expect(jwtMock.sign.mock.calls.length).toBeGreaterThan(0);
    });

    it('throws on invalid credentials', async () => {
      usersMock.findByEmail.mockResolvedValue(null);

      const dto = new LoginDto();
      dto.email = 'no@no.com';
      dto.password = 'x';

      await expect(service.login(dto)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
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
});
