import Link from "next/link"

import { Button } from "@/components/atoms/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card"
import { Input } from "@/components/atoms/input"
import { Label } from "@/components/atoms/label"

// TODO: Implement the forgot password functionality
// TODO: Add popup that an email has been sent to the user; reset password link is there - then login

export function ForgotPasswordForm() {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Reset Password
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Return to{" "}
          <Link href="/auth/login" className="underline">
            Log In Page
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
