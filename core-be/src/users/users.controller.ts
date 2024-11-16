import { Controller, Post } from '@nestjs/common';

@Controller('users')
export class UsersController {

  // POST /users: Create a new user
  @Post()
  createUser() {
      // TODO: Implement createUser() controller method
      return 'This action adds a new user';
    }
  

  // GET /users: Get all users
  // GET /users/:id: Get a user by id
  // PUT /users/:id: Update a user by id
  // DELETE /users/:id: Delete a user by id


}
