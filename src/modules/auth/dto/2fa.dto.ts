import { IsNotEmpty, IsString } from 'class-validator';

export class Setup2faDto {}

export class Enable2faDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}

export class Verify2faDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}

export class Disable2faDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}
