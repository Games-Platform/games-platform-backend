import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamePlatformService } from './game-platform.service';
import { GamePlatform } from './entity/game-platform.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GamePlatform])],
  providers: [GamePlatformService],
  exports: [GamePlatformService],
})
export class GamePlatformModule {}
