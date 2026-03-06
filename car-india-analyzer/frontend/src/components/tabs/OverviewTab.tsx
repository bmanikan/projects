import { CarData, formatPrice } from '../../lib/api';
import { CheckCircle, XCircle, Info } from 'lucide-react';

export default function OverviewTab({ car }: { car: CarData }) {
  return (
    <div className="space-y-6 animate-slide-up">
      {/* Overview */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">About</h3>
        <p className="text-zinc-300 leading-relaxed text-sm">{car.overview}</p>
      </div>

      {/* Price & Variants quick view */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Variants & Pricing</h3>
        <div className="space-y-3">
          {car.variants.map(v => (
            <div key={v.name} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-800/40 hover:bg-zinc-800/70 transition-colors">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-zinc-100">{v.name}</span>
                  <span className="font-mono text-brand-400 text-sm">{formatPrice(v.price)}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {v.transmission.map(t => (
                    <span key={t} className="badge bg-zinc-700 text-zinc-300">{t}</span>
                  ))}
                  {v.highlights.slice(0, 3).map(h => (
                    <span key={h} className="badge bg-zinc-800 text-zinc-400">{h}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Available Colors</h3>
        <div className="flex flex-wrap gap-3">
          {car.colors.map(c => (
            <div key={c.name} className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full border-2 border-zinc-700 shadow-lg"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
              <span className="text-xs text-zinc-400">{c.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Competitors */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Competes Against</h3>
        <div className="flex flex-wrap gap-2">
          {car.competitors.map(c => (
            <span key={c} className="badge bg-zinc-800 border border-zinc-700 text-zinc-300">{c}</span>
          ))}
        </div>
      </div>

      {/* Warranty & Service */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Warranty</h3>
          <div className="space-y-2 text-sm">
            <div className="spec-row">
              <span className="text-zinc-400">Standard</span>
              <span className="text-zinc-200">{car.warranty.standard}</span>
            </div>
            <div className="spec-row">
              <span className="text-zinc-400">Extended</span>
              <span className="text-zinc-200">{car.warranty.extended}</span>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Maintenance</h3>
          <div className="space-y-2 text-sm">
            <div className="spec-row">
              <span className="text-zinc-400">Service Interval</span>
              <span className="text-zinc-200">{car.serviceInterval}</span>
            </div>
            <div className="spec-row">
              <span className="text-zinc-400">Annual Cost</span>
              <span className="text-zinc-200">{car.maintenanceCost.annualAvg as string}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
