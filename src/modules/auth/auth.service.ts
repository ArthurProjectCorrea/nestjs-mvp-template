import {
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RequestResetDto } from './dto/request-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { hashToken } from '../../utils/token-hash';
import { randomBytes } from 'crypto';
import { addSeconds } from 'date-fns';
import { RedisService } from '../../common/redis/redis.service';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

@Injectable()
export class AuthService {
  private resetTokens = new Map<string, string>(); // token -> email

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private redis: RedisService,
  ) {}

  private get redisClient() {
    return this.redis.getClient();
  }

  private generateAccessToken(user: any, jti: string) {
    const payload = { sub: user.id, email: user.email, role: user.role, jti };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    });
    return accessToken;
  }

  private generateRefreshToken() {
    return randomBytes(64).toString('hex'); // string cru; armazenar hash no DB
  }

  private accessTokenTTLSeconds() {
    // parse '15m' etc — for brevity consider 15 minutes
    return 15 * 60;
  }

  async generateTokensAndPersist(
    user: any,
    meta: { ip?: string; userAgent?: string; deviceName?: string },
  ) {
    // create new jti + access
    const jti = randomBytes(16).toString('hex');
    const accessToken = this.generateAccessToken(user, jti);

    // refresh token raw + hash
    const refreshToken = this.generateRefreshToken();
    const refreshHash = hashToken(refreshToken);

    // expiresAt for refresh
    const expiresAt = addSeconds(
      new Date(),
      60 * 60 * 24 * Number(process.env.REFRESH_EXPIRES_IN_DAYS || 30),
    );

    // persist in DB
    const token = await this.prisma.token.create({
      data: {
        userId: user.id,
        refreshTokenHash: refreshHash,
        jti,
        ip: meta.ip,
        userAgent: meta.userAgent,
        deviceName: meta.deviceName,
        expiresAt,
      },
    });

    // add to sessions zset in redis
    await this.redisClient.zadd(
      `sessions:${user.id}`,
      Date.now(),
      String(token.id),
    );
    // optionally cache session metadata
    await this.redisClient.hset(`session:token:${token.id}`, {
      id: String(token.id),
      userId: String(user.id),
      refreshTokenHash: refreshHash,
      jti,
      ip: meta.ip || '',
      userAgent: meta.userAgent || '',
      deviceName: meta.deviceName || '',
      expiresAt: expiresAt.toISOString(),
    });
    // set TTL for hash equal refresh expiry
    const ttlSeconds = Math.floor((expiresAt.getTime() - Date.now()) / 1000);
    await this.redisClient.expire(`session:token:${token.id}`, ttlSeconds);

    return { accessToken, refreshToken, expiresAt, tokenId: token.id };
  }

  async login(
    dto: LoginDto,
    meta: { ip?: string; userAgent?: string; deviceName?: string },
  ) {
    const user = await this.validateUser(dto.email, dto.password);
    // enforce session limit
    await this.enforceSessionLimit(user.id);

    const tokens = await this.generateTokensAndPersist(user, meta);

    await this.prisma.auditLog.create({
      data: {
        userId: user.id,
        event: 'LOGIN',
        ip: meta.ip,
        meta: { userAgent: meta.userAgent },
      },
    });

    return {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async enforceSessionLimit(userId: number) {
    const max = Number(process.env.MAX_SESSIONS_PER_USER || 5);
    if (max <= 0) return;
    // count active sessions in DB
    const active = await this.prisma.token.count({
      where: { userId, isRevoked: false, expiresAt: { gt: new Date() } },
    });
    if (active < max) return;

    // choose policy: revoke oldest
    const oldest = await this.prisma.token.findFirst({
      where: { userId, isRevoked: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'asc' },
    });
    if (oldest) {
      await this.revokeRefreshTokenByDbRecord(oldest);
    }
  }

  private async revokeRefreshTokenByDbRecord(tokenRecord: any) {
    // mark DB revoked
    await this.prisma.token.update({
      where: { id: tokenRecord.id },
      data: { isRevoked: true },
    });
    // add to redis blacklist
    const refreshKey = `bl:refresh:${tokenRecord.refreshTokenHash}`;
    const expiresInSec = Math.max(
      0,
      Math.floor((tokenRecord.expiresAt.getTime() - Date.now()) / 1000),
    );
    if (expiresInSec > 0) {
      await this.redisClient.setex(refreshKey, expiresInSec, '1');
    }
    // also blacklist access jti
    const accessKey = `bl:access:${tokenRecord.jti}`;
    await this.redisClient.setex(accessKey, this.accessTokenTTLSeconds(), '1');

    // audit
    await this.prisma.auditLog.create({
      data: {
        userId: tokenRecord.userId,
        event: 'REVOKE',
        ip: tokenRecord.ip,
        meta: { reason: 'session_limit', tokenId: tokenRecord.id },
      },
    });

    // remove from sessions zset
    await this.redisClient.zrem(
      `sessions:${tokenRecord.userId}`,
      String(tokenRecord.id),
    );
    await this.redisClient.del(`session:token:${tokenRecord.id}`);
  }

  async refresh(
    refreshTokenRaw: string,
    meta: { ip?: string; userAgent?: string },
  ) {
    const hash = hashToken(refreshTokenRaw);
    // find DB entry
    const tokenEntry = await this.prisma.token.findUnique({
      where: { refreshTokenHash: hash },
    });
    if (!tokenEntry || tokenEntry.isRevoked) {
      await this.prisma.auditLog.create({
        data: {
          userId: tokenEntry?.userId,
          event: 'REFRESH_FAIL',
          ip: meta.ip,
          meta: { reason: 'invalid_token', userAgent: meta.userAgent },
        },
      });
      throw new UnauthorizedException('Refresh token inválido');
    }
    if (tokenEntry.expiresAt < new Date()) {
      await this.prisma.auditLog.create({
        data: {
          userId: tokenEntry.userId,
          event: 'REFRESH_FAIL',
          ip: meta.ip,
          meta: { reason: 'expired', userAgent: meta.userAgent },
        },
      });
      throw new UnauthorizedException('Refresh token expirado');
    }

    // rotativo: invalidate old token and issue new one
    if (process.env.ROTATE_REFRESH_TOKENS === 'true') {
      // mark old as revoked
      await this.revokeRefreshTokenByDbRecord(tokenEntry);
    }

    // create new tokens
    const user = await this.prisma.user.findUnique({
      where: { id: tokenEntry.userId },
    });
    if (!user) throw new UnauthorizedException('User not found');
    const newMeta = {
      ip: meta.ip,
      userAgent: meta.userAgent,
      deviceName: tokenEntry.deviceName || undefined,
    };
    const tokens = await this.generateTokensAndPersist(user, newMeta);

    await this.prisma.auditLog.create({
      data: {
        userId: user.id,
        event: 'REFRESH',
        ip: meta.ip,
        meta: {
          userAgent: meta.userAgent,
          rotated: process.env.ROTATE_REFRESH_TOKENS === 'true',
        },
      },
    });

    return {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    };
  }

  async logout(
    refreshTokenRaw: string,
    meta: { ip?: string; userAgent?: string },
  ) {
    const hash = hashToken(refreshTokenRaw);
    const tokenEntry = await this.prisma.token.findUnique({
      where: { refreshTokenHash: hash },
    });
    if (tokenEntry && !tokenEntry.isRevoked) {
      await this.revokeRefreshTokenByDbRecord(tokenEntry);
      await this.prisma.auditLog.create({
        data: {
          userId: tokenEntry.userId,
          event: 'LOGOUT',
          ip: meta.ip,
          meta: { userAgent: meta.userAgent },
        },
      });
    }
    return { message: 'Logout OK' };
  }

  async logoutAll(userId: number, meta: { ip?: string; userAgent?: string }) {
    const tokens = await this.prisma.token.findMany({
      where: { userId, isRevoked: false },
    });
    for (const token of tokens) {
      await this.revokeRefreshTokenByDbRecord(token);
    }
    await this.prisma.auditLog.create({
      data: {
        userId,
        event: 'LOGOUT_ALL',
        ip: meta.ip,
        meta: { userAgent: meta.userAgent },
      },
    });
    return { message: 'All sessions logged out' };
  }

  async listSessions(userId: number) {
    const tokenIds = await this.redisClient.zrange(
      `sessions:${userId}`,
      0,
      -1,
      'REV',
    );
    // For simplicity, return tokenIds
    return tokenIds.map((id) => ({ id: Number(id) }));
  }

  async revokeSession(
    userId: number,
    sessionId: number,
    meta: { ip?: string; userAgent?: string },
  ) {
    const tokenRecord = await this.prisma.token.findUnique({
      where: { id: sessionId },
    });
    if (!tokenRecord || tokenRecord.userId !== userId)
      throw new ForbiddenException();
    await this.revokeRefreshTokenByDbRecord(tokenRecord);
    await this.prisma.auditLog.create({
      data: {
        userId,
        event: 'REVOKE',
        ip: meta.ip,
        meta: { reason: 'manual', sessionId, userAgent: meta.userAgent },
      },
    });
    return { message: 'Sessão revogada' };
  }

  async isAccessRevoked(jti: string) {
    const key = `bl:access:${jti}`;
    const val = await this.redisClient.get(key);
    return !!val;
  }

  // Legacy methods for compatibility
  async requestReset(dto: RequestResetDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('User not found');

    const token = randomBytes(20).toString('hex');
    this.resetTokens.set(token, user.email);

    // MVP: return token in response
    return { message: 'Reset token generated', token };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const email = this.resetTokens.get(dto.token);
    if (!email) throw new UnauthorizedException('Invalid token');

    const hashed = await bcrypt.hash(dto.newPassword, 10);
    await this.usersService.updateByEmail(email, { password: hashed });

    this.resetTokens.delete(dto.token);
    return { message: 'Password reset successful' };
  }

  async getProfile(userId: number) {
    const user = await this.usersService.findOne(userId);
    // UsersService's response DTO does not expose password, but if the
    // underlying object has a password field, remove it defensively.
    if (user && 'password' in (user as unknown as Record<string, unknown>)) {
      const copy = { ...user } as Record<string, unknown>;
      delete copy.password;
      return copy;
    }
    return user;
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    return user;
  }
}
