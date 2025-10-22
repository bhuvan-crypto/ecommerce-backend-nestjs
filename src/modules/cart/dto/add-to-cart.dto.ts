import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty({
    description: 'Unique ID of the customer adding the product to the cart',
    example: 12,
  })
  @IsNumber()
  customer_id: number;

  @ApiProperty({
    description: 'Unique ID of the product to add to the cart',
    example: 101,
  })
  @IsNumber()
  product_id: number;

  @ApiProperty({ description: 'Quantity to add', example: 2, default: 1 })
  @IsNumber()
  @IsOptional()
  quantity?: number = 1;
}
