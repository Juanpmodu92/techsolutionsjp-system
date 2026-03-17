import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import clientRoutes from './modules/clients/client.routes.js';
import authRoutes from './modules/auth/auth.routes.js';
import quoteRoutes from './modules/quotes/quote.routes.js';
import productRoutes from './modules/products/product.routes.js';
import serviceRoutes from './modules/services/service.routes.js';
import inventoryRoutes from './modules/inventory/inventory.routes.js';
import saleRoutes from './modules/sales/sale.routes.js';
import softwareProjectRoutes from './modules/software-projects/software-project.routes.js';
import technicalServiceRoutes from './modules/technical-service/technical-service.routes.js';
import dashboardRoutes from './modules/dashboard/dashboard.routes.js';
import paymentRoutes from './modules/payments/payment.routes.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200
  })
);

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    ok: true,
    message: 'Tech Solutions JP API is running'
  });
});

app.use('/api/clients', clientRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/products', productRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/software-projects', softwareProjectRoutes);
app.use('/api/technical-services', technicalServiceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/payments', paymentRoutes);

export default app;