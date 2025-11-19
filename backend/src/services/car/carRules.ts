import { dbRequest, ExpectedReturn } from '@/utils/database';
import { CarListFilters, CarListResponse, CarDetailResponse } from './carTypes';

/**
 * @summary
 * Retrieves a paginated list of cars based on filters and sorting criteria.
 *
 * @function carList
 * @module car
 *
 * @param {CarListFilters} params - Filter and pagination parameters
 * @returns {Promise<CarListResponse>} List of cars and total count
 */
export async function carList(params: CarListFilters): Promise<CarListResponse> {
  // Transform array parameters to string for SQL if needed, or handle in SP
  const transmissionStr = params.transmission ? params.transmission.join(',') : null;

  const dbParams = {
    idAccount: params.idAccount,
    brand: params.brand || null,
    model: params.model || null,
    yearMin: params.yearMin || null,
    yearMax: params.yearMax || null,
    priceMin: params.priceMin || null,
    priceMax: params.priceMax || null,
    transmission: transmissionStr,
    sortOrder: params.sortOrder || 'Relevância',
    page: params.page,
    pageSize: params.pageSize,
  };

  const result = await dbRequest('[functional].[spCarList]', dbParams, ExpectedReturn.Multi, [
    'data',
    'total',
  ]);

  return {
    data: result.data,
    total: result.total[0]?.total || 0,
  };
}

/**
 * @summary
 * Retrieves detailed information about a specific vehicle.
 *
 * @function carGet
 * @module car
 *
 * @param {Object} params - Request parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idCar - Vehicle identifier
 * @returns {Promise<CarDetailResponse | null>} Vehicle details or null if not found
 */
export async function carGet(params: {
  idAccount: number;
  idCar: number;
}): Promise<CarDetailResponse | null> {
  const result = await dbRequest('[functional].[spCarGet]', params, ExpectedReturn.Multi, [
    'details',
    'photos',
    'items',
    'history',
    'revisions',
    'claims',
    'saleConditions',
    'similar',
  ]);

  const details = result.details[0];
  if (!details) return null;

  const saleConditions = result.saleConditions[0];
  const historySummary = result.history[0];

  // Parse JSON fields safely
  const parseJson = (jsonStr: string | null) => {
    if (!jsonStr) return null;
    try {
      return JSON.parse(jsonStr);
    } catch (e) {
      return null;
    }
  };

  return {
    details,
    photos: result.photos,
    items: result.items,
    history: {
      summary: historySummary
        ? {
            ...historySummary,
            technicalReportJson: parseJson(historySummary.technicalReportJson),
          }
        : null,
      revisions: result.revisions,
      claims: result.claims,
    },
    saleConditions: {
      conditions: saleConditions,
      paymentMethods: saleConditions ? parseJson(saleConditions.paymentMethodsJson) || [] : [],
      financing: saleConditions ? parseJson(saleConditions.financingConditionsJson) : null,
      requiredDocs: saleConditions ? parseJson(saleConditions.requiredDocsJson) || [] : [],
      docStatus: saleConditions ? parseJson(saleConditions.docStatusJson) : null,
    },
    similar: result.similar,
  };
}
