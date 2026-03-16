import { Router } from 'express';
import { authenticate } from '../../shared/middleware/auth.middleware.js';
import {
  createSoftwareProjectHandler,
  getAllSoftwareProjectsHandler,
  getSoftwareProjectByIdHandler,
  updateSoftwareProjectStatusHandler
} from './software-project.controller.js';

const router = Router();

router.use(authenticate);

router.post('/', createSoftwareProjectHandler);
router.get('/', getAllSoftwareProjectsHandler);
router.get('/:id', getSoftwareProjectByIdHandler);
router.patch('/:id/status', updateSoftwareProjectStatusHandler);

export default router;