// import { Injectable } from "@nestjs/common";
// import { AuthGuard } from "@nestjs/passport";

// @Injectable()
// export class JwtAuthGuard extends AuthGuard('my-jwt-strategy') {}

import { Injectable, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('my-jwt-strategy') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    this.logger.log('JwtAuthGuard canActivate called');
    const request = context.switchToHttp().getRequest();
    this.logger.log(`Request cookies: ${JSON.stringify(request.cookies)}`);
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      this.logger.error('Unauthorized access', err || info);
      throw err || new UnauthorizedException();
    }
    this.logger.log('User authenticated successfully');
    return user;
  }
}