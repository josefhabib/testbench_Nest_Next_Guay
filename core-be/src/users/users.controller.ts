import { Controller, Post } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

  // Constructor (dependency injection)
  constructor(private readonly usersService: UsersService) {}

  // POST /users: Create a new user
  @Post()
  createUser(@Body() req: CreateUserDto) {
    console.log('payload: ', req);
    return this.usersService.createUser(req);
  }

}
