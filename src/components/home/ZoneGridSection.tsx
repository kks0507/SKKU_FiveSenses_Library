'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Mic,
  Music,
  PenTool,
  FileText,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

type Zone = {
  id: string;
  name: string;
  icon: string;
  status: string;
  count: number | null;
  href: string;
};

type Highlight = {
  type: string;
  title: string;
  subtitle: string;
  linkUrl: string;
};

type HomeData = {
  highlights: Highlight[];
  zones: Zone[];
};

/* ──────────────────────────────────────────────
   Zone configuration
   ────────────────────────────────────────────── */

interface ZoneConfig {
  icon: React.ReactNode;
  label: string;
  subtitle: string;
  href: string;
  // Tailwind classes for idle / hover states
  idleBg: string;
  idleBorder: string;
  idleText: string;
  hoverBg: string;
  hoverBorder: string;
  // Card gradient
  cardGradient: string;
  cardText: string;
  cardAccent: string;
}

const ZONE_CONFIG: Record<string, ZoneConfig> = {
  bookclub: {
    icon: <BookOpen className="h-7 w-7 md:h-8 md:w-8" />,
    label: '북클럽',
    subtitle: '함께 읽고 토론하는 북클럽 존',
    href: '/bookclub',
    idleBg: 'bg-green-50',
    idleBorder: 'border-green-100',
    idleText: 'text-green-700',
    hoverBg: 'group-hover:bg-green-100',
    hoverBorder: 'group-hover:border-green-300',
    cardGradient: 'from-green-600 to-green-700',
    cardText: 'text-white',
    cardAccent: 'bg-white/20',
  },
  narration: {
    icon: <Mic className="h-7 w-7 md:h-8 md:w-8" />,
    label: '낭독',
    subtitle: '소리 내어 완성하는 낭독 존',
    href: '/narration',
    idleBg: 'bg-purple-50',
    idleBorder: 'border-purple-100',
    idleText: 'text-purple-600',
    hoverBg: 'group-hover:bg-purple-100',
    hoverBorder: 'group-hover:border-purple-300',
    cardGradient: 'from-purple-600 to-purple-700',
    cardText: 'text-white',
    cardAccent: 'bg-white/20',
  },
  listening: {
    icon: <Music className="h-7 w-7 md:h-8 md:w-8" />,
    label: '듣기',
    subtitle: '듣고 읽어보는 듣기 존',
    href: '/listening',
    idleBg: 'bg-blue-50',
    idleBorder: 'border-blue-100',
    idleText: 'text-blue-600',
    hoverBg: 'group-hover:bg-blue-100',
    hoverBorder: 'group-hover:border-blue-300',
    cardGradient: 'from-blue-600 to-blue-700',
    cardText: 'text-white',
    cardAccent: 'bg-white/20',
  },
  writing: {
    icon: <PenTool className="h-7 w-7 md:h-8 md:w-8" />,
    label: '필사',
    subtitle: '따라 쓰며 새기는 필사 존',
    href: '/writing',
    idleBg: 'bg-amber-50',
    idleBorder: 'border-amber-100',
    idleText: 'text-amber-600',
    hoverBg: 'group-hover:bg-amber-100',
    hoverBorder: 'group-hover:border-amber-300',
    cardGradient: 'from-amber-500 to-amber-600',
    cardText: 'text-white',
    cardAccent: 'bg-white/20',
  },
  review: {
    icon: <FileText className="h-7 w-7 md:h-8 md:w-8" />,
    label: '서평',
    subtitle: '읽고 생각을 나누는 서평 존',
    href: '/review',
    idleBg: 'bg-red-50',
    idleBorder: 'border-red-100',
    idleText: 'text-red-500',
    hoverBg: 'group-hover:bg-red-100',
    hoverBorder: 'group-hover:border-red-300',
    cardGradient: 'from-red-500 to-red-600',
    cardText: 'text-white',
    cardAccent: 'bg-white/20',
  },
};

const ZONE_ORDER = ['bookclub', 'narration', 'listening', 'writing', 'review'];

/* ──────────────────────────────────────────────
   Helpers for highlight cards
   ────────────────────────────────────────────── */

function getHighlightCardForZone(
  zoneId: string,
  zones: Zone[],
  highlights: Highlight[],
): { title: string; status: string; href: string; zoneId: string } | null {
  const zone = zones.find((z) => z.id === zoneId);
  const highlight = highlights.find((h) => h.type === zoneId);

  if (zoneId === 'bookclub') {
    return {
      title: highlight?.title || '이달의 북클럽',
      status: zone?.status || '준비중',
      href: highlight?.linkUrl || '/bookclub',
      zoneId,
    };
  }
  if (zoneId === 'narration') {
    return {
      title: highlight?.title || '이달의 낭독',
      status: zone?.status || '준비중',
      href: highlight?.linkUrl || '/narration',
      zoneId,
    };
  }
  if (zoneId === 'writing' || zoneId === 'review') {
    return {
      title: highlight?.title || (zoneId === 'writing' ? '인기 필사' : '인기 서평'),
      status: zone?.status || '-',
      href: highlight?.linkUrl || `/${zoneId}`,
      zoneId,
    };
  }
  return null;
}

