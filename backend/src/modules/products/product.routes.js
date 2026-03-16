import { Router } from 'express';
import { authenticate } from '../../shared/middleware/auth.middleware.js';
import {
  createProductCategoryHandler,
  getAllProductCategoriesHandler,
  createProductHandler,
  getAllProductsHandler,
  getProductByIdHandler,
  updateProductHandler,
  deactivateProductHandler
} from './product.controller.js';

const router = Router();

router.use(authenticate);

router.post('/categories', createProductCategoryHandler);
router.get('/categories', getAllProductCategoriesHandler);

router.post('/', createProductHandler);
router.get('/', getAllProductsHandler);
router.get('/:id', getProductByIdHandler);
router.put('/:id', updateProductHandler);
router.patch('/:id/deactivate', deactivateProductHandler);

export default router;