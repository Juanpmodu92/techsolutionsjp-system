import { Router } from 'express';
import { authenticate } from '../../shared/middleware/auth.middleware.js';
import { getDashboardMetricsHandler } from './dashboard.controller.js';

const router = Router();

router.use(authenticate);

router.get('/metrics', getDashboardMetricsHandler);

export default router;