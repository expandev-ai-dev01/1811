/**
 * @interface CarEntity
 * @description Represents a car entity in the system
 */
export interface CarEntity {
  idCar: number;
  idAccount: number;
  model: string;
  brand: string;
  year: number;
  modelYear?: number;
  price: number;
  mileage?: number;
  transmission?: string;
  fuel?: string;
  color?: string;
  doors?: number;
  bodyType?: string;
  motor?: string;
  power?: string;
  plateEnd?: number;
  image: string;
  description?: string;
  status: number;
  dateCreated: Date;
  dateModified: Date;
  deleted: boolean;
}

/**
 * @interface CarListFilters
 * @description Filters for listing cars
 */
export interface CarListFilters {
  idAccount: number;
  brand?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  transmission?: string[];
  sortOrder?: string;
  page: number;
  pageSize: number;
}

/**
 * @interface CarListResponse
 * @description Response structure for car listing
 */
export interface CarListResponse {
  data: CarEntity[];
  total: number;
}

// --- Detail Types ---

export interface CarPhoto {
  idCarPhoto: number;
  url: string;
  isMain: boolean;
  caption: string | null;
  order: number;
}

export interface CarItem {
  idCarItem: number;
  name: string;
  category: string;
  isOptional: boolean;
}

export interface CarHistory {
  idCarHistory: number;
  provenance: string;
  ownerCount: number;
  warrantyDetails: string | null;
  technicalReportJson: string | null;
}

export interface CarRevision {
  idCarRevision: number;
  date: Date;
  mileage: number;
  location: string;
}

export interface CarClaim {
  idCarClaim: number;
  date: Date;
  type: string;
  description: string;
}

export interface CarSaleCondition {
  idCarSaleCondition: number;
  acceptsTrade: boolean;
  saleObservations: string | null;
  paymentMethodsJson: string;
  financingConditionsJson: string | null;
  requiredDocsJson: string;
  docStatusJson: string;
}

export interface CarSimilar {
  idCar: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  image: string;
  status: number;
}

/**
 * @interface CarDetailResponse
 * @description Comprehensive vehicle details response
 */
export interface CarDetailResponse {
  details: CarEntity;
  photos: CarPhoto[];
  items: CarItem[];
  history: {
    summary: CarHistory | null;
    revisions: CarRevision[];
    claims: CarClaim[];
  };
  saleConditions: {
    conditions: CarSaleCondition | null;
    paymentMethods: string[];
    financing: any | null;
    requiredDocs: any[];
    docStatus: any | null;
  };
  similar: CarSimilar[];
}
