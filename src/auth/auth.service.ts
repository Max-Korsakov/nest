import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(login: string): Promise<any> {
    const user = await this.usersService.getUserWithLogin(login);
    if (user) {
      return user;
    }
    return null;
  }

  async login(userPayload) {
    const user = await this.usersService.getUserWithLogin(userPayload?.login);
    if (userPayload?.password === user?.password) {
      const payload = { username: user.login, sub: user.id };
      return {
        access_token: this.jwtService.sign(payload, { secret: '111' }),
      };
    }
    throw new HttpException('Credentials not valid', HttpStatus.UNAUTHORIZED);
  }
}
