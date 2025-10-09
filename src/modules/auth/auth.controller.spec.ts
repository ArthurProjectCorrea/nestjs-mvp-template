import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Request } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  const mockService = {
    validateUser: jest.fn(),
    generateTokens: jest.fn(),
    revokeToken: jest.fn(),
    revokeAllTokens: jest.fn(),
    refreshTokens: jest.fn(),
    login: jest.fn().mockResolvedValue({
      access_token: 'access',
      refresh_token: 'refresh',
      user: { id: 1, email: 'a@a.com', name: 'test', role: 'user' },
    }),
    logout: jest.fn().mockResolvedValue({ message: 'Logout OK' }),
    requestReset: jest.fn().mockResolvedValue({ token: 'tok' }),
    resetPassword: jest.fn().mockResolvedValue({ message: 'ok' }),
    getProfile: jest.fn().mockResolvedValue({ id: 1, email: 'a@a.com' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const loginDto = { email: 'test@example.com', password: 'password' };
      const mockRequest = {
        ip: '127.0.0.1',
        connection: { remoteAddress: '127.0.0.1' },
        get: jest.fn().mockReturnValue('Mozilla/5.0'),
      } as unknown as Request;

      const result = await controller.login(loginDto, mockRequest);

      expect(mockService.login).toHaveBeenCalledWith(loginDto, {
        ip: '127.0.0.1',
        userAgent: 'Mozilla/5.0',
        deviceName: 'Mozilla/5.0',
      });
      expect(result).toEqual({
        access_token: 'access',
        refresh_token: 'refresh',
        user: { id: 1, email: 'a@a.com', name: 'test', role: 'user' },
      });
    });
  });

  it('logout should call service.logout with correct parameters', async () => {
    const dto = { refreshToken: 'token' };
    const mockReq = {
      ip: '127.0.0.1',
      get: jest.fn().mockReturnValue('TestAgent/1.0'),
    } as unknown as Request;

    const res = await controller.logout(dto, mockReq);

    expect(mockService.logout).toHaveBeenCalledWith('token', {
      ip: '127.0.0.1',
      userAgent: 'TestAgent/1.0',
    });
    expect(res).toHaveProperty('message', 'Logout OK');
  });
});
