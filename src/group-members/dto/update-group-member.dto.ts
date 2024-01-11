import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupMembersDto } from './create-group-member.dto';

export class UpdateGroupMemberDto extends PartialType(CreateGroupMembersDto) {}
