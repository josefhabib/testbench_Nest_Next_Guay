import { Module } from '@nestjs/common';
import { AuthEController } from './auth-e.controller';
import { AuthEService } from './auth-e.service';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (ConfigService: ConfigService) => ({
        secret: ConfigService.getOrThrow('NESTJS_CORE_JWT_SECRET'),
        signOptions: {
          expiresIn: ConfigService.getOrThrow('NESTJS_CORE_JWT_EXPIRES_IN'),
        },
      }),
    }),
  ],
  controllers: [AuthEController],
  providers: [AuthEService, LocalStrategy],
})
export class AuthEModule {}
