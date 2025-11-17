import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Product } from '../product/product.entity';
import { User } from '../user/user.entity';
import { Cart } from './cart.entity';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Cart.name, schema: {} },
    { name: User.name, schema: {} },
    { name: Product.name, schema: {} },
  ])],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
