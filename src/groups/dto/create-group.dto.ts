import { IsNotEmpty, IsString } from 'class-validator';
import { GroupMemberRoleType } from 'src/types/group';

export class CreateGroupDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  first_message: string;

  @IsNotEmpty()
  members: Array<{
    id: string;
    role: GroupMemberRoleType;
  }>;
}
