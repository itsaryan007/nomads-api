import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    try {
      return await this.userModel.create(createUserDto);
    } catch (err) {
      if (err.code === 11000) {
        throw new BadRequestException('User already exists');
      }
      throw err;
    }
  }

  async findByEmailAndUpdate(
    email: string,
    updateData: Partial<User>,
  ): Promise<UserResponseDto> {
    const user = await this.userModel
      .findOneAndUpdate({ email }, updateData, { new: true })
      .lean();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return new UserResponseDto(user);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userModel.find().lean();
    return users.map((user) => new UserResponseDto(user));
  }

  async update(id: string, updateData: Partial<User>): Promise<UserDocument> {
    const user = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async findOne(id: string): Promise<UserResponseDto | null> {
    const user = await this.userModel.findById(id).lean();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return new UserResponseDto(user);
  }

  async delete(id: string): Promise<UserDocument | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async updateVerificationCode(
    email: string,
    code: string,
  ): Promise<UserDocument> {
    const user = await this.userModel
      .findOneAndUpdate(
        { email },
        { verificationCode: code },
        { new: true, upsert: true },
      )
      .exec();

    return user;
  }
}
