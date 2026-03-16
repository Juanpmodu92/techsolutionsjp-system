import { Router } from 'express';
import { authenticate } from '../../shared/middleware/auth.middleware.js';
import {
  createSaleHandler,
  getAllSalesHandler,
  getSaleByIdHandler
} from './sale.controller.js';

const router = Router();

router.use(authenticate);

router.post('/', createSaleHandler);
router.get('/', getAllSalesHandler);
router.get('/:id', getSaleByIdHandler);

export default router;