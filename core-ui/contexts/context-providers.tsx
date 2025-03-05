/**
 * @file context-providers.tsx
 * @description This file contains the ContextProviders component which is used to wrap child components with necessary context providers.
 * 
 * @motivation In Next.js, client components cannot directly import server components. However, context providers, which are client components, 
 * need to be applied high up in the component hierarchy. This necessitates a pattern where the app router imports and lists all components 
 * (based on the URL) in the root component, which is a server component and an ancestor to context providers. 
 * Given that multiple contexts (e.g., theme, auth, cache) may be required, having a single ContextProviders component to wrap all necessary contexts 
 * simplifies the implementation. This approach ensures that context providers are applied correctly without violating Next.js constraints, 
 * promoting a clean and maintainable code structure.
 */

/**
 * ContextProviders component wraps its children with the AuthContext provider.
 * 
 * @param {Object} props - The props object.
 * @param {React.ReactNode} props.children - The child components to be wrapped by the context providers.
 * @param {IAuthContext} props.authStatus - The authentication status to be provided to the AuthContext.
 * 
 * @returns {JSX.Element} The children components wrapped with the AuthContext provider.
 */
"use client"
import { AuthContext } from "./auth-context";
import { IAuthContext } from "../interfaces_types/auth-context.interface";

export default function ContextProviders({ children, authStatus }: { children: React.ReactNode, authStatus: IAuthContext }) {
  return (
    <AuthContext.Provider value={authStatus}>
        {children}
    </AuthContext.Provider>
  );
}
