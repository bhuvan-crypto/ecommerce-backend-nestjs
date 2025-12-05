import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString, IsNumber, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

// Query DTOs
export class DateRangeQueryDto {
  @ApiProperty({
    description: 'Start date in ISO format',
    example: '2024-12-01T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    description: 'End date in ISO format',
    example: '2024-12-05T23:59:59.999Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class DailyUsageQueryDto {
  @ApiProperty({
    description: 'Number of days to retrieve',
    example: 30,
    default: 30,
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  days?: number = 30;
}

// Response DTOs
export class ActionCountDto {
  @ApiProperty({ example: 'view' })
  action: string;

  @ApiProperty({ example: 4521 })
  count: number;
}

export class FeatureUsageDto {
  @ApiProperty({ example: 'product', description: 'Feature name' })
  _id: string;

  @ApiProperty({ example: 5234, description: 'Total usage count' })
  totalCount: number;

  @ApiProperty({ 
    type: [ActionCountDto],
    description: 'Breakdown by action' 
  })
  actions: ActionCountDto[];

  @ApiProperty({ 
    example: '2024-12-05T10:45:23.000Z',
    description: 'Last time this feature was used' 
  })
  lastUsed: Date;
}

export class StatisticsDto {
  @ApiProperty({ 
    example: 15847,
    description: 'Total number of tracked events' 
  })
  totalEvents: number;

  @ApiProperty({ 
    example: 12,
    description: 'Number of unique features tracked' 
  })
  uniqueFeatures: number;

  @ApiProperty({ 
    example: 342,
    description: 'Number of unique users tracked' 
  })
  uniqueUsers: number;
}

export class OverviewResponseDto {
  @ApiProperty({ type: StatisticsDto })
  statistics: StatisticsDto;

  @ApiProperty({ 
    type: [FeatureUsageDto],
    description: 'Usage data for all features' 
  })
  features: FeatureUsageDto[];
}

export class TopUserDto {
  @ApiProperty({ 
    example: 'user_123abc',
    description: 'User ID' 
  })
  _id: string;

  @ApiProperty({ 
    example: 156,
    description: 'Number of times user used this feature' 
  })
  count: number;

  @ApiProperty({ 
    example: '2024-12-05T10:45:23.000Z',
    description: 'Last time user used this feature' 
  })
  lastUsed: Date;
}

export class ActionBreakdownDto {
  @ApiProperty({ 
    example: 'view',
    description: 'Action name' 
  })
  _id: string;

  @ApiProperty({ 
    example: 4521,
    description: 'Number of times this action was performed' 
  })
  count: number;
}

export class FeatureDetailsResponseDto {
  @ApiProperty({ 
    example: 'product',
    description: 'Feature name' 
  })
  featureName: string;

  @ApiProperty({ 
    example: 5234,
    description: 'Total usage count' 
  })
  totalCount: number;

  @ApiProperty({ 
    type: [ActionBreakdownDto],
    description: 'Usage breakdown by action' 
  })
  byAction: ActionBreakdownDto[];

  @ApiProperty({ 
    type: [TopUserDto],
    description: 'Top users of this feature' 
  })
  topUsers: TopUserDto[];
}

export class DailyUsageDto {
  @ApiProperty({ 
    example: '2024-12-01',
    description: 'Date in YYYY-MM-DD format' 
  })
  _id: string;

  @ApiProperty({ 
    example: 245,
    description: 'Usage count for this day' 
  })
  count: number;
}

export class UsageTrendQueryDto {
  @ApiProperty({
    description: 'Start date in ISO format',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    description: 'End date in ISO format',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    description: 'Time granularity',
    enum: ['hour', 'minute'],
    default: 'hour',
    required: false,
  })
  // @IsOptional()
  // @IsEnum(['hour', 'minute'])
  // granularity?: 'hour' | 'minute' = 'hour';

  @ApiProperty({
    description: 'Filter by specific action name',
    required: false,
    example: 'view'
  })
  @IsOptional()
  @IsString()
  action?: string;

  // @ApiProperty({
  //   description: 'add client time zone',
  //   required: false,
  //   example: 'Asia/Kolkata'
  // })

  // @IsOptional()
  // @IsString() // You can use @IsTimeZone() if you want strict validation
  // timezone?: string = 'UTC';
}

export class UsageTrendResponseDto {
  @ApiProperty({ example: '2024-12-05 14:30' })
  _id: string;

  @ApiProperty({ example: 42 })
  count: number;
}