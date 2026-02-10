'use client';

import { useState, useEffect } from 'react';
import {
  Trophy,
  Medal,
  Crown,
  Users,
  Award,
  GraduationCap,
  ChevronRight,
  Star,
} from 'lucide-react';

type PersonalRank = {
  rank: number;
  userId: string;
  name: string;
  department: string;
  enrollYear: number | null;
  cumulativePoints: number;
  badgeCount: number;
  isMunho: boolean;
};

type LCRank = {
  rank: number;
  lcId: string;
  name: string;
  totalPoints: number;
  avgPoints: number;
  memberCount: number;
};

type ScholarshipCandidate = {
  rank: number;
  userId: string;
  name: string;
  department: string;
  enrollYear: number | null;
  cumulativePoints: number;
  badgeCount: number;
  isMunho: boolean;
};

type RankingData = {
  personalRanking: PersonalRank[];
  lcRanking: LCRank[];
  scholarshipCandidates: ScholarshipCandidate[];
};

const TABS = [
  { key: 'personal', label: '\uAC1C\uC778 \uB7AD\uD0B9', icon: Medal },
  { key: 'lc', label: 'LC \uB7AD\uD0B9', icon: Users },
] as const;

type TabKey = (typeof TABS)[number]['key'];

function getRankStyle(rank: number) {
  switch (rank) {
    case 1:
      return {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        text: 'text-amber-700',
        icon: <Crown className="h-5 w-5 text-amber-500" />,
        label: '\uD83E\uDD47',
      };
    case 2:
      return {
        bg: 'bg-warm-gray-50',
        border: 'border-warm-gray-200',
        text: 'text-warm-gray-600',
        icon: <Medal className="h-5 w-5 text-warm-gray-400" />,
        label: '\uD83E\uDD48',
      };
    case 3:
      return {
        bg: 'bg-amber-50/50',
        border: 'border-amber-100',
        text: 'text-amber-600',
        icon: <Medal className="h-5 w-5 text-amber-400" />,
        label: '\uD83E\uDD49',
      };
    default:
      return {
        bg: '',
        border: 'border-warm-gray-100',
        text: 'text-muted',
        icon: null,
        label: `${rank}`,
      };
  }
}

