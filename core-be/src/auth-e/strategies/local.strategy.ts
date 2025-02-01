import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local"; 
import { AuthEService } from "../auth-e.service";
import { User } from "@prisma/client";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'my-local-strategy') {

    constructor(private readonly authEService: AuthEService) {
   
    // Override LocalStrategy default: By default the local strategy uses username and password fields. We want to use email and password fields instead. Override by passing an options object to the super() method.
    super({
      usernameField: "email",
      passwordField: "password",
    });
  }

  async validate(username: string, password: string): Promise<User> {
    // All Passport strategies must implmement a validate() method
    // The validate() method is called by Passport when an incoming request hits a Guard that is using this strategy

    // NB: whatever is returned from the passport strategy validate method is attached to the request object as req.user
    //     This is helpful for subsequent middleware to access the user object

    return this.authEService.verifyCredentials(username, password);
  }
}





// // Implementation Note: export class LocalStrategy extends PassportStrategy(Strategy)
// // ----------------------------------------------------------------------------------
// //
// // - A detail of this setup that may appear strange is that we extend a class 
// //   from a function:
// //  
// //   > export class LocalStrategy extends PassportStrategy(Strategy)
// //
// //   PassportStrategy() 
// //    - is provided by NestJS (in order to integrate Passport with NestJS)
// //    - is a "higher order" (class factory) FUNCTION -> It takes a strategy as an argument and returns a class.
// //
// //   Why do we need this?
// //    Different authentication stragegies have fundamentally different configurations.
// //    For instance, a local strategy requires a username and password, whereas 
// //    an OAuth strategy requires a client ID and client secret.
// //
// //   On the other hand, all authentication strategies share some common functionality:
// //    - They all require a validate() method.
// //    - They all require a constructor that accepts configuration options.
// //    - They all return a user object if the credentials are valid.
// //
// // By using a class factory, we can define the common functionality in the 
// //  PassportStrategy class without imposing a specific configuration.
// //
// // The specific strategy we use is governed by which "Strategy" we imported.
// // Here we:
// //    >  import { Strategy } from "passport-local"
// //
// // However, since we also installed passport-jwt, we could also import the
// //  JWT strategy from there:
// //    >  import { Strategy } from "passport-jwt"
