import { Controller, Post, Get, Delete, Body, Param, Query } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { Auth } from '../auth/auth.decorator';
import { Roles } from '../../common/decoraters/roles.decorator';
import { Role } from '../../types/user';
import { ApiOkResponse } from '@nestjs/swagger';
import { AddToCartResponse } from './dto/add-to-cart.response';
import { TrackFeature } from '../analytics/decorators/track-feature.decorator';

@Auth()
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Post()
  @Roles(Role.CUSTOMER)
  @ApiOkResponse({
    description: "Item added to cart",
    type: AddToCartResponse,
  })
  @TrackFeature({
    featureName: 'cart',
    action: "add_to_cart",
    includeMetadata: true
  })
  add(@Body() dto: AddToCartDto) {
    return this.cartService.add(dto);
  }

  @Get(':customerId')
  getCustomerCart(@Param('customerId') customerId: string) {
    return this.cartService.findByCustomer(customerId);
  }

  @Delete(':id')
  @TrackFeature({
    featureName: 'cart',
    action: "remove_from_cart",
    includeMetadata: true
  })
  remove(@Param('id') id: string, @Query('productId') productId: string
  ) {
    return this.cartService.remove(id, productId);
  }
}
