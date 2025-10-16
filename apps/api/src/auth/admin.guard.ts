import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { User } from '@cigaro/libs';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    const isAdmin: boolean = ['admin', 'super_admin', 'moderator'].includes(user.userRole);

    if (!isAdmin) {
      throw new ForbiddenException('Admin access required');
    }

    return true;
  }
}