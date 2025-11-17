import { Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { Roles } from 'src/common/decoraters/roles.decorator';
import { Role } from 'src/types/user';
import { Auth } from '../auth/auth.decorator';
import { OrderService } from './order.service';

@Auth()
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Roles(Role.CUSTOMER)
  create(@Req() req: Request) {
    return this.orderService.create(String(req.user['id']));
  }

  @Get()
  findAll(@Req() req: Request) {
    console.log(req.user);
    if (req.user['role'] === Role.CUSTOMER) {
      return this.orderService.findAll(String(req.user['id']));
    }
    return this.orderService.findAll();
  }

  @Delete(':id')
  cancel(@Param('id') id: string) {
    return this.orderService.cancel(id);
  }
}
