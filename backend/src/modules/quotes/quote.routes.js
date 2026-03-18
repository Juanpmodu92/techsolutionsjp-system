import { Router } from 'express';
import { authenticate } from '../../shared/middleware/auth.middleware.js';
import {
  createQuoteHandler,
  getAllQuotesHandler,
  getQuoteByIdHandler,
  getQuotePdfHandler,
  updateQuoteStatusHandler
} from './quote.controller.js';

const router = Router();

router.use(authenticate);

router.post('/', createQuoteHandler);
router.get('/', getAllQuotesHandler);
router.get('/:id', getQuoteByIdHandler);
router.get('/:id/pdf', getQuotePdfHandler);
router.patch('/:id/status', updateQuoteStatusHandler);

export default router;