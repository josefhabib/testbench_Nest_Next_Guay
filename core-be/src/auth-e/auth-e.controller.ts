import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthEController {
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req) {
    // console.log('IN LOGIN: req.user is: ', req.user);
    return req.user;
  }
}
