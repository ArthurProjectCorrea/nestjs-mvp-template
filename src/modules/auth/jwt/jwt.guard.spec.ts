import { JwtGuard } from './jwt.guard';
import { ExecutionContext } from '@nestjs/common';

describe('JwtGuard', () => {
  it('should be defined', () => {
    expect(new JwtGuard()).toBeDefined();
  });

  it('should delegate canActivate to parent AuthGuard and return true', async () => {
    const guard = new JwtGuard();

    // Get parent prototype (AuthGuard('jwt').prototype) and type it
    const parentProto = Object.getPrototypeOf(
      Object.getPrototypeOf(guard),
    ) as unknown as {
      canActivate: (ctx: ExecutionContext) => boolean | Promise<boolean>;
    };

    // Spy on parent's canActivate and force true
    const spy = jest
      .spyOn(parentProto, 'canActivate')
      .mockImplementation(() => true);

    // call and assert (provide a minimal ExecutionContext mock)
    const result = await (
      guard as unknown as {
        canActivate: (ctx: ExecutionContext) => boolean | Promise<boolean>;
      }
    ).canActivate({} as unknown as ExecutionContext);
    expect(result).toBe(true);
    spy.mockRestore();
  });

  it('should delegate canActivate to parent AuthGuard and return false', async () => {
    const guard = new JwtGuard();
    const parentProto = Object.getPrototypeOf(
      Object.getPrototypeOf(guard),
    ) as unknown as {
      canActivate: (ctx: ExecutionContext) => boolean | Promise<boolean>;
    };
    const spy = jest
      .spyOn(parentProto, 'canActivate')
      .mockImplementation(() => false);

    const result = await (
      guard as unknown as {
        canActivate: (ctx: ExecutionContext) => boolean | Promise<boolean>;
      }
    ).canActivate({} as unknown as ExecutionContext);
    expect(result).toBe(false);
    spy.mockRestore();
  });

  it('should propagate errors thrown by parent canActivate', () => {
    const guard = new JwtGuard();
    const parentProto = Object.getPrototypeOf(
      Object.getPrototypeOf(guard),
    ) as unknown as {
      canActivate: (ctx: ExecutionContext) => boolean | Promise<boolean>;
    };
    const error = new Error('parent-failure');
    const spy = jest
      .spyOn(parentProto, 'canActivate')
      .mockImplementation(() => {
        throw error;
      });

    expect(() =>
      (
        guard as unknown as {
          canActivate: (ctx: ExecutionContext) => boolean | Promise<boolean>;
        }
      ).canActivate({} as unknown as ExecutionContext),
    ).toThrow(error);
    spy.mockRestore();
  });
});
