import { IsNotEmpty, IsString } from 'class-validator';

export class GetFriendRequestDto {
  @IsNotEmpty()
  @IsString()
  receiver_id: string;

  @IsString()
  offline_time?: string;
}
