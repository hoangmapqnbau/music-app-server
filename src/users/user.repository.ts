import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findOne(userFilterQuery: FilterQuery<User>): Promise<User> {
    const foundUser = this.userModel.findOne({ email: userFilterQuery.email });
    return foundUser;
  }

  async find(usersFilterQuery: FilterQuery<User>): Promise<User[]> {
    return this.userModel.find(usersFilterQuery);
  }

  async create(user: User): Promise<User> {
    const existingUser = await this.userModel.findOne({ email: user.email });

    if (existingUser) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error:
            'This email is already registered, please try a different one.',
        },
        HttpStatus.CONFLICT,
      );
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);

    const newUser = new this.userModel({
      ...user,
      password: hashedPassword,
    });

    return await newUser.save();
  }

  async findOneAndUpdate(
    userFilterQuery: FilterQuery<User>,
    user: Partial<User>,
  ): Promise<User> {
    return this.userModel.findOneAndUpdate(userFilterQuery, user);
  }
}
