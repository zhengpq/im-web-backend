import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { GroupMembersService } from './group-members.service';
import { CreateGroupMembersDto } from './dto/create-group-member.dto';
import { GetMemberDto } from './dto/group-member.dto';

@Controller('/api/groupmembers')
export class GroupMembersController {
  constructor(private readonly groupMembersService: GroupMembersService) {}

  @Post()
  create(@Body() createGroupMemberDto: CreateGroupMembersDto) {
    return this.groupMembersService.create(createGroupMemberDto);
  }

  @Get('/exist')
  findOne(@Query() getMemberDto: GetMemberDto) {
    return this.groupMembersService.findOne(getMemberDto);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.groupMembersService.findOne(+id);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupMembersService.remove(+id);
  }
}
