import { Response } from 'express';
import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthEService } from './auth-e.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '@prisma/client';
import { IJwtPayload } from 'src/interfaces/jwt-payload.interface';
import { ICurrentUserInfo } from 'src/interfaces/user-info_be-core-auth';

@Controller('auth')
export class AuthEController {
  constructor(private authService: AuthEService) {} // Inject the AuthService (contains implementation of the create jwt functionality)

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(
    @CurrentUser() user: User, // Custom decorator to extract the user object from the request object (put there by the corresponding Passport object's strategy() method)
    @Res({ passthrough: true }) response: Response,
  ) {
    // Explicitly add user object attributes that you want to include in the JWT token (Security: avoid including sensitive/superfluous data)
    const trimmedUserObj: IJwtPayload = {
      id: user.id,
      email: user.email
    };
    // Generate the JWT token + attach it to the response object
    return this.authService.login(trimmedUserObj, response); // delegate JWT creation to login function of our AuthEService: given the user object enrich the current res object with the JWT token.
  }

  @UseGuards(JwtAuthGuard)
  @Get('whoami')
  whoami(@CurrentUser() user: ICurrentUserInfo) {
    return user;
  }
}

