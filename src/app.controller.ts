import { Controller, Request, Post } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
