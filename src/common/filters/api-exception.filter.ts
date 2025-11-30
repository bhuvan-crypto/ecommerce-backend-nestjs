import { Catch, ExceptionFilter, ArgumentsHost, HttpException, HttpStatus, ExecutionContext } from "@nestjs/common";
import { Response } from 'express';
import { ApiResponse } from "../responses/api-response";

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = 500;
    let message = "Internal server error";
    
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res: any = exception.getResponse();
      // If validation error (our exceptionFactory sets 'errors')
      if (res.errors) {
        return response.status(status).json(ApiResponse.error(status, "Validation error", res.errors));

      }

      // Other HttpExceptions → simple message
      message = res.message || res.error || exception.message;

      return response.status(status).json(ApiResponse.error(status, message));


    }

    // Fallback for unknown exceptions
    return response.status(500).json(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error",));
  }
}
