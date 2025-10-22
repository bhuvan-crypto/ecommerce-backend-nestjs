import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,
  ) {}

  add(dto: AddToCartDto) {
    const cartItem = this.cartRepo.create({
      customer_id: { id: dto.customer_id },
      product_id: { id: dto.product_id },
      quantity: dto.quantity,
    });

    return this.cartRepo.save(cartItem);
  }

  findByCustomer(customer_id: number): Promise<
    {
      customer_id: number;
      product: {
        id: number;
        name: string;
        price: number;
      };
      product_id: number;
      count: number;
      total_quantity: number;
      total_sum: number;
    }[]
  > {
    return this.cartRepo
      .createQueryBuilder('cart')
      .select('cart.customer_id', 'customer_id')
      .addSelect(
        'JSON_OBJECT(' +
          "'id', product.id, " +
          "'name', product.name, " +
          "'price', product.price" +
          ')',
        'product',
      )
      .addSelect('cart.product_id', 'product_id')
      .addSelect('COUNT(cart.id)', 'count')
      .addSelect('SUM(cart.quantity)', 'total_quantity')
      .addSelect('SUM(cart.quantity * product.price)', 'total_sum')
      .innerJoin('cart.product_id', 'product')
      .where('cart.customer_id = :customerId', { customerId: customer_id })
      .andWhere('cart.is_deleted = false')
      .groupBy('cart.customer_id')
      .addGroupBy('cart.product_id')
      .getRawMany();
  }

  async remove(id: number) {
    await this.cartRepo.update(id, { is_deleted: true });
  }
  async removeByCustomer(customerId: number) {
    await this.cartRepo.update(
      {
        customer_id: {
          id: customerId,
        },
      },
      { is_deleted: true },
    );
  }
}
