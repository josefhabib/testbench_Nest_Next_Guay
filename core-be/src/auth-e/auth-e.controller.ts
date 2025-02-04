import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthEController {
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() request) {
    // --- Generate the JWT token here ---
    // 1. Get the user from the request object
    //
    //    Notes: req.user
    //    - This field on the request object has been added to the request object by the LocalAuthGuard guard (LocalAuthGuard class; validate() method)
    //    - The password field has been redacted for security reasons
    //    - This enrichment of the request object is important it allows subsequently used methods to access the user object (like JWT token generation)
    //
    // TODO: Add usergroup to database and include it in the JWT token
    // TODO: Add error handling

    const currentUser = request.user;

    // 2. Set secret key & expiry time environment variables
    // 3. Generate the JWT token using the sign() method
    // 4. Return the JWT token in the response (Note: The client will store the token in the cookie)
    //  Important settings:
    //  - The cookie needs to be secure and httpOnly
    //  - The cookie needs to have a sameSite attribute set to ??? (strict or lax)
    //  - passthrough=true in the cookie settings (to ensure that the request is processed by the application and accepted by the browser)

    // return request.user;
  }
}
