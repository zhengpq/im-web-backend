import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteFriendDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  friend_id: string;
}
