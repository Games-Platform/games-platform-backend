import { Module } from '@nestjs/common';
import { UserGameController } from './user-game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserGame } from './entity/user-game.entity';
import { UserGameService } from './user-game.service';
import { Game } from 'src/games/entity/game.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserGame, Game])],
  controllers: [UserGameController],
  providers: [UserGameService],
})
export class UserGameModule {}
