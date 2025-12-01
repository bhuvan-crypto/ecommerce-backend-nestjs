import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart } from './cart.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { CartQueryBuilder } from './cart.query.builder';
import { ProductService } from '../product/product.service';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name)
    private readonly cartModel: Model<Cart>,
    private readonly productService: ProductService
  ) { }

  async add(dto: AddToCartDto) {
    const payload = {
      customer_id: new Types.ObjectId(dto.customer_id),
      product_id: new Types.ObjectId(dto.product_id),
      quantity: dto.quantity ?? 1,
    };

    const products = await this.productService.findAll(1, [payload.product_id].length, null, null, [payload.product_id.toString()]);

    const product = products.data.find((p) => p._id.toString() === payload.product_id.toString());
    if (!product) {
      throw new Error(`Product ${payload.product_id} not found`);
    }

    // check in product its it available quantity
    if (product.stock_quantity < payload.quantity) {
      throw new Error(`Only ${product.stock_quantity} items available in stock`);
    }

    await this.productService.findByIdAndUpdate(
      dto.product_id,
      { $inc: { stock_quantity: -1 } }
    );


    const cartItem = await this.cartModel.create(payload);
    return cartItem;
  }

  findByCustomer(customer_id: string) {
    // Use ObjectId for matching inside aggregation pipeline
    const customerObjId = new Types.ObjectId(customer_id);
    const pipeline = new CartQueryBuilder(customerObjId)
      .matchActiveItems()       // Step 1: Filter
      .joinProductDetails()     // Step 2: Join
      .groupItemsAndCalculateSum() // Step 3: Aggregate
      .projectFinalResult()     // Step 4: Shape Output
      .build();

    // The CartService is cleaner and easier to read!
    return this.cartModel.aggregate(pipeline);
  }

  async remove(id: string, productId: string) {
    await Promise.all([this.cartModel.findByIdAndUpdate(id, { is_deleted: true }),
    this.productService.findByIdAndUpdate(
      productId,
      { $inc: { stock_quantity: 1 } }
    )]);
  }
  async removeByCustomer(customerId: string) {
    await this.cartModel.updateMany({ customer_id: new Types.ObjectId(customerId) }, { is_deleted: true });
  }
}
