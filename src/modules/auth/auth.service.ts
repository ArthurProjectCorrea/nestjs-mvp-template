import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
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
  ) {}

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
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
}
