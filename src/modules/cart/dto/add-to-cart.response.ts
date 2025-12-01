import { ApiProperty } from "@nestjs/swagger";

export class CartItemResponse {
  @ApiProperty()
  cartId: string;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  quantity: number;
}

export class AddToCartResponse {
  @ApiProperty({ default: true })
  success: boolean;

  @ApiProperty({ type: CartItemResponse })
  data: CartItemResponse;
}
