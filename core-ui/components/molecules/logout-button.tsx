"use client"

import { LogOut } from 'lucide-react';
import { useState } from 'react';
import { logOutUser } from '@/app/auth/login/action_login-user';

/**
 * Props for the LogoutButton component.
 */
interface LogoutButtonProps {
  onLogout?: () => void;
}

/**
 * LogoutButton component renders a logout icon with hover and click effects.
 * @param {LogoutButtonProps} props - The props for the component.
 */
const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleLogout = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200); // Reset click state after 200ms
    logOutUser('be-core-auth');
    // alert('Logout button clicked');
    // if (onLogout) {
    //   onLogout();
    // }
  };

  return (
    <LogOut 
      onClick={handleLogout}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        cursor: 'pointer',
        color: isClicked ? 'red' : isHovered ? 'orange' : 'white',
        transform: isClicked ? 'scale(0.95)' : 'scale(1)',
        transition: 'color 0.3s, transform 0.1s'
      }}
    />
  );
};

export default LogoutButton;