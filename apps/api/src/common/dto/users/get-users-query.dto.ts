import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { USER_RANK, UserRank } from '@cigaro/shared';

export class GetUsersQueryDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  limit?: number = 20;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  search?: string;

  @IsOptional()
  @IsEnum(USER_RANK)
  rank?: UserRank;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  onlyActive?: boolean = true;
}