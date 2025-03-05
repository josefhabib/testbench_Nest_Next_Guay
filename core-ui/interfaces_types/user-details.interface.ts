// Details about the currenly logged in user (if any). 
// The user details can be obtained from the NestJS server using the GET auth/whoami/ endpoint.

export interface IUserDetails {
  id: number | undefined;
  // username: string | null;
  // usergroup_core: string;
  email: string| undefined;
}