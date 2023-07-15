import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { EAuth } from 'src/types';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(2, { message: EAuth.VALIDATE_USERNAME })
  username: string;

  @IsOptional()
  @MinLength(8, { message: EAuth.VALIDATE_PASSWORD })
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
