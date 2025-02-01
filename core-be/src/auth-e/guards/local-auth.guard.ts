import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";   // NB: Imported from @nestjs/passport; Will receive a 'strategy' as an argument
import { AuthEService } from "../auth-e.service";


@Injectable()
export class LocalAuthGuard extends AuthGuard('my-local-strategy') {
  // constructor(private authService: AuthEService) {
  //   super();
  // }

  // async canActivate(context: ExecutionContext) {
  //   const request = context.switchToHttp().getRequest();
  //   const response = context.switchToHttp().getResponse();

  //   const user = await this.authService.validateUser(
  //     request.body.username,
  //     request.body.password
  //   );

  //   if (user) {
  //     request.user = user;
  //     return true;
  //   }

  //   return false;
  // }
}