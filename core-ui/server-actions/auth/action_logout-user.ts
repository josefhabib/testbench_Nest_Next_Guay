"use server"
import { cookies } from "next/headers";

// --- Logout function
export async function logOutUser(autheCookieName: string){
  const authECookie = cookies(); // Get the cookies
  (await authECookie).delete('be-core-auth'); // Delete the cookie (to log out the user) 
}
