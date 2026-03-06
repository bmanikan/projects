import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import carsRouter from './routes/cars.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/cars', carsRouter);

app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.listen(PORT, () => {
  console.log(`🚗 Car India Analyzer API running on http://localhost:${PORT}`);
  console.log(`   ANTHROPIC_API_KEY: ${process.env.ANTHROPIC_API_KEY ? '✅ configured' : '⚠️  not set (AI features disabled)'}`);
});
