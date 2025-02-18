"use server"

/**
 * Logs in a user by sending their credentials to the server and returns the server's response.
 * 
 * @param _prevState - The previous state of the login process.
 * @param formData - The form data containing the user's email and password.
 * @returns A promise that resolves to an object containing the login result.
 * 
 * @remarks
 * - The function extracts the email and password from the provided form data.
 * - It validates the form (have all data been provided); Returns an error state if the form is incomplete.
 * - It sends a POST request to the auth server with the user's credentials.
 * - Processes the response from the auth server
 *  -- If the server responds with an error, it returns an error state with the server's message.
 *  -- If the login is successful, it returns a success state with the server's response data and cookie.
 *     //TODO: set the cookie in the browser ()
 * - In case of an unknown server error, it returns an error state with a status of 500.
 * 
 * @example
 * ```typescript
 * const formData = new FormData();
 * formData.append("email", "user@example.com");
 * formData.append("password", "password123");
 * 
 * const result = await logInUser(prevState, formData);
 * console.log(result);
 * ```
 */

import { post } from "@/utils/custom_fetch";
import { ILoginUserOutput } from "@/Interfaces/login-user-output.interface";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";


async function setAuthCookie(response: Response) {
  // Helper function to set the auth cookie in the browser
  //
  // -> input:  The response object from the server
  // -> output: The auth cookie is set in the browser
  //
  // 1. Extract the auth cookie from the response header
  // 2. Parse the cookie string to extract the cookie name and value
  // 3. Decode the token to extract the expiration date; Then convert the expiration date to a Date object (using jwt-decode)
  // 4. Set the cookie in the browser (using cookies() from next/headers)
  
  const authCookieHeader = response.headers.get("Set-Cookie"); // Extract the auth cookie from the response header
  
  if (authCookieHeader) { 
    const token = authCookieHeader.split(";")[0].split("=")[1]; 
    const decodedToken = jwtDecode<{ exp: number }>(token); 
    const expiresOn = new Date(decodedToken.exp * 1000); 
    (await cookies()).set({
      name: "be-core-auth",
      value: token,
      secure: true,
      httpOnly: true,
      expires: expiresOn,
    });
  }
}

// Login function
export default async function logInUser(_prevState: ILoginUserOutput, formData: FormData): Promise<ILoginUserOutput> {

  // --- Setup:
  // Set URL of the target server from the environment variables
  const url = `${process.env.NESTJS_CORE_URL}/auth/login`;

  // --- Form data: 
  // Extraction
  const ip_email = formData.get("email") as string;
  const ip_password = formData.get("password") as string;
  const payload = {
    email: ip_email,
    password: ip_password,
  };
  // Validation (Are all fields filled in?)
  if (!ip_email || !ip_password) {
    const returnObj: ILoginUserOutput = {
      state: "error",
      message: "Form incomplete.",
      data: {},
    };
    return returnObj;
  }

  try{
    const response = await post(url, payload);
    const parsedResponse = await response.json();

    if (!response.ok){
      const returnObj: ILoginUserOutput =  {
        state: "error",
        status: response.status,
        message: parsedResponse.body.message || {}, //TODO: use getErrorMessage() to extract the message
        data: {},
      }
      return returnObj;
    }
    else {
      const returnObj: ILoginUserOutput = {
        state: "success",
        status: response.status,
        message: parsedResponse.body.message || {},
        data: parsedResponse.data || {},
      }
      await setAuthCookie(response);  // Set the auth cookie in the browser
      return returnObj
    }
  } 
  catch (error) {
    const returnObj: ILoginUserOutput = {
      state: "error",
      status: 500,
      message: "Unkown server error",
      data: {}
    }
    return returnObj;
  }
}
