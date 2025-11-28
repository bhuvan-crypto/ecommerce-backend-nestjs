import { PaginationResult } from "src/types/product";
import { IProduct } from "./interface/product";
import { Product } from "./product.entity";
import { ProductService } from "./product.service";


export class ProductCache implements IProduct {
    constructor(
        private readonly productService: ProductService, // Replace 'any' with actual cache client type

    ) { }

    private getRedisCacheAvailable(): boolean {
        // Implement logic to check if Redis cache is available
        return false; // Placeholder implementation
    }
    async findAll(page: number, limit: number): Promise<PaginationResult<Product>> {
        const total = 0;
        const totalPages = 0;
        if (this.getRedisCacheAvailable()) {
            return {
                data: [],
                total,
                page,
                limit,
                totalPages,
            };
        }



        return this.productService.findAll(page, limit);
    }
}