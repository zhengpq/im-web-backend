import { Injectable } from '@nestjs/common';
import { UsersModel } from 'src/users/models/users.model';
import { InjectModel } from '@nestjs/sequelize';
import uuidv4 from 'src/utils/uuid';
import { Op } from 'sequelize';
import { FriendDeleted } from 'src/types/friend';
import { GetFriendDto, GetFriendsDto } from './dto/get-friends.dto';
import { FriendsModel } from './models/friends.model';
// import { UpdateFriendDto } from './dto/update-friend.dto';
import { CreateFriendDto } from './dto/create-friend.dto';
import { DeleteFriendDto } from './dto/delete-friend.dto';

@Injectable()
export class FriendsService {
  @InjectModel(FriendsModel)
  private friendsModel: typeof FriendsModel;

  @InjectModel(UsersModel)
  private usersModel: typeof UsersModel;

  async create(createFriendDto: CreateFriendDto) {
    const { user_id, friend_id } = createFriendDto;
    const newFriendRow = await this.friendsModel.create({
      id: uuidv4(),
      user_id,
      friend_id,
    });
    const newFriendData = await this.usersModel.findByPk(
      newFriendRow.get('friend_id'),
    );
    return {
      ...newFriendRow.get(),
      username: newFriendData.get('username'),
      avatar: newFriendData.get('avatar'),
    };
  }

  async findAll(getFriendsDto: GetFriendsDto) {
    const { user_id, offline_time } = getFriendsDto;
    const options: any = {
      where: {
        user_id,
        deleted: FriendDeleted.NOT_DELETED,
      },
      include: [
        {
          model: UsersModel,
          as: 'friend_user',
          attributes: ['username', 'avatar'],
        },
      ],
      order: [['created_at', 'DESC']],
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
    const friends = await this.friendsModel.findAll(options);
    if (friends) {
      return friends.map((friend) => {
        const { username, avatar } = friend.friend_user;
        const data = {
          ...friend.get({ plain: true }),
          username,
          avatar,
        };
        delete data.friend_user;
        return data;
      });
    }
    return null;
  }

  async findOne(getFriendDto: GetFriendDto) {
    const { user_id, friend_id } = getFriendDto;
    const friend = await this.friendsModel.findOne({
      where: {
        user_id,
        friend_id,
        deleted: FriendDeleted.NOT_DELETED,
      },
      include: [
        {
          model: UsersModel,
          as: 'friend_user',
          attributes: ['username', 'avatar'],
        },
      ],
    });
    if (friend) {
      const { username, avatar } = friend.friend_user;
      const data = {
        ...friend.get({ plain: true }),
        username,
        avatar,
      };
      delete data.friend_user;
      return data;
    }
    return null;
  }

  async delete(deleteFriendDto: DeleteFriendDto) {
    const { user_id, friend_id } = deleteFriendDto;
    const result = await this.friendsModel.update(
      {
        deleted: FriendDeleted.DELETED,
      },
      {
        where: {
          [Op.or]: [
            { user_id, friend_id },
            { user_id: friend_id, friend_id: user_id },
          ],
        },
      },
    );
    if (result) {
      return result;
    }
    return null;
  }

  async findAllFriends(id: string) {
    const friends = await this.friendsModel.findAll({
      where: {
        user_id: id,
      },
      include: [
        {
          model: UsersModel,
          as: 'friend_user',
          attributes: ['username', 'avatar'],
        },
      ],
      order: [['created_at', 'DESC']],
    });
    if (friends) {
      return friends.map((friend) => {
        const { username, avatar } = friend.friend_user;
        const data = {
          ...friend.get({ plain: true }),
          username,
          avatar,
        };
        delete data.friend_user;
        return data;
      });
    }
    return null;
  }
}
