import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Product, ProductSchema } from '../product/product.entity';
import { User, UserSchema } from '../user/user.entity';
import { Cart, CartSchema } from './cart.entity';
import { ProductService } from '../product/product.service';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Cart.name, schema: CartSchema },
    { name: User.name, schema: UserSchema },
    { name: Product.name, schema: ProductSchema },
  ]), ProductModule],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule { }
