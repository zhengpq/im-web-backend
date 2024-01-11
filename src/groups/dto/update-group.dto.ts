import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { CreateGroupDto } from './create-group.dto';

export class UpdateGroupDto extends PartialType(CreateGroupDto) {}

export class AddGroupMembersDto {
  @IsNotEmpty()
  @IsString()
  group_id: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  user_ids: string[];
}

export class DeleteGroupMembersDto {
  @IsNotEmpty()
  @IsString()
  group_id: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  user_ids: string[];
}

export class UpdateGroupInfoDto {
  @IsNotEmpty()
  @IsString()
  group_id: string;

  @IsString()
  group_name?: string;

  @IsString()
  group_description?: string;
}
