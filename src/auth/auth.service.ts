import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { UsersService } from '../users/users.service';
import { User } from 'src/users/schemas/user.schema';
import { GetUserDTO } from './dtos/get-user-dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.getUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = {
      username: user.email,
      sub: user.userId,
    };

    const userResponse = new GetUserDTO();
    userResponse.email = user.email;
    userResponse.fullName = user.fullName;
    userResponse.userId = user.userId;

    return {
      access_token: this.jwtService.sign(payload),
      userResponse,
    };
  }
}
