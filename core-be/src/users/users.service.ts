import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaUsersDbService } from 'src/prisma_users-db/prisma_users-db.service';
import { User } from '@prisma/client'; // ! Prisma generated types from schema.prisma file 

@Injectable()
export class UsersService {

  constructor(private readonly PrismaUsersDbService: PrismaUsersDbService){}
  
  async createUser(ctx: CreateUserDto) : Promise<User> { // NB: label asyunc (access db) an add return type  

    // persist user (& return promise):
    return this.PrismaUsersDbService.user.create({
      data: {
        ...ctx,
        password: await bcrypt.hash(ctx.password, 10)
      }
    });

  }
}
