"use server";
/**
 * @fileoverview 
 * Server Action for creating a new user account. This action is called by the useActionState hook in the SignupForm component.
 *
 * @description 
 * This NextJS server action sits between the web app client and the NestJS server. 
 * 
 *    +-------------------+         FormData              +----------------------+                          +-------------------+
 *    |      Browser      | ----------------------------> |    Web App Server    |                          | NestJS BE Server  |
 *    |   (Client-Side    |                               |     (Next.js App)    |                          |   External        |
 *    |     Web App)      |                               |                      |                          |   Server          |
 *    |                   | <---------------------------- |--(createUser())*     |   Network req (eg HTTP)  |                   |
 *    |   (<SignUpForm)   |       ICreateUserOutput       |            (post())--| <----------------------->|(e.g. Database/API)|
 *    +-------------------+                               +----------------------+    Network res (eg HTTP) +-------------------+
 *
 *  Its main tasks are to:
 *  1. Provide the link between the Web App client and the NestJS server for the task of creating a new user account.
 *  2. Decouple the Web App client from the NestJS server by enforcing the ICreateUserOutput interface.
 *  3. Tasks:
 *     - Perform data transformations
 *     - Perform validation checks 
 *     - Handle errors 
 *     - Trigger network requests to the NestJS server  
 * 
 * Workflow:
 * - When a user entered data in the Web App client (e.g. email, password1, password2) and submits the form, the createUser() function is called.
 * - It's goal is to:
 *    -- check the validity of the request
 *    -- if valid, send the request to the NestJS server (using the post() function (custom_fetch utility))
 *    -- return the result of the operation to the client (ICreateUserOutput)
 * 
 * 
 * @design
 * Decoupling: 
 *  The web app client and the target server (NestJS) utilize different and pre-defiend technologies, languages, and protocols (e.g. FormData <-> HTTP).
 *  This requires a mapping between the two systems to ensure that the data is correctly formatted and understood by both parties. 
 *  The challenge is that if this mapping is hardcoded, any changes to the server or client would require changes to the other party 
 *    - this represents a tightly coupled system (rigid & brittle).
 *  The createUser() server action uses the ICreateUserOutput interface to decouple: 
 *  1. the web app client <-> web app back end: Both adhere to the ICreateUserOutput interface. The client renders the form based on the state object returned by the server action.
 *  2. the web app back end <-> NestJS server:  The server action maps the create user request (received from the client) to a network request; and the network responses to an ICreateUserOutput object (e.g. if we change the network protocol, the database type/vendor/version/structure etc).
 * 
 * Error Handling:
 *  Errors can occur at various stages of the process. E.g.:
 *  - The client:         The form may have missing/invalid entries
 *  - The Web App Server: The data may not be correctly formatted; May not pass validation checks
 *  - The NestJS server:  An email may already exist in the database; The server may be down etc. 
 *  The way we want to handle errors is to not crash out of the execution. Instead we want to return an object that the client 
 *   can use to display an error message to the user. This object is the ICreateUserOutput interface.
 *  The range of errors that can occur is mapped to the ICreateUserOutput interface:
 *  - Unknown error if the server cannot be reached (this is the default state as it does not require the ability to make a network request)
 *  - Known validation check (i.e. data) errors: e.g. if the form data is incomplete or passwords do not match
 *  - Known server errors (e.g db consistency rules are being violated - e.g. email already exists)
 *  - Success: the user was created successfully
 * 
 * @remarks
 * This action performs the following steps:
 * 1. Extracts form data (email, password1, password2) from the client.
 * 2. Validates the form data (checks if all fields are filled and if passwords match).
 * 3. Sends a POST request to the NestJS server to create a new user.
 * 4. Returns the result of the operation to the client.
 * 
 * @module action_create-user
 */

import { post } from "@/utils/custom_fetch";
import { ICreateUserOutput } from "@/interfaces_types/create-user-output.interface";

export default async function createUser(_prevState: any, formData: FormData): Promise<ICreateUserOutput> {

  // --- Setup:
  // Set URL of the target server from the environment variables
  const url = `${process.env.NESTJS_CORE_URL}/users`;

  // --- Pre-Processing:
  // Extract form data
  const ip_email = formData.get("email") as string;
  const ip_password1 = formData.get("password1") as string;
  const ip_password2 = formData.get("password2") as string;

  // --- Form Validation & Error Handling:
  // Validation Check1: Are all fields filled in?
  if (!ip_email || !ip_password1 || !ip_password2) {
    const returnObj: ICreateUserOutput = {
      state: "error",
      message: "Form incomplete. Account not created.",
      data: {},
    };
    return returnObj;
  }
  // Validation Check2: Do the passwords match?
  if (ip_password1 !== ip_password2) {
    const returnObj: ICreateUserOutput = {
      state: "error",
      message: "Passwords do not match. Account not created.",
      data: {},
    };
    return returnObj;
  }
  // Validation Checks: Is the email valid? 
  // -> Not implemented here: will be checked by the NesTJS server (DTO) which returns an error if Validation fails
  // Validation Checks: Is the password strong enough? - Not implemented here; will be checked by the NesTJS server (DTO) 
  // -> Not implemented here: will be checked by the NesTJS server (DTO) which returns an error if Validation fails

  // --- Perform the network request (e.g. custom Post function for HTTP requests)
  const jsondata = {
    email: ip_email,
    password: ip_password1,
  };
  try {
    const response = await post(url, jsondata);
    const responseBody = await response.json();
    
    // --- Handle the response (create a returnObj) based on the response from the server
    // Success: User created successfully
    if (response.ok) {
      const returnObj: ICreateUserOutput = {
      state : "success",
      status : response.status,
      message : "User created successfully",
      data : responseBody.data,
    };
    return returnObj;
    } else {
      // Server returned an error (get it from res.error)
      const returnObj: ICreateUserOutput = {
        state : "error",
        status : response.status,
        message : responseBody.error || "Failed to create user",
        data : {}
      };
      return returnObj;
    }
  } catch (error) {
    // Fall-back: Server could not be reached
    const returnObj: ICreateUserOutput = {
      state: "error",
      status: 500,
      message: "Server could not be reached",
      data: {},
    };
    return returnObj;
  }
}