/**
 * Middleware function to handle access control in a Next.js application.
 * 
 * NextJS Middleware runs before a request is processed by the NextJS server 
 *  and/or after the response has been generated but before it is sent to the 
 *  client. It is commonly used for tasks such as authentication (here), logging,
 *  and request modification.
 * 
 * Middleware functions are executed by the NextJS framework and therefore must 
 *  be implemeneted in line with the expectations of the NextJS framework: 
 *  - It must be stored in a project root level file called middleware.ts (@/middleware.ts)
 *  - It must export a function called `middleware` that takes two arguments:
 *    - `req`: The incoming request object
 *    - `res`: The outgoing response object
 *  - It must return a response object or undefined
 *  - It can be configured to apply to specific routes or route patterns
 * 
 * Auth Middleware:
 *  Auth middleware is applied by default to all requests. Exceptions can/must 
 *   explicitly be defined. Here, 2 exceptions are specified:
 *   - URL: pages starting with a certain URL pattern (publicRoutes)
 *   - Types: Static assets (images, favicons, etc.) are not subject to the
 *     auth middleware (config)
 * 
 * Functionality:
 *   - When a request is made to the NextJS server, the middleware checks if the
 *     exclusion exceptions apply. 
 *      -> Is the route a public route?
 *      -> Is the route a static asset?
 *        - If yes, the request is processed as normal.
 *        - If not, the middleware checks if the user is authenticated (and later authorized)
 *     -> Is the auth cookie set on the request?
 *        - If yes, the request is processed as normal.
 *       - If not, the middleware redirects the user to the login screen. Once the user has 
 *          submitted credentials (attempts to set the auth cookie `be-core-auth`), the 
 *          middleware will automatically return the user to the page they were trying 
 *          to access and repeat the previous attempt.
 * 
 * Known limitations: 
 *  - The middleware does not handle the case where the user is authenticated 
 *    but not authorized.
 * 
 * @param {NextRequest} req - The incoming request object.
 * @param {NextResponse} res - The outgoing response object.
 * 
 * @returns {Response | undefined} - A redirect response to the login page if access is restricted, otherwise undefined.
 */

import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest, res: NextResponse){
  
  // NextJS Access Control
  // Check 

  const publicRoutes = [
    "/auth/login", 
    "/auth/signup",
    "/auth/logout",
    "/auth/forgotPassword",
  ];

  const authCookie = req.cookies.get("be-core-auth");
  let authCookieValue = null;
  if (authCookie) {
    authCookieValue = authCookie.value;
  } 
  else {
    if (!authCookieValue && !publicRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
      return Response.redirect(new URL("/auth/login", req.url));
    }
  }
}

export const config = {
  // The middleware will read this config file and not apply the middleware to static assets (like favicon, other images) based on the supplied regex
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.png$).*)"
  ]
}
