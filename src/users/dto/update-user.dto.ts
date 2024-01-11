import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

export class UpdateOfflineTimeDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsNumber()
  time: number;
}

class UserInfoDataDto {
  @IsString()
  avatar?: string;

  @IsString()
  username?: string;
}

export class UpdateUserInfoDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsObject()
  @ValidateNested()
  @Type(() => UserInfoDataDto)
  data?: UserInfoDataDto;
}
