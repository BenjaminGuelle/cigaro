import { Club as PrismaClub, Address, ClubSettings, User, ClubMember } from '@prisma/client';

export type ClubModel = PrismaClub;

export interface ClubWithRelations extends ClubModel {
  address?: Address | null;
  settings?: ClubSettings | null;
  owner?: User | null;
  members?: ClubMember[];
}

export interface PublicClubProfile {
  id: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  coverPhotoUrl: string | null;
  memberCount: number;
  isPublic: boolean;
  foundedAt: Date | null;
}

export interface ClubMemberView extends PublicClubProfile {
  contactEmail: string | null;
  address?: Address | null;     // Selon les settings du club
  invitationCode: string | null; // Seulement pour président/vice-président
}