import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
// import { FriendRequestsModel } from './models/friend-requests.model';
import { UsersModel } from 'src/users/models/users.model';
import { FriendsModel } from 'src/friends/models/friends.model';
import { FriendMessagesModel } from 'src/friend-messages/models/friend-messages.model';
import { FriendMessagesService } from 'src/friend-messages/friend-messages.service';
import { GroupsService } from 'src/groups/groups.service';
import { GroupsModel } from 'src/groups/models/groups.model';
import { GroupMembersModel } from 'src/group-members/models/group-members.model';
import { GroupMessagesModel } from 'src/group-messages/models/group-messages.model';
import { GroupMessagesService } from 'src/group-messages/group-messages.service';
import { FriendsService } from 'src/friends/friends.service';
import { GroupMembersService } from 'src/group-members/group-members.service';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { FriendRequestsModel } from 'src/friend-requests/models/friend-requests.model';
import { FriendRequestsService } from 'src/friend-requests/friend-requests.service';
import { FriendsModule } from 'src/friends/friends.module';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatGatewayService } from './chat.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      FriendRequestsModel,
      UsersModel,
      FriendsModel,
      FriendMessagesModel,
      GroupsModel,
      GroupMembersModel,
      GroupMessagesModel,
      UsersModel,
    ]),
    forwardRef(() => FriendsModule),
  ],
  providers: [
    JwtService,
    AuthService,
    ChatGateway,
    ChatGatewayService,
    FriendMessagesService,
    GroupsService,
    GroupMessagesService,
    GroupMembersService,
    FriendsService,
    UsersService,
    FriendRequestsService,
  ],
  controllers: [ChatController],
  exports: [ChatGateway, ChatGatewayService],
})
export class ChatGatewayModule {}
