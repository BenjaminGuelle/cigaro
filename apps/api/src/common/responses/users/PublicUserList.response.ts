import { Expose, Transform } from 'class-transformer';
import { UserRank } from '@cigaro/libs';

export class PublicUserListResponse {
  @Expose()
  id: string;

  @Expose()
  pseudo: string;

  @Expose()
  avatarUrl?: string;

  @Expose()
  rank: UserRank;

  @Expose()
  @Transform(({ obj }) => !!obj.pseudo && !!obj.firstName)
  isProfileComplete: boolean;

  // Minimal stats pour la liste
  @Expose({ groups: ['authenticated'] })
  @Transform(({ obj }) => obj.rank !== 'initie')
  isExperienced: boolean;
}