import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { successResponse, errorResponse } from '@/utils/httpResponse';
import { carList, carGet } from '@/services/car/carRules';
import { zOptionalNumber, zOptionalString, zPage, zPageSize, zId } from '@/utils/zodValidation';

// Validation Schema for List Request
export const listSchema = z.object({
  query: z.object({
    brand: zOptionalString,
    model: zOptionalString,
    yearMin: zOptionalNumber,
    yearMax: zOptionalNumber,
    priceMin: zOptionalNumber,
    priceMax: zOptionalNumber,
    transmission: z
      .union([z.string(), z.array(z.string())])
      .optional()
      .transform((val) => {
        if (typeof val === 'string') return [val];
        return val;
      }),
    sort: zOptionalString,
    page: zPage,
    pageSize: zPageSize,
  }),
});

// Validation Schema for Get Request
export const getSchema = z.object({
  params: z.object({
    id: zId,
  }),
});

/**
 * @api {get} /api/v1/external/public/car List Cars
 * @apiName ListCars
 * @apiGroup Car
 * @apiVersion 1.0.0
 * @apiDescription Retrieves a list of cars with filtering, sorting and pagination
 */
export async function listHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Default account ID for public access (assuming single tenant or default public account)
    const DEFAULT_ACCOUNT_ID = 1;

    const {
      brand,
      model,
      yearMin,
      yearMax,
      priceMin,
      priceMax,
      transmission,
      sort,
      page,
      pageSize,
    } = req.query as unknown as z.infer<typeof listSchema>['query'];

    const result = await carList({
      idAccount: DEFAULT_ACCOUNT_ID,
      brand,
      model,
      yearMin,
      yearMax,
      priceMin,
      priceMax,
      transmission,
      sortOrder: sort,
      page,
      pageSize,
    });

    res.json(
      successResponse(result.data, {
        page,
        pageSize,
        total: result.total,
      })
    );
  } catch (error) {
    next(error);
  }
}

/**
 * @api {get} /api/v1/external/public/car/:id Get Car Details
 * @apiName GetCar
 * @apiGroup Car
 * @apiVersion 1.0.0
 * @apiDescription Retrieves detailed information about a specific vehicle
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const DEFAULT_ACCOUNT_ID = 1;
    const { id } = req.params as unknown as z.infer<typeof getSchema>['params'];

    const result = await carGet({
      idAccount: DEFAULT_ACCOUNT_ID,
      idCar: id,
    });

    if (!result) {
      res.status(404).json(errorResponse('Vehicle not found', 'NOT_FOUND'));
      return;
    }

    res.json(successResponse(result));
  } catch (error) {
    next(error);
  }
}
