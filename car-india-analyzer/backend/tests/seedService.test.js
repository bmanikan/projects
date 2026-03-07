import { describe, it, expect } from 'vitest';
import { getCarList, getCarByModel } from '../src/services/seedService.js';

describe('seedService', () => {
  describe('getCarList', () => {
    it('returns an array of car summaries', () => {
      const cars = getCarList();
      expect(Array.isArray(cars)).toBe(true);
      expect(cars.length).toBeGreaterThan(0);
    });

    it('each car has required summary fields', () => {
      const cars = getCarList();
      for (const car of cars) {
        expect(car).toHaveProperty('id');
        expect(car).toHaveProperty('brand');
        expect(car).toHaveProperty('model');
        expect(car).toHaveProperty('year');
        expect(car).toHaveProperty('tagline');
        expect(car).toHaveProperty('priceRange');
        expect(car).toHaveProperty('image');
      }
    });

    it('does not return full car data fields', () => {
      const cars = getCarList();
      for (const car of cars) {
        expect(car).not.toHaveProperty('engine');
        expect(car).not.toHaveProperty('transmission');
        expect(car).not.toHaveProperty('salesData');
        expect(car).not.toHaveProperty('variants');
      }
    });

    it('priceRange has min and max as numbers', () => {
      const cars = getCarList();
      for (const car of cars) {
        expect(typeof car.priceRange.min).toBe('number');
        expect(typeof car.priceRange.max).toBe('number');
        expect(car.priceRange.max).toBeGreaterThanOrEqual(car.priceRange.min);
      }
    });
  });

  describe('getCarByModel', () => {
    it('returns full car data for valid model', () => {
      const car = getCarByModel('swift');
      expect(car).not.toBeNull();
      expect(car.id).toBe('swift');
      expect(car.brand).toBe('Maruti Suzuki');
      expect(car.model).toBe('Swift');
    });

    it('returns null for non-existent model', () => {
      const car = getCarByModel('nonexistent-car-xyz');
      expect(car).toBeNull();
    });

    it('full car data has engine, transmission, and salesData', () => {
      const car = getCarByModel('swift');
      expect(car).toHaveProperty('engine');
      expect(car).toHaveProperty('transmission');
      expect(car).toHaveProperty('salesData');
      expect(car).toHaveProperty('variants');
      expect(car).toHaveProperty('safety');
      expect(car).toHaveProperty('colors');
    });

    it('caches repeated lookups', () => {
      const car1 = getCarByModel('swift');
      const car2 = getCarByModel('swift');
      expect(car1).toBe(car2); // same reference
    });

    it('Swift has correct price range', () => {
      const car = getCarByModel('swift');
      expect(car.priceRange.min).toBe(649000);
      expect(car.priceRange.max).toBe(902000);
    });

    it('Swift has 4 variants', () => {
      const car = getCarByModel('swift');
      expect(car.variants).toHaveLength(4);
      expect(car.variants.map(v => v.name)).toEqual(['LXi', 'VXi', 'ZXi', 'ZXi+']);
    });

    it('Swift has 12 months of sales data', () => {
      const car = getCarByModel('swift');
      expect(car.salesData.monthly).toHaveLength(12);
    });

    it('Swift has 6 colors', () => {
      const car = getCarByModel('swift');
      expect(car.colors).toHaveLength(6);
      for (const color of car.colors) {
        expect(color).toHaveProperty('name');
        expect(color).toHaveProperty('hex');
        expect(color.hex).toMatch(/^#[0-9A-Fa-f]{6}$/);
      }
    });
  });
});
