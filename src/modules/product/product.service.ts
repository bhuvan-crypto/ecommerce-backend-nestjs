import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';
import { PaginationResult } from '../../types/product';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
  ) {}

  async create(userID: number, dto: CreateProductDto): Promise<Product> {
    const product = new this.productModel({
      ...dto,
      created_by: userID,
    });
    return product.save();
  }

  async findAll(
    page = 1,
    limit = 10,
    category?: string | null,
    price?: { min?: number; max?: number } | null,
  ): Promise<PaginationResult<Product>> {
    const filter: any = { is_deleted: false };
    if (category) {
      filter.category_id = category;
    }
    if (price?.min !== undefined && price?.max !== undefined) {
      filter.price = { $gte: price.min, $lte: price.max };
    }
    const data = await this.productModel
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    const total = await this.productModel.countDocuments(filter);
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product || product.is_deleted) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    await this.productModel.findByIdAndUpdate(id, dto);
    return this.findOne(id);
  }

  async softDelete(id: string): Promise<void> {
    await this.productModel.findByIdAndUpdate(id, { is_deleted: true });
  }
}
