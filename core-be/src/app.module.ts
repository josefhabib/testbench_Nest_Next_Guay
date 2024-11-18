import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    ConfigModule.forRoot(),
    LoggerModule.forRoot(), // To be changed: add run config (dev/test/prod) specific configs
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
