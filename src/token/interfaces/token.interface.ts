import { UserRoles } from 'src/types/roles.type';

export interface ITokenParams {
  userId: string;
  email: string;
  role: UserRoles;
}

export interface ITokenSecret {
  accessTokenSecret: string;
  refreshTokenSecret: string;
}
