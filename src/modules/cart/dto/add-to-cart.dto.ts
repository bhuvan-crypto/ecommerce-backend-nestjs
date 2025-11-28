import { IsNumber,IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty({
    description: 'Unique ID of the customer adding the product to the cart',
    example: "691c2d9d6a3f3426780311b5",
  })
  @IsString()
  customer_id: string;

  @ApiProperty({
    description: 'Unique ID of the product to add to the cart',
    example: "691c2ee1c344217a1cef3d49",
  })
  @IsString()
  product_id: string;

  @ApiProperty({ description: 'Quantity to add', example: 2, default: 1 })
  @IsNumber()
  @IsOptional()
  quantity?: number = 1;
}
