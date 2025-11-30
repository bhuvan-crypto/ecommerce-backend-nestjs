import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { MongoError } from 'mongodb';
import { ApiResponse } from '../responses/api-response';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception.code === 11000) {
      return response
        .status(HttpStatus.CONFLICT)
        .json(ApiResponse.error( HttpStatus.CONFLICT,"Duplicate key error",));
    }

    return response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(ApiResponse.error( HttpStatus.INTERNAL_SERVER_ERROR,"Internal server error"));
  }
}
