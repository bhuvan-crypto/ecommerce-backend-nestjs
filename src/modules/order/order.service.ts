import { Injectable } from '@nestjs/common';
import { CartService } from '../cart/cart.service';
import { Order } from './order.entity';

@Injectable()
export class OrderService {
  constructor(
    private readonly cartService: CartService,
  ) {}

  async create(customerId: string) {
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

    // TODO: Implement order creation and stock decrement with Mongoose
    await this.cartService.removeByCustomer(customerId);
    return [];
  }

  findAll(customerId?: string) {
    if (customerId) {
      // TODO: Refactor to use Mongoose
      return [];
    }
  }

  async cancel(id: string) {
    // TODO: Implement cancel with Mongoose
    return;
  }
}
