import { Injectable } from '@nestjs/common';
import { hashPassword } from 'src/utils/password';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import uuidv4 from 'src/utils/uuid';
import { FriendsModel } from 'src/friends/models/friends.model';
import { FriendDeleted } from 'src/types/friend';
import { UsersModel } from './models/users.model';
import { UpdateOfflineTimeDto, UpdateUserInfoDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { SearchUserDto } from './dto/search-user.dto';

interface FindOneOption {
  id?: string;
  username?: string;
  hasPassword?: boolean;
}

@Injectable()
export class UsersService {
  @InjectModel(UsersModel)
  private userModel: typeof UsersModel;

  @InjectModel(FriendsModel)
  private friendsModel: typeof FriendsModel;

  async create(createUserDto: CreateUserDto) {
    const { username, password, avatar } = createUserDto;
    const passwordHashed = await hashPassword(password);
    const newUser = await this.userModel.create({
      id: uuidv4(),
      username,
      password: passwordHashed,
      avatar,
    });
    if (newUser) {
      const { password: passwordFilter, ...result } = newUser.get();
      return result;
    }
    return null;
  }

  async updateUserInfo(updateUserInfoDto: UpdateUserInfoDto) {
    const { user_id, data } = updateUserInfoDto;
    const row = await this.userModel.update(data, {
      where: {
        id: user_id,
      },
    });
    if (row) {
      const newData = await this.userModel.findByPk(user_id);
      return newData;
    }
    return null;
  }

  findAll(): Promise<UsersModel[]> {
    return this.userModel.findAll({
      attributes: {
        exclude: ['password'],
      },
    });
  }

  findByUsername(username: string): Promise<UsersModel> {
    return this.userModel.findOne({
      where: {
        username,
      },
      attributes: {
        exclude: ['password'],
      },
    });
  }

  async searchUser(
    key: string,
    searchUserDto: SearchUserDto,
  ): Promise<UsersModel[]> {
    const { user_id } = searchUserDto;
    const friends = await this.friendsModel.findAll({
      where: {
        user_id,
        deleted: FriendDeleted.NOT_DELETED,
      },
      raw: true,
    });
    const friendsIds = friends.map((item) => item.friend_id);
    friendsIds.push(user_id);
    const options = {
      where: {
        username: {
          [Op.like]: `%${key}%`,
        },
        id: {
          [Op.not]: friendsIds,
        },
      },
    };
    return this.userModel.findAll(options);
  }

  async findById(options: FindOneOption): Promise<UsersModel> {
    const { id, username, hasPassword } = options;
    const findOptions: any = {
      where: {},
      attributes: {},
    };
    if (!hasPassword) {
      findOptions.attributes.exclude = ['password'];
    }
    if (id) {
      findOptions.where.id = id;
    }
    if (username) {
      findOptions.where.username = username;
    }
    return this.userModel.findOne(findOptions);
  }

  async findByIds(ids: string[]) {
    const data = await this.userModel.findAll({
      where: {
        [Op.or]: {
          id: ids,
        },
      },
      attributes: {
        exclude: ['password'],
      },
      raw: true,
    });
    return data;
  }

  updateOfflineTime(updateOfflineTime: UpdateOfflineTimeDto) {
    const { id, time } = updateOfflineTime;
    console.log('paki updatetime', id, time);
    if (id) {
      return this.userModel.update(
        {
          offline_time: time,
        },
        {
          where: {
            id,
          },
        },
      );
    }
    return null;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
