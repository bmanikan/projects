import { describe, it, expect, beforeAll } from 'vitest';
import express from 'express';

// Import the app directly
import app from '../src/app.js';

// Simple test helper to make HTTP requests to the Express app
function request(app) {
  return {
    async get(path) {
      return new Promise((resolve, reject) => {
        const server = app.listen(0, () => {
          const port = server.address().port;
          fetch(`http://localhost:${port}${path}`)
            .then(async res => {
              const body = await res.json();
              server.close();
              resolve({ status: res.status, body });
            })
            .catch(err => {
              server.close();
              reject(err);
            });
        });
      });
    },
    async post(path, data) {
      return new Promise((resolve, reject) => {
        const server = app.listen(0, () => {
          const port = server.address().port;
          fetch(`http://localhost:${port}${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          })
            .then(async res => {
              const body = await res.json();
              server.close();
              resolve({ status: res.status, body });
            })
            .catch(err => {
              server.close();
              reject(err);
            });
        });
      });
    },
  };
}

describe('API Routes', () => {
  describe('GET /api/health', () => {
    it('returns health status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/cars', () => {
    it('returns list of cars', async () => {
      const res = await request(app).get('/api/cars');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('car summaries have required fields', async () => {
      const res = await request(app).get('/api/cars');
      const car = res.body.data[0];
      expect(car).toHaveProperty('id');
      expect(car).toHaveProperty('brand');
      expect(car).toHaveProperty('model');
      expect(car).toHaveProperty('year');
      expect(car).toHaveProperty('priceRange');
    });
  });

  describe('GET /api/cars/:model', () => {
    it('returns full car data for swift', async () => {
      const res = await request(app).get('/api/cars/swift');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe('swift');
      expect(res.body.data.model).toBe('Swift');
      expect(res.body.data).toHaveProperty('engine');
      expect(res.body.data).toHaveProperty('variants');
    });

    it('returns 404 for non-existent car', async () => {
      const res = await request(app).get('/api/cars/nonexistent');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Car not found');
    });
  });

  describe('GET /api/cars/:model/ai-analysis', () => {
    it('returns 503 when ANTHROPIC_API_KEY is not set', async () => {
      const original = process.env.ANTHROPIC_API_KEY;
      delete process.env.ANTHROPIC_API_KEY;
      const res = await request(app).get('/api/cars/swift/ai-analysis');
      expect(res.status).toBe(503);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('ANTHROPIC_API_KEY');
      if (original) process.env.ANTHROPIC_API_KEY = original;
    });

    it('returns 404 for non-existent model', async () => {
      const res = await request(app).get('/api/cars/nonexistent/ai-analysis');
      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/cars/:model/ask', () => {
    it('returns 400 when question is missing', async () => {
      const res = await request(app).post('/api/cars/swift/ask', {});
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Question required');
    });

    it('returns 503 when ANTHROPIC_API_KEY is not set', async () => {
      const original = process.env.ANTHROPIC_API_KEY;
      delete process.env.ANTHROPIC_API_KEY;
      const res = await request(app).post('/api/cars/swift/ask', { question: 'test' });
      expect(res.status).toBe(503);
      if (original) process.env.ANTHROPIC_API_KEY = original;
    });

    it('returns 404 for non-existent model', async () => {
      const res = await request(app).post('/api/cars/nonexistent/ask', { question: 'test' });
      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/cars/:model/variants', () => {
    it('returns 503 when ANTHROPIC_API_KEY is not set', async () => {
      const original = process.env.ANTHROPIC_API_KEY;
      delete process.env.ANTHROPIC_API_KEY;
      const res = await request(app).get('/api/cars/swift/variants');
      expect(res.status).toBe(503);
      if (original) process.env.ANTHROPIC_API_KEY = original;
    });
  });

  describe('GET /api/cars/:model/sales-insight', () => {
    it('returns 503 when ANTHROPIC_API_KEY is not set', async () => {
      const original = process.env.ANTHROPIC_API_KEY;
      delete process.env.ANTHROPIC_API_KEY;
      const res = await request(app).get('/api/cars/swift/sales-insight');
      expect(res.status).toBe(503);
      if (original) process.env.ANTHROPIC_API_KEY = original;
    });
  });
});
