import { Router } from 'express';
import { authenticate } from '../../shared/middleware/auth.middleware.js';
import {
  createPaymentHandler,
  getAllPaymentsHandler
} from './payment.controller.js';

const router = Router();

router.use(authenticate);

router.post('/', createPaymentHandler);
router.get('/', getAllPaymentsHandler);

export default router;