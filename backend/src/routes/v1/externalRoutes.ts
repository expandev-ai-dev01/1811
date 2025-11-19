import { Router } from 'express';
import * as healthController from '@/api/v1/external/public/health/controller';

const router = Router();

// System routes
router.get('/public/health', healthController.getHandler);

// Feature Routes Placeholder
// TODO: Add Car routes here (GET /public/car, GET /public/car/:id)
// TODO: Add Contact routes here (POST /public/contact)

export default router;
