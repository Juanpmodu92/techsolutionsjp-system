import { Router } from 'express';
import {
  createQuoteHandler,
  getAllQuotesHandler,
  getQuoteByIdHandler,
  updateQuoteStatusHandler
} from './quote.controller.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/', createQuoteHandler);
router.get('/', getAllQuotesHandler);
router.get('/:id', getQuoteByIdHandler);
router.patch('/:id/status', updateQuoteStatusHandler);

export default router;