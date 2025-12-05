import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import {
  DateRangeQueryDto,
  DailyUsageQueryDto,
  OverviewResponseDto,
  FeatureUsageDto,
  FeatureDetailsResponseDto,
  DailyUsageDto,
  StatisticsDto,
  UsageTrendQueryDto,
  UsageTrendResponseDto,
} from './dto';

// Add your auth guard here
// @UseGuards(JwtAuthGuard, AdminGuard)
@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('v1/overview')
  @ApiOperation({ 
    summary: 'Get analytics overview',
    description: 'Returns overall statistics and feature usage summary for the specified date range. This endpoint provides a complete dashboard view with total events, unique features, unique users, and detailed breakdown of each feature usage.'
  })
  @ApiResponse({
    status: 200,
    description: 'Analytics overview retrieved successfully',
    type: OverviewResponseDto,
    schema: {
      example: {
        statistics: {
          totalEvents: 15847,
          uniqueFeatures: 12,
          uniqueUsers: 342
        },
        features: [
          {
            _id: 'product',
            totalCount: 5234,
            actions: [
              { action: 'view', count: 4521 },
              { action: 'list', count: 456 },
              { action: 'search', count: 257 }
            ],
            lastUsed: '2024-12-05T10:45:23.000Z'
          },
          {
            _id: 'cart',
            totalCount: 3456,
            actions: [
              { action: 'add_item', count: 2134 },
              { action: 'view', count: 892 },
              { action: 'remove_item', count: 345 },
              { action: 'checkout', count: 85 }
            ],
            lastUsed: '2024-12-05T10:42:11.000Z'
          },
          {
            _id: 'order',
            totalCount: 2187,
            actions: [
              { action: 'create', count: 876 },
              { action: 'view', count: 987 },
              { action: 'list', count: 324 }
            ],
            lastUsed: '2024-12-05T10:38:45.000Z'
          }
        ]
      }
    }
  })
  async getOverview(@Query() query: DateRangeQueryDto): Promise<OverviewResponseDto> {
    const start = query.startDate ? new Date(query.startDate) : undefined;
    const end = query.endDate ? new Date(query.endDate) : undefined;

    const [statistics, featuresUsage] = await Promise.all([
      this.analyticsService.getStatistics(start, end),
      this.analyticsService.getAllFeaturesUsage(start, end),
    ]);

    return {
      statistics,
      features: featuresUsage,
    };
  }

  @Get('features')
  @ApiOperation({ 
    summary: 'Get all features usage',
    description: 'Returns usage statistics for all tracked features with action breakdown. Useful for displaying a features comparison table or chart.'
  })
  @ApiResponse({
    status: 200,
    description: 'Features usage retrieved successfully',
    type: [FeatureUsageDto],
    schema: {
      example: [
        {
          _id: 'product',
          totalCount: 5234,
          actions: [
            { action: 'view', count: 4521 },
            { action: 'list', count: 456 },
            { action: 'search', count: 257 }
          ],
          lastUsed: '2024-12-05T10:45:23.000Z'
        },
        {
          _id: 'cart',
          totalCount: 3456,
          actions: [
            { action: 'add_item', count: 2134 },
            { action: 'view', count: 892 },
            { action: 'remove_item', count: 345 }
          ],
          lastUsed: '2024-12-05T10:42:11.000Z'
        },
        {
          _id: 'order',
          totalCount: 2187,
          actions: [
            { action: 'create', count: 876 },
            { action: 'view', count: 987 }
          ],
          lastUsed: '2024-12-05T10:38:45.000Z'
        }
      ]
    }
  })
  async getAllFeaturesUsage(@Query() query: DateRangeQueryDto): Promise<FeatureUsageDto[]> {
    const start = query.startDate ? new Date(query.startDate) : undefined;
    const end = query.endDate ? new Date(query.endDate) : undefined;

    return this.analyticsService.getAllFeaturesUsage(start, end);
  }

  @Get('features/:featureName')
  @ApiOperation({ 
    summary: 'Get specific feature details',
    description: 'Returns detailed analytics for a specific feature including total count, action breakdown, and top users who use this feature the most.'
  })
  @ApiParam({ 
    name: 'featureName', 
    type: String,
    description: 'Name of the feature (e.g., product, cart, order, user, payment, wishlist)',
    example: 'product',
    examples: {
      product: { value: 'product' },
      cart: { value: 'cart' },
      order: { value: 'order' },
      payment: { value: 'payment' }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Feature details retrieved successfully',
    type: FeatureDetailsResponseDto,
    schema: {
      example: {
        featureName: 'product',
        totalCount: 5234,
        byAction: [
          { _id: 'view', count: 4521 },
          { _id: 'list', count: 456 },
          { _id: 'search', count: 257 }
        ],
        topUsers: [
          {
            _id: 'user_123abc',
            count: 156,
            lastUsed: '2024-12-05T10:45:23.000Z'
          },
          {
            _id: 'user_456def',
            count: 134,
            lastUsed: '2024-12-05T09:32:11.000Z'
          },
          {
            _id: 'user_789ghi',
            count: 98,
            lastUsed: '2024-12-05T08:15:45.000Z'
          }
        ]
      }
    }
  })
  async getFeatureDetails(
    @Param('featureName') featureName: string,
    @Query() query: DateRangeQueryDto,
  ): Promise<FeatureDetailsResponseDto> {
    const start = query.startDate ? new Date(query.startDate) : undefined;
    const end = query.endDate ? new Date(query.endDate) : undefined;

    const [totalCount, byAction, topUsers] = await Promise.all([
      this.analyticsService.getFeatureUsageCount(featureName, start, end),
      this.analyticsService.getFeatureUsageByAction(featureName, start, end),
      this.analyticsService.getTopUsers(featureName),
    ]);

    return {
      featureName,
      totalCount,
      byAction,
      topUsers,
    };
  }

  @Get('features/:featureName/daily')
  @ApiOperation({ 
    summary: 'Get daily usage chart data',
    description: 'Returns daily usage statistics for a feature over the specified number of days. Perfect for creating line charts or time-series visualizations.'
  })
  @ApiParam({ 
    name: 'featureName', 
    type: String,
    description: 'Name of the feature to get daily usage for',
    example: 'product'
  })
  @ApiResponse({
    status: 200,
    description: 'Daily usage data retrieved successfully',
    type: [DailyUsageDto],
    schema: {
      example: [
        { _id: '2024-11-05', count: 198 },
        { _id: '2024-11-06', count: 215 },
        { _id: '2024-11-07', count: 189 },
        { _id: '2024-11-08', count: 234 },
        { _id: '2024-11-09', count: 201 },
        { _id: '2024-11-10', count: 178 },
        { _id: '2024-11-11', count: 156 },
        { _id: '2024-11-12', count: 167 },
        { _id: '2024-11-13', count: 223 },
        { _id: '2024-11-14', count: 245 },
        { _id: '2024-11-15', count: 267 },
        { _id: '2024-11-16', count: 234 },
        { _id: '2024-11-17', count: 198 },
        { _id: '2024-11-18', count: 289 },
        { _id: '2024-11-19', count: 301 },
        { _id: '2024-11-20', count: 278 },
        { _id: '2024-11-21', count: 256 },
        { _id: '2024-11-22', count: 234 },
        { _id: '2024-11-23', count: 267 },
        { _id: '2024-11-24', count: 289 },
        { _id: '2024-11-25', count: 312 },
        { _id: '2024-11-26', count: 334 },
        { _id: '2024-11-27', count: 298 },
        { _id: '2024-11-28', count: 276 },
        { _id: '2024-11-29', count: 301 },
        { _id: '2024-11-30', count: 289 },
        { _id: '2024-12-01', count: 245 },
        { _id: '2024-12-02', count: 312 },
        { _id: '2024-12-03', count: 289 },
        { _id: '2024-12-04', count: 356 },
        { _id: '2024-12-05', count: 401 }
      ]
    }
  })
  async getDailyUsage(
    @Param('featureName') featureName: string,
    @Query() query: DailyUsageQueryDto,
  ): Promise<DailyUsageDto[]> {
    return this.analyticsService.getDailyUsage(featureName, query.days);
  }

  @Get('statistics')
  @ApiOperation({ 
    summary: 'Get overall statistics',
    description: 'Returns high-level statistics about total events tracked, number of unique features, and number of unique users for the specified date range.'
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    type: StatisticsDto,
    schema: {
      example: {
        totalEvents: 15847,
        uniqueFeatures: 12,
        uniqueUsers: 342
      }
    }
  })
  async getStatistics(@Query() query: DateRangeQueryDto): Promise<StatisticsDto> {
    const start = query.startDate ? new Date(query.startDate) : undefined;
    const end = query.endDate ? new Date(query.endDate) : undefined;

    return this.analyticsService.getStatistics(start, end);
  }


  @Get('features/:featureName/trend')
  @ApiOperation({ 
    summary: 'Get precise usage trend',
    description: 'Returns usage data grouped by hour or minute. Can be filtered by a specific action (e.g., "view", "create").'
  })
  @ApiParam({ 
    name: 'featureName', 
    example: 'product' 
  })
  @ApiResponse({
    status: 200,
    type: [UsageTrendResponseDto],
  })
  async getUsageTrend(
    @Param('featureName') featureName: string,
    @Query() query: UsageTrendQueryDto,
  ): Promise<UsageTrendResponseDto[]> {
    const start = query.startDate ? new Date(query.startDate) : undefined;
    const end = query.endDate ? new Date(query.endDate) : undefined;

    // Default to last 24 hours if no date provided for granular query
    const effectiveStart = start || new Date(new Date().getTime() - 24 * 60 * 60 * 1000);

    return this.analyticsService.getUsageTrend(
      featureName, 
      effectiveStart, 
      end, 
      query.action,
    );
  }
}