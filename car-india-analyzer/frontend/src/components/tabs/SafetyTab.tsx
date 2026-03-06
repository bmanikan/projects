import { CarData } from '../../lib/api';
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

function SafetyBadge({ active, label }: { active: boolean | string; label: string }) {
  const isActive = active === true || (typeof active === 'string' && active !== 'N/A');
  return (
    <div className={`flex items-center gap-2 p-3 rounded-xl ${isActive ? 'bg-green-500/10 border border-green-500/20' : 'bg-zinc-800/40 border border-zinc-700/40'}`}>
      {isActive
        ? <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
        : <XCircle className="w-4 h-4 text-zinc-600 flex-shrink-0" />}
      <span className={`text-sm ${isActive ? 'text-zinc-200' : 'text-zinc-500'}`}>{label}</span>
      {typeof active === 'string' && active !== 'N/A' && active !== 'true' && (
        <span className="ml-auto text-xs text-zinc-500">{active}</span>
      )}
    </div>
  );
}

export default function SafetyTab({ car }: { car: CarData }) {
  const s = car.safety as Record<string, unknown>;
  const airbags = s.airbags as { count: number; details: string };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* NCAP Note */}
      <div className="card p-5 border-amber-500/20 bg-amber-500/5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-300 text-sm mb-1">NCAP Rating</p>
            <p className="text-zinc-400 text-sm">{s.ncapRating as string} — Global NCAP has not tested the 2024 Swift. Check the official NCAP website for updated ratings.</p>
          </div>
        </div>
      </div>

      {/* Airbags */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-brand-400" />
          <h3 className="font-semibold text-zinc-100">Airbag System</h3>
        </div>
        <div className="flex items-center gap-4 mb-3">
          <div className="text-4xl font-bold text-brand-400">{airbags.count}</div>
          <div>
            <div className="text-sm font-medium text-zinc-200">Airbags</div>
            <div className="text-xs text-zinc-400">{airbags.details}</div>
          </div>
        </div>
      </div>

      {/* Safety Features Grid */}
      <div className="card p-5">
        <h3 className="font-semibold text-zinc-100 mb-4">Active Safety Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <SafetyBadge active={s.abs as boolean} label="ABS (Anti-lock Braking)" />
          <SafetyBadge active={s.ebd as boolean} label="EBD (Electronic Brake Distribution)" />
          <SafetyBadge active={s.esp as string} label={`ESP (Electronic Stability Program) — ${s.esp}`} />
          <SafetyBadge active={s.hillHoldControl as boolean} label="Hill Hold Control" />
          <SafetyBadge active={s.rearParkingSensors as boolean} label="Rear Parking Sensors" />
          <SafetyBadge active={s.rearCamera as string} label={`Rear Camera — ${s.rearCamera}`} />
          <SafetyBadge active={s.isofix as boolean} label="ISOFIX Child Seat Anchors" />
          <SafetyBadge active={s.tyrePressureMonitor as string} label={`TPMS — ${s.tyrePressureMonitor}`} />
        </div>
      </div>

      {/* Seat Belt Reminder */}
      <div className="card p-5">
        <h3 className="font-semibold text-zinc-100 mb-3">Passive Safety</h3>
        <div className="space-y-2 text-sm">
          <div className="spec-row">
            <span className="text-zinc-400">Seatbelt Reminder</span>
            <span className="text-zinc-200">{s.seatbeltReminder as string}</span>
          </div>
          <div className="spec-row">
            <span className="text-zinc-400">Child Safety Locks</span>
            <span className="text-green-400">Standard on all variants</span>
          </div>
          <div className="spec-row">
            <span className="text-zinc-400">High-Strength Steel Body</span>
            <span className="text-green-400">TECT Body Structure</span>
          </div>
          <div className="spec-row">
            <span className="text-zinc-400">Speed Alert System</span>
            <span className="text-green-400">All variants (Govt. mandated)</span>
          </div>
        </div>
      </div>

      {/* Safety Note */}
      <div className="card p-4 bg-zinc-800/30">
        <p className="text-xs text-zinc-500 leading-relaxed">
          <strong className="text-zinc-400">Note:</strong> Safety features vary by variant. ZXi+ gets the most comprehensive safety package including 6 airbags, ESP, rear disc brakes, TPMS, and Suzuki Connect for live tracking. India's Bharat NCAP program may include this model in future test cycles.
        </p>
      </div>
    </div>
  );
}
