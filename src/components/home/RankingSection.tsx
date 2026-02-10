'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trophy, Users, Medal, ChevronRight } from 'lucide-react';

/* ──────────────────────────────────────────────
   Types (matching /api/ranking response)
   ────────────────────────────────────────────── */

type PersonalRank = {
  rank: number;
  userId: string;
  name: string;
  department: string;
  cumulativePoints: number;
};

type LCRank = {
  rank: number;
  lcId: string;
  name: string;
  totalPoints: number;
  avgPoints: number;
  memberCount: number;
};

type RankingData = {
  personalRanking: PersonalRank[];
  lcRanking: LCRank[];
};

/* ──────────────────────────────────────────────
   Filter configuration
   ────────────────────────────────────────────── */

type FilterKey = 'all' | 'personal' | 'lc';

const FILTERS: { key: FilterKey; label: string; emoji: string }[] = [
  { key: 'all', label: '전체', emoji: '⭐' },
  { key: 'personal', label: '개인', emoji: '🏅' },
  { key: 'lc', label: 'LC', emoji: '👥' },
];

/* ──────────────────────────────────────────────
   Helpers
   ────────────────────────────────────────────── */

const rankMedals = ['🥇', '🥈', '🥉'];

function getRankBorderClass(rank: number): string {
  switch (rank) {
    case 1:
      return 'border-l-4 border-l-amber-400';
    case 2:
      return 'border-l-4 border-l-warm-gray-300';
    case 3:
      return 'border-l-4 border-l-amber-600';
    default:
      return '';
  }
}

/* ──────────────────────────────────────────────
   Component
   ────────────────────────────────────────────── */

export default function RankingSection() {
  const [data, setData] = useState<RankingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  useEffect(() => {
    fetch('/api/ranking')
      .then((res) => res.json())
      .then((json: RankingData) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const showPersonalList = activeFilter === 'all' || activeFilter === 'personal';
  const showLcCards = activeFilter === 'lc';

  return (
    <div className="w-full bg-cream py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* ═══ Section header ═══ */}
        <div className="flex items-center justify-center mb-10 md:mb-12 relative">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
            오거서 랭킹
          </h2>
          <Link
            href="/ranking"
            className="absolute right-0 inline-flex items-center gap-1 text-sm font-medium text-muted transition-colors hover:text-foreground group"
          >
            전체 보기
            <ChevronRight
              size={16}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </Link>
        </div>

        {/* ═══ Category filter buttons ═══ */}
        <div className="flex items-center justify-center gap-4 md:gap-6 mb-8 md:mb-10">
          {FILTERS.map((filter) => {
            const isSelected = activeFilter === filter.key;
            return (
              <button
                key={filter.key}
                type="button"
                onClick={() => setActiveFilter(filter.key)}
                className={`flex flex-col items-center gap-1.5 transition-all duration-200 outline-none`}
              >
                <div
                  className={`w-14 h-14 md:w-16 md:h-16 rounded-lg flex items-center justify-center text-xl md:text-2xl transition-all ${
                    isSelected
                      ? 'ring-3 ring-primary scale-105 bg-green-50'
                      : 'bg-warm-gray-200 hover:scale-110 opacity-75'
                  }`}
                >
                  {filter.emoji}
                </div>
                <span
                  className={`text-xs font-medium transition-colors ${
                    isSelected ? 'text-foreground' : 'text-muted'
                  }`}
                >
                  {filter.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* ═══ Content ═══ */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-xl bg-warm-gray-200"
              />
            ))}
          </div>
        ) : !data ? (
          <div className="py-10 text-center text-muted">
            데이터를 불러올 수 없습니다.
          </div>
        ) : (
          <>
            {/* ─── Personal ranking list (전체 / 개인) ─── */}
            {showPersonalList && (
              <div className="space-y-2.5">
                {data.personalRanking.slice(0, 5).map((entry) => {
                  const isTopThree = entry.rank <= 3;
                  return (
                    <div
                      key={entry.userId}
                      className={`bg-card-bg rounded-xl px-5 py-4 shadow-sm hover:shadow-md transition-all flex items-center gap-4 ${getRankBorderClass(entry.rank)}`}
                    >
                      {/* Rank medal / number */}
                      <div className="flex-shrink-0 w-8 text-center">
                        {isTopThree ? (
                          <span className="text-xl">
                            {rankMedals[entry.rank - 1]}
                          </span>
                        ) : (
                          <span className="text-base font-bold text-muted">
                            {entry.rank}
                          </span>
                        )}
                      </div>

                      {/* Name + department */}
                      <div className="flex-1 min-w-0">
                        <span className="text-sm md:text-base font-semibold text-foreground">
                          {entry.name}
                        </span>
                        <span className="ml-2 text-xs text-muted">
                          {entry.department}
                        </span>
                      </div>

                      {/* Points */}
                      <span className="flex-shrink-0 text-sm md:text-base font-bold text-primary">
                        {entry.cumulativePoints.toLocaleString()}P
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ─── LC ranking cards (LC) ─── */}
            {showLcCards && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {data.lcRanking.slice(0, 3).map((lc) => (
                  <div
                    key={lc.lcId}
                    className="bg-card-bg rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
                  >
                    {/* Header row */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xl">
                        {rankMedals[lc.rank - 1] || lc.rank}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-base font-bold text-foreground truncate">
                          {lc.name}
                        </h4>
                        <p className="text-xs text-muted flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          멤버 {lc.memberCount}명
                        </p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[11px] text-muted mb-0.5">
                          총 포인트
                        </p>
                        <p className="text-lg font-bold text-primary">
                          {lc.totalPoints.toLocaleString()}P
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] text-muted mb-0.5">
                          평균 포인트
                        </p>
                        <p className="text-lg font-bold text-foreground">
                          {lc.avgPoints.toLocaleString()}P
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
