/**
 * @fileoverview This file defines the LandingPage component (implemented as a server component).
 * 
 * @motivation
 * 1. Flexibility: Implementing the LandingPage as a server component allows flexibility in what is stored as the landing page.
 * 2. Server Component Requirement: Ensuring that both layout.tsx and page.tsx are server components allows the import of both server and client components. 
 *    If the page were defined as a client component, it would prevent the import of server components, which is not desirable.
 * 
 * @returns {JSX.Element} The rendered TestPage component.
 */

"use server" 

import TestPage from '@/components/pages/test-page_auth'; // Client Component (reactive)

const LandingPage = async () => {

  // --- Render the page
  return (
    <TestPage />
  );
}

export default LandingPage;
