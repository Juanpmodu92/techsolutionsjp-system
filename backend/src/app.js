import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

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

export default app;