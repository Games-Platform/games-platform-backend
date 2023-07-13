import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

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
      throw new BadRequestException('User with this email already exist');
    }

    const hashedPassword = await hash(createUserDto.password, 12);

    const user = await this.userRepository.save({
      ...createUserDto,
      password: hashedPassword,
    });

    const { id, username, email } = user;

    const token = this.jwtService.sign({ email });

    return { id, username, email, token };
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
    });
  }
}
