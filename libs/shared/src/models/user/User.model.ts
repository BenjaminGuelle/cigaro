import { User as PrismaUser, $Enums } from '@prisma/client';

export type User = PrismaUser;

export interface UserProfile extends User {
  isProfileComplete: boolean;
  joinedClubsCount: number;
  needsProfileCompletion: boolean;
}

export interface PublicUserProfile {
  id: string;
  pseudo: string | null;
  firstName: string | null;  // Selon privacy_settings.profile_public
  lastName: string | null;   // Selon privacy_settings.profile_public
  avatarUrl: string | null;
  rank: UserRank;
  xp: number;                // Selon privacy_settings.show_rank
  joinedClubsCount: number;  // Selon privacy_settings.show_clubs
  status: UserStatus;        // AJOUTÉ
  isClubMate: boolean;       // AJOUTÉ - True si dans un club commun
}

export type UserStatus = $Enums.UserStatus;
export type UserRole = $Enums.UserRole;
export type UserRank = $Enums.UserRank;
export type PlanType = $Enums.PlanType;