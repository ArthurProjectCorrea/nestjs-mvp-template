import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'Role of the user',
    example: 'user',
    enum: UserRole,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiProperty({
    description: 'Whether the user is active',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
