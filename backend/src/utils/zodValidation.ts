import { z } from 'zod';

// Common Zod schemas for validation
export const zString = z.string().trim().min(1);
export const zOptionalString = z.string().trim().optional();
export const zNumber = z.coerce.number();
export const zOptionalNumber = z.coerce.number().optional();
export const zId = z.coerce.number().int().positive();
export const zPage = z.coerce.number().int().min(1).default(1);
export const zPageSize = z.coerce.number().int().min(1).max(100).default(12);

// Database ID validation
export const zDbId = z.number().int().positive();
