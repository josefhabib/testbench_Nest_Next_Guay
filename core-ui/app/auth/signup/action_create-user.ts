"use server";

// Server Action to create a new user account
// ! To be used in conjunction with useActionState hook (args are pre-defined)
// POST localhost:3000/user

import { redirect } from "next/navigation";

export default async function createUser(
  _prevState:any, 
  formData: FormData
){ 
  // !!!
  // The structure of this function is specific to, and determined by, the useActionState hook
  //  - _prevState: the previous state of the action (not used in this case)
  //  - formData: an object containing: email:string, password1:string, password2:string)
  //    NB: FormData is A BUILT-IN JavaScript OBJECT that provides a way to easily construct a set of key/value pairs representing form fields and their value
  // !!!


  // Extract Form Data
  const email = formData.get("email") as string;
  const password1 = formData.get("password1") as string;
  const password2 = formData.get("password2") as string;
  
  // Validity Checks
  if (!email || !password1 || !password2) {
    return { state: "error", message: "Please fill in all fields" };
  }

  if (password1 !== password2) {
    return { state: "error", message: "Passwords do not match" };
  }

  // Create User (Form Submission + API Call)
  try {

    console.log("process.env.NESTJS_CORE_URL: ", process.env.NESTJS_CORE_URL);

    const response = await fetch(
      `${process.env.NESTJS_CORE_URL}:${process.env.NESTJS_CORE_PORT}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password: password1 }),
      }
    );

    // Process (parse) Response
    const parsedResponse = await response.json();

    // Handle Errors
    if (!response.ok) {
      throw new Error("Failed to create user");
    }

    // Handle Success
    redirect("/auth/login");
    return { state: "success" };
  
  } 
  catch (error: any) {
    return { state: "error", message: error.message };
  }
}
