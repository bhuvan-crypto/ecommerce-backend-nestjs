import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { CartModule } from './modules/cart/cart.module';
import { OrderModule } from './modules/order/order.module';
import { User } from './modules/user/user.entity';
import { Product } from './modules/product/product.entity';
import { Cart } from './modules/cart/cart.entity';
import { Order } from './modules/order/order.entity';
import { AuthModule } from './modules/auth/auth.module';
@Module({
  imports: [
    // 🌱 Loads .env file (DATABASE_URL, PORT, etc.)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 🗄️ TypeORM Database Connection
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'ecommerce.db',
      entities: [User, Product, Cart, Order],
      synchronize: true,
      extra: {
        foreignKeys: true,
      },
    }),

    // 🧩 Feature Modules
    AuthModule,
    UserModule,
    ProductModule,
    CartModule,
    OrderModule,
  ],
})
export class AppModule {}
