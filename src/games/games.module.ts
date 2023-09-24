import { Module } from '@nestjs/common';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entity/game.entity';
import { GamePlatformModule } from 'src/game-platform/game-platform.module';

@Module({
  imports: [TypeOrmModule.forFeature([Game]), GamePlatformModule],
  controllers: [GamesController],
  providers: [GamesService],
})
export class GamesModule {}
