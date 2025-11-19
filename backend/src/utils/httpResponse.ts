/**
 * Standardized API response structures
 */

export interface SuccessResponse<T> {
  success: true;
  data: T;
  metadata?: {
    page?: number;
    pageSize?: number;
    total?: number;
    timestamp: string;
  };
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

export const successResponse = <T>(data: T, metadata?: any): SuccessResponse<T> => ({
  success: true,
  data,
  metadata: {
    ...metadata,
    timestamp: new Date().toISOString(),
  },
});

export const errorResponse = (
  message: string,
  code: string = 'INTERNAL_ERROR',
  details?: any
): ErrorResponse => ({
  success: false,
  error: {
    code,
    message,
    details,
  },
  timestamp: new Date().toISOString(),
});
