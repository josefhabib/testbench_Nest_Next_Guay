import { Injectable } from '@nestjs/common';
// import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthEService {
  // constructor(private readonly usersService: UsersService) {}

  login(user: any, response: any) {
    //TODO: Implement JWT creation logic here
    return response;
  }
}
