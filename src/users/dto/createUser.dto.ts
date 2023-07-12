import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(2, { message: 'Username must be more then 2 symbols' })
  username: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be more than 8 symbols' })
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
