import { IsOptional, IsString, IsUrl, Length, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'First name must be a string' })
  @Length(1, 100, { message: 'First name must be between 1 and 100 characters' })
  @Transform(({ value }) => value?.trim())
  firstName?: string;

  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  @Length(1, 100, { message: 'Last name must be between 1 and 100 characters' })
  @Transform(({ value }) => value?.trim())
  lastName?: string;

  @IsOptional()
  @IsString({ message: 'Pseudo must be a string' })
  @Length(2, 50, { message: 'Pseudo must be between 2 and 50 characters' })
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'Pseudo can only contain letters, numbers, underscore and dash'
  })
  @Transform(({ value }) => value?.trim())
  pseudo?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Avatar URL must be a valid URL' })
  avatarUrl?: string;
}