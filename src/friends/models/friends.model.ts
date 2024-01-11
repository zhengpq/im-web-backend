import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { FriendDeleted } from 'src/types/friend';
import { UsersModel } from 'src/users/models/users.model';

@Table({ tableName: 'friends', timestamps: true })
export class FriendsModel extends Model {
  @PrimaryKey
  @Column
  id: string;

  @ForeignKey(() => UsersModel)
  @Column({ defaultValue: '' })
  user_id: string;

  @BelongsTo(() => UsersModel, 'user_id')
  user: UsersModel;

  @ForeignKey(() => UsersModel)
  @Column
  friend_id: string;

  @BelongsTo(() => UsersModel, 'friend_id')
  friend_user: UsersModel;

  @Column({ defaultValue: FriendDeleted.NOT_DELETED })
  deleted: FriendDeleted;

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
