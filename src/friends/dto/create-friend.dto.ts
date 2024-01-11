import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFriendDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  friend_id: string;
}
