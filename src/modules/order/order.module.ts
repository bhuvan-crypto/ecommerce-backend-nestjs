import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartModule } from '../cart/cart.module';
import { Product, ProductSchema } from '../product/product.entity';
import { ProductModule } from '../product/product.module';
import { User, UserSchema } from '../user/user.entity';
import { OrderController } from './order.controller';
import { Order, OrderSchema } from './order.entity';
import { OrderService } from './order.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema }
    ]),
    CartModule,
    ProductModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule { }