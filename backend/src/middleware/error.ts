import { Request, Response, NextFunction } from 'express';
import { logger } from '@/utils/logger';
import { errorResponse } from '@/utils/httpResponse';
import { ZodError } from 'zod';

export function errorMiddleware(error: any, req: Request, res: Response, next: NextFunction): void {
  const correlationId = req.headers['x-correlation-id'] || 'unknown';

  // Log the error
  logger.error('Unhandled error', {
    correlationId,
    path: req.path,
    method: req.method,
    error: error.message,
    stack: error.stack,
  });

  // Handle Zod Validation Errors
  if (error instanceof ZodError) {
    res.status(400).json(errorResponse('Validation failed', 'VALIDATION_ERROR', error.errors));
    return;
  }

  // Handle Syntax Errors (JSON parsing)
  if (error instanceof SyntaxError && 'body' in error) {
    res.status(400).json(errorResponse('Invalid JSON payload', 'BAD_REQUEST'));
    return;
  }

  // Default Error
  const statusCode = error.statusCode || 500;
  const message = statusCode === 500 ? 'Internal Server Error' : error.message;

  res.status(statusCode).json(errorResponse(message, 'SERVER_ERROR'));
}
