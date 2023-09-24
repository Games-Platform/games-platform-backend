import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

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
  @IsNumber()
  released: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  games_platform_rating: number;

  @IsArray()
  gamePlatforms?: string[];
}
