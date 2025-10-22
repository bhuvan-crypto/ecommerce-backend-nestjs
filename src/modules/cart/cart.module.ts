import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Product } from '../product/product.entity';
import { User } from '../user/user.entity';
import { Cart } from './cart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, User, Product])],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
