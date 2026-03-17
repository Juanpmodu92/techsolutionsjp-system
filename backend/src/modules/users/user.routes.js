import { Router } from 'express';
import { authenticate } from '../../shared/middleware/auth.middleware.js';
import {
  activateUserHandler,
  createUserHandler,
  deactivateUserHandler,
  getAllUsersHandler,
  updateUserHandler
} from './user.controller.js';

const router = Router();

router.use(authenticate);

router.get('/', getAllUsersHandler);
router.post('/', createUserHandler);
router.put('/:id', updateUserHandler);
router.patch('/:id/activate', activateUserHandler);
router.patch('/:id/deactivate', deactivateUserHandler);

export default router;