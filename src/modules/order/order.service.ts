import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { CartService } from '../cart/cart.service';
import { ProductService } from '../product/product.service';
import { Order } from './order.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name)

    private readonly orderModel: Model<Order>,
    private readonly cartService: CartService,
    private readonly productService: ProductService

  ) { }

  async create(customerId: string) {
    const currentCart = await this.cartService.findByCustomer(customerId);


    const productIds = currentCart.map((item) => item.product_id);
    const products = await this.productService.findAll(1, productIds.length, null, null, productIds);

    for (const item of currentCart) {
      const product = products.data.find((p) => p._id.toString() === item.product_id.toString());
      if (!product || product.stock_quantity < item.total_quantity) {
        throw new Error(`Product ${item.product_id} is out of stock`);
      }
    }


    if (!currentCart.length) {
      throw new Error('Cart is empty');
    }


    const dataToInsert = currentCart.map((item) => ({
      customer_id:  new Types.ObjectId(item.customer_id),
      product_id:  new Types.ObjectId(item.product_id),
      quantity: item.total_quantity,
      sum: item.total_sum,
    }));

   const orders= await this.orderModel.insertMany(dataToInsert);

    for (const item of currentCart) {
      const product = products.data.find((p) => p._id.toString() === item.product_id.toString());
      if (product) {
        product.stock_quantity -= item.total_quantity;
        await this.productService.update(product._id.toString(), { stock_quantity: product.stock_quantity });
      }
    }


    await this.cartService.removeByCustomer(customerId);

    // const paymentProcessor = this.paymentService.getPaymentProcessor('Stripe');
    // const paymentSuccess = await paymentProcessor.processPayment(100, 'USD');
    // if (!paymentSuccess) {
    //   throw new Error('Payment failed');
    // }
    // TODO: Implement order creation and stock decrement with Mongoose
    return orders;
  }

  async findAll(customerId?: string) {
  const query: any = { is_deleted: false };

  if (customerId) {
    query.customer_id = new Types.ObjectId(customerId);
  }

  const orders = await this.orderModel
    .find(query)
    .populate('product_id')
    .lean();

  // rename product_id → product
  const mapped = orders.map((o) => ({
    ...o,
    product: o.product_id, // new field
    product_id: undefined, // remove old
  }));

  return mapped;
}


  async cancel(id: string) {
    await this.orderModel.findByIdAndUpdate(id, { is_deleted: true });
  }
}
