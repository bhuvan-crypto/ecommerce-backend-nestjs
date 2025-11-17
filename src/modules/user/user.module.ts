import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PrivateUserController } from './private-user.controller';
import { PublicUserController } from './public-user.controller';
import { User, UserSchema } from './user.entity';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // Register User schema in Mongoose
  ],
  controllers: [PublicUserController, PrivateUserController], // Routes (HTTP endpoints)
  providers: [UserService], // Business logic
  exports: [UserService], // Export service so other modules (e.g., Auth) can use it
})
export class UserModule {}
