import { Injectable, UnauthorizedException } from '@nestjs/common';
import { USER_MESSAGES } from '../constants/message';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/users/hash.service';
import { UserService } from 'src/users/users.service';
import { UserDocument } from 'src/users/schema/user.schema';
export interface JwtUser {
  userId: string;
  username: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) {}


async validateUser(username: string, password: string): Promise<UserDocument | null> {
  try {
    const { user } = await this.usersService.getUserByUsername(username); 
    if (user && await this.hashService.comparePassword(password, user.password)) {
      return user;
    }
    return null;
  } catch (error) {
    throw new UnauthorizedException(USER_MESSAGES.AUTH_ERROR);
  }
}


async login(username: string, password: string) {
  try {
    const user = await this.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException(USER_MESSAGES.AUTH_ERROR);
    }

    const payload = { sub: user._id, username: user.username, roles: user.roles };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        roles: user.roles,
      },
      message: USER_MESSAGES.LOGIN_SUCCESS,
    };
  } catch (error) {
    throw new UnauthorizedException(error.message || USER_MESSAGES.AUTH_ERROR);
  }
}
}