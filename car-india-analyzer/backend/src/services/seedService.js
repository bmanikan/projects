import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '../../data');

const cache = new Map();

export function getCarList() {
  const files = readdirSync(dataDir).filter(f => f.endsWith('.json'));
  return files.map(file => {
    const data = JSON.parse(readFileSync(join(dataDir, file), 'utf-8'));
    return {
      id: data.id,
      brand: data.brand,
      model: data.model,
      year: data.year,
      tagline: data.tagline,
      priceRange: data.priceRange,
      image: data.image,
    };
  });
}

export function getCarByModel(modelId) {
  if (cache.has(modelId)) return cache.get(modelId);

  try {
    const filePath = join(dataDir, `${modelId.toLowerCase()}.json`);
    const data = JSON.parse(readFileSync(filePath, 'utf-8'));
    cache.set(modelId, data);
    return data;
  } catch {
    return null;
  }
}
