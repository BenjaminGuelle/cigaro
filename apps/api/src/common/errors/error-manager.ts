import {
  HttpException,
  HttpStatus,
  Logger,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from '@cigaro/libs';

export type CigaroErrorCode =
  | 'ok'
  | 'cancelled'
  | 'unknown'
  | 'invalid-argument'
  | 'deadline-exceeded'
  | 'not-found'
  | 'already-exists'
  | 'permission-denied'
  | 'resource-exhausted'
  | 'failed-precondition'
  | 'aborted'
  | 'out-of-range'
  | 'unimplemented'
  | 'internal'
  | 'unavailable'
  | 'data-loss'
  | 'unauthenticated';

export type ErrorChannel =
  | 'USERS'
  | 'CLUBS'
  | 'TASTINGS'
  | 'EVENTS'
  | 'AUTH'
  | 'SYSTEM'
  | 'CRITICAL';

const ERROR_CODE_TO_HTTP_STATUS: Record<CigaroErrorCode, HttpStatus> = {
  'ok': HttpStatus.OK,
  'cancelled': HttpStatus.REQUEST_TIMEOUT,
  'unknown': HttpStatus.INTERNAL_SERVER_ERROR,
  'invalid-argument': HttpStatus.BAD_REQUEST,
  'deadline-exceeded': HttpStatus.REQUEST_TIMEOUT,
  'not-found': HttpStatus.NOT_FOUND,
  'already-exists': HttpStatus.CONFLICT,
  'permission-denied': HttpStatus.FORBIDDEN,
  'resource-exhausted': HttpStatus.TOO_MANY_REQUESTS,
  'failed-precondition': HttpStatus.PRECONDITION_FAILED,
  'aborted': HttpStatus.CONFLICT,
  'out-of-range': HttpStatus.BAD_REQUEST,
  'unimplemented': HttpStatus.NOT_IMPLEMENTED,
  'internal': HttpStatus.INTERNAL_SERVER_ERROR,
  'unavailable': HttpStatus.SERVICE_UNAVAILABLE,
  'data-loss': HttpStatus.INTERNAL_SERVER_ERROR,
  'unauthenticated': HttpStatus.UNAUTHORIZED,
};

export class DomainError extends HttpException {
  constructor(
    message: string,
    public readonly errorCode: CigaroErrorCode,
    statusCode?: number,
    public readonly channel?: ErrorChannel
  ) {
    const httpStatus = statusCode || ERROR_CODE_TO_HTTP_STATUS[errorCode];
    super({ message, errorCode, channel }, httpStatus);
  }
}

export type ManageErrorArgument = {
  code: CigaroErrorCode;
  message: string;
  verbose?: boolean;
  statusCode?: number;
  channel?: ErrorChannel;
  context?: any;
};

export function manageError({
                              code,
                              message,
                              verbose = true,
                              statusCode,
                              channel = 'SYSTEM',
                              context = {}
                            }: ManageErrorArgument): never {
  const logger = new Logger(`ErrorManager:${channel}`);

  if (verbose) {
    logger.error(message, { context, errorCode: code });
  }

  throw new DomainError(message, code, statusCode, channel);
}

export const ErrorManager = {
  // ============================================================================
  // HYBRID PATTERN - Returns NestJS Exceptions + Logging
  // ============================================================================

  // AUTH ERRORS
  unauthenticated: (context?: string): UnauthorizedException => {
    const logger = new Logger('AUTH');
    logger.warn('Unauthenticated access attempt', { context });

    return new UnauthorizedException('Authentication required');
  },

  insufficientRole: (required: UserRole[], current: UserRole, context?: string): ForbiddenException => {
    const logger = new Logger('AUTH');
    logger.warn('Insufficient role access denied', {
      requiredRoles: required,
      currentRole: current,
      context
    });

    return new ForbiddenException(
      `Access denied. Required: ${required.join('|')}, Current: ${current}`
    );
  },

  // USER ERRORS
  userNotFound: (userId?: string, context?: any): NotFoundException => {
    const logger = new Logger('USERS');
    logger.warn('User not found', { userId, context });

    const message = userId ? `User ${userId} not found` : 'User not found';
    return new NotFoundException(message);
  },

  userNotActive: (userId?: string, context?: any): ForbiddenException => {
    const logger = new Logger('USERS');
    logger.warn('User not active', { userId, context });

    return new ForbiddenException('User account is not active');
  },

  // VALIDATION ERRORS
  invalidArgument: (field: string, details?: string, context?: any): BadRequestException => {
    const logger = new Logger('SYSTEM');
    logger.warn('Invalid argument', { field, details, context });

    const message = details || `Invalid value for field: ${field}`;
    return new BadRequestException(message);
  },

  accessDenied: (reason: string, context?: string): ForbiddenException => {
    const logger = new Logger('AUTH');
    logger.warn('Access denied', { reason, context });

    return new ForbiddenException(`Access denied: ${reason}`);
  },

  // SYSTEM ERRORS
  testDisabled: (): ForbiddenException => {
    const logger = new Logger('SYSTEM');
    logger.warn('Test endpoint accessed in production');

    return new ForbiddenException('Test endpoints not available in production');
  },

  // ============================================================================
  // LEGACY METHODS - Keep for business logic (non-Guards)
  // ============================================================================

  handleError: (error: any, operation: string) => {
    const context = { operation };

    if (error.errorCode) {
      throw error;
    }

    if (error.code && error.code.startsWith('P')) {
      const prismaContext = { ...context, prismaCode: error.code };

      switch (error.code) {
        case 'P2002':
          manageError({
            code: 'already-exists',
            message: 'Resource already exists',
            channel: 'SYSTEM',
            context: prismaContext
          });
          break;
        case 'P2025':
          manageError({
            code: 'not-found',
            message: 'Resource not found',
            channel: 'SYSTEM',
            context: prismaContext
          });
          break;
        default:
          manageError({
            code: 'internal',
            message: `Database operation failed: ${operation}`,
            channel: 'CRITICAL',
            context: prismaContext
          });
      }
    }

    manageError({
      code: 'internal',
      message: `Operation failed: ${operation}`,
      channel: 'CRITICAL',
      context: { ...context, errorMessage: error.message }
    });
  }
};