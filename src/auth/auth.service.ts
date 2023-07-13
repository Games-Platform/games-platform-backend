import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { IUser } from 'src/types';

import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    const isComparedPassword = compare(user.password, pass);
    if (user && isComparedPassword) {
      return user;
    }
    throw new BadRequestException('User or password is incorrect');
  }

  async login(user: IUser) {
    const { id, username, email } = user;
    const payload = { email, id, username };
    return {
      id,
      email,
      username,
      access_token: this.jwtService.sign(payload),
    };
  }
}
