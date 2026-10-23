import type { Request } from 'express';
import type { Permission } from '../../role/enums/permission.enum';

export interface AuthenticatedUser {
  id: number;
  name: string;
  email: string;
  permissions: Permission[];
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}
