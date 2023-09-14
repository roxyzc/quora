import { UserRoles } from 'src/enums/userRoles.enum';
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: UserRoles[]) => SetMetadata('roles', roles);
