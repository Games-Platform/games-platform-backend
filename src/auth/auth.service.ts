import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { EAuth } from 'src/types';
import { CreateUserDto } from 'src/users/dto/createUser.dto';

import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async findUser(id: number) {
    const user = await this.usersService.findOneById(id);
    return user;
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email, false);

    if (!pass || !user.password) {
      throw new BadRequestException(EAuth.INVALID_CRENEDTIALS);
    }

    const isComparedPassword = compare(user.password, pass);
    if (user && isComparedPassword) {
      return user;
    }
    throw new BadRequestException(EAuth.INVALID_CRENEDTIALS);
  }

  async saveGoogleUser(displayName: string, email: string): Promise<any> {
    const existingUser = await this.usersService.findOneByEmail(email, true);

    if (existingUser) {
      existingUser.username = displayName;
      await this.usersService.updateUser(existingUser);

      return existingUser;
    }

    const newUser = await this.usersService.createUser({
      username: displayName,
      email: email,
      password: null,
    });

    return newUser;
  }

  async googleLogin(request, response) {
    await this.saveGoogleUser(
      request.user.displayName,
      request.user.emails[0].value,
    );
    const loggedUser = this.login(request, response);

    if (loggedUser) {
      const redirectUrl = this.configService.get('FRONTEND_URL_DEV');
      response.redirect(redirectUrl);
      return;
    }
  }

  async register(createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }

  async login(request, response) {
    const { id, username, email } = request.user;
    const payload = { email, id, username };
    const token = this.jwtService.sign(payload);

    if (!token) {
      throw new BadRequestException(EAuth.INVALID_CRENEDTIALS);
    }
    response.cookie('access_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
    });

    return { access_token: token, status: 'ok' };
  }
}
