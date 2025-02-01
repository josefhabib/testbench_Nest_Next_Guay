import * as bcrypt from 'bcrypt';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaUsersDbService } from 'src/prisma_users-db/prisma_users-db.service';
import { Prisma, PrismaClient, User } from '@prisma/client'; // ! Prisma generated types from schema.prisma file 

@Injectable()
export class UsersService {

  constructor(private readonly PrismaUsersDbService: PrismaUsersDbService){}
  
  async createUser(ctx: CreateUserDto) : Promise<Omit<User, 'password'>> { // NB: label async (access db) and add return type (NB: Don't return password! Omit utility type used to exclude password field) 
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

  async getUser(filter: Prisma.UserWhereUniqueInput): Promise<User> {
    try {
      return await this.PrismaUsersDbService.user.findUniqueOrThrow({ where: filter });
    } catch (error) {
      throw new UnprocessableEntityException('User not found or multiple users found.');
    }
  }
}

// Find a user in the users-db database given SOME criteria (not hardcoded)
    // NB: Prisma allows you to use the findUniqueOrReject method to find a user by their email (or throw an error if no/multiple users are found)
    // NB: Prisma allows you to define the filter criterion in real time (i.e. through the args provided to the method) - this avoids having to define a separate query method for each filter criterion 

