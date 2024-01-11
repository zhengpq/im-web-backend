import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  SOCKET_EVENT_ADD_GROUP_MEMBERS,
  SOCKET_EVENT_CREATE_GROUP,
  SOCKET_EVENT_DELETE_FRIEND,
  SOCKET_EVENT_DELETE_GROUP_MEMBERS,
  SOCKET_EVENT_DISBAND_GROUP,
  SOCKET_EVENT_FRIEND_REQUEST,
  SOCKET_EVENT_FRIEND_REQUEST_RECEIVED,
  SOCKET_EVENT_FRIEND_REQUEST_REJECT,
  SOCKET_EVENT_QUIT_GROUP,
  SOCKET_EVENT_SEND_GROUP_MESSAGE,
  SOCKET_EVENT_SENT_FRIEND_MESSAGE,
  SOCKET_EVENT_UPDATE_GROUP_NAME,
} from 'src/const/socket-events';
import {
  FriendAnswerPayload,
  FriendDeletePayload,
  FriendRequestPayload,
} from 'src/types/friend';
import { SendFrienMessagePayLoad } from 'src/types/friend-message';
import {
  GroupAddMembersPayload,
  GroupCreatePayload,
  GroupDeleteMembersPayload,
  GroupDisbandPayload,
  GroupQuitPayload,
  GroupSendMessagePayload,
  GroupUpdateInfoPayload,
} from 'src/types/group';
import { ErrorCode, errorMessage } from 'src/const/error-code';
// import { UpdateFriendDto } from './dto/update-friend.dto';
import { ChatGatewayService } from './chat.service';

