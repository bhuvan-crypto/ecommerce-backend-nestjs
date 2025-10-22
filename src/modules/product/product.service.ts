import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';
import { PaginationResult } from 'src/types/product';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async create(userID: number, dto: CreateProductDto): Promise<Product> {
    const product = this.productRepo.create({
      ...dto,
      created_by: userID,
    });
    return this.productRepo.save(product);
  }

  async findAll(
    page = 1,
    limit = 10,
    category?: number | null,
    price?: { min?: number; max?: number } | null,
  ): Promise<PaginationResult<Product>> {
    const where: FindOptionsWhere<Product> = { is_deleted: false };

    if (category) {
      where.category_id = category;
    }

    if (price?.min !== undefined && price?.max !== undefined) {
      where.price = Between(price.min, price.max);
    }

    const [data, total] = await this.productRepo.findAndCount({
      where,
      relations: ['created_by', 'updated_by'],
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id, is_deleted: false },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    await this.productRepo.update(id, dto);
    return this.findOne(id);
  }

  async softDelete(id: number): Promise<void> {
    await this.productRepo.update(id, { is_deleted: true });
  }
}
