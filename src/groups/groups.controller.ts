import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import {
  AddGroupMembersDto,
  DeleteGroupMembersDto,
  UpdateGroupInfoDto,
} from './dto/update-group.dto';
import { GetGroupsDto } from './dto/get-group.dto';

@Controller('api/groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(createGroupDto);
  }

  @Post('/addmembers')
  addMembers(@Query() addGroupMembersDto: AddGroupMembersDto) {
    return this.groupsService.addMembers(addGroupMembersDto);
  }

  @Post('/deletemembers')
  deleteMembers(@Query() deleteGroupMembersDto: DeleteGroupMembersDto) {
    return this.groupsService.deleteMembers(deleteGroupMembersDto);
  }

  @Post('/update')
  update(@Query() updateGroupInfoDto: UpdateGroupInfoDto) {
    return this.groupsService.updateInfo(updateGroupInfoDto);
  }

  // @Get()
  // findAll() {
  //   return this.groupsService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupsService.findOne(id);
  }

  @Get()
  findGroupsByUser(@Query() getGroupsDto: GetGroupsDto) {
    return this.groupsService.findGroupsByUser(getGroupsDto);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
  //   return this.groupsService.update(+id, updateGroupDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.groupsService.remove(+id);
  // }
}
