import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateUserGameDto {
  @IsNotEmpty()
  @IsString()
  game: number;

  @IsNumber()
  rating: number;

  @IsNumber()
  status: number;
}
