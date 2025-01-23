"use client";

// Page displays a form for creating a new user account

import { useActionState, useEffect } from "react";
import { SignupForm } from "../../../components/signup-form";
import { Toaster } from "@/components/ui/toaster" // TODO: Move to layout?
import { useToast } from "@/hooks/use-toast";
import createUser from "./action_create-user";

export default function Page() {

  // useActionState hook: manages the communication between a (server) action and the client (form) 
  const [state, formAction, isPending] = useActionState(createUser, undefined);

  // useToast hook: display of toast notifications
  //
  //  If the server-action to create a new user account fails (e.g. user already exists, 
  //    password too weak etc) it returns a HTTP response with an error status code and 
  //    an error message.
  //  In this page this triggers a toast notification displaying that error message.
  const { toast } = useToast()

  useEffect(() => {
    if (state?.state === "error") {
      toast({
          variant: "destructive",
          title: "Account NOT Created",
          description: state.message
      })
    }
  }, [state?.state])

  return (
   <div className="flex h-screen w-full items-center justify-center px-4">
      <form action={formAction}>
        <SignupForm isPending={isPending} />
      </form>
      <Toaster />
    </div>
  );
}