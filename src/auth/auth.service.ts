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

    const isComparedPassword = await compare(pass, user.password);

    if (!user || !isComparedPassword) {
      throw new BadRequestException(EAuth.INVALID_CRENEDTIALS);
    }
    return user;
  }

  async saveGoogleUser(displayName: string, email: string): Promise<any> {
    try {
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
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async googleLogin(request, response) {
    try {
      await this.saveGoogleUser(
        request.user.displayName,
        request.user.emails[0].value,
      );

      const currentRequest = {
        user: {
          username: request.user.displayName,
          email: request.user.emails[0].value,
        },
      };

      const loggedUser = await this.login(currentRequest, response, true);
      if (loggedUser) {
        const redirectUrl = this.configService.get('FRONTEND_URL_DEV');
        response.redirect(redirectUrl);
        return;
      }
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async register(createUserDto: CreateUserDto, response) {
    await this.usersService.createUser(createUserDto);

    const user = await this.usersService.findOneByEmail(
      createUserDto.email,
      false,
    );
    const { id, username, email } = user;
    const payload = {
      email,
      id,
      username,
    };
    const token = this.jwtService.sign(payload);

    response.cookie('access_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return { access_token: token, message: EAuth.REGISTER_SUCCESS };
  }

  async login(request, response, isGoogle) {
    const user = await this.usersService.findOneByEmail(
      request.user.email,
      isGoogle,
    );

    const { id, username, email } = user;
    const payload = {
      email,
      id,
      username,
    };
    const token = this.jwtService.sign(payload);

    response.cookie('access_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
    });

    return { access_token: token, message: EAuth.LOGIN_SUCCESS };
  }

  logout(res) {
    res.clearCookie('access_token');

    return {
      message: EAuth.LOGOUT_SUCCESS,
    };
  }
}
