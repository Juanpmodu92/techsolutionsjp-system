import { Router } from 'express';
import {
  createClientHandler,
  deactivateClientHandler,
  reactivateClientHandler,
  getAllClientsHandler,
  getClientByIdHandler,
  updateClientHandler
} from './client.controller.js';

const router = Router();

router.post('/', createClientHandler);
router.get('/', getAllClientsHandler);
router.get('/:id', getClientByIdHandler);
router.put('/:id', updateClientHandler);
router.patch('/:id/deactivate', deactivateClientHandler);
router.patch('/:id/activate', reactivateClientHandler);

export default router;