import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { IUser } from 'src/types';
import { Injectable } from '@nestjs/common';
import { VerifiedCallback } from 'passport-jwt';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private authService: AuthService) {
    super();
  }

  serializeUser(user: IUser, done: VerifiedCallback) {
    done(null, user);
  }

  async deserializeUser(payload: any, done: VerifiedCallback) {
    const user = await this.authService.findUser(payload.id);

    return user ? done(null, user) : done(null, null);
  }
}
