import { UserRank } from '../../models';

export interface PublicUserResponse {
  id: string;
  pseudo: string | null;
  firstName: string | null; // Si privacy_settings.profile_public
  lastName: string | null;  // Si privacy_settings.profile_public
  avatarUrl: string | null;
  rank: UserRank;
  xp: number;
}