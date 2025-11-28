import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    // const request = ctx.getRequest(); // Request object if needed

    if (exception.code === 11000) {
      // Parse the error message to find out which field was duplicated
      // Message format: E11000 duplicate key error collection: ... index: username_1 ...
      const message = exception.message;
      
      // Simple regex to extract the field name if possible (optional)
      // This assumes the index name contains the field name, which is standard in Mongoose
      // You might want to customize the error message further
      
      return response.status(HttpStatus.CONFLICT).json({
        statusCode: HttpStatus.CONFLICT,
        message: 'Duplicate key error',
        error: 'Conflict',
        // Sending the raw message is useful for debugging, 
        // but for production, you might want to sanitize this
        details: message, 
      });
    }

    // Handle other MongoErrors here (e.g., connection issues)
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error',
    });
  }
}