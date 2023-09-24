import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GamePlatform } from './entity/game-platform.entity';

@Injectable()
export class GamePlatformService {
  constructor(
    @InjectRepository(GamePlatform)
    private platformRepository: Repository<GamePlatform>,
  ) {}

  async getAllPlatforms(): Promise<GamePlatform[]> {
    return this.platformRepository.find();
  }

  async getPlatformById(id: number): Promise<GamePlatform> {
    const platform = await this.platformRepository.findOne({ where: { id } });

    if (!platform) {
      throw new NotFoundException();
    }

    return platform;
  }

  async getPlatformByName(platformName: string): Promise<GamePlatform> {
    const platform = await this.platformRepository.findOne({
      where: { platform: platformName },
    });

    if (!platform) {
      return null;
    }

    return platform;
  }

  async createPlatform(platform: string): Promise<GamePlatform> {
    const currentPlatform = this.platformRepository.create({ platform });

    return this.platformRepository.save(currentPlatform);
  }
}
