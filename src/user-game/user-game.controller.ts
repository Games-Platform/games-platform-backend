import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserGameService } from './user-game.service';
import { CreateUserGameDto } from './dto/createUserGame.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateUserGameDto } from './dto/updateUserGame.dto';

@Controller('user-game')
export class UserGameController {
  constructor(private userGameService: UserGameService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createGame(@Body() userGameDto: CreateUserGameDto, @Req() req) {
    return await this.userGameService.createUserGame(userGameDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('set-rating')
  async setGameRating(@Body() userGameDto: UpdateUserGameDto, @Req() req) {
    const { rating, game } = userGameDto;

    return await this.userGameService.setUserRating(req.user, game, rating);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('set-status')
  async setGameStatus(@Body() userGameDto: UpdateUserGameDto, @Req() req) {
    const { status, game } = userGameDto;

    return await this.userGameService.setGameStatus(req.user, game, status);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-rating/:gameId')
  async getUserRating(@Param() { gameId }, @Req() req) {
    return await this.userGameService.getUserRating(req.user, gameId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-status/:gameId')
  async getGameStatus(@Param() { gameId }, @Req() req) {
    return await this.userGameService.getGameStatus(req.user, gameId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-user-games')
  async getUserGames(@Req() req) {
    return await this.userGameService.getUserGames(req.user);
  }
}
