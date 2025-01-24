import { Module } from '@nestjs/common';
import { AuthEController } from './auth-e.controller';
import { AuthEService } from './auth-e.service';

@Module({
  controllers: [AuthEController],
  providers: [AuthEService]
})
export class AuthEModule {}
