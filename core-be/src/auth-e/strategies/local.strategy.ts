import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from 'src/users/users.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LocalStrategy extends PassportStrategy(
  Strategy,
  'my-local-strategy',
) {
  constructor(private readonly usersService: UsersService) {
    // Override LocalStrategy default: By default the local strategy uses username and password fields. We want to use email and password fields instead. Override by passing an options object to the super() method.
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true, // Ensure this is set to true if you want to access the request object in the validate() method
    });
  }

  async validate(
    req: Request,
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.verifyCredentials(email, password);

    // If the user is authenticated, return the user object (redact the password field for security)
    const { password: _, ...result } = user;
    return result;
  }

  // Private utility method to verify the user's credentials (email and password) by comparing provided (args) against the database
  private async verifyCredentials(
    email: string,
    password: string,
  ): Promise<User> {
    try {
      // 1. Check if the user exists in the database
      const user = await this.usersService.getUser({ email });

      // 2. If the user exists, check if the password is correct
      const authenticated = await bcrypt.compare(password, user.password);

      // 3. If the password is correct, return the user; Otherwise, throw an UnauthorizedException
      if (!authenticated) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (err) {
      throw new UnauthorizedException('Invalid credentials'); // NB: Generic error message formulation (Does not reveal if the username (step 1) or password (step 2) is incorrect)
    }
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
