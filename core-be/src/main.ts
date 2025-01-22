import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from the specified .env file
const envFilePath = process.env.ENV_FILE_PATH || path.resolve(__dirname, '../../.env');
dotenv.config({ path: envFilePath });
// // -- NB - 
// //         Although the NODE_ENV environment variable is set in the package.json scripts file (e.g. "build:prod": "dotenv -e ../../.env -- nest build") 
// //         they must nevertheless also be included here: 
// //         This is because environment variables are not being passed to the compiled code in the dist directory 
// //         When you run node dist/main, it does not have access to the environment variables set during the build process.


// TODO: Add logging
// TODO: Add error handling (currently, NestJS will only return a 500 error (if an exception is thrown); or a 400 error (if a validation checks fail))
// TODO: Add Swagger (OpenAPI) documentation
// TODO: Refactor: Create a separate auth module with its own NestJS app (Microservices), its own Prisma client - so that Auth is a standalone full stack app that can be integrated into the main app.
// TODO: ?Refactor: Move all the configuration to a separate file (e.g. config.ts)
// TODO: ?Refactor: Move all the logging to a separate file (e.g. logger.ts)
// TODO: ?Refactor: Move all the error handling to a separate file (e.g. error.ts)
    


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

  // - Start the app (Use configService to get port from .env)
  await app.listen(process.env.NESTJS_CORE_PORT || 3000); //TODO: Conflicing Mechanisms: We explicitly load the .env files in package.json AND we use the config module (that looks for a local .env file) - consolidate!!!
  //console.log('Listening on port: ', configService.getOrThrow('NESTJS_CORE_PORT'));
}
bootstrap();
