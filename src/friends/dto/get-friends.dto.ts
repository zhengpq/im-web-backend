import { IsNotEmpty, IsString } from 'class-validator';

export class GetFriendsDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsString()
  offline_time?: string;
}

export class GetFriendDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  friend_id: string;
}
