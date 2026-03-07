import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import CarDashboard from '../src/components/CarDashboard';

const mockCarData = {
  id: 'swift',
  brand: 'Maruti Suzuki',
  model: 'Swift',
  year: 2024,
  tagline: "India's Most Loved Hatchback",
  priceRange: { min: 649000, max: 902000 },
  image: 'https://example.com/swift.jpg',
  overview: 'The Swift is a premium hatchback.',
  engine: {
    type: '1.2L DualJet',
    displacement: '1197cc',
    cylinders: 4,
    valves: 16,
    maxPower: '89.7 bhp @ 6000 rpm',
    maxTorque: '113 Nm @ 4400 rpm',
    fuelType: 'Petrol',
    boreStroke: '73.0mm x 71.5mm',
    compressionRatio: '12.0:1',
    idleStartStop: true,
    emissionNorm: 'BS6 Phase 2',
  },
  transmission: {
    options: [
      { type: 'Manual', name: '5-Speed MT', gears: 5, mileage: '24.8 km/l' },
      { type: 'Automatic', name: '5-Speed AMT', gears: 5, mileage: '25.75 km/l' },
    ],
  },
  suspension: {
    front: { type: 'MacPherson Strut', description: 'Independent with coil spring' },
    rear: { type: 'Torsion Beam', description: 'With coil spring' },
  },
  steering: { type: 'EPS', mechanism: 'Rack and Pinion', turningRadius: '4.8 m' },
  brakes: { front: 'Ventilated Disc', rear: 'Drum' },
  dimensions: {
    length: 3845, width: 1735, height: 1530,
    wheelbase: 2450, groundClearance: 163,
    kerbWeight: { min: 905, max: 925 },
    bootSpace: 268, fuelTankCapacity: 37,
    tyreSize: '185/65 R15',
  },
  safety: {
    ncapRating: 'Not Tested (2024)',
    airbags: { count: 6, details: 'Driver + Passenger' },
    abs: true, ebd: true, esp: 'ZXi+',
    hillHoldControl: true, rearParkingSensors: true,
    rearCamera: 'ZXi+', seatbeltReminder: 'All seats',
    tyrePressureMonitor: 'ZXi+ only', isofix: true,
  },
  variants: [
    { name: 'LXi', price: 649000, transmission: ['MT'], highlights: ['AC'] },
    { name: 'VXi', price: 724000, transmission: ['MT', 'AMT'], highlights: ['Touchscreen'] },
  ],
  features: { infotainment: {}, comfort: {}, exterior: {} },
  competitors: ['Hyundai Grand i10 NIOS', 'Tata Tiago'],
  salesData: {
    monthly: [{ month: 'Apr 2024', units: 18423 }],
    annual: [{ year: 'FY 2024-25', units: 247782 }],
    marketShare: '~12%',
    ranking: '#1',
  },
  colors: [{ name: 'Magma Grey', hex: '#4A4A4A' }],
  warranty: { standard: '2 years', extended: 'Up to 5 years' },
  serviceInterval: 'Every 10,000 km',
  maintenanceCost: { firstService: 0, annualAvg: '₹6,000 - ₹10,000', majorService: 'Every 40,000 km' },
};

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('CarDashboard', () => {
  it('shows loading spinner initially', () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(
      () => new Promise(() => {})
    );
    render(<CarDashboard carId="swift" onBack={() => {}} />);
    expect(screen.getByText('Loading car data...')).toBeInTheDocument();
  });

  it('renders car info after loading', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: () => Promise.resolve({ success: true, data: mockCarData }),
    } as Response);

    render(<CarDashboard carId="swift" onBack={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText('Swift')).toBeInTheDocument();
      expect(screen.getByText('Maruti Suzuki')).toBeInTheDocument();
      expect(screen.getByText("India's Most Loved Hatchback")).toBeInTheDocument();
    });
  });

  it('shows error state for failed API call', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: () => Promise.resolve({ success: false, error: 'Car not found' }),
    } as Response);

    render(<CarDashboard carId="nonexistent" onBack={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText('Car not found')).toBeInTheDocument();
    });
  });

  it('calls onBack when back button is clicked on error', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: () => Promise.resolve({ success: false, error: 'Car not found' }),
    } as Response);

    const onBack = vi.fn();
    render(<CarDashboard carId="nonexistent" onBack={onBack} />);

    await waitFor(() => {
      expect(screen.getByText('← Back')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('← Back'));
    expect(onBack).toHaveBeenCalled();
  });

  it('renders all 6 tabs', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: () => Promise.resolve({ success: true, data: mockCarData }),
    } as Response);

    render(<CarDashboard carId="swift" onBack={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Engine & Specs')).toBeInTheDocument();
      expect(screen.getByText('Sales')).toBeInTheDocument();
      expect(screen.getByText('Safety')).toBeInTheDocument();
      expect(screen.getByText('AI Analysis')).toBeInTheDocument();
      expect(screen.getByText('Live Data')).toBeInTheDocument();
    });
  });

  it('shows overview tab content by default', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: () => Promise.resolve({ success: true, data: mockCarData }),
    } as Response);

    render(<CarDashboard carId="swift" onBack={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText('The Swift is a premium hatchback.')).toBeInTheDocument();
      expect(screen.getByText('LXi')).toBeInTheDocument();
      expect(screen.getByText('VXi')).toBeInTheDocument();
    });
  });

  it('displays price range correctly', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: () => Promise.resolve({ success: true, data: mockCarData }),
    } as Response);

    render(<CarDashboard carId="swift" onBack={() => {}} />);

    await waitFor(() => {
      const minPrices = screen.getAllByText('₹6.49 L');
      const maxPrices = screen.getAllByText('₹9.02 L');
      expect(minPrices.length).toBeGreaterThanOrEqual(1);
      expect(maxPrices.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('displays mileage from first transmission option', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: () => Promise.resolve({ success: true, data: mockCarData }),
    } as Response);

    render(<CarDashboard carId="swift" onBack={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText('24.8 km/l')).toBeInTheDocument();
    });
  });
});
