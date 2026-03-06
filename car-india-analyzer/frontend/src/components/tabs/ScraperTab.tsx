import { useState } from 'react';
import { Globe, RefreshCw, ExternalLink, CheckCircle, XCircle } from 'lucide-react';
import { CarData, api } from '../../lib/api';

interface ScrapedData {
  expertReview: {
    pros: string[];
    cons: string[];
    summary: string;
    rating: string | null;
  } | null;
  livePricing: { prices: string[]; source: string } | null;
  userRatings: Record<string, string> | null;
  scrapedAt: string;
}

export default function ScraperTab({ car }: { car: CarData }) {
  const [data, setData] = useState<ScrapedData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runScrape = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.scrape(car.id);
      setData(result as ScrapedData);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Scraping failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Intro */}
      <div className="card p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Globe className="w-4 h-4 text-brand-400" />
              <h3 className="font-semibold text-zinc-100">Live Web Data</h3>
            </div>
            <p className="text-sm text-zinc-400">
              Scrapes CarDekho, Maruti Suzuki, and CarWale for real-time expert reviews, pricing, and ratings.
            </p>
          </div>
          <button
            onClick={runScrape}
            disabled={loading}
            className="btn-primary flex items-center gap-2 ml-4 flex-shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Scraping...' : 'Scrape Now'}
          </button>
        </div>
      </div>

      {error && (
        <div className="card p-4 bg-red-500/10 border-red-500/20">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {data && (
        <>
          {/* Status strip */}
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Expert Review', ok: !!data.expertReview },
              { label: 'Live Pricing', ok: !!data.livePricing },
              { label: 'User Ratings', ok: !!data.userRatings },
            ].map(({ label, ok }) => (
              <div key={label} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border ${ok ? 'bg-green-500/10 border-green-500/20 text-green-300' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}>
                {ok ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                {label}
              </div>
            ))}
            <div className="flex items-center gap-1 text-xs text-zinc-600 ml-auto">
              Scraped: {new Date(data.scrapedAt).toLocaleTimeString()}
            </div>
          </div>

          {/* Expert Review */}
          {data.expertReview ? (
            <div className="card p-5">
              <h3 className="font-semibold text-zinc-100 mb-4">Expert Review (CarDekho)</h3>
              {data.expertReview.rating && (
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-3xl font-bold text-brand-400">{data.expertReview.rating}</span>
                  <span className="text-zinc-400 text-sm">/ 10</span>
                </div>
              )}
              {data.expertReview.summary && (
                <p className="text-sm text-zinc-300 mb-4 bg-zinc-800/30 rounded-xl p-3 leading-relaxed">
                  {data.expertReview.summary}
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.expertReview.pros.length > 0 && (
                  <div>
                    <div className="text-xs text-green-400 uppercase tracking-wide mb-2">Pros</div>
                    <ul className="space-y-1">
                      {data.expertReview.pros.map((p, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                          <span className="text-green-400 mt-0.5">+</span>{p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {data.expertReview.cons.length > 0 && (
                  <div>
                    <div className="text-xs text-red-400 uppercase tracking-wide mb-2">Cons</div>
                    <ul className="space-y-1">
                      {data.expertReview.cons.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                          <span className="text-red-400 mt-0.5">-</span>{c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {data.expertReview.pros.length === 0 && data.expertReview.cons.length === 0 && !data.expertReview.summary && (
                <p className="text-sm text-zinc-500">Review content was not extractable from the page (site structure may have changed).</p>
              )}
            </div>
          ) : (
            <div className="card p-4">
              <p className="text-sm text-zinc-500">Expert review scraping failed — CarDekho may have blocked the request or changed their page structure.</p>
            </div>
          )}

          {/* Live Pricing */}
          {data.livePricing && data.livePricing.prices.length > 0 && (
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-zinc-100">Live Pricing from Maruti</h3>
                <a
                  href={data.livePricing.source}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-zinc-500 hover:text-brand-400 flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" /> Source
                </a>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.livePricing.prices.map((p, i) => (
                  <span key={i} className="badge bg-zinc-800 border border-zinc-700 text-zinc-200 text-sm">{p}</span>
                ))}
              </div>
            </div>
          )}

          {/* User Ratings */}
          {data.userRatings && Object.keys(data.userRatings).length > 0 && (
            <div className="card p-5">
              <h3 className="font-semibold text-zinc-100 mb-4">User Ratings by Category (CarWale)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(data.userRatings).map(([k, v]) => (
                  <div key={k} className="bg-zinc-800/40 rounded-xl p-3">
                    <div className="text-xs text-zinc-500 mb-1">{k}</div>
                    <div className="text-lg font-bold text-brand-400">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {!data && !loading && (
        <div className="card p-8 text-center">
          <Globe className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-500 text-sm">Click "Scrape Now" to fetch live data from the web</p>
          <p className="text-zinc-600 text-xs mt-1">Sources: CarDekho, Maruti Suzuki, CarWale</p>
        </div>
      )}
    </div>
  );
}
