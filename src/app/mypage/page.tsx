'use client';

import { useState, useEffect } from 'react';
import {
  Trophy,
  Star,
  Medal,
  Crown,
  TrendingUp,
  TrendingDown,
  Clock,
  Award,
  BookOpen,
  Mic,
  Music,
  PenTool,
  FileText,
} from 'lucide-react';

type BadgeItem = {
  zone: string;
  earned: boolean;
  earnedAt: string | null;
};

type PointRecord = {
  id: string;
  userId: string;
  amount: number;
  type: 'earn' | 'spend';
  zone: string | null;
  description: string;
  balanceAfter: number;
  createdAt: string;
};

type MyPageData = {
  user: {
    id: string;
    name: string;
    department: string;
    enrollYear: number | null;
    studentId: string | null;
    profileImage: string;
    title: string | null;
    lcName: string | null;
  };
  points: {
    cumulative: number;
    available: number;
    rank: number;
  };
  badges: {
    collection: BadgeItem[];
    count: number;
    total: number;
    isMunho: boolean;
  };
  recentActivities: PointRecord[];
};

const ZONE_META: Record<string, { emoji: string; label: string; icon: typeof BookOpen }> = {
  bookclub: { emoji: '\uD83D\uDCD6', label: '\uBD81\uD074\uB7FD', icon: BookOpen },
  narration: { emoji: '\uD83C\uDF99\uFE0F', label: '\uB0AD\uB3C5', icon: Mic },
  listening: { emoji: '\uD83C\uDFB5', label: '\uB4E3\uAE30', icon: Music },
  writing: { emoji: '\u270D\uFE0F', label: '\uD544\uC0AC', icon: PenTool },
  review: { emoji: '\uD83D\uDCDD', label: '\uC11C\uD3C9', icon: FileText },
};

