import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";


@Injectable()
export class LocalAuthGuard extends AuthGuard('my-local-strategy') {}

// -- Logging version of the LocalAuthGuard --
//
// import { Injectable, ExecutionContext, UnauthorizedException, Logger } from "@nestjs/common";
// import { AuthGuard } from "@nestjs/passport";
//
// @Injectable()
// export class LocalAuthGuard extends AuthGuard('my-local-strategy') {
//   private readonly logger = new Logger(LocalAuthGuard.name);
//
//   canActivate(context: ExecutionContext) {
//     this.logger.log('NestJS Logger AuthGuard: LocalAuthGuard canActivate called');
//     const request = context.switchToHttp().getRequest();
//     this.logger.log(`NestJS Logger AuthGuard: Request cookies: ${JSON.stringify(request.cookies)}`);
//     return super.canActivate(context);
//   }
//
//   handleRequest(err, user, info) {
//     if (err || !user) {
//       this.logger.error('NestJS Logger AuthGuard: Unauthorized access', err || info);
//       throw err || new UnauthorizedException();
//     }
//     this.logger.log('NestJS Logger AuthGuard: User authenticated successfully');
//     return user;
//   }
// }