import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Product } from '../product/product.entity';
import { User } from '../user/user.entity';
import { Order } from './order.entity';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User, Product]), CartModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
