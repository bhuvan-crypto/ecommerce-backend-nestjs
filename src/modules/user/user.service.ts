import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) { }

// in user.service.ts

 // in user.service.ts

  async create(dto: CreateUserDto): Promise<User> {
    
    // --- ADD THESE TWO LINES ---
    console.log('MODEL NAME:', this.userModel.modelName);
    console.log('SCHEMA KEYS:', Object.keys(this.userModel.schema.paths));
    // ----------------------------

    try {
      const hash = await bcrypt.hash(dto.password, 10);
      console.log('ATTEMPTING TO CREATE:', { username: dto.username, role: dto.role });

      const createdUser = await this.userModel.create({
        username: dto.username,
        role: dto.role,
        passwordHash: hash
      });

      console.log('--- SUCCESS: User was created ---', createdUser);
      return createdUser;

    } catch (error) {
      console.error('--- ERROR: FAILED TO CREATE USER ---', error);
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    await this.userModel.findByIdAndUpdate(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id);
  }
  async login(
    username: string,
    password: string,
  ): Promise<{ message: string }> {
    // 1️⃣ Find user by username
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 2️⃣ Compare passwords
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    // 3️⃣ If valid, return success message
    return { message: `Welcome back, ${user.username}!` };
  }
}
