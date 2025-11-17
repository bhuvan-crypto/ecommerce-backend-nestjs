import { Controller, Post, Get, Delete, Body, Param } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { Auth } from '../auth/auth.decorator';
import { Roles } from '../../common/decoraters/roles.decorator';
import { Role } from '../../types/user';

@Auth()
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @Roles(Role.CUSTOMER)
  add(@Body() dto: AddToCartDto) {
    return this.cartService.add(dto);
  }

  @Get(':customerId')
  getCustomerCart(@Param('customerId') customerId: string) {
    return this.cartService.findByCustomer(customerId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(id);
  }
}
