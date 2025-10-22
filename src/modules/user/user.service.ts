import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const hash = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({ ...dto, passwordHash: hash });
    return this.userRepo.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    await this.userRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.userRepo.delete(id);
  }
  async login(
    username: string,
    password: string,
  ): Promise<{ message: string }> {
    // 1️⃣ Find user by username
    const user = await this.userRepo.findOne({ where: { username } });
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
