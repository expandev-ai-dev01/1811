import { Request, Response } from 'express';
import { errorResponse } from '@/utils/httpResponse';

export function notFoundMiddleware(req: Request, res: Response): void {
  res.status(404).json(errorResponse(`Route ${req.method} ${req.path} not found`, 'NOT_FOUND'));
}
