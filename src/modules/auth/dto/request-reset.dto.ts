import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestResetDto {
  @ApiProperty({
    description: 'Email to send reset token',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;
}
