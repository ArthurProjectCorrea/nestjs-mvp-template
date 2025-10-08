import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  const mockService = {
    login: jest.fn().mockResolvedValue({ access_token: 't', user: {} }),
    logout: jest.fn().mockReturnValue({ message: 'ok' }),
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

  it('login should call service.login', async () => {
    const dto = new LoginDto();
    dto.email = 'a';
    dto.password = 'b';
    const res = await controller.login(dto);
    expect(mockService.login).toHaveBeenCalled();
    expect(res).toHaveProperty('access_token');
  });

  it('logout should call service.logout', () => {
    const res = controller.logout();
    expect(mockService.logout).toHaveBeenCalled();
    expect(res).toHaveProperty('message');
  });
});
