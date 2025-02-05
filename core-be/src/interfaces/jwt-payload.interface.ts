// create an interface for the JWT payload containing only the necessary information:
//  - email: string;
//  - becore_usergroup: UserGroups;

import { IUserGroups } from './usergroups.interface';

export interface IJwtPayload {
  email: string;
  // becore_usergroup: IUserGroups;
}