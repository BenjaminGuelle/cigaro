import { Expose, Transform } from 'class-transformer';
import { PlanType, UserRank, UserRole, UserStatus } from '@cigaro/libs';

export class UserResponse {
  @Expose()
  id: string;

  // Champs publics - toujours visibles
  @Expose()
  pseudo: string;

  @Expose()
  avatarUrl?: string;

  @Expose()
  rank: UserRank;

  @Expose()
  status: UserStatus;

  // Champs semi-privés - selon privacy settings et contexte
  @Expose({ groups: ['owner', 'admin'] })
  email: string;

  @Expose({ groups: ['owner', 'club', 'admin'] })
  firstName?: string;

  @Expose({ groups: ['owner', 'club', 'admin'] })
  lastName?: string;

  // Champs privés - owner uniquement
  @Expose({ groups: ['owner'] })
  userRole: UserRole;

  @Expose({ groups: ['owner'] })
  soloPlan: PlanType;

  @Expose({ groups: ['owner'] })
  soloSubscriptionId?: string;

  // Champs calculés - respectent les privacy settings
  @Expose({ groups: ['owner', 'club', 'admin'] })
  @Transform(({ obj }) => {
    // Respecter showRank privacy setting
    const showRank = obj.privacySettings?.showRank ?? true;
    return showRank ? obj.rank !== 'initie' : false;
  })
  isExperienced: boolean;

  @Expose()
  @Transform(({ obj }) => !!obj.pseudo && !!obj.firstName)
  isProfileComplete: boolean;

  // Stats publiques (si privacy permet)
  @Expose({ groups: ['authenticated'] })
  @Transform(({ obj }) => {
    // Respecter showRank privacy setting
    const showRank = obj.privacySettings?.showRank ?? true;
    return showRank ? obj.xp : 0;
  })
  xp: number;

  @Expose({ groups: ['authenticated'] })
  joinedClubsCount?: number;

  // Timestamps
  @Expose({ groups: ['owner', 'admin'] })
  createdAt: Date;

  @Expose({ groups: ['owner', 'admin'] })
  updatedAt: Date;
}