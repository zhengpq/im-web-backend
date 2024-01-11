import { IsNotEmpty, IsString } from 'class-validator';

export class GetGroupsDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsString()
  offline_time?: string;
}
