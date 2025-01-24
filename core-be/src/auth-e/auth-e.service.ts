import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthEService {

  constructor(private readonly usersService: UsersService) {}

  async verifyCredentials(email: string, password: string): Promise<boolean> {

    try { 
      // 1. Check if the user exists in the database (use the users service of the users module)
      const user = await this.usersService.getUser({email});

      // NB: UsersService.getUser() method checks if a unique user exists in the db 
      // - if not it throws an error (handled in the catch block)
      // - if the next step is executed we know, by implication, that the user exists in the db and has been retrieved
      
      // 2. If the user exists, check if the password is correct
      // - Compare the provided password with the hashed password stored in the database

      // 3. If the password is correct, return true; Otherwise, return false

      return true

    }
    catch (err) {}
  }
}
