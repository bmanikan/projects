import { useState } from 'react';
import { Sparkles, Send, RefreshCw, MessageSquare } from 'lucide-react';
import { CarData, api } from '../../lib/api';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AITab({ car }: { car: CarData }) {
  const [fullAnalysis, setFullAnalysis] = useState<string | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [variantAdvice, setVariantAdvice] = useState<string | null>(null);
  const [loadingVariant, setLoadingVariant] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState('');
  const [loadingQ, setLoadingQ] = useState(false);

  const fetchAnalysis = async () => {
    setLoadingAnalysis(true);
    try {
      const res = await api.aiAnalysis(car.id);
      setFullAnalysis(res.analysis);
    } catch (e: unknown) {
      setFullAnalysis(`Error: ${e instanceof Error ? e.message : 'Unknown error'}`);
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const fetchVariantAdvice = async () => {
    setLoadingVariant(true);
    try {
      const res = await api.variantAdvice(car.id);
      setVariantAdvice(res.recommendation);
    } catch (e: unknown) {
      setVariantAdvice(`Error: ${e instanceof Error ? e.message : 'Unknown error'}`);
    } finally {
      setLoadingVariant(false);
    }
  };

  const askQuestion = async () => {
    if (!question.trim()) return;
    const q = question.trim();
    setQuestion('');
    setMessages(prev => [...prev, { role: 'user', content: q }]);
    setLoadingQ(true);
    try {
      const res = await api.askQuestion(car.id, q);
      setMessages(prev => [...prev, { role: 'assistant', content: res.analysis }]);
    } catch (e: unknown) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${e instanceof Error ? e.message : 'Unknown error'}` }]);
    } finally {
      setLoadingQ(false);
    }
  };

  const quickQuestions = [
    'Is the Swift good for highway driving?',
    'Compare ZXi vs ZXi+ — worth the extra price?',
    'How does Swift handle Indian potholes?',
    'What are the common problems with Swift?',
  ];

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header note */}
      <div className="card p-4 bg-brand-500/5 border-brand-500/20">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-brand-400" />
          <span className="text-sm font-medium text-brand-300">Powered by Claude AI</span>
        </div>
        <p className="text-xs text-zinc-400">
          Requires ANTHROPIC_API_KEY in backend .env. All analysis is AI-generated based on the car's spec data.
        </p>
      </div>

      {/* Full Analysis */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-zinc-100">Comprehensive Analysis</h3>
          <button
            onClick={fetchAnalysis}
            disabled={loadingAnalysis}
            className="btn-primary text-sm flex items-center gap-2"
          >
            <Sparkles className={`w-3.5 h-3.5 ${loadingAnalysis ? 'animate-pulse' : ''}`} />
            {loadingAnalysis ? 'Analyzing...' : fullAnalysis ? 'Refresh' : 'Generate'}
          </button>
        </div>
        {fullAnalysis ? (
          <div className="prose-dark">
            <ReactMarkdown>{fullAnalysis}</ReactMarkdown>
          </div>
        ) : (
          <div className="text-sm text-zinc-500 text-center py-8 bg-zinc-800/20 rounded-xl">
            Get a comprehensive expert analysis of the {car.brand} {car.model}
          </div>
        )}
      </div>

      {/* Variant Advisor */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-zinc-100">Which Variant Should You Buy?</h3>
          <button
            onClick={fetchVariantAdvice}
            disabled={loadingVariant}
            className="btn-ghost text-sm flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingVariant ? 'animate-spin' : ''}`} />
            {loadingVariant ? 'Thinking...' : 'Ask AI'}
          </button>
        </div>
        {variantAdvice ? (
          <div className="prose-dark text-sm">
            <ReactMarkdown>{variantAdvice}</ReactMarkdown>
          </div>
        ) : (
          <div className="text-sm text-zinc-500 text-center py-6 bg-zinc-800/20 rounded-xl">
            AI will recommend the best variant for your needs
          </div>
        )}
      </div>

      {/* Q&A Chat */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-4 h-4 text-brand-400" />
          <h3 className="font-semibold text-zinc-100">Ask Anything</h3>
        </div>

        {/* Quick Questions */}
        <div className="flex flex-wrap gap-2 mb-4">
          {quickQuestions.map(q => (
            <button
              key={q}
              onClick={() => setQuestion(q)}
              className="text-xs px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-full text-zinc-300 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Messages */}
        {messages.length > 0 && (
          <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                    m.role === 'user'
                      ? 'bg-brand-500 text-white'
                      : 'bg-zinc-800 text-zinc-200'
                  }`}
                >
                  {m.role === 'assistant' ? (
                    <div className="prose-dark">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  ) : (
                    m.content
                  )}
                </div>
              </div>
            ))}
            {loadingQ && (
              <div className="flex justify-start">
                <div className="bg-zinc-800 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && askQuestion()}
            placeholder={`Ask about the ${car.model}...`}
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand-500 transition-colors"
          />
          <button
            onClick={askQuestion}
            disabled={loadingQ || !question.trim()}
            className="btn-primary px-3 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
