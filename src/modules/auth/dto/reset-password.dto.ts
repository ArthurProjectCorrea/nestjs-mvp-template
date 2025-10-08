import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Reset token received by email',
    example: 'abcd-1234',
  })
  @IsNotEmpty()
  token: string;

  @ApiProperty({ description: 'New password to set', example: 'NewPass456!' })
  @MinLength(6)
  newPassword: string;
}
