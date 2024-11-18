import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';

// TODO: Add logging
// TODO: Add error handling (currently, NestJS will only return a 500 error (if an exception is thrown); or a 400 error (if a validation checks fail))

async function bootstrap() {
  // - Create the app
  const app = await NestFactory.create(AppModule);

  // - Logging (Pino)
  const logger = app.get(Logger);
  app.useLogger(logger);
  
  // - Validation (and any other global) pipes
  app.useGlobalPipes(new ValidationPipe({ whitelist: true } )); 

  // - Add ConfigService (dynamically set run-config specific parameters from .env file)
  const configService = app.get(ConfigService);
  await app.listen(configService.getOrThrow('NESTJS_CORE_PORT'));
  // console.log('Listening on port: ', configService.getOrThrow('NESTJS_CORE_PORT'));
}
bootstrap();
