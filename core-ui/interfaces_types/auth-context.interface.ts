// The auth status will be stored in a ReactJS Context. This interface defines the shape of the object that will be stored in the context.

// import { AuthUserGroups } from "./auth-user-groups.type";

export interface IAuthContext {
  authenticated: boolean;             
  // username: string | null;         //TODO: enrich the auth object with pertinent auth information (see also: auth-context.ts)
  // usergroup_core: AuthUserGroups;  //TODO: enrich the auth object with pertinent auth information (see also: auth-context.ts)
  // login: () => void;               //TODO: enrich the auth object with pertinent auth information (see also: auth-context.ts)
  // logout: () => void;              //TODO: enrich the auth object with pertinent auth information (see also: auth-context.ts)
}