import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import uuidv4 from 'src/utils/uuid';
import { Sequelize, Op } from 'sequelize';
import { GroupMembersModel } from 'src/group-members/models/group-members.model';
import {
  GetNewGroupMessagesDto,
  GroupMessagesListDto,
} from './dto/group-message.dto';
import { GroupMessagesModel } from './models/group-messages.model';
import { CreateGroupMessageDto } from './dto/create-group-message.dto';

@Injectable()
export class GroupMessagesService {
  @InjectModel(GroupMessagesModel)
  private groupMessagesModel: typeof GroupMessagesModel;

  @InjectModel(GroupMembersModel)
  private groupMembersModel: typeof GroupMembersModel;

  async create(createGroupMessageDto: CreateGroupMessageDto) {
    const { group_id, sender_id, content, type, ack_id } =
      createGroupMessageDto;
    const id = uuidv4();
    const message = await this.groupMessagesModel.create({
      id: uuidv4(),
      ack_id: ack_id || id,
      group_id,
      sender_id,
      content,
      type,
    });
    return message;
  }

  async findAllNew(getNewGroupMessagesDto: GetNewGroupMessagesDto) {
    const { user_id, group_id, offline_time } = getNewGroupMessagesDto;
    const commonOptions: any = {
      where: {},
      order: [['created_at', 'ASC']],
    };
    if (offline_time) {
      commonOptions.where.created_at = {
        [Op.gt]: Number(offline_time),
      };
    }
    /**
     * 如果有传入固定的 group id，那么久只拿对应的 group 的数据，否则拿全部的数据
     */
    if (group_id) {
      commonOptions.where.group_id = group_id;
      const messages = await this.groupMessagesModel.findAll(commonOptions);
      return [
        {
          group_id,
          messages,
        },
      ];
    }
    const groups = await this.groupMembersModel.findAll({
      where: {
        user_id,
      },
    });
    if (groups.length > 0) {
      const result = await Promise.all(
        groups.map((group) => {
          return new Promise((resolve, reject) => {
            const messageOption = {
              ...commonOptions,
            };
            const groupId = group.getDataValue('group_id');
            messageOption.where.group_id = groupId;
            this.groupMessagesModel
              .findAll(messageOption)
              .then((value) => {
                resolve({
                  group_id: groupId,
                  messages: value,
                });
              })
              .catch((error) => {
                reject(error);
              });
          });
        }),
      )
        .then((value) => {
          return value;
        })
        .catch((error) => {
          throw error;
        });
      return result;
    }

    return [];
  }

  findList(groupMessagesListDto: GroupMessagesListDto) {
    const { id } = groupMessagesListDto;
    return this.groupMessagesModel.findAll({
      where: {
        group_id: id,
      },
      order: [[Sequelize.literal('created_at'), 'ASC']],
    });
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} groupMessage`;
  // }

  // update(id: number, updateGroupMessageDto: UpdateGroupMessageDto) {
  //   return `This action updates a #${id} groupMessage`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} groupMessage`;
  // }
}
