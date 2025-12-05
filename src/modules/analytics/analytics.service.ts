import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FeatureAnalytics, FeatureAnalyticsDocument } from './schemas/analytics.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(FeatureAnalytics.name)
    private analyticsModel: Model<FeatureAnalyticsDocument>,
  ) {}

  // Track a feature usage
  async trackFeature(data: {
    featureName: string;
    action: string;
    userId?: string;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
  }) {
    try {
      const analytics = new this.analyticsModel(data);
      await analytics.save();
    } catch (error) {
      // Log error but don't block the main operation
      console.error('Analytics tracking error:', error);
    }
  }

  // Get total count for a specific feature
  async getFeatureUsageCount(
    featureName: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<number> {
    const query: any = { featureName };
    
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = startDate;
      if (endDate) query.timestamp.$lte = endDate;
    }

    return this.analyticsModel.countDocuments(query);
  }

  // Get usage count by action
  async getFeatureUsageByAction(
    featureName: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    const match: any = { featureName };
    
    if (startDate || endDate) {
      match.timestamp = {};
      if (startDate) match.timestamp.$gte = startDate;
      if (endDate) match.timestamp.$lte = endDate;
    }

    return this.analyticsModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);
  }

  // Get all features usage summary
  async getAllFeaturesUsage(startDate?: Date, endDate?: Date) {
    const match: any = {};
    
    if (startDate || endDate) {
      match.timestamp = {};
      if (startDate) match.timestamp.$gte = startDate;
      if (endDate) match.timestamp.$lte = endDate;
    }

    return this.analyticsModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            feature: '$featureName',
            action: '$action',
          },
          count: { $sum: 1 },
          lastUsed: { $max: '$timestamp' },
        },
      },
      {
        $group: {
          _id: '$_id.feature',
          totalCount: { $sum: '$count' },
          actions: {
            $push: {
              action: '$_id.action',
              count: '$count',
            },
          },
          lastUsed: { $max: '$lastUsed' },
        },
      },
      { $sort: { totalCount: -1 } },
    ]);
  }

  // Get daily usage for a feature (for charts)
  async getDailyUsage(
    featureName: string,
    days: number = 30,
  ) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.analyticsModel.aggregate([
      {
        $match: {
          featureName,
          timestamp: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }

  // Get top users of a feature
  async getTopUsers(featureName: string, limit: number = 10) {
    return this.analyticsModel.aggregate([
      { $match: { featureName, userId: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: '$userId',
          count: { $sum: 1 },
          lastUsed: { $max: '$timestamp' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: limit },
    ]);
  }

  // Get usage statistics
  async getStatistics(startDate?: Date, endDate?: Date) {
    const match: any = {};
    
    if (startDate || endDate) {
      match.timestamp = {};
      if (startDate) match.timestamp.$gte = startDate;
      if (endDate) match.timestamp.$lte = endDate;
    }

    const [totalEvents, uniqueFeatures, uniqueUsers] = await Promise.all([
      this.analyticsModel.countDocuments(match),
      this.analyticsModel.distinct('featureName', match),
      this.analyticsModel.distinct('userId', { ...match, userId: { $ne: null } }),
    ]);

    return {
      totalEvents,
      uniqueFeatures: uniqueFeatures.length,
      uniqueUsers: uniqueUsers.length,
    };
  }


  async getUsageTrend(
    featureName: string,
    startDate?: Date,
    endDate?: Date,
    action?: string,
  ) {
    const match: any = { featureName };

    // Filter by action if provided
    if (action) {
      match.action = action;
    }

    // Date filtering
    if (startDate || endDate) {
      match.timestamp = {};
      if (startDate) match.timestamp.$gte = startDate;
      if (endDate) match.timestamp.$lte = endDate;
    }

    // Define MongoDB date format based on granularity
    // Hour: "2024-12-05 14:00"
    // Minute: "2024-12-05 14:35"

    return this.analyticsModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            $dateToString: {  date: '$timestamp' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }, // Sort chronologically
    ]);
  }
}