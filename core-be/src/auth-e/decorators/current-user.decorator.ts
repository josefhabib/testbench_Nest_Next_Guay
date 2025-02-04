import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';

/**
 * Custom decorator to extract the current user from the request object.
 *
 * This decorator can be used in route handlers to access the authenticated user.
 * It uses the `createParamDecorator` function from NestJS to create a parameter decorator.
 *
 * @param _data - Unused parameter, can be any value.
 * @param context - The execution context which provides details about the current request.
 * @returns The user object extracted from the request.
 *
 * @example
 * ```typescript
 * @Get('profile')
 * getProfile(@CurrentUser() user: User) {
 *   return user;
 * }
 * ```
 *
 */

// TODO: Add usergroup to database and include it in the JWT token
// TODO: Add error handling

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest(); // Explicitly setting protocol simplifies protocol switching
    return request.user as User; // Type Safety
  },
);
