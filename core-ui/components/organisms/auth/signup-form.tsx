// Form to accept user input for signup
// - The form is wrapped in a Next <form> tag to handle the form submission (dumb component)
// - Each input field MUST have a "name" attribute to associate the input with the form data
// - By default, this component is a "server" component

import { Button } from "@/components/atoms/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Loader2 } from "lucide-react";

interface SignupFormProps {
  isPending: boolean;
}

export function SignupForm({ isPending }: SignupFormProps) {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Signup</CardTitle>
        <CardDescription>
          Create an account to access the application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="abc@example.com" 
              disabled={isPending} 
              required />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password1">Password 1</Label>
            </div>
            <Input 
              id="password1" 
              name="password1" 
              type="password" 
              placeholder="Enter password" 
              disabled={isPending} 
              required />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password2">Password 2</Label>
            </div>
            <Input 
              id="password2" 
              name="password2" 
              type="password" 
              placeholder="Confirm password" 
              disabled={isPending} 
              required />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {isPending ? "Signing Up..." : "Sign Up"}
        </Button>
      </CardFooter>
    </Card>
  );
}
