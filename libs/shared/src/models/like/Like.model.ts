import { Like as PrismaLike, User } from '@prisma/client';

export type LikeModel = PrismaLike;

export interface LikeWithRelations extends LikeModel {
  user?: User | null;
}