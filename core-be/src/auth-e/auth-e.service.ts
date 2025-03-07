import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { Response } from 'express';
import ms from 'ms';
// import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';

export interface ILoginResponse {
  message: string;
}

@Injectable()
export class AuthEService {
  // Dependency Injection of the UsersService () and ConfigService (get JWT env variables)
  constructor(
    // private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  login(user: IJwtPayload, res:Response): ILoginResponse {  

    // --- 
    // Task: Generate a JWT token 
    //
    // Context:
    //  - The JWT service is already (see auth-e.module.ts JwtModule import (& async registration)) configured with:
    //    --> the secret key  
    //    --> the expiration duration
    //  - The login function also receives the following as args:
    //    --> the user object (prepped by LocalAuthGuard) and
    //    --> the response object (provided by AuthEController)
    //
    // Steps:
    //  1. Calculate the expiry time (current time + expiration duration)
    //  2. Generate the JWT token using the jwtService.sign() method (pre-configured with the secret key and expiry duration - see auth-e.module.ts)
    //  3. Create a response object enriched with the JWT token
    // --- 

    // --- Create the JWT token
    const payload = { user };
    // console.log('IN AuthEService.login(): The payload is ' + JSON.stringify(payload));

    const token = this.jwtService.sign(payload);
    // console.log('IN AuthEService.login(): The generated token is', token);

    // --- Calculate the expiry time (to communicate expiration time to the CLIENT - prompts cookie to be cleared when expired)
    const decodedToken = jwt.decode(token) as { [key: string]: any };
    const expiresAt = new Date(decodedToken.exp * 1000);

    // // --- OPTIONAL Debugging (Start): Decode the token to inspect its payload and expiration time-----------------------------
    //
    // console.log('\n ========================Debugging Start: check JWT attached to res by login()============================');
    // console.log('IN AuthEService.login(): The decoded token is', decodedToken);
    // // - Convert iat to human-readable format
    // if (decodedToken.iat) {
    //   const issuedAt = new Date(decodedToken.iat * 1000);
    //   console.log('IN AuthEService.login(): The token was issued at', issuedAt.toISOString());
    // }
    // else {
    //   console.log('IN AuthEService.login(): The token was issued at an unknown time');
    // }
    // // - Convert exp to human-readable format
    // if (decodedToken.exp) {
    //   console.log('IN AuthEService.login(): The token expires at', expiresAt.toISOString());
    // }
    // else {
    //   console.log('IN AuthEService.login(): The token expires at an unknown time');
    // }
    // console.log('========================Debugging End:   check JWT attached to res by login()============================ \n');
    //
    // // --- OPTIONAL Debugging (End)-------------------------------------------------------------------------------------


    // --- Attach the JWT token to the response object (cookie)
    res.cookie('be-core-auth', token, {
      httpOnly: true, // Prevents client-side JS from reading the cookie
      secure: true, // Only allow httpS connections (or http on localhost)
      //sameSite: 'strict',
      expires: expiresAt // Set the expiration time of the cookie (to prompt client to clear it)
    });

    // --- Enrich the response object with the JWT token and return it
    return { message: 'Login successful; Cookie (be-core-auth) set on response' }; // Do not return the token in the response body (security risk)
  }
}
