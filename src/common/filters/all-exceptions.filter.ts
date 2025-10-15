import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Determine HTTP status code
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Extract message safely
    let message: string | object =
      exception instanceof HttpException
        ? exception.getResponse()
        : ((exception as Error)?.message ?? 'Internal server error');

    // Normalize message to string if possible
    if (typeof message === 'object' && (message as any).message) {
      message = (message as any).message;
    }

    // Log the error server-side
    this.logger.error(
      {
        path: request.url,
        method: request.method,
        status,
        message,
        stack: (exception as any)?.stack,
      },
      (exception as any)?.stack,
    );

    // Send standardized response to client
    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: message,
    });
  }
}
