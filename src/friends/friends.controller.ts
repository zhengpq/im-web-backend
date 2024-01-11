import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { GetFriendDto, GetFriendsDto } from './dto/get-friends.dto';
import { DeleteFriendDto } from './dto/delete-friend.dto';

@Controller('api/friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Get()
  findAll(@Query() getFriendsDto: GetFriendsDto) {
    return this.friendsService.findAll(getFriendsDto);
  }

  @Get('/exist')
  findOne(@Query() getFriendDto: GetFriendDto) {
    return this.friendsService.findOne(getFriendDto);
  }

  @Post('/create')
  create(@Body() createFriendDto: CreateFriendDto) {
    return this.friendsService.create(createFriendDto);
  }

  @Post('/delete')
  delete(@Query() deleteFriendDto: DeleteFriendDto) {
    return this.friendsService.delete(deleteFriendDto);
  }
}
