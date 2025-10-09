jest.mock('../../../common/redis/redis.service');

import { JwtGuard } from './jwt.guard';
import { ExecutionContext } from '@nestjs/common';

/* eslint-disable @typescript-eslint/no-unsafe-argument */

describe('JwtGuard', () => {
  let redisServiceMock: { getClient: jest.Mock };

  beforeEach(() => {
    redisServiceMock = {
      getClient: jest.fn().mockReturnValue({
        get: jest.fn(),
      }),
    };
  });

  it('should be defined', () => {
    expect(new JwtGuard(redisServiceMock as any)).toBeDefined();
  });

  it('should delegate canActivate to parent AuthGuard and return true', async () => {
    const guard = new JwtGuard(redisServiceMock as any);

    // Get parent prototype (AuthGuard('jwt').prototype) and type it
    const parentProto = Object.getPrototypeOf(
      Object.getPrototypeOf(guard),
    ) as unknown as {
      canActivate: (ctx: ExecutionContext) => Promise<boolean>;
    };

    // Spy on parent's canActivate and force true
    const spy = jest.spyOn(parentProto, 'canActivate').mockResolvedValue(true);

    // Create a mock ExecutionContext
    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ user: { jti: 'test-jti' } }),
      }),
    } as unknown as ExecutionContext;

    // call and assert
    const result = await guard.canActivate(mockContext);
    expect(result).toBe(true);
    expect(spy).toHaveBeenCalledWith(mockContext);
    spy.mockRestore();
  });

  it('should return true when parent canActivate succeeds', async () => {
    const guard = new JwtGuard(redisServiceMock as any);

    // Get parent prototype (AuthGuard('jwt').prototype) and type it
    const parentProto = Object.getPrototypeOf(
      Object.getPrototypeOf(guard),
    ) as unknown as {
      canActivate: (ctx: ExecutionContext) => Promise<boolean>;
    };

    // Spy on parent's canActivate and force success
    const spy = jest.spyOn(parentProto, 'canActivate').mockResolvedValue(true);

    // Create a mock ExecutionContext
    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ user: { jti: 'test-jti' } }),
      }),
    } as unknown as ExecutionContext;

    const result = await guard.canActivate(mockContext);
    expect(result).toBe(true);
    expect(spy).toHaveBeenCalledWith(mockContext);
    spy.mockRestore();
  });

  it('should propagate errors thrown by parent canActivate', async () => {
    const guard = new JwtGuard(redisServiceMock as any);
    const parentProto = Object.getPrototypeOf(
      Object.getPrototypeOf(guard),
    ) as unknown as {
      canActivate: (ctx: ExecutionContext) => Promise<boolean>;
    };
    const error = new Error('parent-failure');
    const spy = jest.spyOn(parentProto, 'canActivate').mockRejectedValue(error);

    await expect(
      guard.canActivate({} as unknown as ExecutionContext),
    ).rejects.toThrow('parent-failure');
    spy.mockRestore();
  });
});
