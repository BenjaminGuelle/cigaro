import { ClubMember as PrismaClubMember, User, Club } from '@prisma/client';

export type ClubMemberModel = PrismaClubMember;

export interface ClubMemberWithRelations extends ClubMemberModel {
  user?: User | null;
  club?: Club | null;
}