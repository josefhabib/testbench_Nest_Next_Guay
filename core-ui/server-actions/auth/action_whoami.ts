"use server"

/**
 * @fileoverview
 * This file contains the implementation of the whoami API route and the corresponding server action.
 * 
 * @background
 * In several instances, the UI needs to be able to determine whether a user is logged in or not; 
 * and if a user is logged in, who the user is. For instance:
 * 
 * - Personalization:
 *   If a user is logged in, the user's name can be displayed in the header (in both server and client components).
 * 
 * - Conditional Routing:
 *   If a user is logged in and wants to browse to the log in screen they should be re-directed to the
 *   home screen/landing page.
 *   If a user is not logged in and wants to go to a protected route they should be re-directed to the
 *   login screen.
 * 
 * - Development/Debugging: Access restriction
 *   Our application will have several access restricted routes. These routes will be accessible only
 *   to users who are logged in. Traditionally, web applications store the authentication state in
 *   the browser memory and automatically send the authentication state with each request to the server.
 *   The server then uses this information to determine whether the user is allowed to access the
 *   requested resource.
 *   Our application has a service based architecture. The web app server (NextJS) is limited to routing
 *   and rendering. The data access is handled by another server (NestJS). This means that we need to
 *   explicitly implement how access is controlled. This includes not only sending cookies/tokens from the browser
 *   to the web application server, but also forwarding these to the data server and interpreting the response.
 *   This is outlined in more detail in the custom_fetch.ts file.
 * 
 * @purpose
 * The whoami API route and the corresponding server action provides a testbench for the development
 * and debugging of these access controls: It is the first access restricted API route that relies on the 
 * identification of the authentication status and identity of the user.
 * 
 * @manual
 * ---
 * -> input:  None
 * -> output: WhoamiResponse
 *      --> status: 
 *            - "loggedIn": if status is 2xx and response has a body containing the user details
 *            - "notLoggedIn": if the status is 401 
 *            - "unknown": if the status is not 2xx or 401 - i.e. an error has occurred
 *      --> user:
 *          Optional object containing the user details (id, email) if the status is "loggedIn"
 * ---
 * 1. Send a GET request to the /auth/whoami route on the NestJS server.
 * 2. Return the response from the server.
 */

import { get } from "@/utils/custom_fetch";
import { IUserDetails } from "@/interfaces_types/user-details.interface";

export default async function whoami(): Promise<IUserDetails> {

  // --- Send the request
  const url = `${process.env.NESTJS_CORE_URL}/auth/whoami`;
  const response = await get(url); 
  const responseBody = await response.json();
  
  // --- Handle errors
  if ((response.status < 200) || (response.status >= 300)) { // If the response status is not 2xx (i.e. the user is not logged in or an error has occurred)
    return (
      {
        id: undefined,
        email: undefined
      }
    )
  }
  
  // --- Handle success
  return ({
    id: responseBody.payload.user.id, 
    email : responseBody.payload.user.email
  })
}