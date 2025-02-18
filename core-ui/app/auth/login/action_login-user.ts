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
      cookie: ""
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
        cookie: ""
      }
      return returnObj;
    }
    else {
      const returnObj: ILoginUserOutput = {
        state: "success",
        status: response.status,
        message: parsedResponse.body.message || {},
        data: parsedResponse.data || {},
        cookie: response.headers.get("set-cookie") || ""
      }
      //TODO: set the cookie in the browser ()
      // const cookie = response.headers.get("set-cookie") || ""
      return returnObj
    }
  } 
  catch (error) {
    const returnObj: ILoginUserOutput = {
      state: "error",
      status: 500,
      message: "Unkown server error",
      data: {},
      cookie: ""
    }
    return returnObj;
  }
}
