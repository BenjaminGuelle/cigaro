import { IsBoolean, IsOptional } from 'class-validator';

export class UpdatePrivacySettingsDto {
  @IsOptional()
  @IsBoolean({ message: 'profilePublic must be a boolean' })
  profilePublic?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'emailVisible must be a boolean' })
  emailVisible?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'showRank must be a boolean' })
  showRank?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'showTastingsCount must be a boolean' })
  showTastingsCount?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'showClubs must be a boolean' })
  showClubs?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'showLocation must be a boolean' })
  showLocation?: boolean;
}