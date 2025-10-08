import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the user',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'Alice Smith',
  })
  name: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'alice@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Role of the user',
    example: 'user',
    enum: ['user', 'admin'],
  })
  role: string;

  @ApiProperty({
    description: 'Whether the user is active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Date when the user was created',
    example: '2025-10-07T21:22:07.346Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the user was last updated',
    example: '2025-10-07T21:22:07.346Z',
  })
  updatedAt: Date;
}

export class UsersListResponseDto {
  @ApiProperty({
    description: 'List of users',
    type: [UserResponseDto],
  })
  data: UserResponseDto[];
}

export class ErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message',
    example: 'Validation failed',
  })
  message: string;

  @ApiProperty({
    description: 'Detailed error information',
    example: ['email must be a valid email'],
    required: false,
    type: [String],
  })
  error?: string[];
}

export class ConflictErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 409,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message',
    example: 'Email already exists',
  })
  message: string;
}

export class NotFoundErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 404,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message',
    example: 'User not found',
  })
  message: string;
}
