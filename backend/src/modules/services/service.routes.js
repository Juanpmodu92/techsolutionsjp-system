import { Router } from 'express';
import { authenticate } from '../../shared/middleware/auth.middleware.js';
import {
  activateServiceHandler,
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
router.patch('/:id/activate', activateServiceHandler);

export default router;