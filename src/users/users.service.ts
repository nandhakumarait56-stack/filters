import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { USER_MESSAGES } from '../constants/message';
import { HashService } from './hash.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly hashService: HashService
  ) {}

  async register(createUserDto: CreateUserDto): Promise<{ message: string; user: User }> {
    try {
      const hashedPassword = await this.hashService.hashPassword(createUserDto.password);
      const user = new this.userModel({ ...createUserDto, password: hashedPassword });
      await user.save();
      return { message: USER_MESSAGES.REGISTER_SUCCESS, user };
    } catch (error) {
      throw new BadRequestException(error.message || 'Registration failed');
    }
  }

async getUserByUsername(username: string): Promise<{ message: string; user: UserDocument }> {
  try {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) throw new NotFoundException(USER_MESSAGES.NOT_FOUND);
    return { message: USER_MESSAGES.USER_MESSAGES, user };
  } catch (error) {
    throw new NotFoundException(error.message || USER_MESSAGES.NOT_FOUND);
  }
}

async updateByUsername(username: string, updateData: Partial<User>): Promise<{ message: string }> {
  try {
    const updatedUser = await this.userModel.findOneAndUpdate({ username }, updateData, { new: true });
    if (!updatedUser) throw new NotFoundException(USER_MESSAGES.NOT_FOUND);
    return { message: USER_MESSAGES.UPDATE_SUCCESS };
  } catch (error) {
    throw new NotFoundException(error.message || USER_MESSAGES.NOT_FOUND);
  }
}

async deleteByUsername(username: string): Promise<{ message: string }> {
  try {
    const deletedUser = await this.userModel.findOneAndDelete({ username });
    if (!deletedUser) throw new NotFoundException(USER_MESSAGES.NOT_FOUND);
    return { message: USER_MESSAGES.DELETE_SUCCESS };
  } catch (error) {
    throw new NotFoundException(error.message || USER_MESSAGES.NOT_FOUND);
  }
}

}