import { Module } from '@nestjs/common';
import { AuthEController } from './auth-e.controller';
import { AuthEService } from './auth-e.service';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [AuthEController],
  providers: [AuthEService]
})
export class AuthEModule {}
