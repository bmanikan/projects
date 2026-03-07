import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '../data');

describe('Data Integrity', () => {
  const files = readdirSync(dataDir).filter(f => f.endsWith('.json'));

  it('data directory contains at least one JSON file', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  for (const file of files) {
    describe(`${file}`, () => {
      const data = JSON.parse(readFileSync(join(dataDir, file), 'utf-8'));

      it('has required top-level fields', () => {
        const requiredFields = [
          'id', 'brand', 'model', 'year', 'tagline',
          'priceRange', 'image', 'overview', 'engine',
          'transmission', 'safety', 'variants', 'salesData',
        ];
        for (const field of requiredFields) {
          expect(data, `missing field: ${field}`).toHaveProperty(field);
        }
      });

      it('id matches filename', () => {
        expect(data.id).toBe(file.replace('.json', ''));
      });

      it('priceRange has valid min/max', () => {
        expect(data.priceRange.min).toBeGreaterThan(0);
        expect(data.priceRange.max).toBeGreaterThanOrEqual(data.priceRange.min);
      });

      it('year is a reasonable number', () => {
        expect(data.year).toBeGreaterThanOrEqual(2015);
        expect(data.year).toBeLessThanOrEqual(2030);
      });

      it('has at least one variant', () => {
        expect(data.variants.length).toBeGreaterThan(0);
      });

      it('each variant has name, price, transmission, highlights', () => {
        for (const v of data.variants) {
          expect(v).toHaveProperty('name');
          expect(v).toHaveProperty('price');
          expect(v.price).toBeGreaterThan(0);
          expect(Array.isArray(v.transmission)).toBe(true);
          expect(Array.isArray(v.highlights)).toBe(true);
        }
      });

      it('variant prices are in ascending order', () => {
        for (let i = 1; i < data.variants.length; i++) {
          expect(data.variants[i].price).toBeGreaterThanOrEqual(data.variants[i - 1].price);
        }
      });

      it('salesData has monthly and annual arrays', () => {
        expect(Array.isArray(data.salesData.monthly)).toBe(true);
        expect(Array.isArray(data.salesData.annual)).toBe(true);
        expect(data.salesData.monthly.length).toBeGreaterThan(0);
        expect(data.salesData.annual.length).toBeGreaterThan(0);
      });

      it('monthly sales entries have month and units', () => {
        for (const entry of data.salesData.monthly) {
          expect(entry).toHaveProperty('month');
          expect(entry).toHaveProperty('units');
          expect(entry.units).toBeGreaterThan(0);
        }
      });

      it('engine has required specs', () => {
        expect(data.engine).toHaveProperty('type');
        expect(data.engine).toHaveProperty('maxPower');
        expect(data.engine).toHaveProperty('maxTorque');
        expect(data.engine).toHaveProperty('fuelType');
      });

      it('transmission has at least one option', () => {
        expect(data.transmission.options.length).toBeGreaterThan(0);
        for (const opt of data.transmission.options) {
          expect(opt).toHaveProperty('type');
          expect(opt).toHaveProperty('name');
          expect(opt).toHaveProperty('mileage');
        }
      });

      it('safety has airbags info', () => {
        expect(data.safety).toHaveProperty('airbags');
        expect(data.safety.airbags.count).toBeGreaterThan(0);
      });

      it('image URL is a valid HTTPS URL', () => {
        expect(data.image).toMatch(/^https?:\/\//);
      });

      it('colors have name and valid hex', () => {
        if (data.colors) {
          for (const color of data.colors) {
            expect(color).toHaveProperty('name');
            expect(color.hex).toMatch(/^#[0-9A-Fa-f]{6}$/);
          }
        }
      });
    });
  }
});
