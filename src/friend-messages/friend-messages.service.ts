import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import uuidv4 from 'src/utils/uuid';
import {
  GetNewFriendMessagesDto,
  RemoveFriendMessagesDto,
} from './dto/friend-message.dto';
import { FriendMessagesModel } from './models/friend-messages.model';
import { CreateFriendMessageDto } from './dto/create-friend-message.dto';

@Injectable()
export class FriendMessagesService {
  @InjectModel(FriendMessagesModel)
  private friendMessagesModel: typeof FriendMessagesModel;

  async create(createFriendMessage: CreateFriendMessageDto) {
    const { sender_id, ack_id, receiver_id, type, content } =
      createFriendMessage;
    const exitMessage = await this.friendMessagesModel.findOne({
      where: {
        sender_id,
        ack_id,
      },
    });
    // 如果之前已经发过同条信息，先删除再插入新的信息
    if (exitMessage) {
      await this.friendMessagesModel.destroy({
        where: {
          sender_id,
          ack_id,
        },
      });
    }
    const message = await this.friendMessagesModel.create({
      id: uuidv4(),
      ack_id,
      sender_id,
      receiver_id,
      type,
      content,
    });
    return message;
  }

  async findAllNew(getNewFriendMessagesDto: GetNewFriendMessagesDto) {
    const { receiver_id, offline_time } = getNewFriendMessagesDto;
    const commonOptions: any = {
      where: {
        receiver_id,
      },
      order: [['created_at', 'ASC']],
    };
    if (offline_time) {
      commonOptions.where.created_at = {
        [Op.gt]: Number(offline_time),
      };
    }
    const groupOptions = {
      ...commonOptions,
      group: ['sender_id'],
    };
    const groups = await this.friendMessagesModel.findAll(groupOptions);
    if (groups.length > 0) {
      const result = await Promise.all(
        groups.map((item) => {
          return new Promise((resolve, reject) => {
            const messageOption = {
              ...commonOptions,
              where: {
                ...commonOptions.where,
                sender_id: item.getDataValue('sender_id'),
              },
            };
            this.friendMessagesModel
              .findAll(messageOption)
              .then((value) => {
                resolve({
                  user_id: item.getDataValue('sender_id'),
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

  async removeFriendMessage(removeFriendMessagesDto: RemoveFriendMessagesDto) {
    const { user1_id, user2_id } = removeFriendMessagesDto;
    const data = await this.friendMessagesModel.destroy({
      where: {
        [Op.or]: [
          { sender_id: user1_id, receiver_id: user2_id },
          { sender_id: user2_id, receiver_id: user1_id },
        ],
      },
    });
    if (data) {
      return data;
    }
    return null;
  }

  findOne(id: number) {
    return `This action returns a #${id} friendMessage`;
  }

  // update(id: number, updateFriendMessageDto: UpdateFriendMessageDto) {
  //   return `This action updates a #${id} friendMessage`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} friendMessage`;
  // }
}
