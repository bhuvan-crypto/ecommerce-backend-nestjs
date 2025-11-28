// 📁 src/modules/cart/cart.query.builder.ts (New File)

import { Types } from "mongoose";

/**
 * CartQueryBuilder 🏗️
 * Builds the complex MongoDB aggregation pipeline fluently, step-by-step.
 */
export class CartQueryBuilder {
  private pipeline: any[] = [];
  private customerId: Types.ObjectId;

  constructor(customerId: Types.ObjectId) {
    this.customerId = customerId;
  }

  // Step 1: Match active items for the specific customer
  public matchActiveItems(): CartQueryBuilder {
    this.pipeline.push({
      $match: { customer_id: this.customerId, is_deleted: false }
    });
    return this; // ⬅️ Returns 'this' for method chaining (Fluent Interface)
  }

  // Step 2: Join the product details (lookup)
  public joinProductDetails(): CartQueryBuilder {
    this.pipeline.push(
      {
        $lookup: {
          from: 'products',
          localField: 'product_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' }, // Deconstructs the single product array
    );
    return this;
  }

  // Step 3: Group by item and calculate totals (sum)
  public groupItemsAndCalculateSum(): CartQueryBuilder {
    this.pipeline.push({
      $group: {
        _id: { customer_id: '$customer_id', product_id: '$product_id' },
        count: { $sum: 1 },
        total_quantity: { $sum: '$quantity' },
        total_sum: { $sum: { $multiply: ['$quantity', '$product.price'] } },
        product: { $first: '$product' },
        cart_ids: { $push: '$$ROOT._id' },
      },
    });
    return this;
  }

  // Step 4: Shape the final output fields (projection)
  public projectFinalResult(): CartQueryBuilder {
    this.pipeline.push({
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
        cart_ids: 1,
      },
    });
    return this;
  }

  // Final Step: Returns the constructed complex object (the array)
  public build(): any[] {
    return this.pipeline;
  }
}