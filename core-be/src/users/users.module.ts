import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaUsersDbModule } from 'src/prisma_users-db/prisma_users-db.module';

@Module({
  imports: [PrismaUsersDbModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
