import { UserRoles } from 'src/types/roles.type';

export interface GetTokenParams {
  userId: string;
  email: string;
  role: UserRoles;
}
