import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FeatureAnalyticsDocument = FeatureAnalytics & Document;

@Schema({ timestamps: true })
export class FeatureAnalytics {
  @Prop({ required: true, index: true })
  featureName: string; // e.g., 'product.view', 'cart.add', 'order.create'

  @Prop({ required: true, index: true })
  action: string; // e.g., 'view', 'create', 'update', 'delete'

  @Prop({ type: String, index: true })
  userId?: string; // Optional: track per user

  @Prop({ type: Object })
  metadata?: Record<string, any>; // Additional data like productId, orderId, etc.

  @Prop({ type: Date, default: Date.now, index: true })
  timestamp: Date;

  @Prop({ type: String })
  ipAddress?: string;

  @Prop({ type: String })
  userAgent?: string;
}

export const FeatureAnalyticsSchema = SchemaFactory.createForClass(FeatureAnalytics);

// Create compound indexes for better query performance
FeatureAnalyticsSchema.index({ featureName: 1, timestamp: -1 });
FeatureAnalyticsSchema.index({ featureName: 1, action: 1, timestamp: -1 });
FeatureAnalyticsSchema.index({ userId: 1, timestamp: -1 });