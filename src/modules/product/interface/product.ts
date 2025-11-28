import { PaginationResult } from "src/types/product";
import { Product } from "../product.entity";

export interface IProduct {
    findAll(page: number, limit: number): Promise<PaginationResult<Product>>;
}