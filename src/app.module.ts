import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './auth/strategies/google.strategy';
import { GamesModule } from './games/games.module';
import { dataSourceOptions } from './db/data-source';
import { UserGameModule } from './user-game/user-game.module';
import { GamePlatformModule } from './game-platform/game-platform.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    AuthModule,
    PassportModule.register({ session: true }),
    GamesModule,
    UserGameModule,
    GamePlatformModule,
  ],
  controllers: [],
  providers: [GoogleStrategy],
})
export class AppModule {}
