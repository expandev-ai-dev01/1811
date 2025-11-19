import sql from 'mssql';
import { config } from '@/config';
import { logger } from '@/utils/logger';

// Database configuration
const dbConfig: sql.config = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'your_password',
  server: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '1433'),
  database: process.env.DB_NAME || 'catalogo_carros',
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.NODE_ENV !== 'production',
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

// Connection pool singleton
let pool: sql.ConnectionPool | null = null;

export const getPool = async (): Promise<sql.ConnectionPool> => {
  if (pool) return pool;

  try {
    pool = await new sql.ConnectionPool(dbConfig).connect();
    logger.info('Database connected successfully');
    return pool;
  } catch (error) {
    logger.error('Database connection failed', error);
    throw error;
  }
};

export enum ExpectedReturn {
  Single = 'Single',
  Multi = 'Multi',
  None = 'None',
}

export async function dbRequest(
  procedure: string,
  params: Record<string, any>,
  expectedReturn: ExpectedReturn = ExpectedReturn.Single,
  resultSetNames?: string[]
): Promise<any> {
  try {
    const pool = await getPool();
    const request = pool.request();

    // Add parameters to request
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value);
    });

    // Cast to any to avoid type mismatch issues between mssql v10 and @types/mssql v9
    const result: any = await request.execute(procedure);

    switch (expectedReturn) {
      case ExpectedReturn.Single:
        return result.recordset && result.recordset.length > 0 ? result.recordset[0] : null;

      case ExpectedReturn.Multi:
        if (resultSetNames && resultSetNames.length > 0) {
          const response: Record<string, any[]> = {};
          result.recordsets.forEach((set: any, index: number) => {
            const name = resultSetNames[index] || `result${index}`;
            response[name] = set;
          });
          return response;
        }
        return result.recordsets;

      case ExpectedReturn.None:
        return true;

      default:
        return result.recordset;
    }
  } catch (error) {
    logger.error(`Database request failed: ${procedure}`, error);
    throw error;
  }
}
