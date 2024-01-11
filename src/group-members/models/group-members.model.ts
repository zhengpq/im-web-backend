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
import { GroupMemberRoleType } from 'src/types/group';
import { UsersModel } from 'src/users/models/users.model';
import { GroupsModel } from '../../groups/models/groups.model';

@Table({ tableName: 'group_members', timestamps: true })
export class GroupMembersModel extends Model {
  @PrimaryKey
  @Column
  id: string;

  @ForeignKey(() => UsersModel)
  @Column({ defaultValue: '' })
  user_id: string;

  @ForeignKey(() => GroupsModel)
  @Column({ defaultValue: '' })
  group_id: string;

  @Column({ defaultValue: GroupMemberRoleType.MEMBER })
  role: GroupMemberRoleType;

  @BelongsTo(() => GroupsModel, 'group_id')
  group: GroupsModel;

  @BelongsTo(() => UsersModel, 'user_id')
  user: UsersModel;

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
