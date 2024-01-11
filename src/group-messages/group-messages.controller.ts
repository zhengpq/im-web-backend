import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { GroupMessagesService } from './group-messages.service';
import { CreateGroupMessageDto } from './dto/create-group-message.dto';
import { GetNewGroupMessagesDto } from './dto/group-message.dto';

@Controller('/api/groupmessages')
export class GroupMessagesController {
  constructor(private readonly groupMessagesService: GroupMessagesService) {}

  @Post()
  create(@Body() createGroupMessageDto: CreateGroupMessageDto) {
    return this.groupMessagesService.create(createGroupMessageDto);
  }

  @Get('/new')
  findAllNew(@Query() getNewGroupMessagesDto: GetNewGroupMessagesDto) {
    return this.groupMessagesService.findAllNew(getNewGroupMessagesDto);
  }

  // @Get('/:id')
  // findAll(@Param() groupMessageDto: GroupMessageDto) {
  //   return this.groupMessagesService.findAll(groupMessageDto);
  // }

  // @Get()
  // findAll() {
  //   return this.groupMessagesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.groupMessagesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateGroupMessageDto: UpdateGroupMessageDto,
  // ) {
  //   return this.groupMessagesService.update(+id, updateGroupMessageDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.groupMessagesService.remove(+id);
  // }
}
