// Next.js middleware runs before a request is processed by 
// the Next.js server or after the response has been generated 
// but before it is sent to the client. Middleware can be used 
// to handle tasks such as authentication, logging, and request 
// modification.

import { NextRequest, NextResponse } from "next/server";



export function middleware(req: NextRequest, res: NextResponse){
  
  // NextJS Access Control
  // Check if the auth cookie has been set on the current request; 
  // -> If yes, get the value
  // -> If not, impose access restrictions 
  //    I.e. check if you are attempting to access an access-restricted route, 
  //    and if you are, redirecting the user to the login page

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
    // 
    // If the request does not have the auth cookie set... 
    // ... check if you are attempting to access an authentication restricted route... 
    // ... and if you are then redirect the user to the login page
    // 
    if (!authCookieValue && !publicRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
      // if you do NOT have an auth cookie AND the route is NOT public, redirect to the login page
      return Response.redirect(new URL("/auth/login", req.url));
    }
  }
}

export const config = {
  // The middleware will read this config file and not apply the middleware to 
  //  static assets (like favicon, other images) based on the supplied regex
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.png$).*)"
  ]
}
