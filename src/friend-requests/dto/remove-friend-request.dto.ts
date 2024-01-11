import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { FriendRequestStatus } from 'src/types/friend';

export class RemoveFriendRequestDto {
  @IsNotEmpty()
  @IsString()
  sender_id: string;

  @IsNotEmpty()
  @IsString()
  receiver_id: string;

  @IsEnum(FriendRequestStatus)
  status: FriendRequestStatus;
}
