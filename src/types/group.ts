import { CreateGroupMessageDto } from 'src/group-messages/dto/create-group-message.dto';
import {
  AddGroupMembersDto,
  DeleteGroupMembersDto,
  UpdateGroupInfoDto,
} from 'src/groups/dto/update-group.dto';
import { CreateGroupDto } from 'src/groups/dto/create-group.dto';
import { DeleteGroupDto } from 'src/groups/dto/delete-group.dto';
import { SocketPaylodData } from './socket';

export enum GroupMemberRoleType {
  MANAGER = 'MANAGER',
  MEMBER = 'MEMBER',
}

export type GroupCreatePayload = SocketPaylodData<CreateGroupDto>;

export type GroupSendMessagePayload = SocketPaylodData<{
  message: CreateGroupMessageDto;
  targets: string[];
}>;

export type GroupAddMembersPayload = SocketPaylodData<AddGroupMembersDto>;
export type GroupDeleteMembersPayload = SocketPaylodData<DeleteGroupMembersDto>;
export type GroupUpdateInfoPayload = SocketPaylodData<UpdateGroupInfoDto>;
export type GroupQuitPayload = SocketPaylodData<DeleteGroupMembersDto>;
export type GroupDisbandPayload = SocketPaylodData<DeleteGroupDto>;
