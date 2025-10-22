import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrivateUserController } from './private-user.controller';
import { PublicUserController } from './public-user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // Register User entity in TypeORM
  ],
  controllers: [PublicUserController, PrivateUserController], // Routes (HTTP endpoints)
  providers: [UserService], // Business logic
  exports: [UserService], // Export service so other modules (e.g., Auth) can use it
})
export class UserModule {}
