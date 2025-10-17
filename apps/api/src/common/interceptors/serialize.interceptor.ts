import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  SetMetadata
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance, ClassConstructor } from 'class-transformer';
import { UserModel } from '@cigaro/libs';

export type SerializationGroup = 'public' | 'authenticated' | 'owner' | 'club' | 'admin';

interface RequestWithUser extends Request {
  user?: UserModel;
  clubMembership?: {
    role: string;
    status: string;
    club: { id: string; name: string };
  };
  params: Record<string, string>;
}

export const Serialize = <T>(dto: ClassConstructor<T>) => SetMetadata('serialize_dto', dto);

export const SerializeGroups = (...groups: SerializationGroup[]) =>
  SetMetadata('serialize_groups', groups);

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((data: unknown) => {
        const dto = this.reflector.getAllAndOverride<ClassConstructor<unknown>>('serialize_dto', [
          context.getHandler(),
          context.getClass(),
        ]);

        if (!dto) {
          return data;
        }

        const groups = this.reflector.getAllAndOverride<SerializationGroup[]>('serialize_groups', [
          context.getHandler(),
          context.getClass(),
        ]) || [];

        const dynamicGroups = this.getDynamicGroups(context, groups);

        return plainToInstance(dto, data, {
          excludeExtraneousValues: true, // Seuls les champs @Expose sont inclus
          groups: dynamicGroups,
          enableImplicitConversion: true
        });
      })
    );
  }

  private getDynamicGroups(
    context: ExecutionContext,
    staticGroups: SerializationGroup[]
  ): SerializationGroup[] {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    const groups: SerializationGroup[] = [...staticGroups];

    if (user) {
      groups.push('authenticated');

      if (this.isOwner(request, user)) {
        groups.push('owner');
      }

      if (this.isClubMate(request)) {
        groups.push('club');
      }

      if (['admin', 'moderator'].includes(user.userRole)) {
        groups.push('admin');
      }
    } else {
      groups.push('public');
    }

    return groups;
  }

  private isOwner(request: RequestWithUser, user: UserModel): boolean {
    const resourceUserId = request.params.userId || request.params.id;
    return resourceUserId === user.id;
  }

  private isClubMate(request: RequestWithUser): boolean {
    return !!request.clubMembership;
  }
}

export const SerializeAsPublic = <T>(dto: ClassConstructor<T>) => [
  Serialize(dto),
  SerializeGroups('public')
];

export const SerializeAsAuthenticated = <T>(dto: ClassConstructor<T>) => [
  Serialize(dto),
  SerializeGroups('authenticated')
];

export const SerializeAsOwner = <T>(dto: ClassConstructor<T>) => [
  Serialize(dto),
  SerializeGroups('owner')
];