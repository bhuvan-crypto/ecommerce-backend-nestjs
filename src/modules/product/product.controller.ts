import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Auth } from '../auth/auth.decorator';
import { Roles } from '../../common/decoraters/roles.decorator';
import { Role } from '../../types/user';
import { ApiQuery } from '@nestjs/swagger';
import { TrackFeature } from '../analytics/decorators/track-feature.decorator';

@Auth()
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Roles(Role.ADMIN)
  @TrackFeature({ 
      featureName: 'product', 
      action: "create_product",
      includeMetadata: true 
    })
  create(@Req() req: Express.Request, @Body() dto: CreateProductDto) {
    return this.productService.create(req.user.id, dto);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'category', required: false, example: 2 })
  @ApiQuery({
    name: 'priceMin',
    required: false,
    example: 100,
    description: 'Minimum price filter',
  })
  @ApiQuery({
    name: 'priceMax',
    required: false,
    example: 1000,
    description: 'Maximum price filter',
  })
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('category') category?: string,
    @Query('priceMin') priceMin?: number,
    @Query('priceMax') priceMax?: number,
  ) {
    return this.productService.findAll(page, limit, category, {
      min: priceMin,
      max: priceMax,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @TrackFeature({ 
      featureName: 'product', 
      action: "update_product",
      includeMetadata: true 
    })
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(id, dto);
  }
    
  @Delete(':id')
  @TrackFeature({ 
      featureName: 'product', 
      action: "delete_product",
      includeMetadata: true 
    })
  remove(@Param('id') id: string) {
    return this.productService.softDelete(id);
  }
}
