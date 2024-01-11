import { PartialType } from '@nestjs/mapped-types';
import { FriendMessageStatus } from 'src/types/friend-message';
import { IsArray, IsEnum, IsString } from 'class-validator';
import { CreateFriendMessageDto } from './create-friend-message.dto';

export class UpdateFriendMessageDto extends PartialType(
  CreateFriendMessageDto,
) {}

export class UpdateFriendMessageStatusDto {
  @IsArray({
    message: 'ids 参数有误',
  })
  @IsString({ each: true })
  ids?: Array<string>;

  @IsString({
    message: 'sender_id 参数有误',
  })
  sender_id?: string;

  @IsString({
    message: 'receiver_id 参数有误',
  })
  receiver_id?: string;

  @IsEnum(FriendMessageStatus, { message: 'status 参数有误' })
  status: FriendMessageStatus;
}
