import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) //
    private readonly userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { username } });
    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const payload = { username: user.username, id: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    return { access_token: token, payload };
  }
}
