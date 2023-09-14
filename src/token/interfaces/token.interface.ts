import { UserRoles } from 'src/enums/userRoles.enum';

export interface GetTokenParams {
  userId: string;
  email: string;
  role: UserRoles;
}
