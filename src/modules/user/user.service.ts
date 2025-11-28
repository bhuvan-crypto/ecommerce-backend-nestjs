// 📁 src/modules/user/user.service.ts (Final Refactored Code)

import {
  Inject, // ⬅️ Necessary for custom token injection
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto, LoginDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

// 🏛️ NEW IMPORTS: The Abstraction (Interface) and the Token
import { LoggerService } from '../../common/logger/logger.service';
import { USER_REPOSITORY_TOKEN } from './interfaces/user.repository.interface';
import type { IUserRepository } from './interfaces/user.repository.interface';

@Injectable()
export class UserService {
  private readonly context = UserService.name; 

  constructor(
    // 1️⃣ Inject the Interface (Abstraction) instead of the Mongoose Model (Detail)
    @Inject(USER_REPOSITORY_TOKEN) 
    private readonly userRepository: IUserRepository, // ⬅️ All data access happens here
    
    private readonly logger: LoggerService,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    this.logger.log(`Attempting to create user: ${dto.username}`, this.context);
    try {
      // 🧱 Business Logic: Hash password before passing to repository
      const hash = await bcrypt.hash(dto.password, 10);
      
      const createdUser = await this.userRepository.create({ 
        username: dto.username,
        role: dto.role,
        passwordHash: hash
      });

      this.logger.log(`SUCCESS: User ${createdUser.username} was created.`, this.context);
      return createdUser;

    } catch (error) {
      this.logger.error('FAILED TO CREATE USER due to business error.', error.stack, this.context); 
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll(); // ⬅️ Repository call
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne(id); // ⬅️ Repository call
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    // Note: Password update logic would need to be added here for full business rules
    const updatedUser = await this.userRepository.update(id, dto); // ⬅️ Repository call
    if (!updatedUser) throw new NotFoundException('User not found for update');
    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.remove(id); // ⬅️ Repository call
  }

  async login(username: string, password: string): Promise<{ message: string }> {
    // 1️⃣ Find user by username using the Repository
    const user = await this.userRepository.findByUsername(username); // ⬅️ Repository call
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 2️⃣ Business Logic: Compare passwords (this stays in the service/business layer)
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    return { message: `Welcome back, ${user.username}!` };
  }
}