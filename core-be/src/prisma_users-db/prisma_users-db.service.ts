import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaUsersDbService extends PrismaClient implements OnModuleInit{
  // PrismaClient: Pre-configured in ../../../databases/db-server-dev1/prisma/schema.prisma
  // OnModuleInit: NestJS lifecycle hook that ensures it will be called on application startup 

  async onModuleInit() {
    // onModuleInit runs on start up...
    await this.$connect(); // ...to set up a connection to the database
  }
}
