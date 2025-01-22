import { Module } from '@nestjs/common';
import { PrismaUsersDbService } from './prisma_users-db.service';

@Module({
  providers: [PrismaUsersDbService],
  exports: [PrismaUsersDbService]
})
export class PrismaUsersDbModule {}