/* ──────────────────────────────────────────────
   Component
   ────────────────────────────────────────────── */

export default function ZoneGridSection() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/home')
      .then((res) => res.json())
      .then((json: HomeData) => {
        setZones(json.zones || []);
        setHighlights(json.highlights || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Build highlight cards: bookclub, narration, and first of writing/review that has data
  const highlightCards = loading
    ? []
    : [
        getHighlightCardForZone('bookclub', zones, highlights),
        getHighlightCardForZone('narration', zones, highlights),
        getHighlightCardForZone('writing', zones, highlights) ||
          getHighlightCardForZone('review', zones, highlights),
      ].filter(Boolean) as {
        title: string;
        status: string;
        href: string;
        zoneId: string;
      }[];

  return (
    <div className="w-full bg-background py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* ═══════════════════════════════════════
           Part 1: Zone Icon Grid
           ═══════════════════════════════════════ */}
        <div className="flex items-center justify-center mb-10 md:mb-12 relative">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
            활동 존
          </h2>
          <Link
            href="/bookclub"
            className="absolute right-0 inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary-hover"
          >
            참여하기
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Icon row */}
        {loading ? (
          <div className="flex flex-wrap items-start justify-center gap-6 md:gap-10">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className="h-16 w-16 md:h-20 md:w-20 animate-pulse rounded-full bg-warm-gray-200" />
                <div className="h-3 w-12 animate-pulse rounded bg-warm-gray-200" />
                <div className="h-2.5 w-20 animate-pulse rounded bg-warm-gray-100" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap items-start justify-center gap-6 md:gap-10">
            {ZONE_ORDER.map((zoneId) => {
              const config = ZONE_CONFIG[zoneId];
              const zone = zones.find((z) => z.id === zoneId);
              if (!config) return null;

              return (
                <Link
                  key={zoneId}
                  href={config.href}
                  className="group flex flex-col items-center gap-3 outline-none"
                >
                  {/* Circular icon */}
                  <div
                    className={`flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full border transition-all duration-300 ${config.idleBg} ${config.idleBorder} ${config.idleText} ${config.hoverBg} ${config.hoverBorder} group-hover:scale-110 group-hover:shadow-md`}
                  >
                    {config.icon}
                  </div>

                  {/* Label */}
                  <div className="text-center">
                    <span className="block text-[13px] md:text-sm font-semibold text-foreground">
                      {config.label}
                    </span>
                    <span className="block text-[11px] md:text-xs text-muted font-medium mt-0.5">
                      {config.subtitle}
                    </span>
                  </div>

                  {/* Status badge */}
                  {zone && (
                    <span className="inline-block rounded-full bg-warm-gray-100 px-2.5 py-0.5 text-[10px] font-semibold text-warm-gray-600">
                      {zone.status}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}

        {/* ═══════════════════════════════════════
           Part 2: Monthly Highlight Cards
           ═══════════════════════════════════════ */}
        <div className="mt-16 md:mt-20">
          <div className="flex items-center justify-center mb-10 md:mb-12 relative">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
              이달의 하이라이트
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-48 animate-pulse rounded-2xl bg-warm-gray-200"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {highlightCards.map((card, idx) => {
                const config = ZONE_CONFIG[card.zoneId];
                if (!config) return null;

                return (
                  <Link
                    key={`${card.zoneId}-${idx}`}
                    href={card.href}
                    className="group relative overflow-hidden rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    {/* Gradient background */}
                    <div
                      className={`bg-gradient-to-br ${config.cardGradient} p-6 md:p-8`}
                    >
                      {/* Decorative circle */}
                      <div
                        className={`absolute -right-6 -top-6 h-24 w-24 rounded-full ${config.cardAccent} blur-sm`}
                      />

                      {/* Zone icon (faded) */}
                      <div className="absolute right-4 top-4 opacity-20">
                        {config.icon}
                      </div>

                      {/* Content */}
                      <div className="relative">
                        {/* Status pill */}
                        <span
                          className={`mb-4 inline-block rounded-full ${config.cardAccent} px-3 py-1 text-xs font-semibold ${config.cardText}`}
                        >
                          {card.status}
                        </span>

                        {/* Title */}
                        <h3
                          className={`mb-2 text-lg md:text-xl font-bold leading-snug ${config.cardText}`}
                        >
                          {card.title}
                        </h3>

                        {/* Zone name */}
                        <p className="text-sm text-white/70">
                          {config.label} 존
                        </p>
                      </div>

                      {/* Arrow */}
                      <div className="mt-6 flex items-center gap-1.5 text-sm font-medium text-white/80 transition-all duration-200 group-hover:text-white">
                        <span>자세히 보기</span>
                        <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
