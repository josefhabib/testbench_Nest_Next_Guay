import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { PrismaUsersDbModule } from './prisma_users-db/prisma_users-db.module';
import { AuthEModule } from './auth-e/auth-e.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        // - Get the current run configuration
        const isProduction = configService.get('NODE_ENV') === 'production';

        return {
          // - Return the logger configuration (depending on the current run configuration)
          pinoHttp: {
            transport: isProduction 
              ? undefined 
              : {
                target: 'pino-pretty',
                options: {
                  singleLine: true,
                },
              },
            level: isProduction ? 'info' : 'debug',
          },
        };
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot(),
    UsersModule,
    AuthEModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
