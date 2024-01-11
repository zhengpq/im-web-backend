import { IsNotEmpty, IsString } from 'class-validator';

export class GroupMessageDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}

export class GroupMessagesListDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}

export class GetNewGroupMessagesDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsString()
  group_id?: string;

  @IsString()
  offline_time: string;
}
