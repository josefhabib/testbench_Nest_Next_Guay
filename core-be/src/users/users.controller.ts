import { Controller, Post } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {

  // POST /users: Create a new user
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    // TODO: Implement createUser() controller method
    return 'This action adds a new user';
  }
  

  // GET /users: Get all users
  // GET /users/:id: Get a user by id
  // PUT /users/:id: Update a user by id
  // DELETE /users/:id: Delete a user by id


}
