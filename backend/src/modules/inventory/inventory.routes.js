import { Router } from 'express';
import { authenticate } from '../../shared/middleware/auth.middleware.js';
import {
  createInventoryMovementHandler,
  getInventoryMovementsHandler
} from './inventory.controller.js';

const router = Router();

router.use(authenticate);

router.post('/movements', createInventoryMovementHandler);
router.get('/movements', getInventoryMovementsHandler);

export default router;