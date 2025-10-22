import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Product } from '../product/product.entity';
import { User } from '../user/user.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'customer_id' })
  customer_id: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product_id: number;

  @Column({ default: false })
  is_deleted: boolean;

  @Column({ default: 1 })
  quantity: number;

  @Column({ default: 0 })
  sum: number;

  @CreateDateColumn()
  created_at: Date;
}
