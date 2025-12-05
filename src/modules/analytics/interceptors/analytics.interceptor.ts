import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AnalyticsService } from '../analytics.service';
import { TrackFeatureOptions, TRACK_FEATURE_KEY } from '../decorators/track-feature.decorator';

@Injectable()
export class AnalyticsInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private analyticsService: AnalyticsService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const trackOptions = this.reflector.get<TrackFeatureOptions>(
      TRACK_FEATURE_KEY,
      context.getHandler(),
    );

    if (!trackOptions) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const { featureName, action, includeMetadata } = trackOptions;

    return next.handle().pipe(
      tap(() => {
        // Track after successful execution
        const metadata: Record<string, any> = {};

        if (includeMetadata) {
          // Include relevant request data
          if (request.params && Object.keys(request.params).length > 0) {
            metadata.params = request.params;
          }
          if (request.query && Object.keys(request.query).length > 0) {
            metadata.query = request.query;
          }
          // Optionally include parts of the body (be careful with sensitive data)
          if (request.body && Object.keys(request.body).length > 0) {
            // You might want to filter sensitive fields here
            metadata.body = this.sanitizeBody(request.body);
          }
        }

        this.analyticsService.trackFeature({
          featureName,
          action,
          userId: request.user?.id || request.user?._id, // Adjust based on your auth structure
          metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
          ipAddress: request.ip,
          userAgent: request.headers['user-agent'],
        });
      }),
    );
  }

  private sanitizeBody(body: any): any {
    // Remove sensitive fields like passwords, tokens, etc.
    const sensitiveFields = ['password', 'token', 'creditCard', 'cvv'];
    const sanitized = { ...body };

    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        delete sanitized[field];
      }
    });

    return sanitized;
  }
}