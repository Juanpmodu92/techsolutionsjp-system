import { Router } from 'express';
import {
  createQuoteHandler,
  getAllQuotesHandler,
  getQuoteByIdHandler
} from './quote.controller.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/', createQuoteHandler);
router.get('/', getAllQuotesHandler);
router.get('/:id', getQuoteByIdHandler);

export default router;