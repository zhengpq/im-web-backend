import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasOne,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import {
  FriendMessageStatus,
  FriendMessageType,
} from 'src/types/friend-message';
import { UsersModel } from 'src/users/models/users.model';

@Table({ tableName: 'friend_messages' })
export class FriendMessagesModel extends Model {
  @PrimaryKey
  @Column
  id: string;

  @Column({ defaultValue: '' })
  @Column
  ack_id: string;

  @Column({ defaultValue: '' })
  @ForeignKey(() => UsersModel)
  sender_id: string;

  @BelongsTo(() => UsersModel, 'sender_id')
  sender: UsersModel;

  @ForeignKey(() => UsersModel)
  @Column({ defaultValue: '' })
  receiver_id: string;

  @BelongsTo(() => UsersModel, 'receiver_id')
  receiver: UsersModel;

  @Column({ defaultValue: FriendMessageType.TEXT })
  type: FriendMessageType;

  @Column({ defaultValue: '' })
  content: string;

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
