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
    return this.usersService.createUser(req);
  }
  

  // GET /users: Get all users
  // GET /users/:id: Get a user by id
  // PUT /users/:id: Update a user by id
  // DELETE /users/:id: Delete a user by id


}
