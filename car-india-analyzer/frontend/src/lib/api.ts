const BASE = '/api';

export interface CarSummary {
  id: string;
  brand: string;
  model: string;
  year: number;
  tagline: string;
  priceRange: { min: number; max: number };
  image: string;
}

export interface CarData {
  id: string;
  brand: string;
  model: string;
  year: number;
  tagline: string;
  overview: string;
  priceRange: { min: number; max: number };
  image: string;
  engine: Record<string, unknown>;
  transmission: { options: Array<{ type: string; name: string; gears: number; mileage: string }> };
  suspension: { front: { type: string; description: string }; rear: { type: string; description: string } };
  steering: Record<string, string>;
  brakes: Record<string, string>;
  dimensions: Record<string, unknown>;
  safety: Record<string, unknown>;
  variants: Array<{ name: string; price: number; transmission: string[]; highlights: string[] }>;
  features: Record<string, unknown>;
  competitors: string[];
  salesData: {
    monthly: Array<{ month: string; units: number }>;
    annual: Array<{ year: string; units: number; note?: string }>;
    marketShare: string;
    ranking: string;
  };
  colors: Array<{ name: string; hex: string }>;
  warranty: Record<string, string>;
  serviceInterval: string;
  maintenanceCost: Record<string, string | number>;
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error);
  return json.data as T;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error);
  return json.data as T;
}

export const api = {
  getCars: () => get<CarSummary[]>('/cars'),
  getCar: (id: string) => get<CarData>(`/cars/${id}`),
  scrape: (id: string) => get<unknown>(`/cars/${id}/scrape`),
  aiAnalysis: (id: string) => get<{ analysis: string; generatedAt: string }>(`/cars/${id}/ai-analysis`),
  variantAdvice: (id: string) => get<{ recommendation: string }>(`/cars/${id}/variants`),
  salesInsight: (id: string) => get<{ insight: string }>(`/cars/${id}/sales-insight`),
  askQuestion: (id: string, question: string) =>
    post<{ analysis: string }>(`/cars/${id}/ask`, { question }),
};

export function formatPrice(paise: number) {
  const lakh = paise / 100000;
  return `₹${lakh.toFixed(2)} L`;
}

export function formatUnits(n: number) {
  if (n >= 100000) return `${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}
