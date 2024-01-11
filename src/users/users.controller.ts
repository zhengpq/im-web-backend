import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Res,
} from '@nestjs/common';
import { Public } from 'src/decorators/public';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserInfoDto } from './dto/update-user.dto';
import { SearchUserDto } from './dto/search-user.dto';

@Controller('/api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Public()
  @Post('/create')
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const user = await this.usersService.create(createUserDto);
    const access_token = await this.authService.login(user);
    res.cookie('access_token', access_token, {
      httpOnly: true,
      maxAge: 3 * 86400000,
    });
    res.send({
      statusCode: 201,
      data: user
        ? {
            access_token,
            ...user,
          }
        : null,
    });
  }

  @Post('/update')
  async updateUserInfo(@Body() updateUserInfoDto: UpdateUserInfoDto) {
    return this.usersService.updateUserInfo(updateUserInfoDto);
  }

  @Public()
  @Get('/username/:username')
  findByUsername(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  @Get('/search/:key')
  searchUser(@Param('key') key: string, @Query() searchUserDto: SearchUserDto) {
    return this.usersService.searchUser(key, searchUserDto);
  }

  @Get('/id/:id')
  findById(@Param('id') id: string) {
    return this.usersService.findById({
      id,
    });
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
