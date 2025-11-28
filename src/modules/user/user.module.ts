import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PrivateUserController } from './private-user.controller';
import { PublicUserController } from './public-user.controller';
import { User, UserSchema } from './user.entity';
import { UserService } from './user.service';
import { USER_REPOSITORY_TOKEN } from './interfaces/user.repository.interface';
import { MongooseUserRepository } from './repositories/mongoose.user.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // Register User schema in Mongoose
  ],
  controllers: [PublicUserController, PrivateUserController], // Routes (HTTP endpoints)
  providers: [UserService, {
    provide: USER_REPOSITORY_TOKEN, // 💡 When someone asks for the interface/token...
    useClass: MongooseUserRepository, // 💡 ...give them the Mongoose implementation.
  }], // Business logic
  exports: [UserService], // Export service so other modules (e.g., Auth) can use it
})
export class UserModule { }
