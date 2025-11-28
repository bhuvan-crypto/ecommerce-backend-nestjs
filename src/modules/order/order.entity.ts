import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  customer_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product_id: Types.ObjectId;

  @Prop({ type: Number, default: 1 })
  quantity: number;

  @Prop({ type: Boolean, default: false })
  is_deleted: boolean;


  @Prop({ type: Number, default: 0 })
  sum: number;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;
}
export const OrderSchema = SchemaFactory.createForClass(Order);
