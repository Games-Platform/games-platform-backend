import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EAuth } from 'src/types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const existUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existUser) {
      throw new BadRequestException(EAuth.USER_EXIST);
    }

    const user = await this.userRepository.save({
      ...createUserDto,
      password: createUserDto.password
        ? await hash(createUserDto.password, 12)
        : null,
    });

    const { id, username, email } = user;

    const token = this.jwtService.sign({ email });

    return { id, username, email, token };
  }

  async findOneByEmail(email: string, isGoogle: boolean) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user && !isGoogle) {
      throw new BadRequestException(EAuth.USER_NOT_EXIST);
    }

    return user;
  }

  async findOneById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new BadRequestException(EAuth.USER_NOT_EXIST);
    }

    return user;
  }

  async updateUser(user: User): Promise<User> {
    const updatedUser = await this.userRepository.save(user);
    return updatedUser;
  }
}
