import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { User } from './schemas/user.schema';
import { UserRepository } from './user.repository';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UserRepository) {}

  async getUsers(): Promise<User[]> {
    return this.usersRepository.find({});
  }

  async getUserById(userId: string): Promise<User> {
    return this.usersRepository.findOne({ userId });
  }

  async createUser(
    email: string,
    password: string,
    passWordHint: string,
    fullName: string,
  ): Promise<User> {
    return this.usersRepository.create({
      userId: uuidv4(),
      email,
      password,
      passWordHint,
      fullName,
    });
  }

  async updateUser(userId: string, userUpdates: UpdateUserDto): Promise<User> {
    return this.usersRepository.findOneAndUpdate({userId}, userUpdates)
  }
}
