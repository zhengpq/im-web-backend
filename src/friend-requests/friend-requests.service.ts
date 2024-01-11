import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FriendRequestStatus } from 'src/types/friend';
import uuidv4 from 'src/utils/uuid';
import { Op } from 'sequelize';
import { CreateFriendRequestDto } from './dto/create-friend-request.dto';
import { UpdateFriendRequestDto } from './dto/update-friend-request.dto';
import { FriendRequestsModel } from './models/friend-requests.model';
import { RemoveFriendRequestDto } from './dto/remove-friend-request.dto';
import { GetFriendRequestDto } from './dto/get-friend-request.dto';

@Injectable()
export class FriendRequestsService {
  @InjectModel(FriendRequestsModel)
  private friendRequestsModel: typeof FriendRequestsModel;

  async create(createFriendRequestDto: CreateFriendRequestDto) {
    const { sender_id, receiver_id, message } = createFriendRequestDto;
    const oldRequest = await this.friendRequestsModel.findOne({
      where: {
        sender_id,
        receiver_id,
        status: FriendRequestStatus.SENDING,
      },
    });
    if (oldRequest) {
      return null;
    }
    const newRequest = await this.friendRequestsModel.create({
      id: uuidv4(),
      sender_id,
      receiver_id,
      message: message || '',
    });
    return newRequest.get();
  }

  async findAll(getFriendRequestDto: GetFriendRequestDto) {
    const { receiver_id, offline_time } = getFriendRequestDto;
    const options: any = {
      where: {},
    };
    if (receiver_id) {
      options.where.receiver_id = receiver_id;
    }
    if (offline_time) {
      options.where.created_at = {
        [Op.gt]: parseInt(offline_time, 10),
      };
    }
    const result = await this.friendRequestsModel.findAll(options);
    return result;
  }

  findOne(id: number) {
    return `This action returns a #${id} friendRequest`;
  }

  async update(updateFriendRequestDto: UpdateFriendRequestDto) {
    const { id, status } = updateFriendRequestDto;
    const result = await this.friendRequestsModel.update(
      {
        status,
      },
      {
        where: {
          id,
        },
      },
    );
    return result;
  }

  remove(removeFriendRequestDto: RemoveFriendRequestDto) {
    const { sender_id, receiver_id, status } = removeFriendRequestDto;
    return this.friendRequestsModel.destroy({
      where: {
        sender_id,
        receiver_id,
        status,
      },
    });
  }
}
