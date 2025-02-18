"use client";

import { useActionState, useEffect } from "react";
import { LoginForm } from "@/components/login-form"
import { Toaster } from "@/components/ui/toaster" // TODO: Move to layout?
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import logInUser from "./action_login-user";
import { ILoginUserOutput } from "@/Interfaces/login-user-output.interface";

export default function Page() {

  // --- Setup:
   // Define the shape & initial value of the output of the createUser() function (action_create-user.ts)
   const initialState: ILoginUserOutput = {
    state: "starting",
    message: "",
    data: {},
    cookie: ""
  };
  // Initialize the router
  const router = useRouter(); //TODO: Redirect to the landing page if the user is logged in
  // Initialize Toast
  const { toast } = useToast();
  // Set up useActionState hook (NextJS form submission): 
  const [state, formAction, isPending] = useActionState(logInUser, initialState);

  //TODO --- Handle authenticated users (redirect to landing page)
  const redirectAuthenticatedUser = () => {
    // We need a way to check if the user is authenticated (e.g. by checking the cookie) to implement this functionality
  }
  useEffect(() => {
    redirectAuthenticatedUser();
  }, [isPending, state]);

  // --- Handle successful login (redirect user to landing page) and failed login (display toast)
  useEffect(()=>{
    if (state.state === "starting") {
      // Do nothing (the loading spinner will be displayed; see the LoginForm component)
    }
    else if (state.state === "error") {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Incorrect credentials. Please try again."
      })
    }
    else if (state.state === "success") {
      // TODO: add redirectAuthenticatedUser();
      // TODO: Remove redirect (temporary - should be replaced by the above line)
      router.push("/");
    }
    else {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Unknown error. Please try again later."
      })
    }
  }
  , [isPending, state]);

  // --- Render the Login Form
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <form action={formAction}>
        <LoginForm isPending={isPending}/>
      </form>
      <Toaster />
    </div>
  )
}
