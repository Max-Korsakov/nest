import { Controller, Body, Post } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { AppService } from './app.service';
import { ApiTags, ApiBody, ApiProperty } from '@nestjs/swagger';
import { Public } from './auth/public';

export class Login {
  @ApiProperty({
    description: 'user login name',
    default: 'user@user.com',
  })
  login: string;

  @ApiProperty({
    description: 'user password',
    default: 'qwerty1234',
  })
  password: string;
}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @ApiTags('auth')
  @Public()
  @Post('auth/login')
  @ApiBody({ type: Login })
  async login(@Body() loginPayload: any) {
    return this.authService.login(loginPayload);
  }
}
