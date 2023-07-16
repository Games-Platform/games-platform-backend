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
    try {
      const user = await this.usersService.findOneByEmail(email, false);

      if (!pass || !user.password) {
        throw new BadRequestException(EAuth.INVALID_CRENEDTIALS);
      }

      const isComparedPassword = compare(user.password, pass);
      if (user && isComparedPassword) {
        return user;
      }
    } catch (err) {
      throw new BadRequestException(err);
    }
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

      const loggedUser = await this.login(currentRequest, response);
      if (loggedUser) {
        const redirectUrl = this.configService.get('FRONTEND_URL_DEV');
        response.redirect(redirectUrl);
        return;
      }
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async register(createUserDto: CreateUserDto) {
    await this.usersService.createUser(createUserDto);

    return { message: EAuth.REGISTER_SUCCESS };
  }

  async login(request, response) {
    try {
      const user = await this.usersService.findOneByEmail(
        request.user.email,
        true,
      );

      if (!user) {
        throw new BadRequestException(EAuth.INVALID_CRENEDTIALS);
      }

      const { id, username, email } = user;
      const payload = {
        email,
        id,
        username,
      };
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

      return { access_token: token, message: EAuth.LOGIN_SUCCESS };
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  logout(res) {
    res.clearCookie('access_token');

    return {
      message: EAuth.LOGOUT_SUCCESS,
    };
  }
}
