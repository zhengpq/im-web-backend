import {
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { GroupsModel } from 'src/groups/models/groups.model';
import { MessageType } from 'src/types';
import { UsersModel } from 'src/users/models/users.model';

@Table({ tableName: 'group_messages', timestamps: true })
export class GroupMessagesModel extends Model {
  @PrimaryKey
  @Column
  id: string;

  @Column({ defaultValue: '' })
  @Column
  ack_id: string;

  @ForeignKey(() => GroupsModel)
  @Column({ defaultValue: '' })
  group_id: string;

  @ForeignKey(() => UsersModel)
  @Column({ defaultValue: '' })
  sender_id: string;

  @Column({ defaultValue: '' })
  content: string;

  @Column({ defaultValue: MessageType.TEXT })
  type: MessageType;

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
