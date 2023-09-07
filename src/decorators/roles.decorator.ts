import { UserRoles } from 'src/types/roles.type';
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: UserRoles[]) => SetMetadata('roles', roles);
