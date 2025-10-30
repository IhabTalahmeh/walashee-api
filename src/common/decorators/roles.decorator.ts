import { SetMetadata } from '@nestjs/common';
import { ERoleType } from '../enum/role-type.enum';


export const ROLES_KEY = 'roles';

export const Roles = (...roles: ERoleType[]) => SetMetadata(ROLES_KEY, roles);
