import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RedisService } from '../../../common/redis/redis.service';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private redis: RedisService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    await super.canActivate(context);
    const request = context.switchToHttp().getRequest();
    const jti = request.user?.jti;
    if (jti) {
      const isRevoked = await this.redis.getClient().get(`bl:access:${jti}`);
      if (isRevoked) {
        throw new UnauthorizedException('Access token has been revoked');
      }
    }
    return true;
  }
}
