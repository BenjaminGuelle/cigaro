import { Expose } from 'class-transformer';
import { UserResponse } from './User.response';

export class MyProfileResponse extends UserResponse {
  // Ajouter des champs spécifiques au profil personnel
  @Expose()
  isAdminPremium: boolean;

  @Expose()
  adminPremiumNote?: string;

  // Privacy settings (toujours accessibles pour soi-même)
  @Expose()
  privacySettings: {
    profilePublic: boolean;
    emailVisible: boolean;
    showRank: boolean;
    showTastingsCount: boolean;
    showClubs: boolean;
    showLocation: boolean;
  };

  // Stats détaillées
  @Expose()
  totalTastings?: number;

  @Expose()
  averageRating?: number;

  @Expose()
  favoriteVitole?: string;
}