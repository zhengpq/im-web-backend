import { Controller, Get, Param, Query } from '@nestjs/common';
import { FriendRequestsService } from './friend-requests.service';
import { GetFriendRequestDto } from './dto/get-friend-request.dto';

@Controller('api/friendrequests')
export class FriendRequestsController {
  constructor(private readonly friendRequestsService: FriendRequestsService) {}

  @Get()
  findAll(@Query() getFriendRequestDto: GetFriendRequestDto) {
    return this.friendRequestsService.findAll(getFriendRequestDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.friendRequestsService.findOne(+id);
  }
}
