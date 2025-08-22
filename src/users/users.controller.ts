import { Body, Controller, Get, Param, Post, Put, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
interface JwtUser { username: string; roles: string; }

export const GetUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@GetUser() user: JwtUser) {
    return this.userService.getUserByUsername(user.username);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update')
  async update(@GetUser() user: JwtUser, @Body() updateData: UpdateUserDto) {
    return this.userService.updateByUsername(user.username, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  async delete(@GetUser() user: JwtUser) {
    return this.userService.deleteByUsername(user.username);
  }
}
