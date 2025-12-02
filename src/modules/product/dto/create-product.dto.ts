import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'Name of the product', example: 'iPhone 15' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Description of the product',
    example: 'Latest iPhone model',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Price of the product', example: 999.99 })
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Stock quantity available', example: 50 })
  @IsNumber()
  stock_quantity: number;

  @ApiPropertyOptional({
    description: 'Category ID the product belongs to',
    example: 1,
  })
  @IsString()
  @IsOptional()
  category_id?: string;
}
