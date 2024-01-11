import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { GroupMemberRoleType } from 'src/types/group';

export class MemberDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  group_id: string;

  @IsEnum(GroupMemberRoleType)
  role: GroupMemberRoleType;
}

export class CreateGroupMembersDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MemberDto)
  members: MemberDto[];
}
