import { ClubMember as PrismaClubMember } from '@prisma/client';

export type ClubMember = PrismaClubMember;

export enum ClubRole {
  PRESIDENT = 'president',
  VICE_PRESIDENT = 'vice_president',
  MEMBER = 'member'
}

export enum ClubFunctionalRole {
  TREASURER = 'treasurer',
  ORGANIZER = 'organizer'
}

export enum ClubMemberStatus {
  INVITED = 'invited',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  LEFT = 'left'
}