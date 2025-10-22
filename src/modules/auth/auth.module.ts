import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { User } from '../user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }) as DynamicModule,
    JwtModule.register({
      secret: 'secret-key',
      signOptions: { expiresIn: '1h' },
    }) as DynamicModule,
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
