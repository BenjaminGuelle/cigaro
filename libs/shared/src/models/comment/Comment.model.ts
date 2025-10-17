import { Comment as PrismaComment, User } from '@prisma/client';

export type CommentModel = PrismaComment;

export interface CommentWithRelations extends CommentModel {
  user?: User | null;
}