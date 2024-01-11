import {
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { FriendMessagesModel } from 'src/friend-messages/models/friend-messages.model';
import { GroupMembersModel } from 'src/group-members/models/group-members.model';

@Table({ tableName: 'users' })
export class UsersModel extends Model {
  @PrimaryKey
  @Column
  id: string;

  @HasMany(() => FriendMessagesModel, 'sender_id')
  sentMessages: FriendMessagesModel[];

  @HasMany(() => FriendMessagesModel, 'receiver_id')
  receivedMessages: FriendMessagesModel[];

  @Column({ defaultValue: '' })
  username: string;

  @Column
  password: string;

  @Column({ defaultValue: '' })
  avatar: string;

  @HasMany(() => GroupMembersModel, 'group_id')
  group_members: GroupMembersModel[];

  @Column({
    type: DataType.DATE(3),
    get() {
      const offlineTime = this.getDataValue('offline_time') as Date;
      return offlineTime ? offlineTime.getTime() : null;
    },
  })
  offline_time: Date;

  @CreatedAt
  @Column({
    field: 'created_at',
    type: DataType.DATE(3),
    get() {
      const createdAt = this.getDataValue('created_at') as Date;
      return createdAt ? createdAt.getTime() : null; // 将 Date 转换为毫秒
    },
  })
  created_at: Date;

  @UpdatedAt
  @Column({
    field: 'updated_at',
    type: DataType.DATE(3),
    get() {
      const updateAt = this.getDataValue('updated_at') as Date;
      return updateAt ? updateAt.getTime() : null;
    },
  })
  updated_at: Date;
}
