import {
  Injectable,
  CanActivate,
  ExecutionContext,
  SetMetadata
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole, USER_ROLE } from '@cigaro/libs';
import { ErrorManager } from '../errors/error-manager';

export const RequireRoles = (...roles: UserRole[]) => SetMetadata('roles', roles);

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw ErrorManager.unauthenticated('RoleGuard');
    }

    const hasRequiredRole: boolean = requiredRoles.includes(user.userRole);

    if (!hasRequiredRole) {
      throw ErrorManager.insufficientRole(requiredRoles, user.userRole, 'RoleGuard');
    }

    return true;
  }
}

export const RequireAdmin = () => RequireRoles(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN);
export const RequireModerator = () => RequireRoles(USER_ROLE.MODERATOR, USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN);
export const RequireSuperAdmin = () => RequireRoles(USER_ROLE.SUPER_ADMIN);