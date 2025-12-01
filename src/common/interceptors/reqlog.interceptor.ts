import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap, catchError, throwError } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const { method, url, body, query, params } = request;

    const start = Date.now();

    console.log('--- Incoming Request ---');
    console.log('Method:', method);
    console.log('URL:', url);
    console.log('Params:', params);
    console.log('Query:', query);
    console.log('Body:', body);

    return next.handle().pipe(
      tap((data) => {
        // SUCCESS
        console.log('--- Outgoing Response ---');
        console.log('Status:', response.statusCode);
        // console.log('Response:', data);
      }),
      catchError((err) => {
        // ERROR LOGGING
        console.error('--- Error Occurred ---');
        console.error('Status:', err.status || 500);
        console.error('Message:', err.message);
        console.error('Stack:', err.stack);

        return throwError(() => err);
      }),
    );
  }
}
