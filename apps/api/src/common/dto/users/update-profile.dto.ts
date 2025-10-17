import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateUserDto } from './update-user.dto';
import { UpdatePrivacySettingsDto } from './update-privacy-settings.dto';

export class UpdateProfileDto {
  @ValidateNested()
  @Type(() => UpdateUserDto)
  user: UpdateUserDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdatePrivacySettingsDto)
  privacySettings?: UpdatePrivacySettingsDto;
}