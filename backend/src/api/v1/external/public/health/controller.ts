import { Request, Response, NextFunction } from 'express';
import { successResponse } from '@/utils/httpResponse';

/**
 * @api {get} /api/v1/external/public/health Health Check
 * @apiName GetHealth
 * @apiGroup System
 * @apiVersion 1.0.0
 * @apiDescription Checks if the API is running correctly
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json(
      successResponse({
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      })
    );
  } catch (error) {
    next(error);
  }
}
