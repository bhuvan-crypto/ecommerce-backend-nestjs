import { Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { Roles } from '../../common/decoraters/roles.decorator';
import { Role } from '../../types/user';

import { Auth } from '../auth/auth.decorator';
import { OrderService } from './order.service';
import { TrackFeature } from '../analytics/decorators/track-feature.decorator';

@Auth()
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post()
  @Roles(Role.CUSTOMER)
  @TrackFeature({
    featureName: 'order',
    action: "order_placed",
    includeMetadata: true
  })
  create(@Req() req: Request) {
    return this.orderService.create(String(req.user['id']));
  }

  @Get()
  findAll(@Req() req: Request) {
    if (req.user['role'] === Role.CUSTOMER) {
      return this.orderService.findAll(String(req.user['id']));
    }
    return this.orderService.findAll();
  }

  @Delete(':id')
  @TrackFeature({
    featureName: 'order',
    action: "order_cancelled",
    includeMetadata: true
  })
  cancel(@Param('id') id: string) {
    return this.orderService.cancel(id);
  }
}
