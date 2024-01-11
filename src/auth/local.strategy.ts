import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ErrorCode, errorMessage } from 'src/const/error-code';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username);
    // 校验用户是否存在
    if (!user) {
      throw new UnauthorizedException({
        errorCode: ErrorCode.AUTH_NO_USER,
        errorMessage: errorMessage[ErrorCode.AUTH_NO_USER],
      });
    }
    // 校验密码是否错误
    const isValidPassword = await this.authService.validatePassword(
      password,
      user.password,
    );
    if (!isValidPassword) {
      throw new UnauthorizedException({
        errorCode: ErrorCode.AUTH_PASSWORD_ERROR,
        errorMessage: errorMessage[ErrorCode.AUTH_PASSWORD_ERROR],
      });
    }
    return user;
  }
}
