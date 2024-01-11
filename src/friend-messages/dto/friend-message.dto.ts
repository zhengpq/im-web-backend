import { IsNotEmpty, IsString } from 'class-validator';

export class FriendMessagesDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}

export class FriendMessagesListDto {
  @IsNotEmpty()
  @IsString()
  user1_id: string;

  @IsNotEmpty()
  @IsString()
  user2_id: string;
}

export class RemoveFriendMessagesDto {
  @IsNotEmpty()
  @IsString()
  user1_id: string;

  @IsNotEmpty()
  @IsString()
  user2_id: string;
}

export class GetNewFriendMessagesDto {
  @IsNotEmpty()
  @IsString()
  receiver_id: string;

  @IsString()
  offline_time?: string;
}
