import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { FriendMessageType } from 'src/types/friend-message';

export class CreateFriendMessageDto {
  @IsNotEmpty()
  @IsString()
  sender_id: string;

  @IsNotEmpty()
  @IsString()
  ack_id: string;

  @IsNotEmpty()
  @IsString()
  receiver_id: string;

  @IsNotEmpty()
  @IsEnum(FriendMessageType)
  type: FriendMessageType;

  @IsNotEmpty()
  @IsString()
  content: string;
}
