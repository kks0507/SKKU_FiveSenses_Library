'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Sparkles, ChevronRight } from 'lucide-react';

type Highlight = {
  type: string;
  title: string;
  subtitle: string;
  linkUrl: string;
};

type HomeData = {
  highlights: Highlight[];
};

const highlightDotColor: Record<string, string> = {
  bookclub: 'bg-green-600',
  narration: 'bg-purple-500',
  writing: 'bg-amber-500',
  listening: 'bg-blue-500',
  review: 'bg-red-500',
};

export default function HeroBanner() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChipIndex, setActiveChipIndex] = useState(0);
  const [chipVisible, setChipVisible] = useState(true);

  useEffect(() => {
    fetch('/api/home')
      .then((res) => res.json())
      .then((json: HomeData) => {
        setHighlights(json.highlights || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Auto-cycle through highlight chips every 4 seconds with fade transition
  const cycleChips = useCallback(() => {
    if (highlights.length <= 3) return;

    setChipVisible(false);
    setTimeout(() => {
      setActiveChipIndex((prev) => (prev + 1) % Math.max(1, highlights.length - 2));
      setChipVisible(true);
    }, 400);
  }, [highlights.length]);

  useEffect(() => {
    if (highlights.length <= 3) return;
    const interval = setInterval(cycleChips, 4000);
    return () => clearInterval(interval);
  }, [cycleChips, highlights.length]);

  // Get the 3 visible chips (sliding window for > 3 highlights)
  const visibleHighlights =
    highlights.length <= 3
      ? highlights
      : highlights.slice(activeChipIndex, activeChipIndex + 3).length === 3
        ? highlights.slice(activeChipIndex, activeChipIndex + 3)
        : [
            ...highlights.slice(activeChipIndex),
            ...highlights.slice(0, 3 - (highlights.length - activeChipIndex)),
          ];

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, #FDF8ED 0%, #f3fae8 30%, #FDF8ED 60%, #fffbeb 100%)',
        }}
      />

      {/* Subtle decorative circles */}
      <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-green-100/30 blur-3xl" />
      <div className="absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-amber-100/30 blur-3xl" />

      {/* Main content */}
      <div className="relative flex min-h-[320px] items-center justify-center sm:min-h-[400px] md:min-h-[440px]">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            {/* Badge pill */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1.5 text-sm font-medium text-green-800">
              <Sparkles className="h-4 w-4" />
              <span>성균관대학교 학술정보관</span>
            </div>

            {/* Main heading */}
            <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              오감으로 읽다,{' '}
              <span className="text-primary">오거서</span>
            </h1>

            {/* Subtitle */}
            <p className="mb-8 text-base leading-relaxed text-muted sm:text-lg">
              읽고, 듣고, 쓰고, 말하고, 느끼는 — 다섯 가지 감각으로 독서를
              경험하세요.
            </p>

            {/* Highlight chips */}
            {loading ? (
              <div className="flex flex-wrap justify-center gap-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-44 animate-pulse rounded-full bg-warm-gray-200/60"
                  />
                ))}
              </div>
            ) : (
              highlights.length > 0 && (
                <div
                  className={`flex flex-wrap justify-center gap-3 transition-opacity duration-400 ${
                    chipVisible ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  {visibleHighlights.map((h, idx) => (
                    <Link
                      key={`${h.type}-${idx}`}
                      href={h.linkUrl}
                      className="group inline-flex items-center gap-2 rounded-full bg-card-bg px-4 py-2.5 text-sm font-medium text-warm-gray-700 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                      <span
                        className={`inline-block h-2 w-2 rounded-full ${
                          highlightDotColor[h.type] || 'bg-green-500'
                        }`}
                      />
                      <span className="max-w-[200px] truncate">{h.title}</span>
                      <ChevronRight className="h-3.5 w-3.5 text-muted transition-transform duration-200 group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Bottom wave / gradient fade to white */}
      <div className="relative h-16 w-full sm:h-20">
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ height: '100%' }}
        >
          <path
            d="M0 40C240 10 480 60 720 40C960 20 1200 60 1440 30V80H0V40Z"
            fill="var(--background)"
          />
        </svg>
      </div>
    </section>
  );
}
