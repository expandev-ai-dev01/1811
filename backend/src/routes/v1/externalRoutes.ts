import { Router } from 'express';
import { validate } from '@/middleware/validation';
import * as healthController from '@/api/v1/external/public/health/controller';
import * as carController from '@/api/v1/external/public/car/controller';
import * as contactController from '@/api/v1/external/public/contact/controller';

const router = Router();

// System routes
router.get('/public/health', healthController.getHandler);

// Car routes
router.get('/public/car', validate(carController.listSchema), carController.listHandler);
router.get('/public/car/:id', validate(carController.getSchema), carController.getHandler);

// Contact routes
router.post(
  '/public/contact',
  validate(contactController.createSchema),
  contactController.createHandler
);

export default router;
