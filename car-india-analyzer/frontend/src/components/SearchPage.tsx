import { useState, useEffect } from 'react';
import { Search, Zap, TrendingUp, Shield, Cpu } from 'lucide-react';
import { api, CarSummary, formatPrice } from '../lib/api';
import clsx from 'clsx';

interface SearchPageProps {
  onSelect: (id: string) => void;
}

const features = [
  { icon: Cpu, label: 'Engine & Specs', desc: 'Detailed technical breakdown' },
  { icon: TrendingUp, label: 'Sales Reports', desc: 'Monthly & annual trends' },
  { icon: Shield, label: 'Safety Analysis', desc: 'Ratings & crash data' },
  { icon: Zap, label: 'AI Intelligence', desc: 'Claude-powered insights' },
];

export default function SearchPage({ onSelect }: SearchPageProps) {
  const [cars, setCars] = useState<CarSummary[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCars().then(setCars).finally(() => setLoading(false));
  }, []);

  const filtered = cars.filter(
    c =>
      c.model.toLowerCase().includes(query.toLowerCase()) ||
      c.brand.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white font-bold text-lg">
            C
          </div>
          <span className="text-xl font-semibold text-zinc-100">CarIQ India</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl font-bold text-center text-zinc-100 leading-tight mb-4">
          Know your car,{' '}
          <span className="gradient-text">inside out</span>
        </h1>
        <p className="text-zinc-400 text-center text-lg max-w-md mb-12">
          AI-powered intelligence on every Maruti car — specs, sales trends, and expert analysis.
        </p>

        {/* Search */}
        <div className="w-full max-w-lg relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search a car model... (e.g., Swift)"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-12 pr-4 py-4 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-base"
          />
        </div>

        {/* Car Grid */}
        <div className="w-full max-w-4xl">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="card p-4 animate-pulse">
                  <div className="h-36 bg-zinc-800 rounded-lg mb-3" />
                  <div className="h-4 bg-zinc-800 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-zinc-800 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(car => (
                <button
                  key={car.id}
                  onClick={() => onSelect(car.id)}
                  className={clsx(
                    'card p-0 text-left hover:border-brand-500/50 hover:bg-zinc-800/50 transition-all group cursor-pointer overflow-hidden',
                    'animate-fade-in'
                  )}
                >
                  <img
                    src={car.image}
                    alt={car.model}
                    className="w-full h-36 object-cover bg-zinc-800"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <div className="text-xs text-zinc-500 mb-0.5">{car.brand}</div>
                        <div className="font-semibold text-zinc-100 text-base group-hover:text-brand-400 transition-colors">
                          {car.model}
                        </div>
                      </div>
                      <span className="badge bg-zinc-800 text-zinc-400">{car.year}</span>
                    </div>
                    <p className="text-xs text-zinc-500 mb-3 line-clamp-1">{car.tagline}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-brand-400">
                        {formatPrice(car.priceRange.min)} – {formatPrice(car.priceRange.max)}
                      </span>
                      <span className="text-xs text-zinc-600 group-hover:text-zinc-400 transition-colors">
                        Explore →
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-zinc-500">
              {query ? `No cars found for "${query}"` : 'No cars available'}
            </div>
          )}
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-2 mt-12">
          {features.map(f => (
            <div key={f.label} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full">
              <f.icon className="w-3.5 h-3.5 text-brand-400" />
              <span className="text-xs text-zinc-400">{f.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-zinc-600 border-t border-zinc-800">
        CarIQ India · Data sourced from Maruti Suzuki, SIAM, CarDekho & Claude AI
      </footer>
    </div>
  );
}
