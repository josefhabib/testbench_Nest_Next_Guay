"use client"
/**
 * @file auth-context.ts
 * @description This file contains the definition and initialization of the authentication context for the application.
 * It uses React's createContext to create a context for managing authentication state.
 * 
 * @module AuthContext
 */

 /**
  * @constant initAuthContext
  * @type {IAuthContext}
  * @description Initial state for the authentication context. It includes default values for authentication status and placeholders for additional authentication information.
  * @property {boolean} authenticated - Indicates whether the user is authenticated or not.
  * // @property {string | null} username - The username of the authenticated user. (TODO: enrich the auth object with pertinent auth information)
  * // @property {string} usergroup_core - The user group of the authenticated user. (TODO: enrich the auth object with pertinent auth information)
  * // @property {Function} login - Function to handle user login. (TODO: enrich the auth object with pertinent auth information)
  * // @property {Function} logout - Function to handle user logout. (TODO: enrich the auth object with pertinent auth information)
  */

 /**
  * @constant AuthContext
  * @type {React.Context<IAuthContext>}
  * @description React context for authentication state. It provides the authentication state and functions to manage authentication.
  */


import { createContext } from 'react';
import { IAuthContext } from '@/interfaces_types/auth-context.interface';

const initAuthContext: IAuthContext = 
{
  authenticated: false,
  //   username: null,                  //TODO: enrich the auth object with pertinent auth information
  //   usergroup_core: "researcher"     //TODO: enrich the auth object with pertinent auth information
  //   login: () => {},                 //TODO: enrich the auth object with pertinent auth information
  //   logout: () => {},                //TODO: enrich the auth object with pertinent auth information
};

export const AuthContext = createContext(initAuthContext);
