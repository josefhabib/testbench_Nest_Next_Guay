"use client";
/**
 * @fileoverview 
 * This file contains the implementation of the signup page for creating a new user account.
 * 
 * @description
 * This page displays a form for creating a new user account using the <SignupForm> component. The form performs several checks such as ensuring all fields are filled in and verifying that the passwords match. If the checks pass, the form is submitted to the server using the `createUser()` function from `action_create-user.ts`. Upon successful submission, a success toast is displayed and the user is redirected to the login page. If the submission fails, an error message is displayed in toast format.
 * 
 * @todo
 * - Lock the form and display a spinner while the form submission is pending.
 * - Consider moving the <Toaster> component to the layout.
 * 
 * @design
 * The use of the `ICreateUserOutput` interface enforces the shape of the `state` object returned by the `createUser()` function in `action_create-user.ts`. This decouples the `state` object from the implementation of the `createUser()` function.
 * 
 * @module SignupPage
 * 
 * @requires react
 * @requires ../../../components/signup-form
 * @requires @/components/ui/toaster
 * @requires @/hooks/use-toast
 * @requires next/navigation
 * @requires ./action_create-user
 * @requires @/Interfaces/shared/create-user-output.interface
 */


import { useActionState, useEffect } from "react";
import { SignupForm } from "../../../components/organisms/signup-form";
import { Toaster } from "@/components/atoms/toaster" // TODO: Move to layout?
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import createUser from "../../../server-actions/auth/action_create-user";
import { ICreateUserOutput } from "@/Interfaces/create-user-output.interface";

export default function Page() {

  // --- Setup:
  // Define the shape & initial value of the output of the createUser() function (action_create-user.ts)
  const initialState: ICreateUserOutput = {
    state: "starting",
    message: "",
    data: {}
  };
  // Initialize the router
  const router = useRouter();
  // Initialize Toast
  const { toast } = useToast();
  // Set up useActionState hook (NextJS form submission): 
  const [state, formAction, isPending] = useActionState(createUser, initialState);

  // --- Set Toasts (depending on status of account creation)
  useEffect(() => {
    if (state.state === "success") {
      // display toast notification
      toast({
          variant: "default",
          title: "Account Created",
          description: "You can now login to your account"
      });
      // Redirect to the login page
      router.push("/auth/login"); 
    }
    else if (state.state === "error") {
      // display toast notification
      toast({
          variant: "destructive",
          title: "Account NOT Created",
          description: state.message
      });
    }
    else if (state.state === "starting") {
      // starting state (do nothing and wait for user input)
    }
    else {
      // should never happen - throw an error to stop program.
      throw new Error("Unknown state in createUser(), Signup form");
    }
  }, [isPending, state]); 

  // --- Render the Signup Form
  return (
   <div className="flex h-screen w-full items-center justify-center px-4">
      <form action={formAction}>
        <SignupForm isPending={isPending} />
      </form>
      <Toaster />
    </div>
  );
}