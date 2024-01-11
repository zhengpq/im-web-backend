import { Injectable } from '@nestjs/common';
import uuidv4 from 'src/utils/uuid';
import { InjectModel } from '@nestjs/sequelize';
import { UsersModel } from 'src/users/models/users.model';
import { CreateGroupMembersDto } from './dto/create-group-member.dto';
// import { UpdateGroupMemberDto } from './dto/update-group-member.dto';
import { GroupMembersModel } from './models/group-members.model';
import { GetMemberDto } from './dto/group-member.dto';

@Injectable()
export class GroupMembersService {
  @InjectModel(GroupMembersModel)
  private groupMembersModel: typeof GroupMembersModel;

  async create(createGroupMemberDto: CreateGroupMembersDto) {
    const { members } = createGroupMemberDto;
    const membersList = members.map((item) => {
      return {
        id: uuidv4(),
        ...item,
      };
    });
    const membersRows = await this.groupMembersModel.bulkCreate(membersList);
    return membersRows;
  }

  async findAllById(groupId: string) {
    const data = await this.groupMembersModel.findAll({
      where: {
        group_id: groupId,
      },
      include: [
        {
          model: UsersModel,
          as: 'user',
          attributes: {
            exclude: ['password'],
          },
        },
      ],
    });
    const result = data.map((member) => {
      const memberData = member.get({ plain: true });
      return {
        role: memberData.role,
        ...memberData.user,
      };
    });
    return result;
  }

  findAll() {
    return `This action returns all groupMembers`;
  }

  async findOne(getMemberDto: GetMemberDto) {
    const { group_id, user_id } = getMemberDto;
    const member = await this.groupMembersModel.findOne({
      where: {
        group_id,
        user_id,
      },
    });
    return member;
  }

  update(id: number) {
    return `This action updates a #${id} groupMember`;
  }

  remove(id: number) {
    return `This action removes a #${id} groupMember`;
  }
}
