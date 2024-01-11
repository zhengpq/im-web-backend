import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GroupMessagesModel } from 'src/group-messages/models/group-messages.model';
import { GroupMembersService } from 'src/group-members/group-members.service';
import { UsersService } from 'src/users/users.service';
import { UsersModel } from 'src/users/models/users.model';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { GroupMessagesModule } from 'src/group-messages/group-messages.module';
import { FriendsModel } from 'src/friends/models/friends.model';
import { GroupMembersModel } from '../group-members/models/group-members.model';
import { GroupsModel } from './models/groups.model';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      GroupsModel,
      GroupMembersModel,
      GroupMessagesModel,
      UsersModel,
      FriendsModel,
    ]),
    forwardRef(() => GroupMessagesModule),
  ],
  controllers: [GroupsController],
  providers: [
    JwtService,
    AuthService,
    GroupsService,
    GroupMembersService,
    UsersService,
  ],
  exports: [GroupsService],
})
export class GroupsModule {}
