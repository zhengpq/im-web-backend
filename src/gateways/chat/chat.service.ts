import { Inject, Injectable, forwardRef } from '@nestjs/common';
import {
  FriendAnswerPayload,
  FriendDeletePayload,
  FriendRequestPayload,
  FriendRequestStatus,
} from 'src/types/friend';
import { InjectModel } from '@nestjs/sequelize';
import { FriendsModel } from 'src/friends/models/friends.model';
import { CreateFriendMessageDto } from 'src/friend-messages/dto/create-friend-message.dto';
import { FriendMessagesService } from 'src/friend-messages/friend-messages.service';
import {
  GroupAddMembersPayload,
  GroupCreatePayload,
  GroupDeleteMembersPayload,
  GroupDisbandPayload,
  GroupSendMessagePayload,
  GroupUpdateInfoPayload,
} from 'src/types/group';
import { GroupsService } from 'src/groups/groups.service';
import { FriendsService } from 'src/friends/friends.service';
import { GroupMessagesService } from 'src/group-messages/group-messages.service';
import { UsersService } from 'src/users/users.service';
import { FriendRequestsService } from 'src/friend-requests/friend-requests.service';

@Injectable()
export class ChatGatewayService {
  constructor(
    @Inject(forwardRef(() => FriendsService))
    private friendsService: FriendsService,
    private friendMessagesService: FriendMessagesService,
    private groupService: GroupsService,
    private groupMessagesService: GroupMessagesService,
    private usersService: UsersService,
    private friendRequestsService: FriendRequestsService,
  ) {}

  @InjectModel(FriendsModel)
  private friendsModel: typeof FriendsModel;

  async createFriendRequest(friendRequest: FriendRequestPayload) {
    const {
      from,
      to,
      data: { message },
    } = friendRequest;
    return this.friendRequestsService.create({
      sender_id: from,
      receiver_id: to,
      message,
    });
  }

  async friendRequestReceive(payload: FriendAnswerPayload) {
    const {
      from,
      to,
      data: { requestId },
    } = payload;
    // 创建一条新的好友信息
    const newFriendFrom = await this.friendsService.create({
      user_id: from,
      friend_id: to,
    });
    const newFriendTo = await this.friendsService.create({
      user_id: to,
      friend_id: from,
    });
    // 更新请求记录
    if (newFriendFrom && newFriendTo) {
      await this.friendRequestsService.update({
        id: requestId,
        status: FriendRequestStatus.RECEIVED,
      });
      // 删除可能存在的互相请求
      await this.friendRequestsService.remove({
        sender_id: from,
        receiver_id: to,
        status: FriendRequestStatus.SENDING,
      });
    }
    return {
      newFriendFrom,
      newFriendTo,
    };
  }

  async frienRequestReject(payload: FriendAnswerPayload) {
    const {
      data: { requestId },
    } = payload;
    const result = await this.friendRequestsService.update({
      id: requestId,
      status: FriendRequestStatus.REJECT,
    });
    return result;
  }

  async deleteFriend(payload: FriendDeletePayload) {
    const { data } = payload;
    const result = await this.friendsService.delete(data);
    return result;
  }

  async sendFriendMessage(payload: CreateFriendMessageDto) {
    const message = await this.friendMessagesService.create(payload);
    if (message) {
      return message;
    }
    return null;
  }

  async createGroup(payload: GroupCreatePayload) {
    const { data: payloadData } = payload;
    const data = await this.groupService.create({
      name: payloadData.name,
      description: payloadData.description,
      members: payloadData.members,
      first_message: payloadData.first_message,
    });
    if (data) {
      return data;
    }
    return null;
  }

  async createGroupMessage(payload: GroupSendMessagePayload) {
    const data = await this.groupMessagesService.create(payload.data.message);
    return data;
  }

  async addGroupMembers(payload: GroupAddMembersPayload) {
    const { data } = payload;
    const newGroupData = await this.groupService.addMembers(data);
    return newGroupData;
  }

  async deleteGroupMembers(payload: GroupDeleteMembersPayload) {
    const { data } = payload;
    const newGroupData = await this.groupService.deleteMembers(data);
    return newGroupData;
  }

  async disbandGroup(payload: GroupDisbandPayload) {
    const { data } = payload;
    const deleteData = await this.groupService.deleteGroup(data);
    return deleteData;
  }

  async updateGroupInfo(payload: GroupUpdateInfoPayload) {
    const { data } = payload;
    const updateData = await this.groupService.updateInfo(data);
    return updateData;
  }

  updateUserOfflineTime(id: string, time: number) {
    this.usersService.updateOfflineTime({
      id,
      time,
    });
  }

  findAll() {
    return `This action returns all friends`;
  }

  findOne(id: number) {
    return `This action returns a #${id} friend`;
  }

  update(id: number) {
    return `This action updates a #${id} friend`;
  }

  remove(id: number) {
    return `This action removes a #${id} friend`;
  }
}
