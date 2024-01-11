import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UsersModel } from 'src/users/models/users.model';
import { Sequelize, Op } from 'sequelize';
import { GroupMemberRoleType } from 'src/types/group';
import { MessageType } from 'src/types';
import { GroupMessagesService } from 'src/group-messages/group-messages.service';
import uuidv4 from 'src/utils/uuid';
import { GroupMembersService } from 'src/group-members/group-members.service';
import { GroupMembersModel } from '../group-members/models/group-members.model';
import { GroupsModel } from './models/groups.model';
import {
  AddGroupMembersDto,
  DeleteGroupMembersDto,
  UpdateGroupInfoDto,
} from './dto/update-group.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { DeleteGroupDto } from './dto/delete-group.dto';
import { GetGroupsDto } from './dto/get-group.dto';

@Injectable()
export class GroupsService {
  constructor(
    @Inject(forwardRef(() => GroupMessagesService))
    private groupMessagesService: GroupMessagesService,
    private groupMembersService: GroupMembersService,
  ) {}

  @InjectModel(GroupsModel)
  private groupsModel: typeof GroupsModel;

  @InjectModel(GroupMembersModel)
  private groupMembersModel: typeof GroupMembersModel;

  async create(createGroupDto: CreateGroupDto) {
    const { name, description, members, first_message } = createGroupDto;
    const creator = members.find(
      (item) => item.role === GroupMemberRoleType.MANAGER,
    );
    const group = await this.groupsModel.create({
      id: uuidv4(),
      name,
      description: description || '',
    });
    /**
     * 如果群创建成功，需要额外做以下几件事
     * 1、在 group_members 数据表中创建成员
     * 2、在 group_messages 数据表中加入第一条消息
     * 3、在 group_messages_reads 数据表中增加每个成员当前阅读到的最新信息的时间
     */
    if (group) {
      const groupId = group.get('id');
      const memberList = members.map(({ id, role }, index) => {
        return {
          user_id: id,
          group_id: groupId,
          role,
        };
      });
      const groupMembers = await this.groupMembersService.create({
        members: memberList,
      });
      const firstMessageRow = await this.groupMessagesService.create({
        group_id: groupId,
        sender_id: creator.id,
        content: first_message,
        type: MessageType.TEXT,
      });
      const groupMembersData = await this.groupMembersService.findAllById(
        groupId,
      );
      if (groupMembers.length > 0) {
        return {
          group: {
            ...group.get(),
            members: groupMembersData,
          },
          first_message: firstMessageRow.get(),
        };
      }
      return null;
    }
    return null;
  }

  async findGroupsByUser(getGroupsDto: GetGroupsDto) {
    const { user_id, offline_time } = getGroupsDto;
    const groups = await this.groupMembersModel.findAll({
      where: {
        user_id,
      },
      raw: true,
    });
    if (!groups) {
      return null;
    }
    const groupIds = groups.map((item) => item.group_id);
    const options: any = {
      where: { id: groupIds },
      include: [
        {
          model: GroupMembersModel,
          as: 'group_members',
          attributes: ['user_id', 'role'],
          include: [
            {
              model: UsersModel,
              as: 'user',
              attributes: {
                exclude: ['password'],
              },
            },
          ],
        },
      ],
      order: [[Sequelize.literal('created_at'), 'DESC']],
    };
    if (offline_time) {
      options.where[Op.or] = [
        {
          created_at: {
            [Op.gt]: parseInt(offline_time, 10),
          },
        },
        {
          updated_at: {
            [Op.gt]: parseInt(offline_time, 10),
          },
        },
      ];
    }
    const data = await this.groupsModel.findAll(options);
    const result = data.map((group) => {
      const groupData = group.get({ plain: true });
      groupData.members = groupData.group_members.map((item) => {
        return { role: item.role, ...item.user };
      });
      delete groupData.group_members;
      return groupData;
    });
    return result;
  }

  async findGroupMembers(id: string) {
    const members = await this.groupMembersService.findAllById(id);
    return members;
  }

  async findOne(id: string) {
    const group = (await this.groupsModel.findByPk(id)).get();
    const members = await this.findGroupMembers(id);
    group.members = members;
    return group;
  }

  async addMembers(addGroupMembersDto: AddGroupMembersDto) {
    const { user_ids, group_id } = addGroupMembersDto;
    const group = await this.groupsModel.findByPk(group_id);
    // 首先确定是否存在对应的群聊，如果存在，那么添加成员
    if (group) {
      const newMembers = user_ids.map((item) => ({
        user_id: item,
        group_id,
        role: GroupMemberRoleType.MEMBER,
      }));
      const groupNewMembers = await this.groupMembersService.create({
        members: newMembers,
      });
      // 更新群聊的更新时间
      await this.groupsModel.update(
        {
          updated_at: Date.now(),
        },
        {
          where: {
            id: group.id,
          },
        },
      );
      // 如果数据添加成功，那么进行消息通知
      if (groupNewMembers.length > 0) {
        const groupData = await this.findOne(group_id);
        return groupData;
      }
      return null;
    }
    return null;
  }

  async deleteMembers(deleteGroupMembersDto: DeleteGroupMembersDto) {
    const { group_id, user_ids } = deleteGroupMembersDto;
    const group = await this.groupsModel.findByPk(group_id);
    if (group) {
      const deletedMembers = await this.groupMembersModel.destroy({
        where: {
          group_id,
          user_id: user_ids,
        },
      });
      await this.groupsModel.update(
        {
          updated_at: Date.now(),
        },
        {
          where: {
            id: group.id,
          },
        },
      );
      if (deletedMembers) {
        const groupData = await this.findOne(group_id);
        return groupData;
      }
      return null;
    }
    return null;
  }

  async updateInfo(updateGroupInfoDto: UpdateGroupInfoDto) {
    const { group_id, group_name, group_description } = updateGroupInfoDto;
    const updateOptions: GroupsModel = {} as GroupsModel;
    if (group_name) {
      updateOptions.name = group_name;
    }
    if (group_description) {
      updateOptions.description = group_description;
    }
    const group = await this.groupsModel.update(updateOptions, {
      where: {
        id: group_id,
      },
    });
    if (group[0] > 0) {
      const newGroup = await this.findOne(group_id);
      return newGroup;
    }
    return null;
  }

  async deleteGroup(deleteGroupDto: DeleteGroupDto) {
    const { group_id } = deleteGroupDto;
    const groupData = await this.findOne(group_id);
    if (groupData) {
      const deletedMembers = await this.groupMembersModel.destroy({
        where: {
          group_id,
        },
      });
      if (deletedMembers) {
        const deletedGroup = await this.groupsModel.destroy({
          where: {
            id: group_id,
          },
        });
        if (deletedGroup) {
          return {
            groupData,
            deletedGroup,
          };
        }
        return null;
      }
    }
    return null;
  }

  // findAll() {
  //   return `This action returns all groups`;
  // }

  // update(id: number, updateGroupDto: UpdateGroupDto) {
  //   return `This action updates a #${id} group`;
  // }

  remove(id: number) {
    return `This action removes a #${id} group`;
  }
}
