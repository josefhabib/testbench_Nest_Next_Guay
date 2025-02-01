import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class AuthEService {

  constructor(private readonly usersService: UsersService) {}

  async verifyCredentials(email: string, password: string): Promise<User> {

    try { 
      // 1. Check if the user exists in the database 
      const user = await this.usersService.getUser({email});
      
      // 2. If the user exists, check if the password is correct
      const authenticated = await bcrypt.compare(password, user.password);
      
      // 3. If the password is correct, return the user; Otherwise, throw an UnauthorizedException
      if (!authenticated) {
        throw new UnauthorizedException();
      }
      return user
    }
    catch (err) {
      throw new UnauthorizedException('Invalid credentials'); // NB: Generic error message formulation (Does not reveal if the username (step 1) or password (step 2) is incorrect)
    }
  }
}
