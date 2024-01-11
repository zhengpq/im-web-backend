import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { FriendMessagesService } from './friend-messages.service';
import { CreateFriendMessageDto } from './dto/create-friend-message.dto';
import { GetNewFriendMessagesDto } from './dto/friend-message.dto';

@Controller('api/friendmessages')
export class FriendMessagesController {
  constructor(private readonly friendMessagesService: FriendMessagesService) {}

  @Post('/create')
  create(@Body() createFriendMessageDto: CreateFriendMessageDto) {
    return this.friendMessagesService.create(createFriendMessageDto);
  }

  @Get('/new')
  findAllNew(@Query() getNewFriendMessagesDto: GetNewFriendMessagesDto) {
    return this.friendMessagesService.findAllNew(getNewFriendMessagesDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.friendMessagesService.findOne(+id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateFriendMessageDto: UpdateFriendMessageDto,
  // ) {
  //   return this.friendMessagesService.update(+id, updateFriendMessageDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.friendMessagesService.remove(+id);
  // }
}
