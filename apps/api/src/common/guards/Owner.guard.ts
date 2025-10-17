// apps/api/src/common/guards/owner.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  SetMetadata
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { ErrorManager } from '../errors/error-manager';

export interface OwnershipConfig {
  model: 'user' | 'post' | 'tasting' | 'event' | 'club';
  ownerField: string; // 'userId', 'creatorId', 'ownerId', etc.
  paramName?: string; // nom du paramètre route (default: 'id')
}

export const RequireOwnership = (config: OwnershipConfig) =>
  SetMetadata('ownership', config);

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ownershipConfig = this.reflector.getAllAndOverride<OwnershipConfig>('ownership', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!ownershipConfig) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw ErrorManager.unauthenticated('OwnerGuard');
    }

    const paramName: string = ownershipConfig.paramName || 'id';
    const resourceId = request.params[paramName];

    if (!resourceId) {
      throw ErrorManager.invalidArgument(
        paramName,
        `Resource ID parameter '${paramName}' is required`,
        'OwnerGuard'
      );
    }

    const isOwner: boolean = await this.checkOwnership(
      ownershipConfig.model,
      resourceId,
      user.id,
      ownershipConfig.ownerField
    );

    if (!isOwner) {
      throw ErrorManager.accessDenied(
        'Not the owner of this resource',
        `OwnerGuard:${ownershipConfig.model}:${resourceId}`
      );
    }

    return true;
  }

  private async checkOwnership(
    model: string,
    resourceId: string,
    userId: string,
    ownerField: string
  ): Promise<boolean> {
    const prismaModel = this.prisma[model];

    if (!prismaModel) {
      throw ErrorManager.invalidArgument(
        'model',
        `Unknown model: ${model}`,
        'OwnerGuard.checkOwnership'
      );
    }

    const resource = await prismaModel.findUnique({
      where: { id: resourceId },
      select: { [ownerField]: true }
    });

    if (!resource) {
      throw ErrorManager.userNotFound(
        resourceId,
        `OwnerGuard:${model} not found`
      );
    }

    return resource[ownerField] === userId;
  }
}

export const RequirePostOwnership = () => RequireOwnership({
  model: 'post',
  ownerField: 'userId'
});

export const RequireTastingOwnership = () => RequireOwnership({
  model: 'tasting',
  ownerField: 'userId'
});

export const RequireEventOwnership = () => RequireOwnership({
  model: 'event',
  ownerField: 'creatorId'
});

export const RequireClubOwnership = () => RequireOwnership({
  model: 'club',
  ownerField: 'ownerId'
});