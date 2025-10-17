import { User as PrismaUser, UserPrivacySettings, Address } from '@prisma/client';
import { UserRank, UserStatus } from '../../constants';

export type UserModel = PrismaUser;

export interface UserWithRelations extends UserModel {
  address?: Address | null;
  privacySettings?: UserPrivacySettings | null;
}

export interface UserProfile extends UserWithRelations {
  isProfileComplete: boolean;
  joinedClubsCount: number;
  needsProfileCompletion: boolean;
}

export interface PublicUserProfile {
  id: string;
  pseudo: string | null;
  firstName: string | null;  // Filtré selon privacySettings.profilePublic
  lastName: string | null;   // Filtré selon privacySettings.profilePublic
  avatarUrl: string | null;
  rank: UserRank;
  xp: number;                // Filtré selon privacySettings.showRank
  joinedClubsCount: number;  // Filtré selon privacySettings.showClubs
  status: UserStatus;
  isClubMate: boolean;       // True si dans un club commun avec le viewer
}