import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import SearchPage from '../src/components/SearchPage';

const mockCars = [
  {
    id: 'swift',
    brand: 'Maruti Suzuki',
    model: 'Swift',
    year: 2024,
    tagline: "India's Most Loved Hatchback",
    priceRange: { min: 649000, max: 902000 },
    image: 'https://example.com/swift.jpg',
  },
  {
    id: 'baleno',
    brand: 'Maruti Suzuki',
    model: 'Baleno',
    year: 2024,
    tagline: 'Premium Hatchback',
    priceRange: { min: 665000, max: 980000 },
    image: 'https://example.com/baleno.jpg',
  },
];

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('SearchPage', () => {
  it('shows loading skeleton initially', () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(
      () => new Promise(() => {}) // never resolves
    );
    const { container } = render(<SearchPage onSelect={() => {}} />);
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });

  it('renders car cards after loading', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: () => Promise.resolve({ success: true, data: mockCars }),
    } as Response);

    render(<SearchPage onSelect={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText('Swift')).toBeInTheDocument();
      expect(screen.getByText('Baleno')).toBeInTheDocument();
    });
  });

  it('filters cars by search query', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: () => Promise.resolve({ success: true, data: mockCars }),
    } as Response);

    render(<SearchPage onSelect={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText('Swift')).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/Search a car/i);
    fireEvent.change(input, { target: { value: 'Swift' } });

    expect(screen.getByText('Swift')).toBeInTheDocument();
    expect(screen.queryByText('Baleno')).not.toBeInTheDocument();
  });

  it('shows error message when API fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: () => Promise.resolve({ success: false, error: 'Server error' }),
    } as Response);

    render(<SearchPage onSelect={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load cars')).toBeInTheDocument();
    });
  });

  it('calls onSelect when a car is clicked', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: () => Promise.resolve({ success: true, data: mockCars }),
    } as Response);

    const onSelect = vi.fn();
    render(<SearchPage onSelect={onSelect} />);

    await waitFor(() => {
      expect(screen.getByText('Swift')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Swift'));
    expect(onSelect).toHaveBeenCalledWith('swift');
  });

  it('displays headline and feature pills', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: () => Promise.resolve({ success: true, data: [] }),
    } as Response);

    render(<SearchPage onSelect={() => {}} />);

    expect(screen.getByText(/Know your car/)).toBeInTheDocument();
    expect(screen.getByText('Engine & Specs')).toBeInTheDocument();
    expect(screen.getByText('Sales Reports')).toBeInTheDocument();
    expect(screen.getByText('Safety Analysis')).toBeInTheDocument();
    expect(screen.getByText('AI Intelligence')).toBeInTheDocument();
  });

  it('shows "No cars available" when API returns empty list', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: () => Promise.resolve({ success: true, data: [] }),
    } as Response);

    render(<SearchPage onSelect={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText('No cars available')).toBeInTheDocument();
    });
  });
});
