
  import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
  import { Document } from 'mongoose';

  @Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
  export class Product extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ type: String })
    description: string;

    @Prop({ type: Number, required: true })
    price: number;

    @Prop({ type: Number, default: 0 })
    stock_quantity: number;

    @Prop({ type: String })
    category_id: string;

    @Prop({ type: String })
    created_by: string;

    @Prop({ type: String })
    updated_by: string;

    @Prop({ type: Boolean, default: false })
    is_deleted: boolean;
  }

  export const ProductSchema = SchemaFactory.createForClass(Product);
