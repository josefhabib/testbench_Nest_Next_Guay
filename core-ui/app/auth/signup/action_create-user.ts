"use server";

// ---
//
// Server Action for creating a new user account .
// POST to NestJS server [localhost:3000]/user 
// 
// This action is called by the useActionState hook (in the SignupForm component); 
// It is passed as a the first argument to the useActionState hook and called BY the hook. Implication:
//
//    - it is CALLED with 2 arguments:
//    1. _prevState: any            => Previous state of the form (not used here; allows management of form state: { error, success, pending })
//    2. formData: FormData         => The form data (email, password1, password2) from the client
//
//    - it RETURNS an object with the following properties:
//    - state: "error" | "success"  => The state of the action (error, success); This is in addition to isPending (boolean) which is managed by the useActionState hook
//    - message: string             => The message to be displayed in the toast notification
//    - data: any                   => The data returned by the server (if any)
//
// ---

import { redirect } from "next/navigation";

 // Response obj Interface
 interface Response {
  state: "error" | "success";
  message: string;
  data: any;
  redirectUrl?: string;
}

export default async function createUser( _prevState: any, formData: FormData): Promise<Response>{ 

  // - Extract Form Data (associated with the form fields via the "name" attribute)
  const email = formData.get("email") as string;
  const password1 = formData.get("password1") as string;
  const password2 = formData.get("password2") as string;

  // - Validity Checks
  if (!email || !password1 || !password2) {
    return { 
      state: "error", 
      message: "Please fill in all fields", 
      data:{}
    };
  };

  if (password1 !== password2) {
    return { 
      state: "error", 
      message: "Passwords do not match",
      data:{}
    };
  };


  // - Sumbit Create User Request (Form Submission: NestJS API -> Prisma -> Database)
  try {

    const response = await fetch(
      `${process.env.NESTJS_CORE_URL}:${process.env.NESTJS_CORE_PORT}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password: password1 }),
    });

    // Parse Response (to JSON)
    const parsedResponse = await response.json();

    // Handle Errors (returned as HTTP response by the target (NestJS) server)
    if (!response.ok) {
      throw new Error(parsedResponse.message || "Failed to create user");
    }

    return { 
      state: "success", 
      message: "User created successfully",
      data: parsedResponse,
      // redirectUrl: "/auth/login"
    };
  } 
  // Handle (all other) Errors
  catch (error: any) {
    return { 
      state: "error", 
      message: error.message,
      data:{}
    };
  };
}
