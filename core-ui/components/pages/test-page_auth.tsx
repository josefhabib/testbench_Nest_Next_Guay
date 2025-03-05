/**
 * TestPage component.
 * 
 * This component is a simple page to test authentication-related functionality.
 * It retrieves the user's authentication status from the AuthContext and renders
 * different content based on whether the user is authenticated or not.
 * 
 * Note: This page is for testing purposes only and will not be used in the production app.
 * 
 * @returns {JSX.Element} The rendered component based on the user's authentication status.
 */

"use client"

import { useContext } from 'react';
import { AuthContext } from '@/contexts/auth-context';
import LogoutButton from '@/components/molecules/logout-button';

const TestPage = () => {

  //--- Get the user's authentication status from the AuthContext
  const authStatus = useContext(AuthContext);
  //---

  // Check if authStatus.authenticated exists
  if (authStatus.authenticated === undefined) {
    return (
      <>
        Error: Authentication status is undefined.
      </>    
    );
  }
  
  // Render screen based on authentication status
  if (authStatus.authenticated) {
    return (
      <div style={{ margin: '20px', padding: '20px' }}> 
        Home Sweet Home
        <br /> <br /> <br /> 
        Welcome!
        <br /> <br /> <br /> 
        <LogoutButton />
      </div>
    );
  }
  else if (!authStatus.authenticated) {
    return (
      <div style={{ margin: '20px', padding: '20px' }}> 
        Home Sweet Home
        <br /> <br /> <br /> 
        Please log in to access the rest of the site (this should never appear as it should be automated using middleware).
        <br /> <br /> <br />
      </div>
    );
  }
}
export default TestPage;
