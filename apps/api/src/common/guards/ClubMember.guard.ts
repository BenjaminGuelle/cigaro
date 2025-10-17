import {
  Injectable,
  CanActivate,
  ExecutionContext,
  SetMetadata
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { ErrorManager } from '../errors/error-manager';
import { ClubRole, CLUB_ROLE } from '@cigaro/libs';
import { ClubRole as PrismaClubRole, ClubMemberStatus as PrismaClubMemberStatus } from '@prisma/client';

export interface ClubMembershipConfig {
  roles?: ClubRole[];
  paramName?: string; // nom du paramètre route pour clubId (default: 'clubId')
  allowPending?: boolean; // Autoriser les membres pending (default: false)
}

export const RequireClubMembership = (config: ClubMembershipConfig = {}) =>
  SetMetadata('clubMembership', config);

@Injectable()
export class ClubMemberGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const membershipConfig = this.reflector.getAllAndOverride<ClubMembershipConfig>('clubMembership', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!membershipConfig) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw ErrorManager.unauthenticated('ClubMemberGuard');
    }

    const paramName: string = membershipConfig.paramName || 'clubId';
    const clubId = request.params[paramName];

    if (!clubId) {
      throw ErrorManager.invalidArgument(
        paramName,
        `Club ID parameter '${paramName}' is required`,
        'ClubMemberGuard'
      );
    }

    const membership = await this.getClubMembership(clubId, user.id);

    if (!membership) {
      throw ErrorManager.accessDenied(
        'Not a member of this club',
        `ClubMemberGuard:${clubId}:${user.id}`
      );
    }

    const allowedStatuses: PrismaClubMemberStatus[] = membershipConfig.allowPending
      ? ['ACTIVE', 'INVITED']
      : ['ACTIVE'];

    if (!allowedStatuses.includes(membership.status)) {
      throw ErrorManager.accessDenied(
        `Club membership status '${membership.status}' not allowed`,
        `ClubMemberGuard:${clubId}:${user.id}`
      );
    }

    if (membershipConfig.roles && membershipConfig.roles.length > 0) {
      const prismaRoles: PrismaClubRole[] = membershipConfig.roles.map((role: ClubRole) =>
        role.toUpperCase() as PrismaClubRole
      );

      const hasRequiredRole: boolean = prismaRoles.includes(membership.role);

      if (!hasRequiredRole) {
        throw ErrorManager.accessDenied(
          `Club role '${membership.role}' insufficient. Required: ${membershipConfig.roles.join('|')}`,
          `ClubMemberGuard:${clubId}:${user.id}`
        );
      }
    }

    request.clubMembership = membership;

    return true;
  }

  private async getClubMembership(clubId: string, userId: string) {
    const membership = await this.prisma.clubMember.findUnique({
      where: {
        userId_clubId: {
          userId,
          clubId
        }
      },
      select: {
        role: true,
        functionalRole: true,
        status: true,
        joinedAt: true,
        club: {
          select: {
            id: true,
            name: true,
            clubPlan: true
          }
        }
      }
    });

    return membership;
  }
}

export const RequireClubMember = () => RequireClubMembership({});

export const RequireClubPresident = () => RequireClubMembership({
  roles: [CLUB_ROLE.PRESIDENT]
});

export const RequireClubAdmin = () => RequireClubMembership({
  roles: [CLUB_ROLE.PRESIDENT, CLUB_ROLE.VICE_PRESIDENT]
});

export const RequireClubMemberIncludingPending = () => RequireClubMembership({
  allowPending: true
});

// Decorator spécialisé pour les événements (peut inclure invited)
export const RequireEventAccess = () => RequireClubMembership({
  allowPending: true // Les invités peuvent voir les événements
});