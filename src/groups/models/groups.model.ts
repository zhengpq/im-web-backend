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
import { GroupMembersModel } from '../../group-members/models/group-members.model';

@Table({ tableName: 'groups', timestamps: true })
export class GroupsModel extends Model {
  @PrimaryKey
  @Column
  id: string;

  @Column({ defaultValue: '' })
  name: string;

  @Column({ defaultValue: '' })
  description: string;

  @HasMany(() => GroupMembersModel, 'group_id')
  group_members: GroupMembersModel[];

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
