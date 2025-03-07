import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ContextProviders from "@/contexts/context-providers";
import getAuthStatus from "@/server-actions/auth/action_get-auth-status";
import whoami from "@/server-actions/auth/action_whoami";
import { IAuthContext } from "@/interfaces_types/auth-context.interface";
import { IUserDetails } from "@/interfaces_types/user-details.interface";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Transcend",
  description: "Generated by create next app",
};

export default async function RootLayout({ children }: Readonly<{children: React.ReactNode;}>) {

  // --- Server Actions 
  const authStatus:IAuthContext = await getAuthStatus();  // Is the user authenticated?
  let userDetails:IUserDetails = {
    id:undefined,
    email:undefined
  }; 
  if (authStatus.authenticated) {                         // If the user is authenticated...
    userDetails = await whoami();      // Get the user's information
  }

  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ContextProviders authStatus={authStatus} userDetails={userDetails}> 
          {children}
        </ContextProviders>
      </body>
    </html>
  );
}
