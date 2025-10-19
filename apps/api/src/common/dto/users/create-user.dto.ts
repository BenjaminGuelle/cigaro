import {
  IsEmail,
  IsString,
  IsOptional,
  Length,
  Matches,
  IsUrl,
  IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { USER_RANK, UserRank } from '@cigaro/shared';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

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

  @IsOptional()
  @IsEnum(USER_RANK, { message: 'Invalid user rank' })
  rank?: UserRank;
}