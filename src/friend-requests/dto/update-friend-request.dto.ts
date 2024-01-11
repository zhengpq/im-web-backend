import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { FriendRequestStatus } from 'src/types/friend';

export class UpdateFriendRequestDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsEnum(FriendRequestStatus)
  status: FriendRequestStatus;
}
