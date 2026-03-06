import express from 'express';
import cors from 'cors';
import carsRouter from './routes/cars.js';

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    // Allow all vercel.app domains, localhost, and same-origin
    if (
      !origin ||
      origin.includes('localhost') ||
      origin.includes('vercel.app') ||
      origin.includes('127.0.0.1')
    ) {
      callback(null, true);
    } else {
      callback(null, true); // permissive for now — lock down in production
    }
  },
}));
app.use(express.json());

app.use('/api/cars', carsRouter);
app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

export default app;
