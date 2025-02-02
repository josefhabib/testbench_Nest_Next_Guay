import { Module } from '@nestjs/common';
import { AuthEController } from './auth-e.controller';
import { AuthEService } from './auth-e.service';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [UsersModule],
  controllers: [AuthEController],
  providers: [AuthEService, LocalStrategy]
})
export class AuthEModule {}