export default function RankingPage() {
  const [data, setData] = useState<RankingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('personal');

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/ranking');
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
        <div className="space-y-4">
          <div className="h-8 w-48 animate-pulse rounded bg-warm-gray-200" />
          <div className="flex gap-2">
            <div className="h-10 w-32 animate-pulse rounded-lg bg-warm-gray-200" />
            <div className="h-10 w-32 animate-pulse rounded-lg bg-warm-gray-200" />
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-xl bg-card-bg"
              style={{ boxShadow: 'var(--shadow-md)' }}
            />
          ))}
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

  const { personalRanking, lcRanking, scholarshipCandidates } = data;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
          <Trophy className="h-7 w-7 text-accent" />
          \uB7AD\uD0B9
        </h1>
        <p className="mt-1 text-sm text-muted">
          \uC624\uAC70\uC11C \uD65C\uB3D9 \uC131\uACFC \uC21C\uC704
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2">
        {TABS.map((tab) => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-primary text-white'
                  : 'bg-card-bg text-muted hover:bg-warm-gray-100 hover:text-foreground'
              }`}
              style={activeTab !== tab.key ? { boxShadow: 'var(--shadow-sm)' } : undefined}
            >
              <TabIcon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Personal Ranking */}
      {activeTab === 'personal' && (
        <div className="space-y-6">
          {/* Top 3 Podium */}
          <div className="grid grid-cols-3 gap-3">
            {personalRanking.slice(0, 3).map((person) => {
              const style = getRankStyle(person.rank);
              return (
                <div
                  key={person.userId}
                  className={`flex flex-col items-center rounded-xl border p-4 text-center ${style.bg} ${style.border}`}
                  style={{ boxShadow: 'var(--shadow-md)' }}
                >
                  <span className="mb-2 text-2xl">{style.label}</span>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {person.name.slice(-2)}
                  </div>
                  <p className="text-sm font-bold text-foreground">{person.name}</p>
                  <p className="text-xs text-muted">{person.department}</p>
                  <p className="mt-2 text-lg font-bold text-primary">
                    {person.cumulativePoints.toLocaleString()}P
                  </p>
                  <div className="mt-1 flex items-center gap-1">
                    <Award className="h-3 w-3 text-accent" />
                    <span className="text-xs text-muted">\uBC30\uC9C0 {person.badgeCount}\uAC1C</span>
                  </div>
                  {person.isMunho && (
                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                      <Crown className="h-3 w-3" />
                      \uBB38\uD638
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Full Table */}
          <div
            className="overflow-hidden rounded-xl bg-card-bg"
            style={{ boxShadow: 'var(--shadow-md)' }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-warm-gray-100 bg-warm-gray-50">
                    <th className="px-4 py-3 text-left font-semibold text-muted">#</th>
                    <th className="px-4 py-3 text-left font-semibold text-muted">\uC774\uB984</th>
                    <th className="hidden px-4 py-3 text-left font-semibold text-muted sm:table-cell">\uD559\uACFC</th>
                    <th className="px-4 py-3 text-right font-semibold text-muted">\uB204\uC801 \uD3EC\uC778\uD2B8</th>
                    <th className="hidden px-4 py-3 text-center font-semibold text-muted sm:table-cell">\uBC30\uC9C0</th>
                    <th className="px-4 py-3 text-center font-semibold text-muted">\uBB38\uD638</th>
                  </tr>
                </thead>
                <tbody>
                  {personalRanking.map((person) => {
                    const style = getRankStyle(person.rank);
                    const isTopThree = person.rank <= 3;
                    return (
                      <tr
                        key={person.userId}
                        className={`border-b border-warm-gray-50 transition-colors hover:bg-warm-gray-50 ${
                          isTopThree ? style.bg : ''
                        }`}
                      >
                        <td className="px-4 py-3">
                          <span className={`text-sm font-bold ${style.text}`}>
                            {style.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-foreground">{person.name}</p>
                          <p className="text-xs text-muted sm:hidden">{person.department}</p>
                        </td>
                        <td className="hidden px-4 py-3 text-muted sm:table-cell">
                          {person.department}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-foreground">
                          {person.cumulativePoints.toLocaleString()}P
                        </td>
                        <td className="hidden px-4 py-3 text-center sm:table-cell">
                          <span className="inline-flex items-center gap-1 text-muted">
                            <Star className="h-3.5 w-3.5 text-accent" />
                            {person.badgeCount}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {person.isMunho ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                              <Crown className="h-3 w-3" />
                              \uBB38\uD638
                            </span>
                          ) : (
                            <span className="text-xs text-warm-gray-300">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* LC Ranking */}
      {activeTab === 'lc' && (
        <div className="space-y-6">
          {/* Top 3 LC Cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {lcRanking.slice(0, 3).map((lc) => {
              const style = getRankStyle(lc.rank);
              return (
                <div
                  key={lc.lcId}
                  className={`rounded-xl border p-5 ${style.bg} ${style.border}`}
                  style={{ boxShadow: 'var(--shadow-md)' }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{style.label}</span>
                    <div>
                      <p className="text-base font-bold text-foreground">{lc.name}</p>
                      <p className="text-xs text-muted">\uBA64\uBC84 {lc.memberCount}\uBA85</p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted">\uCD1D \uD3EC\uC778\uD2B8</p>
                      <p className="text-lg font-bold text-primary">
                        {lc.totalPoints.toLocaleString()}P
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted">\uD3C9\uADE0 \uD3EC\uC778\uD2B8</p>
                      <p className="text-lg font-bold text-foreground">
                        {lc.avgPoints.toLocaleString()}P
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full LC Table */}
          <div
            className="overflow-hidden rounded-xl bg-card-bg"
            style={{ boxShadow: 'var(--shadow-md)' }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-warm-gray-100 bg-warm-gray-50">
                    <th className="px-4 py-3 text-left font-semibold text-muted">#</th>
                    <th className="px-4 py-3 text-left font-semibold text-muted">LC \uC774\uB984</th>
                    <th className="px-4 py-3 text-right font-semibold text-muted">\uCD1D \uD3EC\uC778\uD2B8</th>
                    <th className="hidden px-4 py-3 text-right font-semibold text-muted sm:table-cell">\uD3C9\uADE0 \uD3EC\uC778\uD2B8</th>
                    <th className="px-4 py-3 text-center font-semibold text-muted">\uBA64\uBC84 \uC218</th>
                  </tr>
                </thead>
                <tbody>
                  {lcRanking.map((lc) => {
                    const style = getRankStyle(lc.rank);
                    const isTopThree = lc.rank <= 3;
                    return (
                      <tr
                        key={lc.lcId}
                        className={`border-b border-warm-gray-50 transition-colors hover:bg-warm-gray-50 ${
                          isTopThree ? style.bg : ''
                        }`}
                      >
                        <td className="px-4 py-3">
                          <span className={`text-sm font-bold ${style.text}`}>
                            {style.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-foreground">{lc.name}</td>
                        <td className="px-4 py-3 text-right font-semibold text-foreground">
                          {lc.totalPoints.toLocaleString()}P
                        </td>
                        <td className="hidden px-4 py-3 text-right text-muted sm:table-cell">
                          {lc.avgPoints.toLocaleString()}P
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center gap-1 text-muted">
                            <Users className="h-3.5 w-3.5" />
                            {lc.memberCount}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Scholarship Section */}
      <div className="mt-10">
        <div
          className="rounded-xl bg-card-bg overflow-hidden"
          style={{ boxShadow: 'var(--shadow-md)' }}
        >
          {/* Scholarship Header */}
          <div className="border-b border-warm-gray-100 bg-green-50 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">\uC7A5\uD559\uAE08 \uC548\uB0B4</h2>
                <p className="text-xs text-muted">
                  \uC624\uAC70\uC11C \uD65C\uB3D9 \uC6B0\uC218\uC790\uC5D0\uAC8C \uC7A5\uD559\uAE08\uC774 \uC9C0\uAE09\uB429\uB2C8\uB2E4
                </p>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="px-6 py-4 border-b border-warm-gray-100">
            <h3 className="mb-3 text-sm font-semibold text-foreground">\uC7A5\uD559\uAE08 \uC218\uC5EC \uC694\uAC74</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-muted">
                <ChevronRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                5\uAC1C \uC874 \uBC30\uC9C0 \uBAA8\uB450 \uD68D\uB4DD (\u201C\uBB38\uD638\u201D \uCE6D\uD638 \uBCF4\uC720\uC790)
              </li>
              <li className="flex items-start gap-2 text-sm text-muted">
                <ChevronRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                \uB204\uC801 \uD3EC\uC778\uD2B8 \uC0C1\uC704 5\uBA85 \uC774\uB0B4
              </li>
              <li className="flex items-start gap-2 text-sm text-muted">
                <ChevronRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                \uD559\uAE30\uBCC4 \uC2EC\uC0AC\uB97C \uD1B5\uD574 \uCD5C\uC885 \uC120\uBC1C
              </li>
            </ul>
          </div>

          {/* Eligible Candidates */}
          <div className="px-6 py-4">
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              \uC7A5\uD559\uAE08 \uC218\uC5EC \uB300\uC0C1\uC790
            </h3>
            {scholarshipCandidates.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted">
                \uD604\uC7AC \uC7A5\uD559\uAE08 \uC218\uC5EC \uB300\uC0C1\uC790\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.
              </p>
            ) : (
              <ul className="space-y-2">
                {scholarshipCandidates.map((candidate, index) => (
                  <li
                    key={candidate.userId}
                    className="flex items-center gap-3 rounded-lg border border-warm-gray-100 p-3"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">{candidate.name}</p>
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                          <Crown className="h-2.5 w-2.5" />
                          \uBB38\uD638
                        </span>
                      </div>
                      <p className="text-xs text-muted">{candidate.department}</p>
                    </div>
                    <span className="text-sm font-bold text-primary">
                      {candidate.cumulativePoints.toLocaleString()}P
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
