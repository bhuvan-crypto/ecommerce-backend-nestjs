// 📁 src/modules/user/repositories/mongoose.user.repository.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user.entity';
import { IUserRepository, IUserCreationPayload } from '../interfaces/user.repository.interface';

@Injectable()
export class MongooseUserRepository implements IUserRepository { // ⬅️ Implements the contract
  constructor(
    // Inject the Mongoose Model (the database detail)
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async create(payload: IUserCreationPayload): Promise<User> {
    // Repository job: Persist the data exactly as given
    const createdUser = new this.userModel(payload);
    return createdUser.save();
  }

  findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async update(id: string, updateData: Partial<User>): Promise<User | null> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id).exec();
  }
}