import { Body, Controller, Get, Param, Patch, Post, UseGuards, Request } from '@nestjs/common';

import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { IsHasCookieGuard } from './../guards/is-has-cookie.guard';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) {}

  
  @Get('me')
  async getMe(@Request() req): Promise<User> {
    const userId = req.user.userId;
    return this.usersService.getUserById(userId);
  }

  @Get(':userId')
  async getUser(@Param('userId') userId: string): Promise<User> {
    return this.usersService.getUserById(userId);
  }


  @Get()
  @UseGuards(IsHasCookieGuard)
  async getUsers(): Promise<User[]> {
    return this.usersService.getUsers();
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    const { email, fullName, passWordHint, password } = createUserDto;
    return this.usersService.createUser(
      email,
      password,
      passWordHint,
      fullName,
    );
  }

  @Patch(':userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUser(userId, updateUserDto);
  }
}
