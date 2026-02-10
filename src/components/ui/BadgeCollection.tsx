'use client';

import { Check } from 'lucide-react';

type ZoneType = 'bookclub' | 'narration' | 'listening' | 'writing' | 'review';

interface Badge {
  zone: ZoneType;
  earned: boolean;
  earnedAt?: string;
}

interface BadgeCollectionProps {
  badges: Badge[];
}

const zoneInfo: Record<ZoneType, { name: string; icon: string; colorClass: string }> = {
  bookclub: { name: '북클럽', icon: '📚', colorClass: 'zone-bookclub' },
  narration: { name: '낭독', icon: '🎙️', colorClass: 'zone-narration' },
  listening: { name: '듣기', icon: '🎧', colorClass: 'zone-listening' },
  writing: { name: '필사', icon: '✍️', colorClass: 'zone-writing' },
  review: { name: '서평', icon: '📝', colorClass: 'zone-review' },
};

export default function BadgeCollection({ badges }: BadgeCollectionProps) {
  const earnedCount = badges.filter((b) => b.earned).length;
  const totalCount = 5;
  const progressPercent = (earnedCount / totalCount) * 100;

  return (
    <div
      className="rounded-2xl bg-card-bg border border-card-border p-5"
      style={{ boxShadow: 'var(--shadow-md)' }}
    >
      {/* Title */}
      <h3 className="mb-4 text-base font-bold text-foreground">존 배지</h3>

      {/* Badge Row */}
      <div className="flex items-center justify-between gap-2">
        {badges.map((badge) => {
          const info = zoneInfo[badge.zone];
          return (
            <div
              key={badge.zone}
              className="flex flex-col items-center gap-1.5"
            >
              {/* Badge Icon */}
              <div className="relative">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl transition-all ${
                    badge.earned
                      ? info.colorClass
                      : 'bg-warm-gray-100 text-warm-gray-400 grayscale'
                  }`}
                >
                  {info.icon}
                </div>

                {/* Earned Check */}
                {badge.earned && (
                  <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-white">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </div>
                )}
              </div>

              {/* Zone Name */}
              <span
                className={`text-xs font-medium ${
                  badge.earned ? 'text-foreground' : 'text-warm-gray-400'
                }`}
              >
                {info.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="mt-5">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="font-medium text-muted">달성 현황</span>
          <span className="font-bold text-primary">
            {earnedCount}/{totalCount}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-warm-gray-100">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
