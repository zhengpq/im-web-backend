import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModel } from 'src/users/models/users.model';
import { FriendMessagesModel } from './models/friend-messages.model';
import { FriendMessagesController } from './friend-messages.controller';
import { FriendMessagesService } from './friend-messages.service';

@Module({
  imports: [SequelizeModule.forFeature([FriendMessagesModel, UsersModel])],
  controllers: [FriendMessagesController],
  providers: [FriendMessagesService],
})
export class FriendMessagesModule {}
