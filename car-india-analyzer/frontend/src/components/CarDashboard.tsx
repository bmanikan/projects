import { useState, useEffect } from 'react';
import { ArrowLeft, Cpu, TrendingUp, Shield, Sparkles, Globe, ChevronRight } from 'lucide-react';
import { api, CarData, formatPrice } from '../lib/api';
import OverviewTab from './tabs/OverviewTab';
import EngineTab from './tabs/EngineTab';
import SalesTab from './tabs/SalesTab';
import SafetyTab from './tabs/SafetyTab';
import AITab from './tabs/AITab';
import ScraperTab from './tabs/ScraperTab';
import clsx from 'clsx';

interface CarDashboardProps {
  carId: string;
  onBack: () => void;
}

const tabs = [
  { id: 'overview', label: 'Overview', icon: ChevronRight },
  { id: 'engine', label: 'Engine & Specs', icon: Cpu },
  { id: 'sales', label: 'Sales', icon: TrendingUp },
  { id: 'safety', label: 'Safety', icon: Shield },
  { id: 'ai', label: 'AI Analysis', icon: Sparkles },
  { id: 'scraper', label: 'Live Data', icon: Globe },
];

export default function CarDashboard({ carId, onBack }: CarDashboardProps) {
  const [car, setCar] = useState<CarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.getCar(carId)
      .then(setCar)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [carId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400 text-sm">Loading car data...</p>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Car not found'}</p>
          <button onClick={onBack} className="btn-ghost">← Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Nav */}
      <header className="sticky top-0 z-20 bg-zinc-950/80 backdrop-blur border-b border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">
          <button onClick={onBack} className="btn-ghost p-2">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-brand-500 flex items-center justify-center text-white text-xs font-bold">
              C
            </div>
            <span className="text-sm text-zinc-400">CarIQ</span>
          </div>
          <div className="h-4 w-px bg-zinc-700" />
          <span className="text-sm font-medium text-zinc-200">
            {car.brand} {car.model} {car.year}
          </span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto w-full px-4 py-6 flex-1">
        {/* Hero Card */}
        <div className="card p-6 mb-6 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-violet-500/5" />
          <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="badge bg-brand-500/20 text-brand-400">{car.brand}</span>
                <span className="badge bg-zinc-800 text-zinc-400">{car.year}</span>
              </div>
              <h1 className="text-3xl font-bold text-zinc-100 mb-1">{car.model}</h1>
              <p className="text-zinc-400 text-sm mb-4">{car.tagline}</p>
              <div className="flex items-center gap-3">
                <div>
                  <div className="text-xs text-zinc-500">Starting</div>
                  <div className="text-xl font-bold text-brand-400">{formatPrice(car.priceRange.min)}</div>
                </div>
                <div className="h-8 w-px bg-zinc-700" />
                <div>
                  <div className="text-xs text-zinc-500">Top Variant</div>
                  <div className="text-xl font-bold text-zinc-200">{formatPrice(car.priceRange.max)}</div>
                </div>
                <div className="h-8 w-px bg-zinc-700" />
                <div>
                  <div className="text-xs text-zinc-500">Mileage</div>
                  <div className="text-xl font-bold text-green-400">
                    {car.transmission.options[0]?.mileage}
                  </div>
                </div>
              </div>
            </div>
            {/* Car image */}
            <div className="sm:w-72 h-40 rounded-xl overflow-hidden bg-zinc-800/50 flex-shrink-0">
              <img
                src={car.image}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-1 overflow-x-auto pb-1 mb-6 scrollbar-none">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'tab-btn flex items-center gap-1.5 whitespace-nowrap flex-shrink-0',
                activeTab === tab.id ? 'tab-btn-active' : 'tab-btn-inactive'
              )}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="pb-12">
          {activeTab === 'overview' && <OverviewTab car={car} />}
          {activeTab === 'engine' && <EngineTab car={car} />}
          {activeTab === 'sales' && <SalesTab car={car} />}
          {activeTab === 'safety' && <SafetyTab car={car} />}
          {activeTab === 'ai' && <AITab car={car} />}
          {activeTab === 'scraper' && <ScraperTab car={car} />}
        </div>
      </div>
    </div>
  );
}
