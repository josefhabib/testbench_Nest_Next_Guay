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
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow('NESTJS_CORE_JWT_SECRET'),
        signOptions: {
          expiresIn: configService.getOrThrow('NESTJS_CORE_JWT_EXPIRES_IN'),
        },
      }),
    }),
  ],
  controllers: [AuthEController],
  providers: [AuthEService, LocalStrategy],
})
export class AuthEModule {}

// Elaboration: JWT Module import, registration & configuration
// ------------------------------------------------------------
//
//---
//   
// @Module({
//   imports: [
//     ...
//     JwtModule.registerAsync({
//       imports: [ConfigModule],
//       inject: [ConfigService],
//       useFactory: (configService: ConfigService) => ({
//         secret: configService.getOrThrow('NESTJS_CORE_JWT_SECRET'),
//         signOptions: {
//           expiresIn: configService.getOrThrow('NESTJS_CORE_JWT_EXPIRES_IN'),
//         },
//       }),
//     }),
//   ],
//   ...
// })
// export class AuthEModule {}
//
//---
//
// Code Explanation 
//      
// - imports: [JwtModule...]: 
//    The JwtModule is imported to enable the use of JWT (JSON Web Token) functionality in the module.
//
// - JwtModule.registerAsync({...}):
//    This method is used to register the JWT (JSON Web Token) module asynchronously. 
//    Module "registration" is needed if the imported module requires configuration values
//    Async registration allows for the use of asynchronous operations (e.g., fetching configuration values from e.g. the .env) - see useFactory.
//
// - imports: [ConfigModule]:
//    The ConfigModule is imported to provide (access to) configuration values. 
//    This module is typically used to manage environment variables (.env) and other configuration settings in a NestJS application.
//
// - useFactory: (configService: ConfigService) => ({ ... }):
//    The "useFactory" property is assigned a factory function that returns the configuration object for the JWT module. 
//    "Factory functions" are a design pattern that allows for the creation of objects based on a set of parameters. 
//      Here, they are used because the configuration values for the JWT module are fetched asynchronously (i.e. an async function is required). 
//    The factory function takes the ConfigService as an argument (see 'inject' below) and returns an object containing the secret and signOptions for the JWT module.
//      - 'secret': The secret key is a string used by the JWT module to sign the JWT tokens. 
//      - 'signOptions': An object containing options for signing the JWT tokens, such as the expiration time.
// 
// - inject: [ConfigService]: 
//    The ConfigService contains the async methods the factory function needs to access the .env config values. It is "injected" here in order to pass it as args to the factory function.
//
// 
// Usage: 
//  To use the secret and expiresIn values in a service, you typically inject the JwtService provided by the JwtModule and use its methods to sign and verify tokens.
//  The JWT service then provides methods: 
//    - sign(payload: any): string: to generate a JWT token with the given payload.
//    - verify(token: string): any: to verify and decode a JWT token.
//  
// Notes & FAQs:
// - The JWT module comes pre-configured with the values for the secret and expiration time - as we have seen above, these are set by the factory function during import/registration.
// - Common errors are:
//   -->   A CIRCULAR DEPENDENCY between the ConfigModule and JwtModule. This can be resolved by ensuring that the ConfigModule is imported before the JwtModule.
//   -->   A CIRCULAR REFERNCE: 
//          Arises when an object contains a reference to another object, which in turn references the original object, creating a loop. 
//          This can happen with complex objects like HTTP requests and responses, which have many nested properties and references. 
//          Best practices to avoid/resolve this: 
//          => Only include the necessary data in the response (i.e. explicitly extract the fields required from the user object)
//          => (!) Dont pass the res object as a parameter to the service and enrich it with the JWT token there. Instead, return the token from the service and let the controller handle the response(!)          
