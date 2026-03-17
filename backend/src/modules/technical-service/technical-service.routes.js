import { Router } from 'express';
import { authenticate } from '../../shared/middleware/auth.middleware.js';
import {
  createTechnicalServiceHandler,
  getAllTechnicalServicesHandler,
  getTechnicalServiceByIdHandler,
  updateTechnicalServiceStatusHandler
} from './technical-service.controller.js';

const router = Router();

router.use(authenticate);

router.post('/', createTechnicalServiceHandler);
router.get('/', getAllTechnicalServicesHandler);
router.get('/:id', getTechnicalServiceByIdHandler);
router.patch('/:id/status', updateTechnicalServiceStatusHandler);

export default router;