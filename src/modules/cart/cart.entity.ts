import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../product/product.entity';
import { User } from '../user/user.entity';

@Entity('cart')
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'customer_id' })
  customer_id: User;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product_id: Product;

  @Column({ default: 1 })
  quantity: number;

  @Column({ default: false })
  is_deleted: boolean;
}
