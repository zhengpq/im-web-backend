import { Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common';
import { Public } from 'src/decorators/public';
import { UsersService } from 'src/users/users.service';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req, @Res() res: Response) {
    const access_token = await this.authService.login(req.user.get().id);
    const user = await this.userService.findByUsername(req.user.get().username);
    // 将 JWT token 存储在 cookie 中
    res.cookie('access_token', access_token, {
      httpOnly: true,
      maxAge: 3 * 86400000,
    });
    res.send({
      statusCode: 201,
      data: {
        access_token,
        ...user.get(),
      },
    });
  }

  @Post('/logout')
  async logout(@Res() res: Response) {
    res.clearCookie('access_token');
    res.send({
      statusCode: 200,
      data: {
        access_token: '',
      },
    });
  }

  @Get('/profile')
  getProfile(@Request() req) {
    return this.userService.findById({
      id: req.user.userid,
      hasPassword: false,
    });
  }
}
