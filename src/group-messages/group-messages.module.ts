import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GroupsModel } from 'src/groups/models/groups.model';
import { GroupsModule } from 'src/groups/groups.module';
import { GroupMembersModel } from 'src/group-members/models/group-members.model';
import { GroupMessagesModel } from './models/group-messages.model';
import { GroupMessagesController } from './group-messages.controller';
import { GroupMessagesService } from './group-messages.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      GroupMessagesModel,
      GroupsModel,
      GroupMembersModel,
    ]),
    forwardRef(() => GroupsModule),
  ],
  controllers: [GroupMessagesController],
  providers: [GroupMessagesService],
  exports: [GroupMessagesService],
})
export class GroupMessagesModule {}
