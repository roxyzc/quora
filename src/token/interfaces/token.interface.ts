import { UserRoles } from 'src/user/interfaces/user.interface';

export interface ITokenParams {
  email: string;
  name: string;
  role: UserRoles;
}

export interface ITokenSecret {
  accessTokenSecret: string;
  refreshTokenSecret: string;
}
