import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  createUser(ctx: CreateUserDto) {
    // TODO: Implement createUser() service method
    return 'Stub: This action will add a new user';
  }
}
