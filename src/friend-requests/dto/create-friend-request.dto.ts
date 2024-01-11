import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFriendRequestDto {
  @IsNotEmpty()
  @IsString()
  sender_id: string;

  @IsNotEmpty()
  @IsString()
  receiver_id: string;

  @IsString()
  message?: string;
}
