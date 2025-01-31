import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class AuthEService {

  constructor(private readonly usersService: UsersService) {}

  async verifyCredentials(email: string, password: string): Promise<User> {

    try { 
      // 1. Check if the user exists in the database (use the users service of the users module)
      const user = await this.usersService.getUser({email});

      // NB: UsersService.getUser() method checks if a unique user exists in the db 
      // - if not it throws an error (handled in the catch block)
      // - if the next step is executed we know, by implication, that the user exists in the db and has been retrieved
      
      // 2. If the user exists, check if the password is correct
      // - Compare the provided password with the hashed password stored in the database
      // - bcrypt.compare() returns a promise that is resolved/rejected - i.e. if compare processing jumps to the catch block 
      const authenticated = await bcrypt.compare(password, user.password);
      
      // 3. If the password is correct, return the user; Otherwise, throw an UnauthorizedException
      if (!authenticated) {
        throw new UnauthorizedException();
      }
      return user

    }
    catch (err) {
      throw new UnauthorizedException('Invalid credentials'); // NB: This error message is generic (Does not reveal if the username (step 1) or password (step 2) is incorrect)
    }
  }
}
