import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { checkPassword } from 'src/utils/password';
import { UsersModel } from 'src/users/models/users.model';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string): Promise<UsersModel> {
    const user = await this.usersService.findById({
      username,
      hasPassword: true,
    });
    return user;
  }

  async validatePassword(
    password: string,
    passwordHashed: string,
  ): Promise<boolean> {
    return checkPassword(password, passwordHashed);
  }

  async login(userId: string) {
    const payload = { userid: userId };
    return this.jwtService.sign(payload);
  }
}
