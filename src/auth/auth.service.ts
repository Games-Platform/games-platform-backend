import { BadRequestException, Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    const isComparedPassword = compare(user.password, pass);
    if (user && isComparedPassword) {
      const { id, username, email } = user;
      return {
        id,
        username,
        email,
      };
    }
    throw new BadRequestException('User or password is incorrect');
  }
}
