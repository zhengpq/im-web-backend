import { DeleteFriendDto } from 'src/friends/dto/delete-friend.dto';
import { SocketPaylodData } from './socket';

export enum FriendRequestStatus {
  SENDING = 'SENDING',
  REJECT = 'REJECT',
  RECEIVED = 'RECEIVED',
}

export enum FriendDeleted {
  DELETED = 1,
  NOT_DELETED = 0,
}

export type FriendRequestPayload = SocketPaylodData<{
  message?: string;
}>;

export type FriendAnswerPayload = SocketPaylodData<{
  requestId: string;
}>;

export type FriendDeletePayload = SocketPaylodData<DeleteFriendDto>;
