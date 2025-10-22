import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Unique ID of the customer placing the order',
    example: 12,
  })
  @IsNumber()
  customer_id: number;
}
