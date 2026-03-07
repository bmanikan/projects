import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { CarData, api, formatUnits } from '../../lib/api';
import { TrendingUp, Award, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const BRAND_COLOR = '#3b6eff';

function CustomTooltip({ active, payload, label }: Record<string, unknown>) {
  if (active && Array.isArray(payload) && payload.length) {
    return (
      <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-sm shadow-xl">
        <p className="text-zinc-300 font-medium mb-1">{label as string}</p>
        <p className="text-brand-400 font-semibold">{formatUnits((payload[0] as {value: number}).value)} units</p>
      </div>
    );
  }
  return null;
}

export default function SalesTab({ car }: { car: CarData }) {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const maxMonthly = Math.max(...car.salesData.monthly.map(d => d.units));

  const fetchInsight = async () => {
    setLoading(true);
    try {
      const res = await api.salesInsight(car.id);
      setInsight(res.insight);
    } catch {
      setInsight('AI insight unavailable. Please configure ANTHROPIC_API_KEY.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="card p-4">
          <div className="text-xs text-zinc-500 mb-1">Market Share</div>
          <div className="text-xl font-bold text-zinc-100">~12%</div>
          <div className="text-xs text-zinc-500">Hatchback segment</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-zinc-500 mb-1">Segment Rank</div>
          <div className="text-xl font-bold text-brand-400">#1</div>
          <div className="text-xs text-zinc-500">B-segment 2024</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-zinc-500 mb-1">Best Month</div>
          <div className="text-xl font-bold text-green-400">{formatUnits(maxMonthly)}</div>
          <div className="text-xs text-zinc-500">
            {car.salesData.monthly.find(d => d.units === maxMonthly)?.month}
          </div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-zinc-500 mb-1">FY 24-25 Total</div>
          <div className="text-xl font-bold text-zinc-100">
            {formatUnits(car.salesData.monthly.reduce((s, d) => s + d.units, 0))}
          </div>
          <div className="text-xs text-zinc-500">Projected</div>
        </div>
      </div>

      {/* Monthly Sales Chart */}
      <div className="card p-5">
        <h3 className="font-semibold text-zinc-100 mb-5">Monthly Sales (FY 2024-25)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={car.salesData.monthly} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
            <defs>
              <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={BRAND_COLOR} stopOpacity={0.3} />
                <stop offset="95%" stopColor={BRAND_COLOR} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis
              dataKey="month"
              tick={{ fill: '#71717a', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={v => v.split(' ')[0]}
            />
            <YAxis
              tick={{ fill: '#71717a', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatUnits}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="units"
              stroke={BRAND_COLOR}
              strokeWidth={2}
              fill="url(#salesGrad)"
              dot={{ fill: BRAND_COLOR, r: 3 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Annual Sales Chart */}
      <div className="card p-5">
        <h3 className="font-semibold text-zinc-100 mb-5">Annual Sales (FY 2020–2025)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={car.salesData.annual} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis
              dataKey="year"
              tick={{ fill: '#71717a', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={v => v.replace('FY ', '')}
            />
            <YAxis
              tick={{ fill: '#71717a', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatUnits}
            />
            <Tooltip
              content={({ active, payload, label }) =>
                active && payload?.length ? (
                  <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-sm">
                    <p className="text-zinc-300 font-medium mb-1">{label}</p>
                    <p className="text-brand-400 font-semibold">{formatUnits(payload[0].value as number)} units</p>
                  </div>
                ) : null
              }
            />
            <Bar dataKey="units" radius={[6, 6, 0, 0]}>
              {car.salesData.annual.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.note ? '#3b6eff' : '#27272a'}
                  stroke={entry.note ? '#3b6eff' : '#3f3f46'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-zinc-600 mt-2">Blue bar = projected FY 2024-25</p>
      </div>

      {/* AI Sales Insight */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-400" />
            <h3 className="font-semibold text-zinc-100">AI Sales Intelligence</h3>
          </div>
          <button
            onClick={fetchInsight}
            disabled={loading}
            className="btn-ghost text-xs flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Analyzing...' : insight ? 'Refresh' : 'Analyze with AI'}
          </button>
        </div>
        {insight ? (
          <div className="prose-dark text-sm">
            <ReactMarkdown>{insight}</ReactMarkdown>
          </div>
        ) : (
          <div className="text-sm text-zinc-500 bg-zinc-800/30 rounded-xl p-4 text-center">
            Click "Analyze with AI" to get Claude's expert sales analysis
          </div>
        )}
      </div>
    </div>
  );
}
