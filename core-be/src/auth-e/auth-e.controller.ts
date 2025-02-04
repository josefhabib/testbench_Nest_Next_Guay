import { Response } from 'express';
import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthEService } from './auth-e.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthEController {
  constructor(private authService: AuthEService) {} // Inject the AuthService (contains implementation of the create jwt functionality)

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(user, response); // delegate JWT creation to login function of our AuthEService: given the user object enrich the current res object with the JWT token.
  }
}
