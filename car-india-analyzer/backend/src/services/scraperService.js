import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

const SCRAPE_TIMEOUT = 10000;

async function fetchWithTimeout(url, timeout = SCRAPE_TIMEOUT) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
        'Accept-Language': 'en-IN,en;q=0.9',
      },
    });
    clearTimeout(timer);
    return res;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

// Scrape CarDekho for expert review snippets
export async function scrapeCarDekhoReview(model) {
  const slug = model.toLowerCase().replace(/\s+/g, '-');
  const url = `https://www.cardekho.com/maruti/${slug}`;
  try {
    const res = await fetchWithTimeout(url);
    const html = await res.text();
    const $ = cheerio.load(html);

    const expertReview = {
      pros: [],
      cons: [],
      summary: '',
      rating: null,
    };

    // Extract pros and cons
    $('[class*="pros"] li, [class*="good"] li').each((_, el) => {
      const text = $(el).text().trim();
      if (text) expertReview.pros.push(text);
    });
    $('[class*="cons"] li, [class*="bad"] li').each((_, el) => {
      const text = $(el).text().trim();
      if (text) expertReview.cons.push(text);
    });

    // Rating
    const ratingEl = $('[class*="rating"] span').first().text().trim();
    if (ratingEl) expertReview.rating = ratingEl;

    // Summary paragraph
    const summaryEl = $('[class*="summary"] p, [class*="review"] p').first().text().trim();
    if (summaryEl) expertReview.summary = summaryEl.slice(0, 500);

    return expertReview;
  } catch (err) {
    console.warn(`[Scraper] CarDekho failed for ${model}: ${err.message}`);
    return null;
  }
}

// Scrape Maruti official for latest price/variant info
export async function scrapeMarutiPrice(model) {
  const slug = model.toLowerCase();
  const url = `https://www.marutisuzuki.com/${slug}`;
  try {
    const res = await fetchWithTimeout(url);
    const html = await res.text();
    const $ = cheerio.load(html);

    const prices = [];
    $('[class*="variant"], [class*="price"]').each((_, el) => {
      const text = $(el).text().trim();
      const match = text.match(/[₹\d,]+\s*(?:Lakh|L)/i);
      if (match) prices.push(match[0]);
    });

    return { prices: [...new Set(prices)].slice(0, 10), source: url };
  } catch (err) {
    console.warn(`[Scraper] Maruti price failed for ${model}: ${err.message}`);
    return null;
  }
}

// Scrape CarWale for user ratings breakdown
export async function scrapeCarWaleRatings(model) {
  const slug = `maruti-${model.toLowerCase()}-2024`;
  const url = `https://www.carwale.com/${slug}-price/`;
  try {
    const res = await fetchWithTimeout(url);
    const html = await res.text();
    const $ = cheerio.load(html);

    const ratings = {};
    $('[class*="rating-category"], [class*="ratingCategory"]').each((_, el) => {
      const label = $(el).find('[class*="label"], span').first().text().trim();
      const score = $(el).find('[class*="score"], strong').first().text().trim();
      if (label && score) ratings[label] = score;
    });

    return Object.keys(ratings).length > 0 ? ratings : null;
  } catch (err) {
    console.warn(`[Scraper] CarWale failed for ${model}: ${err.message}`);
    return null;
  }
}

export async function scrapeAllSources(model) {
  const [review, pricing, ratings] = await Promise.allSettled([
    scrapeCarDekhoReview(model),
    scrapeMarutiPrice(model),
    scrapeCarWaleRatings(model),
  ]);

  return {
    expertReview: review.status === 'fulfilled' ? review.value : null,
    livePricing: pricing.status === 'fulfilled' ? pricing.value : null,
    userRatings: ratings.status === 'fulfilled' ? ratings.value : null,
    scrapedAt: new Date().toISOString(),
  };
}
