import { Controller, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthEController {
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login() {}
}
