import { HttpException, HttpStatus } from '@nestjs/common';
import { Logger } from '@nestjs/common';

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

  userNotFound: (userId?: string, context?: any) => manageError({
    code: 'not-found',
    message: userId ? `User ${userId} not found` : 'User not found',
    channel: 'USERS',
    context
  }),

  userNotActive: (context?: any) => manageError({
    code: 'permission-denied',
    message: 'User account is not active',
    channel: 'USERS',
    context
  }),

  testDisabled: () => manageError({
    code: 'permission-denied',
    message: 'Test endpoints not available in production',
    channel: 'SYSTEM'
  }),

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
  },

  invalidArgument: (field: string, details?: string) => manageError({
    code: 'invalid-argument',
    message: details || `Invalid value for field: ${field}`,
    channel: 'SYSTEM',
    context: { field }
  })
};