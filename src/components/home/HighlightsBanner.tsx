'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Play, Pause } from 'lucide-react';

type Highlight = {
  type: string;
  title: string;
  subtitle: string;
  linkUrl: string;
};

const ZONE_GRADIENTS: Record<string, string> = {
  bookclub: 'from-green-900 to-green-700',
  narration: 'from-purple-900 to-purple-700',
  writing: 'from-amber-900 to-amber-700',
  listening: 'from-blue-900 to-blue-700',
  review: 'from-red-900 to-red-700',
};

const ZONE_LABELS: Record<string, string> = {
  bookclub: '북클럽',
  narration: '낭독',
  writing: '필사',
  listening: '듣기',
  review: '서평',
};

export default function HighlightsBanner() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHighlights() {
      try {
        const res = await fetch('/api/home');
        if (!res.ok) throw new Error('Failed');
        const json = await res.json();
        setHighlights(json.highlights || []);
      } catch {
        // fallback
      } finally {
        setLoading(false);
      }
    }
    fetchHighlights();
  }, []);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % highlights.length);
  }, [highlights.length]);

  useEffect(() => {
    if (!playing || highlights.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [playing, highlights.length, next]);

  if (loading) {
    return (
      <div className="h-[320px] w-full animate-pulse bg-warm-gray-200 sm:h-[400px] md:h-[480px]" />
    );
  }

  if (highlights.length === 0) return null;

  const item = highlights[current];
  const gradient = ZONE_GRADIENTS[item.type] || 'from-green-900 to-green-700';

  return (
    <div className="relative h-[320px] w-full overflow-hidden sm:h-[400px] md:h-[480px]">
      {/* Background gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-all duration-700`}
      />

      {/* Decorative circles */}
      <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/5" />
      <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-white/5" />

      {/* Content */}
      <Link href={item.linkUrl} className="relative flex h-full items-center">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <span className="mb-4 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {ZONE_LABELS[item.type] || item.type}
          </span>
          <h2 className="mb-3 max-w-2xl text-2xl font-bold text-white md:text-4xl lg:text-5xl">
            {item.title}
          </h2>
          {item.subtitle && (
            <p className="max-w-xl text-base text-white/80 md:text-lg">
              {item.subtitle}
            </p>
          )}
        </div>
      </Link>

      {/* Bottom controls */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full bg-black/70 px-4 py-2 backdrop-blur-sm">
        {highlights.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all ${
              i === current ? 'w-6 bg-white' : 'w-2 bg-white/40'
            }`}
            aria-label={`슬라이드 ${i + 1}`}
          />
        ))}
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="ml-1 flex h-6 w-6 items-center justify-center rounded-full text-white/70 transition-colors hover:text-white"
          aria-label={playing ? '일시정지' : '재생'}
        >
          {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}