// @UseInterceptors(TransformSocketResponseInterceptor)
@WebSocketGateway({ cors: { origin: '*' }, port: '3000' })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly chatService: ChatGatewayService) {}

  @WebSocketServer()
  private server: Server;

  formateData(value: any) {
    let code = ErrorCode.SUCCESS;
    let dataFinal = value.data;
    if (value.code) {
      code = value.code;
      dataFinal = value.data;
    }
    const result = {
      code,
      message: errorMessage[code] || '',
      data: {
        ...value,
        data: dataFinal || null,
      },
    };
    return result;
  }

  @SubscribeMessage('connect')
  handleConnection(client: Socket) {
    console.log('paki connect -----------------------------------------');
    const userId = client.handshake.auth.user_id;
    if (userId) {
      client.join(userId);
    }
  }

  @SubscribeMessage('disconnect')
  handleDisconnect(client: Socket) {
    const time = Date.now();
    const id = client.handshake.auth.user_id;
    this.chatService.updateUserOfflineTime(id, time);
  }

  afterInit() {
    console.log('afterInit');
  }

  @SubscribeMessage(SOCKET_EVENT_FRIEND_REQUEST)
  async friendRequest(client: Socket, payload: FriendRequestPayload) {
    console.log('paki SOCKET_EVENT_FRIEND_REQUEST', payload);
    const { from, to } = payload;
    try {
      const data = await this.chatService.createFriendRequest(payload);
      if (data) {
        this.server.to(payload.to).emit(
          SOCKET_EVENT_FRIEND_REQUEST,
          this.formateData({
            from,
            to,
            data,
          }),
        );
      }
      // 请求完成通知发起好友请求的用户
      this.server.to(payload.from).emit(
        SOCKET_EVENT_FRIEND_REQUEST,
        this.formateData({
          data,
          from,
          to,
        }),
      );
    } catch (error) {
      console.error(error);
      this.server.to(payload.from).emit(
        SOCKET_EVENT_FRIEND_REQUEST,
        this.formateData({
          from,
          to,
          data: null,
          code: ErrorCode.FRIEND_REQUEST_FAILED,
        }),
      );
    }
  }

  @SubscribeMessage(SOCKET_EVENT_FRIEND_REQUEST_RECEIVED)
  async friendRequestReceive(client: Socket, payload: FriendAnswerPayload) {
    const {
      from,
      to,
      data: { requestId },
    } = payload;
    try {
      const { newFriendFrom, newFriendTo } =
        await this.chatService.friendRequestReceive(payload);
      this.server.to(from).emit(
        SOCKET_EVENT_FRIEND_REQUEST_RECEIVED,
        this.formateData({
          data: {
            friend: newFriendFrom,
            request_id: requestId,
          },
          from,
          to,
        }),
      );
      this.server.to(to).emit(
        SOCKET_EVENT_FRIEND_REQUEST_RECEIVED,
        this.formateData({
          data: {
            friend: newFriendTo,
            request_id: requestId,
          },
          from,
          to,
        }),
      );
    } catch (error) {
      console.log('FRIEND_REQUEST_RECEIVED_FAILED', error);
      this.server.to(from).emit(
        SOCKET_EVENT_FRIEND_REQUEST_RECEIVED,
        this.formateData({
          code: ErrorCode.FRIEND_REQUEST_RECEIVED_FAILED,
          data: {
            request_id: requestId,
          },
          from,
          to,
        }),
      );
    }
  }

  @SubscribeMessage(SOCKET_EVENT_FRIEND_REQUEST_REJECT)
  async friendRequestReject(client: Socket, payload: FriendAnswerPayload) {
    const {
      from,
      to,
      data: { requestId },
    } = payload;
    try {
      await this.chatService.frienRequestReject(payload);
      this.server.to(from).emit(
        SOCKET_EVENT_FRIEND_REQUEST_REJECT,
        this.formateData({
          data: {
            request_id: requestId,
          },
          from,
          to,
        }),
      );
    } catch (error) {
      console.error(error);
      this.server.to(from).emit(
        SOCKET_EVENT_FRIEND_REQUEST_REJECT,
        this.formateData({
          data: null,
          code: ErrorCode.FRIEND_REQUEST_REJECT_FAILED,
          from,
          to,
        }),
      );
    }
  }

  @SubscribeMessage(SOCKET_EVENT_DELETE_FRIEND)
  async DeleteFriendDto(client: Socket, payload: FriendDeletePayload) {
    const { from, to } = payload;
    try {
      await this.chatService.deleteFriend(payload);
      const data = this.formateData({
        from,
        to,
        data: payload.data,
      });
      this.server.to(to).emit(SOCKET_EVENT_DELETE_FRIEND, data);
      this.server.to(from).emit(SOCKET_EVENT_DELETE_FRIEND, data);
    } catch (error) {
      console.error(error);
      const data = this.formateData({
        code: ErrorCode.FRIEND_DELETE_FAILED,
        from,
        to,
        data: null,
      });
      this.server.to(from).emit(SOCKET_EVENT_DELETE_FRIEND, data);
    }
  }

  @SubscribeMessage(SOCKET_EVENT_SENT_FRIEND_MESSAGE)
  async sendFriendMessage(client: Socket, payload: SendFrienMessagePayLoad) {
    const {
      from,
      to,
      data: { message },
    } = payload;
    if (message) {
      try {
        const newMessage = await this.chatService.sendFriendMessage(message);
        if (newMessage) {
          const newMessageData = newMessage.get();
          const data = this.formateData({
            from,
            to,
            data: newMessageData,
          });
          this.server.to(from).emit(SOCKET_EVENT_SENT_FRIEND_MESSAGE, data);
          this.server.to(to).emit(SOCKET_EVENT_SENT_FRIEND_MESSAGE, data);
        }
      } catch (error) {
        console.log(error);
        const data = this.formateData({
          code: ErrorCode.MESSAGE_SEND_FAILED,
          data: {
            ack_id: message.ack_id,
          },
        });
        this.server.to(from).emit(SOCKET_EVENT_SENT_FRIEND_MESSAGE, data);
      }
    }
  }

  @SubscribeMessage(SOCKET_EVENT_CREATE_GROUP)
  async createGroup(client: Socket, payload: GroupCreatePayload) {
    const { from } = payload;
    try {
      const data = await this.chatService.createGroup(payload);
      if (data.group.members) {
        const targets = data.group.members.map((item) => item.id);
        const finalData = this.formateData({
          from,
          data,
        });
        this.server.to(targets).emit(SOCKET_EVENT_CREATE_GROUP, finalData);
      }
    } catch (error) {
      console.error(error);
      const data = this.formateData({
        code: ErrorCode.GROUP_CREATE_FAILED,
        from,
        data: null,
      });
      this.server.to(from).emit(SOCKET_EVENT_CREATE_GROUP, data);
    }
  }

  @SubscribeMessage(SOCKET_EVENT_SEND_GROUP_MESSAGE)
  async sendGroupMessage(client: Socket, payload: GroupSendMessagePayload) {
    console.log(
      'paki SOCKET_EVENT_SEND_GROUP_MESSAGE ----------------------------------------',
    );
    const {
      from,
      to,
      data: { targets },
    } = payload;
    try {
      const data = await this.chatService.createGroupMessage(payload);
      if (data && targets.length > 0) {
        const finalData = this.formateData({
          from,
          to,
          data: data.get(),
        });
        this.server
          .to(targets)
          .emit(SOCKET_EVENT_SEND_GROUP_MESSAGE, finalData);
      }
    } catch (error) {
      console.error(error);
      const data = this.formateData({
        code: ErrorCode.GROUP_SEND_MESSAGE_FAILED,
        from,
        data: null,
      });
      this.server.to(from).emit(SOCKET_EVENT_SEND_GROUP_MESSAGE, data);
    }
  }

  @SubscribeMessage(SOCKET_EVENT_ADD_GROUP_MEMBERS)
  async addGroupMembers(client: Socket, payload: GroupAddMembersPayload) {
    const {
      from,
      data: { user_ids },
    } = payload;
    try {
      const groupData = await this.chatService.addGroupMembers(payload);
      const newMembers = groupData.members.filter((item) =>
        user_ids.includes(item.id),
      );
      const memberIds = groupData.members.map((item) => item.id);
      const data = this.formateData({
        from,
        data: {
          group_data: groupData,
          new_users: newMembers,
        },
      });
      this.server.to(memberIds).emit(SOCKET_EVENT_ADD_GROUP_MEMBERS, data);
    } catch (error) {
      console.error(error);
      const data = this.formateData({
        code: ErrorCode.GROUP_ADD_MEMBERS_FAILED,
        from,
        data: null,
      });
      this.server.to(from).emit(SOCKET_EVENT_ADD_GROUP_MEMBERS, data);
    }
  }

  @SubscribeMessage(SOCKET_EVENT_DELETE_GROUP_MEMBERS)
  async deleteGroupMembers(client, payload: GroupDeleteMembersPayload) {
    const {
      from,
      data: { user_ids },
    } = payload;
    try {
      const groupData = await this.chatService.deleteGroupMembers(payload);
      const newMemberIds = groupData.members.map((item) => item.id);
      const data = this.formateData({
        from,
        data: {
          group_data: groupData,
          deleted_users: user_ids,
        },
      });
      this.server.to(user_ids).emit(SOCKET_EVENT_DELETE_GROUP_MEMBERS, data);
      this.server
        .to(newMemberIds)
        .emit(SOCKET_EVENT_DELETE_GROUP_MEMBERS, data);
    } catch (error) {
      console.error(error);
      const data = this.formateData({
        code: ErrorCode.GROUP_DELETE_MEMBERS_FAILED,
        from,
        data: null,
      });
      this.server.to(from).emit(SOCKET_EVENT_DELETE_GROUP_MEMBERS, data);
    }
  }

  @SubscribeMessage(SOCKET_EVENT_QUIT_GROUP)
  async quitGroup(client, payload: GroupQuitPayload) {
    const {
      from,
      data: { user_ids },
    } = payload;
    try {
      const groupData = await this.chatService.deleteGroupMembers(payload);
      const newMemberIds = groupData.members.map((item) => item.id);
      const data = this.formateData({
        from,
        data: {
          group_data: groupData,
          deleted_users: user_ids,
        },
      });
      this.server.to(from).emit(SOCKET_EVENT_QUIT_GROUP, data);
      this.server.to(newMemberIds).emit(SOCKET_EVENT_QUIT_GROUP, data);
    } catch (error) {
      console.error(error);
      const data = this.formateData({
        code: ErrorCode.GROUP_QUIT_FAILED,
        from,
        data: null,
      });
      this.server.to(from).emit(SOCKET_EVENT_QUIT_GROUP, data);
    }
  }

  @SubscribeMessage(SOCKET_EVENT_DISBAND_GROUP)
  async disbandGroup(client, payload: GroupDisbandPayload) {
    const {
      from,
      data: { group_id },
    } = payload;
    try {
      const { groupData } = await this.chatService.disbandGroup(payload);
      const targets = groupData.members.map((item) => item.id);
      const data = this.formateData({
        from,
        data: {
          group_id,
        },
      });
      this.server.to(targets).emit(SOCKET_EVENT_DISBAND_GROUP, data);
    } catch (error) {
      console.error(error);
      const data = this.formateData({
        code: ErrorCode.GROUP_DISBAND_FAILED,
        from,
        data: null,
      });
      this.server.to(from).emit(SOCKET_EVENT_DISBAND_GROUP, data);
    }
  }

  @SubscribeMessage(SOCKET_EVENT_UPDATE_GROUP_NAME)
  async updateGroupInfo(client: Socket, payload: GroupUpdateInfoPayload) {
    const { from } = payload;
    try {
      const group = await this.chatService.updateGroupInfo(payload);
      const groupMembers = group.members;
      const targets = groupMembers.map((item) => item.id);
      const data = this.formateData({
        from,
        data: {
          group,
        },
      });
      this.server.to(targets).emit(SOCKET_EVENT_UPDATE_GROUP_NAME, data);
    } catch (error) {
      const data = this.formateData({
        code: ErrorCode.GROUP_UPDATE_NAME_FAILED,
        from,
        data: null,
      });
      this.server.to(from).emit(SOCKET_EVENT_UPDATE_GROUP_NAME, data);
    }
  }

  @SubscribeMessage('findAllFriends')
  findAll() {
    this.server.emit('test');
    return this.chatService.findAll();
  }

  @SubscribeMessage('findOneFriend')
  findOne(@MessageBody() id: number) {
    return this.chatService.findOne(id);
  }

  // @SubscribeMessage('updateFriend')
  // update(@MessageBody() updateFriendDto: UpdateFriendDto) {
  //   return this.chatService.update(updateFriendDto.id, updateFriendDto);
  // }

  // @SubscribeMessage('removeFriend')
  // remove(@MessageBody() id: number) {
  //   return this.chatService.remove(id);
  // }
}
