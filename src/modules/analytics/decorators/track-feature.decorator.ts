import { SetMetadata } from '@nestjs/common';

export const TRACK_FEATURE_KEY = 'track_feature';

export interface TrackFeatureOptions {
  featureName: "user" | "cart"| "order" | "product";
  action: "login_user" | "create_user" | "add_to_cart" | "remove_from_cart" | "order_placed" | "order_cancelled" | "create_product" | "update_product" | "delete_product";
  includeMetadata?: boolean; // Whether to include request body/params as metadata
}

export const TrackFeature = (options: TrackFeatureOptions) =>
  SetMetadata(TRACK_FEATURE_KEY, options);