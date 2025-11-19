import { Router } from 'express';
import externalRoutes from './externalRoutes';
import internalRoutes from './internalRoutes';

const router = Router();

// External (public) routes
router.use('/external', externalRoutes);

// Internal (authenticated/private) routes
router.use('/internal', internalRoutes);

export default router;