const TABS = [
  { key: 'points', label: '\uD3EC\uC778\uD2B8 \uB0B4\uC5ED' },
  { key: 'badges', label: '\uBC30\uC9C0 \uCEEC\uB809\uC158' },
  { key: 'activities', label: '\uD65C\uB3D9 \uB0B4\uC5ED' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export default function MyPage() {
  const [data, setData] = useState<MyPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('points');

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/mypage');
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="space-y-6">
          {/* Profile skeleton */}
          <div
            className="rounded-xl bg-card-bg p-6"
            style={{ boxShadow: 'var(--shadow-md)' }}
          >
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 animate-pulse rounded-full bg-warm-gray-200" />
              <div className="space-y-2">
                <div className="h-5 w-32 animate-pulse rounded bg-warm-gray-200" />
                <div className="h-4 w-48 animate-pulse rounded bg-warm-gray-200" />
              </div>
            </div>
          </div>
          {/* Points skeleton */}
          <div className="grid grid-cols-2 gap-4">
            <div
              className="h-28 animate-pulse rounded-xl bg-card-bg"
              style={{ boxShadow: 'var(--shadow-md)' }}
            />
            <div
              className="h-28 animate-pulse rounded-xl bg-card-bg"
              style={{ boxShadow: 'var(--shadow-md)' }}
            />
          </div>
          {/* Content skeleton */}
          <div
            className="h-64 animate-pulse rounded-xl bg-card-bg"
            style={{ boxShadow: 'var(--shadow-md)' }}
          />
        </div>
        <p className="mt-8 text-center text-muted">\uB85C\uB529 \uC911...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <p className="text-warm-gray-500">\uB370\uC774\uD130\uB97C \uBD88\uB7EC\uC62C \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.</p>
      </div>
    );
  }

  const { user, points, badges, recentActivities } = data;
  const initials = user.name.slice(-2);

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Page Title */}
      <h1 className="mb-6 text-2xl font-bold text-foreground">
        \uB9C8\uC774\uD398\uC774\uC9C0
      </h1>

      {/* Profile Section */}
      <div
        className="mb-6 rounded-xl bg-card-bg p-6"
        style={{ boxShadow: 'var(--shadow-md)' }}
      >
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
            {initials}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-foreground">{user.name}</h2>
              {user.title === '\uBB38\uD638' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                  <Crown className="h-3 w-3" />
                  \uBB38\uD638
                </span>
              )}
            </div>
            <p className="text-sm text-muted">
              {user.department}
              {user.enrollYear ? ` \u00B7 ${user.enrollYear}\uD559\uBC88` : ''}
            </p>
            {user.lcName && (
              <p className="mt-0.5 text-sm text-muted">
                LC: <span className="font-medium text-foreground">{user.lcName}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Points Summary (side by side) */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        {/* Cumulative Points */}
        <div
          className="rounded-xl bg-card-bg p-5"
          style={{ boxShadow: 'var(--shadow-md)' }}
        >
          <div className="flex items-center gap-2 text-sm text-muted">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span>\uB204\uC801 \uD3EC\uC778\uD2B8</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {points.cumulative.toLocaleString()}
            <span className="text-sm font-normal text-muted">P</span>
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted">
            <Medal className="h-3 w-3 text-accent" />
            \uC804\uCCB4 {points.rank}\uC704
          </p>
        </div>

        {/* Available Points */}
        <div
          className="rounded-xl bg-card-bg p-5"
          style={{ boxShadow: 'var(--shadow-md)' }}
        >
          <div className="flex items-center gap-2 text-sm text-muted">
            <Star className="h-4 w-4 text-accent" />
            <span>\uAC00\uC6A9 \uD3EC\uC778\uD2B8</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {points.available.toLocaleString()}
            <span className="text-sm font-normal text-muted">P</span>
          </p>
          <p className="mt-1 text-xs text-muted">\uAD50\uD658 \uAC00\uB2A5\uD55C \uD3EC\uC778\uD2B8</p>
        </div>
      </div>

      {/* Badge Quick View */}
      <div
        className="mb-6 rounded-xl bg-card-bg p-5"
        style={{ boxShadow: 'var(--shadow-md)' }}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">\uBC30\uC9C0 \uCEEC\uB809\uC158</h3>
          <span className="text-xs text-muted">
            {badges.count}/{badges.total} \uD68D\uB4DD
          </span>
        </div>

        <div className="flex items-center justify-center gap-4">
          {badges.collection.map((badge) => {
            const meta = ZONE_META[badge.zone];
            return (
              <div key={badge.zone} className="flex flex-col items-center gap-1">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full text-xl transition-all ${
                    badge.earned
                      ? 'bg-green-100 ring-2 ring-green-500'
                      : 'bg-warm-gray-100 opacity-40 grayscale'
                  }`}
                >
                  {meta?.emoji || '\u2753'}
                </div>
                <span className="text-[10px] text-muted">{meta?.label || badge.zone}</span>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-warm-gray-100">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${(badges.count / badges.total) * 100}%` }}
            />
          </div>
          <p className="mt-1 text-center text-xs text-muted">
            {badges.count}/{badges.total} \uC874 \uBC30\uC9C0 \uD68D\uB4DD
          </p>
        </div>

        {/* Munho golden banner */}
        {badges.isMunho && (
          <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-amber-50 px-4 py-3 border border-amber-200">
            <Trophy className="h-5 w-5 text-amber-600" />
            <span className="text-sm font-bold text-amber-700">
              \uD83C\uDFC6 \uCD95\uD558\uD569\uB2C8\uB2E4! &quot;\uBB38\uD638&quot; \uCE6D\uD638\uB97C \uD68D\uB4DD\uD558\uC168\uC2B5\uB2C8\uB2E4!
            </span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-1 rounded-xl bg-warm-gray-100 p-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-card-bg text-foreground'
                : 'text-muted hover:text-foreground'
            }`}
            style={activeTab === tab.key ? { boxShadow: 'var(--shadow-sm)' } : undefined}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div
        className="rounded-xl bg-card-bg p-5"
        style={{ boxShadow: 'var(--shadow-md)' }}
      >
        {/* Points History Tab */}
        {activeTab === 'points' && (
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
              <Clock className="h-4 w-4 text-primary" />
              \uCD5C\uADFC \uD3EC\uC778\uD2B8 \uB0B4\uC5ED
            </h3>
            {recentActivities.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted">\uD3EC\uC778\uD2B8 \uB0B4\uC5ED\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.</p>
            ) : (
              <ul className="divide-y divide-warm-gray-100">
                {recentActivities.map((record) => (
                  <li key={record.id} className="flex items-center justify-between py-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {record.description}
                      </p>
                      <p className="text-xs text-muted">{formatDate(record.createdAt)}</p>
                    </div>
                    <span
                      className={`text-sm font-bold ${
                        record.type === 'earn' ? 'text-green-600' : 'text-red-500'
                      }`}
                    >
                      {record.type === 'earn' ? '+' : '-'}
                      {Math.abs(record.amount)}P
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Badges Collection Tab */}
        {activeTab === 'badges' && (
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
              <Award className="h-4 w-4 text-accent" />
              \uBC30\uC9C0 \uCEEC\uB809\uC158 \uC0C1\uC138
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {badges.collection.map((badge) => {
                const meta = ZONE_META[badge.zone];
                const ZoneIcon = meta?.icon || BookOpen;
                return (
                  <div
                    key={badge.zone}
                    className={`flex items-center gap-3 rounded-xl border p-4 transition-all ${
                      badge.earned
                        ? 'border-green-200 bg-green-50'
                        : 'border-warm-gray-100 bg-warm-gray-50'
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-lg ${
                        badge.earned
                          ? 'bg-green-100 text-green-700'
                          : 'bg-warm-gray-200 text-warm-gray-400'
                      }`}
                    >
                      {meta?.emoji || '\u2753'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <ZoneIcon className={`h-4 w-4 ${badge.earned ? 'text-green-600' : 'text-warm-gray-400'}`} />
                        <span className={`text-sm font-semibold ${badge.earned ? 'text-foreground' : 'text-warm-gray-400'}`}>
                          {meta?.label || badge.zone} \uBC30\uC9C0
                        </span>
                      </div>
                      <p className="text-xs text-muted">
                        {badge.earned
                          ? `\uD68D\uB4DD\uC77C: ${formatDate(badge.earnedAt!)}`
                          : '\uBBF8\uD68D\uB4DD'}
                      </p>
                    </div>
                    {badge.earned ? (
                      <span className="rounded-full bg-green-600 px-2 py-0.5 text-xs font-semibold text-white">
                        \uD68D\uB4DD
                      </span>
                    ) : (
                      <span className="rounded-full bg-warm-gray-200 px-2 py-0.5 text-xs font-semibold text-warm-gray-500">
                        \uBBF8\uD68D\uB4DD
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {badges.isMunho && (
              <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-50 to-amber-100 px-6 py-4 border border-amber-200">
                <Trophy className="h-6 w-6 text-amber-600" />
                <div className="text-center">
                  <p className="text-base font-bold text-amber-800">\uD83C\uDFC6 \uBB38\uD638 \uCE6D\uD638 \uD68D\uB4DD!</p>
                  <p className="text-xs text-amber-600">
                    \ubaa8\ub4e0 \uc874 \ubc30\uc9c0\ub97c \ud68d\ub4dd\ud558\uc5ec \u201c\ubb38\ud638\u201d \uce6d\ud638\uac00 \ubd80\uc5ec\ub418\uc5c8\uc2b5\ub2c8\ub2e4.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Activities Tab */}
        {activeTab === 'activities' && (
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
              <Clock className="h-4 w-4 text-primary" />
              \uCD5C\uADFC \uD65C\uB3D9 \uB0B4\uC5ED
            </h3>
            {recentActivities.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted">\uD65C\uB3D9 \uB0B4\uC5ED\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.</p>
            ) : (
              <ul className="space-y-3">
                {recentActivities.map((record) => {
                  const zoneMeta = record.zone ? ZONE_META[record.zone] : null;
                  return (
                    <li
                      key={record.id}
                      className="flex items-start gap-3 rounded-lg border border-warm-gray-100 p-3"
                    >
                      <div
                        className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                          record.type === 'earn'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-red-100 text-red-500'
                        }`}
                      >
                        {record.type === 'earn' ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground">
                            {record.description}
                          </p>
                          {zoneMeta && (
                            <span className="rounded-full bg-warm-gray-100 px-2 py-0.5 text-[10px] text-muted">
                              {zoneMeta.label}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted">{formatDate(record.createdAt)}</p>
                      </div>
                      <span
                        className={`whitespace-nowrap text-sm font-bold ${
                          record.type === 'earn' ? 'text-green-600' : 'text-red-500'
                        }`}
                      >
                        {record.type === 'earn' ? '+' : '-'}
                        {Math.abs(record.amount)}P
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
