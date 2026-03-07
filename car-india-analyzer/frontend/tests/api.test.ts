import { describe, it, expect } from 'vitest';
import { formatPrice, formatUnits } from '../src/lib/api';

describe('formatPrice', () => {
  it('converts rupees to lakhs format', () => {
    expect(formatPrice(649000)).toBe('₹6.49 L');
    expect(formatPrice(902000)).toBe('₹9.02 L');
  });

  it('handles round lakh values', () => {
    expect(formatPrice(100000)).toBe('₹1.00 L');
    expect(formatPrice(1000000)).toBe('₹10.00 L');
  });

  it('handles zero', () => {
    expect(formatPrice(0)).toBe('₹0.00 L');
  });

  it('handles small values', () => {
    expect(formatPrice(50000)).toBe('₹0.50 L');
  });
});

describe('formatUnits', () => {
  it('formats values >= 100000 as L (lakhs)', () => {
    expect(formatUnits(100000)).toBe('1.0L');
    expect(formatUnits(250000)).toBe('2.5L');
  });

  it('formats values >= 1000 as K (thousands)', () => {
    expect(formatUnits(1000)).toBe('1.0K');
    expect(formatUnits(18423)).toBe('18.4K');
    expect(formatUnits(24132)).toBe('24.1K');
  });

  it('returns small values as-is', () => {
    expect(formatUnits(500)).toBe('500');
    expect(formatUnits(0)).toBe('0');
    expect(formatUnits(999)).toBe('999');
  });
});
