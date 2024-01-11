import {
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { FriendRequestStatus } from 'src/types/friend';

@Table({ tableName: 'friend_requests' })
export class FriendRequestsModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  sender_id: string;

  @Column
  receiver_id: string;

  @Column({ defaultValue: '' })
  message: string;

  @Column({
    type: DataType.ENUM({ values: Object.keys(FriendRequestStatus) }),
    defaultValue: FriendRequestStatus.SENDING,
  })
  status: FriendRequestStatus;

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
