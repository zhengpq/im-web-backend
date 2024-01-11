import { CreateFriendMessageDto } from 'src/friend-messages/dto/create-friend-message.dto';
import { SocketPaylodData } from './socket';

export enum FriendMessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
}

export enum FriendMessageStatus {
  SENT = 0,
  DELIVERED = 1,
  READ = 2,
}

export type SendFrienMessagePayLoad = SocketPaylodData<{
  message: CreateFriendMessageDto;
}>;
