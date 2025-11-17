import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart } from './cart.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name)
    private readonly cartModel: Model<Cart>,
  ) {}

  async add(dto: AddToCartDto) {
    const cartItem = new this.cartModel({
      customer_id: dto.customer_id,
      product_id: dto.product_id,
      quantity: dto.quantity,
    });
    return cartItem.save();
  }

  findByCustomer(customer_id: string) {
    // Mongoose equivalent: aggregate by customer_id
    return this.cartModel.aggregate([
      { $match: { customer_id, is_deleted: false } },
      {
        $lookup: {
          from: 'products',
          localField: 'product_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: { customer_id: '$customer_id', product_id: '$product_id' },
          count: { $sum: 1 },
          total_quantity: { $sum: '$quantity' },
          total_sum: { $sum: { $multiply: ['$quantity', '$product.price'] } },
          product: { $first: '$product' },
        },
      },
      {
        $project: {
          customer_id: '$_id.customer_id',
          product_id: '$_id.product_id',
          count: 1,
          total_quantity: 1,
          total_sum: 1,
          product: {
            id: '$product._id',
            name: '$product.name',
            price: '$product.price',
          },
        },
      },
    ]);
  }

  async remove(id: string) {
    await this.cartModel.findByIdAndUpdate(id, { is_deleted: true });
  }
  async removeByCustomer(customerId: string) {
    await this.cartModel.updateMany({ customer_id: customerId }, { is_deleted: true });
  }
}
