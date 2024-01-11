import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { FriendsModel } from 'src/friends/models/friends.model';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersModel } from './models/users.model';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    SequelizeModule.forFeature([UsersModel, FriendsModel]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
