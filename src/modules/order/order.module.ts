import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Product } from '../product/product.entity';
import { User } from '../user/user.entity';
import { Order } from './order.entity';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Order.name, schema: {} },
    { name: User.name, schema: {} },
    { name: Product.name, schema: {} },
  ]), CartModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
