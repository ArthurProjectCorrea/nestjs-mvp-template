import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  HttpCode,
  HttpStatus,
  Param,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RequestResetDto } from './dto/request-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Enable2faDto, Verify2faDto, Disable2faDto } from './dto/2fa.dto';
import { JwtGuard } from './jwt/jwt.guard';
import { ThrottlerGuard } from '@nestjs/throttler';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ErrorResponseDto } from '../users/dto/response.dto';
import { UserResponseDto } from '../users/dto/response.dto';
import { hashToken } from '../../utils/token-hash';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(ThrottlerGuard)
  @Post('login')
  @ApiOperation({
    summary: 'Login with email and password',
    description:
      'Authenticates a user with email and password, returning JWT access and refresh tokens.',
  })
  @ApiCreatedResponse({
    description: 'User authenticated successfully',
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid email or password',
    type: ErrorResponseDto,
  })
  async login(@Body() dto: LoginDto, @Req() req: Request) {
    const meta = {
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      deviceName: req.get('User-Agent')?.split(' ')[0] || 'Unknown',
    };
    return this.authService.loginWithSecurity(dto, meta);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Logout user',
    description:
      'Logs out the user by revoking the specified refresh token and clearing the session.',
  })
  @ApiOkResponse({
    description: 'Logout successful',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Logout successful',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid refresh token format',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or expired refresh token',
    type: ErrorResponseDto,
  })
  async logout(@Body() dto: RefreshTokenDto, @Req() req: Request) {
    const meta = {
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
    };
    return this.authService.logout(dto.refreshToken, meta);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh access token using refresh token',
    description:
      'Generates a new access token pair using a valid refresh token. The old refresh token is revoked.',
  })
  @ApiOkResponse({
    description: 'Tokens refreshed successfully',
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid refresh token format',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or expired refresh token',
    type: ErrorResponseDto,
  })
  async refresh(@Body() dto: RefreshTokenDto, @Req() req: Request) {
    const meta = {
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
    };
    return this.authService.refresh(dto.refreshToken, meta);
  }

  @UseGuards(JwtGuard)
  @Get('sessions')
  @ApiOperation({
    summary: 'List active sessions for authenticated user',
    description:
      'Retrieves a list of all active sessions for the currently authenticated user.',
  })
  @ApiOkResponse({
    description: 'Sessions list returned successfully',
    schema: {
      type: 'object',
      properties: {
        sessions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              deviceName: { type: 'string', example: 'Chrome' },
              ip: { type: 'string', example: '192.168.1.100' },
              userAgent: { type: 'string', example: 'Mozilla/5.0...' },
              createdAt: {
                type: 'string',
                example: '2025-10-09T10:00:00.000Z',
              },
              lastUsedAt: {
                type: 'string',
                example: '2025-10-09T10:30:00.000Z',
              },
            },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access token',
    type: ErrorResponseDto,
  })
  async listSessions(@Req() req: Request & { user: { sub: number } }) {
    return this.authService.listSessions(req.user.sub);
  }

  @UseGuards(JwtGuard)
  @Post('sessions/:id/revoke')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Revoke specific session',
    description:
      'Revokes a specific user session by session ID, logging out that session.',
  })
  @ApiOkResponse({
    description: 'Session revoked successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Session revoked successfully',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid session ID format',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Session not found',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access token',
    type: ErrorResponseDto,
  })
  async revokeSession(
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: number } },
  ) {
    const meta = {
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
    };
    return this.authService.revokeSession(req.user.sub, Number(id), meta);
  }

  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Logout from all sessions',
    description:
      'Logs out the user from all active sessions by revoking all refresh tokens.',
  })
  @ApiOkResponse({
    description: 'All sessions logged out successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'All sessions logged out successfully',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid refresh token format',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or expired refresh token',
    type: ErrorResponseDto,
  })
  async logoutAll(@Body() dto: RefreshTokenDto, @Req() req: Request) {
    const hash = hashToken(dto.refreshToken);
    const tokenRecord = await this.authService['prisma'].token.findUnique({
      where: { refreshTokenHash: hash },
    });
    if (!tokenRecord) throw new ForbiddenException();
    const meta = {
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
    };
    return this.authService.logoutAll(tokenRecord.userId, meta);
  }

  @Post('request-reset')
  @ApiOperation({
    summary: 'Request password reset',
    description:
      'Initiates a password reset process by sending a reset token to the user email.',
  })
  @ApiCreatedResponse({
    description: 'Password reset token created successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'reset token generated',
        },
        resetToken: {
          type: 'string',
          example: 'abcd-1234-efgh-5678',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid email format',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'User with this email not found',
    type: ErrorResponseDto,
  })
  requestReset(@Body() dto: RequestResetDto) {
    return this.authService.requestReset(dto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reset password using token',
    description:
      'Resets the user password using a valid reset token and new password.',
  })
  @ApiOkResponse({
    description: 'Password reset successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Password reset successfully',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid token or password format',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or expired reset token',
    type: ErrorResponseDto,
  })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @UseGuards(JwtGuard)
  @Get('profile')
  @ApiOperation({
    summary: 'Get current user profile',
    description:
      'Retrieves the profile information of the currently authenticated user.',
  })
  @ApiOkResponse({
    description: 'User profile returned successfully',
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access token',
    type: ErrorResponseDto,
  })
  getProfile(@Req() req: Request & { user: { sub: number } }) {
    return this.authService.getProfile(req.user.sub);
  }

  // 2FA endpoints
  @UseGuards(JwtGuard)
  @Post('2fa/setup')
  @ApiOperation({
    summary: 'Setup 2FA for user',
    description: 'Generates TOTP secret and QR code for 2FA setup',
  })
  @ApiOkResponse({
    description: '2FA setup data generated',
    schema: {
      type: 'object',
      properties: {
        otpauth_url: { type: 'string' },
        qr: { type: 'string' },
        base32: { type: 'string' },
      },
    },
  })
  setup2fa(@Req() req: Request & { user: { sub: number } }) {
    return this.authService.setup2fa(req.user.sub);
  }

  @UseGuards(JwtGuard)
  @Post('2fa/enable')
  @ApiOperation({
    summary: 'Enable 2FA for user',
    description: 'Verifies TOTP token and enables 2FA for the user',
  })
  @ApiOkResponse({
    description: '2FA enabled successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: '2FA enabled' },
      },
    },
  })
  enable2fa(
    @Body() dto: Enable2faDto,
    @Req() req: Request & { user: { sub: number } },
  ) {
    return this.authService.enable2fa(req.user.sub, dto.token);
  }

  @UseGuards(JwtGuard)
  @Post('2fa/verify')
  @ApiOperation({
    summary: 'Verify 2FA token',
    description: 'Verifies a TOTP token for 2FA authentication',
  })
  @ApiOkResponse({
    description: 'Token verified successfully',
    schema: {
      type: 'object',
      properties: {
        verified: { type: 'boolean', example: true },
      },
    },
  })
  verify2fa(
    @Body() dto: Verify2faDto,
    @Req() req: Request & { user: { sub: number } },
  ) {
    return this.authService.verify2fa(req.user.sub, dto.token);
  }

  @UseGuards(JwtGuard)
  @Post('2fa/disable')
  @ApiOperation({
    summary: 'Disable 2FA for user',
    description: 'Verifies TOTP token and disables 2FA for the user',
  })
  @ApiOkResponse({
    description: '2FA disabled successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: '2FA disabled' },
      },
    },
  })
  disable2fa(
    @Body() dto: Disable2faDto,
    @Req() req: Request & { user: { sub: number } },
  ) {
    return this.authService.disable2fa(req.user.sub, dto.token);
  }
}
