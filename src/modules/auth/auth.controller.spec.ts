import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  const mockService = {
    validateUser: jest.fn(),
    generateTokens: jest.fn(),
    revokeToken: jest.fn(),
    revokeAllTokens: jest.fn(),
    refreshTokens: jest.fn(),
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

  it('login should call service.validateUser and generateTokens', async () => {
    const user = { id: 1, email: 'a', name: 'test', role: 'user' };
    const tokens = { accessToken: 'access', refreshToken: 'refresh' };

    mockService.validateUser.mockResolvedValue(user);
    mockService.generateTokens.mockResolvedValue(tokens);

    const dto = new LoginDto();
    dto.email = 'a';
    dto.password = 'b';
    const res = await controller.login(dto);

    expect(mockService.validateUser).toHaveBeenCalledWith('a', 'b');
    expect(mockService.generateTokens).toHaveBeenCalledWith(1);
    expect(res).toHaveProperty('accessToken', 'access');
    expect(res).toHaveProperty('refreshToken', 'refresh');
    expect(res).toHaveProperty('user', user);
  });

  it('logout should call service.revokeToken', async () => {
    const dto = { refreshToken: 'token' };
    const res = await controller.logout(dto);
    expect(mockService.revokeToken).toHaveBeenCalledWith('token');
    expect(res).toHaveProperty('message', 'Logout successful');
  });
});
