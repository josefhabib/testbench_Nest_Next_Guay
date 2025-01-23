"use client";

import { SignUpForm } from "@/components/signup-form";
import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import createUser from "./action_create-user";

export default function Page() {
  const [state, formAction, isPending] = useActionState(createUser, undefined);

    // Debugging:
    console.log("Page component rendered");
    // -----------

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <form action={formAction}>
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
                <Input id="email" name="email" type="email" placeholder="m@example.com" required />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password1">Password 1</Label>
                </div>
                <Input id="password1" name="password1" type="password" placeholder="Enter password" required />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password2">Password 2</Label>
                </div>
                <Input id="password2" name="password2" type="password" placeholder="Confirm password" required />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Signing Up..." : "Sign Up"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

// "use client";

// import { SignUpForm } from "@/components/signup-form"
// import { useActionState } from "react"

// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"

// import createUser from "./action_create-user"



// export default function Page() {

//   const [state, formAction, isPending] = useActionState(createUser, undefined);

//   return (
//     <div className="flex h-screen w-full items-center justify-center px-4">
      
//       <form action={formAction}>
//         {/* <SignUpForm /> */}

//         <Card className="mx-auto max-w-sm">
//           <CardHeader>
//             <CardTitle className="text-2xl">
//               Signup
//             </CardTitle>
//             <CardDescription>
//               Create an account to access the application
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="grid gap-4">
              
//               <div className="grid gap-2">
//                 <Label htmlFor="email">Email</Label>
//                 <Input
//                   id="email"
//                   name="email"
//                   type="email"
//                   placeholder="m@example.com"
//                   required
//               />

//             </div>
//             <div className="grid gap-2">
//               <div className="flex items-center">
//                 <Label htmlFor="password">Password 1</Label>
//               </div>
//               <Input 
//                 id="password1" 
//                 name="password1"
//                 type="password" 
//                 placeholder="Enter password" 
//                 required 
//               />
//             </div>
//             <div className="grid gap-2">
//               <div className="flex items-center">
//                 <Label htmlFor="password">Password 2</Label>
//               </div>
//               <Input 
//                 id="password2" 
//                 name="password2"
//                 type="password" 
//                 placeholder="Re-enter password" 
//                 required />
//             </div>
//             <Button type="submit" className="w-full">
//               Sign Up
//             </Button>
//           </div>
//           <div className="mt-4 text-center text-sm">
//             Already have an account?{" "}
//             <Link href="/auth/login" className="underline">
//               Login
//             </Link>
//           </div>
//         </CardContent>
//       </Card>

//       </form>

//     </div>
//   )
// }



// // "use client";

// // import { SignUpForm } from "@/components/signup-form"
// // import { useActionState } from "react"
// // import createUser from "./action_create-user"

// // export default function Page() {

// //   const [state, formAction, isPending] = useActionState(createUser, undefined);

// //   return (
// //     <div className="flex h-screen w-full items-center justify-center px-4">
      
// //       <form action={formAction}>
// //         <SignUpForm />
// //       </form>

// //     </div>
// //   )
// // }
