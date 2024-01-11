import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { database } from './config';
// import { APP_INTERCEPTOR } from '@nestjs/core';

import { UploadModule } from './upload/upload.module';
import { UsersModel } from './users/models/users.model';
import { TransformResponseInterceptor } from './interceptors/transform-response.interceptor';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { FriendsModule } from './friends/friends.module';
import { FriendsModel } from './friends/models/friends.model';
import { ChatGatewayModule } from './gateways/chat/chat.module';
import { FriendMessagesModule } from './friend-messages/friend-messages.module';
import { FriendMessagesModel } from './friend-messages/models/friend-messages.model';
import { GroupsModule } from './groups/groups.module';
import { GroupsModel } from './groups/models/groups.model';
import { GroupMembersModel } from './group-members/models/group-members.model';
import { GroupMessagesModule } from './group-messages/group-messages.module';
import { GroupMessagesModel } from './group-messages/models/group-messages.model';
import { GroupMembersModule } from './group-members/group-members.module';
import { FriendRequestsModule } from './friend-requests/friend-requests.module';
import { FriendRequestsModel } from './friend-requests/models/friend-requests.model';

// 数据库配置
const databaseConfig = {
  ...database,
  models: [
    UsersModel,
    FriendsModel,
    FriendRequestsModel,
    FriendMessagesModel,
    GroupsModel,
    GroupMembersModel,
    GroupMessagesModel,
  ],
};

const databaseModule = SequelizeModule.forRoot(databaseConfig);

@Module({
  imports: [
    UsersModule,
    databaseModule,
    UploadModule,
    AuthModule,
    FriendsModule,
    ChatGatewayModule,
    FriendMessagesModule,
    GroupsModule,
    GroupMessagesModule,
    GroupMembersModule,
    FriendRequestsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
