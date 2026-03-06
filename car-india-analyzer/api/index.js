// Vercel serverless entry point — loads dotenv only in local dev
if (process.env.NODE_ENV !== 'production') {
  const { default: dotenv } = await import('dotenv');
  dotenv.config({ path: new URL('../backend/.env', import.meta.url).pathname });
}

import app from '../backend/src/app.js';

export default app;
