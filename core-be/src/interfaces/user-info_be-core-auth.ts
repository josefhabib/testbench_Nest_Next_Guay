import { IUserGroups } from './usergroups.interface';

export interface ICurrentUserInfo {
  id: number;     // user id
  email: string;  // user email
  // TODO: add username: string; // user username
  // TODO: add becore_usergroup: IUserGroups;
  // TODO: add exp: number;    // expiration time
}