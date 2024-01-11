import { IsNotEmpty, IsString } from 'class-validator';
import { MessageType } from 'src/types';

export class CreateGroupMessageDto {
  @IsNotEmpty()
  @IsString()
  group_id: string;

  @IsString()
  ack_id?: string;

  @IsNotEmpty()
  @IsString()
  sender_id: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  type: MessageType;
}
