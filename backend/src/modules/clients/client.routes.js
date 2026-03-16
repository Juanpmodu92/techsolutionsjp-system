import { Router } from 'express';
import {
  createClientHandler,
  getAllClientsHandler,
  getClientByIdHandler
} from './client.controller.js';

const router = Router();

router.post('/', createClientHandler);
router.get('/', getAllClientsHandler);
router.get('/:id', getClientByIdHandler);

export default router;