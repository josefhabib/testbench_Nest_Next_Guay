"use client"

import { createContext } from 'react';
import { IUserDetails } from "@/interfaces_types/user-details.interface";

const initUserContext: IUserDetails = 
{
  id: undefined,
  email: undefined,
};

export const UserContext = createContext(initUserContext);
