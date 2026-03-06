import { CarData } from '../../lib/api';
import { Zap, Gauge, Fuel, Settings } from 'lucide-react';

function SpecCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-zinc-800/50 rounded-xl p-4 flex flex-col gap-1">
      <span className="text-xs text-zinc-500 uppercase tracking-wide">{label}</span>
      <span className="text-lg font-semibold text-zinc-100">{value}</span>
      {sub && <span className="text-xs text-zinc-500">{sub}</span>}
    </div>
  );
}

export default function EngineTab({ car }: { car: CarData }) {
  const e = car.engine as Record<string, unknown>;
  const trans = car.transmission.options;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SpecCard label="Max Power" value={e.maxPower as string} />
        <SpecCard label="Max Torque" value={e.maxTorque as string} />
        <SpecCard label="Displacement" value={e.displacement as string} />
        <SpecCard label="Cylinders" value={`${e.cylinders}-cylinder`} sub={`${e.valves} valves`} />
      </div>

      {/* Engine Details */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-4 h-4 text-brand-400" />
          <h3 className="font-semibold text-zinc-100">Engine Specifications</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
          {[
            ['Engine Type', e.type],
            ['Displacement', e.displacement],
            ['Max Power', e.maxPower],
            ['Max Torque', e.maxTorque],
            ['Bore × Stroke', e.boreStroke],
            ['Compression Ratio', e.compressionRatio],
            ['Fuel Type', e.fuelType],
            ['Emission Norm', e.emissionNorm],
            ['Idle Start-Stop', e.idleStartStop ? 'Yes' : 'No'],
          ].map(([k, v]) => (
            <div key={k as string} className="spec-row">
              <span className="text-sm text-zinc-400">{k as string}</span>
              <span className="text-sm font-medium text-zinc-200">{v as string}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Transmission */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Gauge className="w-4 h-4 text-brand-400" />
          <h3 className="font-semibold text-zinc-100">Transmission Options</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {trans.map(t => (
            <div key={t.type} className="bg-zinc-800/40 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-zinc-100">{t.name}</span>
                <span className="badge bg-brand-500/20 text-brand-400">{t.type}</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Gears</span>
                  <span className="text-zinc-200">{t.gears}-speed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">ARAI Mileage</span>
                  <span className="text-green-400 font-medium">{t.mileage}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suspension */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-brand-400" />
          <h3 className="font-semibold text-zinc-100">Suspension System</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(['front', 'rear'] as const).map(side => {
            const s = car.suspension[side];
            return (
              <div key={side} className="bg-zinc-800/40 rounded-xl p-4">
                <div className="text-xs text-zinc-500 uppercase tracking-wide mb-1">{side}</div>
                <div className="font-semibold text-brand-400 mb-2">{s.type}</div>
                <p className="text-xs text-zinc-400 leading-relaxed">{s.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Steering */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Fuel className="w-4 h-4 text-brand-400" />
          <h3 className="font-semibold text-zinc-100">Steering & Brakes</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
          <div>
            <div className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Steering</div>
            {Object.entries(car.steering).map(([k, v]) => (
              <div key={k} className="spec-row">
                <span className="text-sm text-zinc-400 capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span className="text-sm text-zinc-200">{v}</span>
              </div>
            ))}
          </div>
          <div>
            <div className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Brakes</div>
            {Object.entries(car.brakes).map(([k, v]) => (
              <div key={k} className="spec-row">
                <span className="text-sm text-zinc-400 capitalize">{k}</span>
                <span className="text-sm text-zinc-200">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dimensions */}
      <div className="card p-5">
        <h3 className="font-semibold text-zinc-100 mb-4">Dimensions & Capacity</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            ['Length', `${(car.dimensions as Record<string, unknown>).length} mm`],
            ['Width', `${(car.dimensions as Record<string, unknown>).width} mm`],
            ['Height', `${(car.dimensions as Record<string, unknown>).height} mm`],
            ['Wheelbase', `${(car.dimensions as Record<string, unknown>).wheelbase} mm`],
            ['Ground Clearance', `${(car.dimensions as Record<string, unknown>).groundClearance} mm`],
            ['Boot Space', `${(car.dimensions as Record<string, unknown>).bootSpace} L`],
            ['Fuel Tank', `${(car.dimensions as Record<string, unknown>).fuelTankCapacity} L`],
            ['Tyre Size', (car.dimensions as Record<string, unknown>).tyreSize as string],
          ].map(([k, v]) => (
            <div key={k} className="bg-zinc-800/30 rounded-lg p-3">
              <div className="text-xs text-zinc-500 mb-1">{k}</div>
              <div className="text-sm font-medium text-zinc-200">{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
