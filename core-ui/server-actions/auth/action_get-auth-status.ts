"use server"

import { cookies } from "next/headers";
import { IAuthContext } from "@/interfaces_types/auth-context.interface";

export default async function getAuthStatus(): Promise<IAuthContext> {

  // Get the auth cookie (from the Nextjs Server cookies)
  const cookies_nextjs = await cookies();                   // Get the (NextJS server) cookies
  const authCookie = cookies_nextjs.get("be-core-auth");    // Get the auth cookie (from the cookies) - will only be set on the NextJS server if we have been authenticated and our session is valid
  
  // Set the auth status
  const authStatus = { 
    authenticated : !!authCookie,         // Check if the auth cookie exists on the NextJS server - if the user is (not) authenticated it will (not) exist)
  // authStatus.username = ...            //TODO: enrich the auth object with pertinent auth information
  // authStatus.usergroup_core  = ...     //TODO: enrich the auth object with pertinent auth information
  // authStatus.login = ...               //TODO: enrich the auth object with pertinent auth information
  // authStatus.logout = ...              //TODO: enrich the auth object with pertinent auth information
  }

  return authStatus;
}