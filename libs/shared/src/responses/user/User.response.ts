export interface UserResponse {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  pseudo?: string;
  avatarUrl?: string;
  status: string;
  userRole: string;
  soloPlan: string;
  rank: string;
  xp: number;
  joinedClubsCount: number;
  isProfileComplete: boolean;
  needsProfileCompletion: boolean;
}