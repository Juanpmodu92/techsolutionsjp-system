import { Router } from 'express';
import { authenticate } from '../../shared/middleware/auth.middleware.js';
import {
  getInventorySummaryHandler,
  getPaymentsSummaryHandler,
  getSalesSummaryHandler,
  getTechnicalServicesSummaryHandler
} from './report.controller.js';

const router = Router();

router.use(authenticate);

router.get('/sales-summary', getSalesSummaryHandler);
router.get('/payments-summary', getPaymentsSummaryHandler);
router.get('/inventory-summary', getInventorySummaryHandler);
router.get('/technical-services-summary', getTechnicalServicesSummaryHandler);

export default router;