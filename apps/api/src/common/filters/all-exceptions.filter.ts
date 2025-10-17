import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

interface ErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
  errors?: Record<string, string[]>;
  timestamp: string;
  path: string;
  correlationId?: string;
  stack?: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');
  private readonly isProduction = process.env.NODE_ENV === 'production';

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const correlationId: string = this.generateCorrelationId();

    const errorResponse: ErrorResponse = this.buildErrorResponse(exception, request, correlationId);

    this.logException(exception, request, correlationId, errorResponse);

    response.status(errorResponse.statusCode).json(errorResponse);
  }

  private buildErrorResponse(
    exception: unknown,
    request: Request,
    correlationId: string
  ): ErrorResponse {
    const timestamp = new Date().toISOString();
    const path = request.url;

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object') {
        return {
          ...exceptionResponse,
          statusCode: status,
          timestamp,
          path,
          correlationId,
          ...(this.isProduction ? {} : { stack: exception.stack })
        } as ErrorResponse;
      }

      return {
        statusCode: status,
        message: exceptionResponse as string,
        timestamp,
        path,
        correlationId,
        ...(this.isProduction ? {} : { stack: exception.stack })
      };
    }

    if (this.isPrismaError(exception)) {
      return this.handlePrismaError(exception, timestamp, path, correlationId);
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: this.isProduction ? 'Internal server error' : (exception as Error).message || 'Unknown error',
      error: 'Internal Server Error',
      timestamp,
      path,
      correlationId,
      ...(this.isProduction ? {} : { stack: (exception as Error).stack })
    };
  }

  private isPrismaError(exception: unknown): boolean {
    return typeof exception === 'object' &&
      exception !== null &&
      'code' in exception &&
      typeof (exception as any).code === 'string' &&
      (exception as any).code.startsWith('P');
  }

  private handlePrismaError(
    exception: any,
    timestamp: string,
    path: string,
    correlationId: string
  ): ErrorResponse {
    // Prisma error codes: https://www.prisma.io/docs/reference/api-reference/error-reference
    switch (exception.code) {
      case 'P2002':
        return {
          statusCode: HttpStatus.CONFLICT,
          message: 'Resource already exists',
          error: 'Conflict',
          timestamp,
          path,
          correlationId
        };
      case 'P2025':
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Resource not found',
          error: 'Not Found',
          timestamp,
          path,
          correlationId
        };
      case 'P2003':
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid reference',
          error: 'Bad Request',
          timestamp,
          path,
          correlationId
        };
      case 'P2014':
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid relation',
          error: 'Bad Request',
          timestamp,
          path,
          correlationId
        };
      default:
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Database error',
          error: 'Internal Server Error',
          timestamp,
          path,
          correlationId
        };
    }
  }

  private logException(
    exception: unknown,
    request: Request,
    correlationId: string,
    errorResponse: ErrorResponse
  ): void {
    const context = {
      correlationId,
      path: request.url,
      method: request.method,
      statusCode: errorResponse.statusCode,
      userAgent: request.headers['user-agent'],
      ip: request.ip,
      userId: (request as any).user?.id,
      timestamp: errorResponse.timestamp
    };

    if (errorResponse.statusCode >= 500) {
      this.logger.error(
        `Server Error: ${errorResponse.message}`,
        {
          ...context,
          error: this.isProduction ? '[REDACTED]' : exception,
          stack: this.isProduction ? '[REDACTED]' : (exception as Error)?.stack
        }
      );
    } else if (errorResponse.statusCode >= 400) {
      this.logger.warn(
        `Client Error: ${errorResponse.message}`,
        {
          ...context,
          ...(this.isProduction ? {} : { error: exception })
        }
      );
    } else {
      this.logger.log(
        `Request processed with status ${errorResponse.statusCode}`,
        context
      );
    }

    if (errorResponse.statusCode >= 500) {
      this.triggerAlert(exception, context);
    }
  }

  private triggerAlert(exception: unknown, context: any): void {
    // Ici on pourrait intégrer avec des services d'alerting
    // Sentry, Slack, Email, etc.
    this.logger.error('ALERT: Critical server error detected', {
      alert: true,
      severity: 'critical',
      exception: exception instanceof Error ? exception.message : 'Unknown error',
      context
    });
  }

  private generateCorrelationId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const setupGlobalExceptionFilter = (app: any) => {
  app.useGlobalFilters(new AllExceptionsFilter());
};