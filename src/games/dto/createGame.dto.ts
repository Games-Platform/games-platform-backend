import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateGameDto {
  @IsNotEmpty()
  @IsString()
  game_id: string;

  @IsNotEmpty()
  @IsString()
  background_image: string;

  @IsNotEmpty()
  @IsNumber()
  metacritic: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  games_platform_rating: number;
}
