import * as bcrypt from 'bcrypt';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaUsersDbService } from 'src/prisma_users-db/prisma_users-db.service';
import { User } from '@prisma/client'; // ! Prisma generated types from schema.prisma file 

@Injectable()
export class UsersService {

  constructor(private readonly PrismaUsersDbService: PrismaUsersDbService){}
  
  async createUser(ctx: CreateUserDto) : Promise<Omit<User, 'password'>> { // NB: label async (access db) and add return type  

    // persist user (& return promise):
    try {
      return await this.PrismaUsersDbService.user.create({
        data: {
          ...ctx,
          password: await bcrypt.hash(ctx.password, 10)
        },
        select:{
          id: true,
          email: true
        }
      });
    } catch (error) {
      if (error.code === 'P2002') { // Prisma unique constraint violation error code
        throw new UnprocessableEntityException('A user with this email already exists.');
      }
      throw error;
    }

  }
}
