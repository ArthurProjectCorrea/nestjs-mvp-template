import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RequestResetDto } from './dto/request-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  private resetTokens = new Map<string, string>(); // token -> email

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);
    const tokens = await this.generateTokens(user.id);

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

  logout() {
    // MVP: client-side token discard
    return { message: 'Logout successful' };
  }

  async requestReset(dto: RequestResetDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new BadRequestException('User not found');

    const token = randomBytes(20).toString('hex');
    this.resetTokens.set(token, user.email);

    // MVP: return token in response
    return { message: 'Reset token generated', token };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const email = this.resetTokens.get(dto.token);
    if (!email) throw new BadRequestException('Invalid token');

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

  async generateTokens(userId: number) {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new UnauthorizedException('User not found');

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    // Generate refresh token with unique identifier to avoid duplicates
    const refreshPayload = {
      ...payload,
      type: 'refresh',
      jti: randomBytes(16).toString('hex'), // Unique identifier
    };
    const refreshToken = this.jwtService.sign(refreshPayload, {
      expiresIn: '7d',
    });

    // Store refresh token in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    await this.prisma.token.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateRefreshToken(token: string) {
    const tokenRecord = await this.prisma.token.findUnique({
      where: { refreshToken: token },
      include: { user: true },
    });

    if (!tokenRecord) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (tokenRecord.isRevoked) {
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    if (tokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token has expired');
    }

    return tokenRecord.user;
  }

  async revokeToken(token: string) {
    await this.prisma.token.updateMany({
      where: { refreshToken: token },
      data: { isRevoked: true },
    });
  }

  async revokeAllTokens(userId: number) {
    await this.prisma.token.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    });
  }

  async refreshTokens(oldRefreshToken: string) {
    const user = await this.validateRefreshToken(oldRefreshToken);

    // Revoke the old token
    await this.revokeToken(oldRefreshToken);

    // Generate new tokens
    return this.generateTokens(user.id);
  }
}
