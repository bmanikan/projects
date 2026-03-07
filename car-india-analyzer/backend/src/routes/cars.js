import { Router } from 'express';
import { getCarList, getCarByModel } from '../services/seedService.js';
import { scrapeAllSources } from '../services/scraperService.js';

const router = Router();

// Lazy-load Claude service to avoid crashing when ANTHROPIC_API_KEY is missing
let claudeService = null;
async function getClaude() {
  if (!claudeService) {
    claudeService = await import('../services/claudeService.js');
  }
  return claudeService;
}

// GET /api/cars - list all available cars
router.get('/', (req, res) => {
  try {
    const cars = getCarList();
    res.json({ success: true, data: cars });
  } catch (err) {
    console.error('[cars] Failed to load car list:', err.message);
    res.status(500).json({ success: false, error: 'Failed to load car list' });
  }
});

// GET /api/cars/:model - full seed data for a car
router.get('/:model', (req, res) => {
  const car = getCarByModel(req.params.model);
  if (!car) return res.status(404).json({ success: false, error: 'Car not found' });
  res.json({ success: true, data: car });
});

// GET /api/cars/:model/scrape - live scraped data
router.get('/:model/scrape', async (req, res) => {
  const car = getCarByModel(req.params.model);
  if (!car) return res.status(404).json({ success: false, error: 'Car not found' });

  try {
    const scraped = await scrapeAllSources(car.model);
    res.json({ success: true, data: scraped });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/cars/:model/ai-analysis - Claude AI full analysis
router.get('/:model/ai-analysis', async (req, res) => {
  const car = getCarByModel(req.params.model);
  if (!car) return res.status(404).json({ success: false, error: 'Car not found' });

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({ success: false, error: 'ANTHROPIC_API_KEY not configured' });
  }

  try {
    const { analyzeCarWithAI } = await getClaude();
    const analysis = await analyzeCarWithAI(car);
    res.json({ success: true, data: analysis });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/cars/:model/ask - ask Claude a specific question
router.post('/:model/ask', async (req, res) => {
  const car = getCarByModel(req.params.model);
  if (!car) return res.status(404).json({ success: false, error: 'Car not found' });

  const { question } = req.body;
  if (!question) return res.status(400).json({ success: false, error: 'Question required' });

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({ success: false, error: 'ANTHROPIC_API_KEY not configured' });
  }

  try {
    const { analyzeCarWithAI } = await getClaude();
    const result = await analyzeCarWithAI(car, question);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/cars/:model/variants - AI variant recommendations
router.get('/:model/variants', async (req, res) => {
  const car = getCarByModel(req.params.model);
  if (!car) return res.status(404).json({ success: false, error: 'Car not found' });

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({ success: false, error: 'ANTHROPIC_API_KEY not configured' });
  }

  try {
    const { compareVariants } = await getClaude();
    const result = await compareVariants(car);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/cars/:model/sales-insight - AI sales analysis
router.get('/:model/sales-insight', async (req, res) => {
  const car = getCarByModel(req.params.model);
  if (!car) return res.status(404).json({ success: false, error: 'Car not found' });

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({ success: false, error: 'ANTHROPIC_API_KEY not configured' });
  }

  try {
    const { generateSalesInsight } = await getClaude();
    const result = await generateSalesInsight(car.salesData, `${car.brand} ${car.model}`);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
