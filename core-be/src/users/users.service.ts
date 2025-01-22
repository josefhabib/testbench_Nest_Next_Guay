import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaUsersDbService } from 'src/prisma_users-db/prisma_users-db.service';

@Injectable()
export class UsersService {

  constructor(private readonly PrismaUsersDbService: PrismaUsersDbService){}
  
  createUser(ctx: CreateUserDto) {
    // TODO: Implement createUser() service method
    return 'Stub: This action will add a new user';
  }
}
