import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsInterceptor } from './interceptors/analytics.interceptor';
import { FeatureAnalytics, FeatureAnalyticsSchema } from './schemas/analytics.schema';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FeatureAnalytics.name, schema: FeatureAnalyticsSchema },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [
    AnalyticsService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AnalyticsInterceptor,
    },
  ],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}