import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartService } from '../cart/cart.service';
import { Order } from './order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    private readonly cartService: CartService,
  ) {}

  async create(customerId: number) {
    const result = await this.cartService.findByCustomer(customerId);

    if (!result.length) {
      throw new Error('Cart is empty');
    }

    const dataToInsert = result.map((item) => ({
      customer_id: item.customer_id,
      product_id: item.product_id,
      quantity: item.total_quantity,
      sum: item.total_sum,
    }));

    return await this.orderRepo.manager.transaction(async (manager) => {
      const order = manager.create(this.orderRepo.target, dataToInsert);
      const savedOrders = await manager.save(order);

      for (const item of result) {
        await manager.decrement(
          'Product',
          { id: item.product_id },
          'stock_quantity',
          item.total_quantity,
        );
      }

      await this.cartService.removeByCustomer(customerId);

      return savedOrders;
    });
  }

  findAll(customerId?: number) {
    if (customerId) {
      return this.orderRepo.find({
        where: { customer_id: customerId, is_deleted: false },
        relations: ['product_id'],
      });
    }
    return this.orderRepo.find({
      where: { is_deleted: false },
      relations: ['customer_id', 'product_id'],
    });
  }

  async cancel(id: number) {
    await this.orderRepo.update(id, { is_deleted: true });
  }
}
