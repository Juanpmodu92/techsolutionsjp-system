import { Router } from 'express';
import { authenticate } from '../../shared/middleware/auth.middleware.js';
import {
  createServiceHandler,
  deactivateServiceHandler,
  getAllServicesHandler,
  getServiceByIdHandler,
  updateServiceHandler
} from './service.controller.js';

const router = Router();

router.use(authenticate);

router.post('/', createServiceHandler);
router.get('/', getAllServicesHandler);
router.get('/:id', getServiceByIdHandler);
router.put('/:id', updateServiceHandler);
router.patch('/:id/deactivate', deactivateServiceHandler);

export default router;