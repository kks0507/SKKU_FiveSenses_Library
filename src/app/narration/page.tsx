'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Mic,
  BookOpen,
  CalendarDays,
  Users,
  ChevronRight,
  Play,
  Clock,
  Upload,
  Headphones,
  CheckCircle,
} from 'lucide-react';

type BookInfo = {
  id: string;
  title: string;
  author: string;
  coverImage: string;
};

type CurrentNarration = {
  id: string;
  month: string;
  bookId: string;
  section: string;
  pageRange: string;
  description: string;
  deadline: string;
  totalParticipants: number;
  currentParticipants: number;
  status: string;
  createdAt: string;
  book: BookInfo | null;
};

type ArchiveItem = {
  id: string;
  month: string;
  bookId: string;
  title: string;
  section: string;
  totalParticipants: number;
  audioUrl: string;
  duration: number;
  publishedAt: string;
  book: BookInfo | null;
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function getDaysLeft(deadline: string) {
  const diff = new Date(deadline).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86400000));
}

const howToSteps = [
  {
    icon: <BookOpen className="h-5 w-5" />,
    title: '1. 낭독 구간 확인',
    description: '이달의 선정 도서와 배정된 낭독 구간을 확인하세요.',
  },
  {
    icon: <Mic className="h-5 w-5" />,
    title: '2. 낭독 녹음',
    description: '조용한 환경에서 또렷하게 낭독을 녹음해 주세요.',
  },
  {
    icon: <Upload className="h-5 w-5" />,
    title: '3. 파일 업로드',
    description: '녹음 파일을 업로드하고 제출하면 참여 완료!',
  },
  {
    icon: <Headphones className="h-5 w-5" />,
    title: '4. 오디오북 완성',
    description: '모든 참여자의 녹음이 합쳐져 오디오북이 됩니다.',
  },
];

export default function NarrationPage() {
  const [current, setCurrent] = useState<CurrentNarration | null>(null);
  const [archive, setArchive] = useState<ArchiveItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/narration/current').then((r) => r.json()),
      fetch('/api/narration/archive').then((r) => r.json()),
    ])
      .then(([currentData, archiveData]) => {
        setCurrent(currentData);
        setArchive(archiveData.archive || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 rounded-2xl p-8" style={{ background: '#f5f3ff' }}>
          <div className="h-8 w-64 animate-pulse rounded-lg" style={{ background: '#ede9fe' }} />
          <div className="mt-3 h-4 w-96 animate-pulse rounded-lg" style={{ background: '#ede9fe' }} />
        </div>
        <div className="h-80 animate-pulse rounded-xl bg-warm-gray-100" />
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-xl bg-warm-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* ===== ZONE HEADER ===== */}
      <section className="mb-10 overflow-hidden rounded-2xl" style={{ background: '#f5f3ff' }}>
        <div className="px-6 py-10 sm:px-10">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: '#ede9fe' }}>
              <Mic className="h-7 w-7" style={{ color: '#7c3aed' }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl" style={{ color: '#4c1d95' }}>
                낭독 존 — 우리가 만드는 오디오북
              </h1>
              <p className="mt-1 text-sm" style={{ color: '#7c3aed' }}>
                학생들의 목소리로 직접 만드는 오디오북 프로젝트입니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CURRENT NARRATION ===== */}
      {current && (
        <section className="mb-12">
          <h2 className="mb-5 text-xl font-bold text-warm-gray-900">
            이달의 낭독 프로젝트
          </h2>
          <div
            className="overflow-hidden rounded-xl bg-card-bg"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3">
              {/* Book cover placeholder */}
              <div className="flex flex-col items-center justify-center gap-4 p-8 md:border-r md:border-warm-gray-100" style={{ background: '#faf8ff' }}>
                <div className="flex h-40 w-28 items-center justify-center rounded-lg bg-warm-gray-100">
                  <BookOpen className="h-12 w-12 text-warm-gray-300" />
                </div>
                {current.book && (
                  <div className="text-center">
                    <h3 className="text-base font-bold text-warm-gray-800">
                      {current.book.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted">{current.book.author}</p>
                  </div>
                )}
              </div>

              {/* Info area */}
              <div className="col-span-2 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-sm font-medium text-muted">{current.month}</span>
                  {current.status === 'open' ? (
                    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ background: '#ede9fe', color: '#7c3aed' }}>
                      <Clock className="h-3 w-3" />
                      D-{getDaysLeft(current.deadline)}
                    </span>
                  ) : (
                    <span className="inline-block rounded-full bg-warm-gray-100 px-2.5 py-0.5 text-xs font-semibold text-warm-gray-500">
                      마감
                    </span>
                  )}
                </div>

                <h3 className="mb-2 text-lg font-bold text-warm-gray-900">
                  {current.section}
                </h3>
                <p className="mb-2 text-sm text-warm-gray-500">
                  낭독 범위: {current.pageRange}
                </p>
                <p className="mb-4 text-sm leading-relaxed text-muted">
                  {current.description}
                </p>

                {/* Participation stats */}
                <div className="mb-5 rounded-lg bg-warm-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-warm-gray-600">
                      <Users className="h-4 w-4 text-muted" />
                      참여 현황
                    </div>
                    <span className="text-sm font-bold" style={{ color: '#7c3aed' }}>
                      {current.currentParticipants}/{current.totalParticipants}명
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-warm-gray-200">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(current.currentParticipants / current.totalParticipants) * 100}%`,
                        background: '#7c3aed',
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted">
                  <CalendarDays className="h-4 w-4" />
                  마감일: {formatDate(current.deadline)}
                </div>

                {/* CTA */}
                {current.status === 'open' && (
                  <button className="mt-5 w-full rounded-lg px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:w-auto" style={{ background: '#7c3aed' }}>
                    낭독 참여하기
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== HOW TO PARTICIPATE ===== */}
      <section className="mb-12">
        <h2 className="mb-5 text-xl font-bold text-warm-gray-900">참여 방법</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {howToSteps.map((step, idx) => (
            <div
              key={idx}
              className="rounded-xl bg-card-bg p-5"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
            >
              <div
                className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: '#ede9fe', color: '#7c3aed' }}
              >
                {step.icon}
              </div>
              <h3 className="mb-1 text-sm font-bold text-warm-gray-800">{step.title}</h3>
              <p className="text-xs leading-relaxed text-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== ARCHIVE ===== */}
      {archive.length > 0 && (
        <section>
          <h2 className="mb-5 text-xl font-bold text-warm-gray-900">
            완성된 오디오북 아카이브
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {archive.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-xl bg-card-bg transition-all hover:translate-y-[-2px]"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
              >
                {/* Cover placeholder */}
                <div className="flex h-32 items-center justify-center" style={{ background: '#faf8ff' }}>
                  <Headphones className="h-10 w-10" style={{ color: '#c4b5fd' }} />
                </div>
                <div className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs text-muted">{item.month}</span>
                    <div className="flex items-center gap-1 text-xs text-muted">
                      <Clock className="h-3 w-3" />
                      {formatDuration(item.duration)}
                    </div>
                  </div>
                  <h3 className="mb-1 line-clamp-1 text-sm font-bold text-warm-gray-800">
                    {item.title}
                  </h3>
                  {item.book && (
                    <p className="line-clamp-1 text-xs text-muted">
                      《{item.book.title}》 — {item.book.author}
                    </p>
                  )}
                  <div className="mt-2 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs text-muted">
                      <Users className="h-3 w-3" />
                      참여 {item.totalParticipants}명
                    </span>
                    <div className="flex items-center gap-1 text-xs font-medium" style={{ color: '#7c3aed' }}>
                      <CheckCircle className="h-3.5 w-3.5" />
                      완성
                    </div>
                  </div>

                  {/* Play button */}
                  <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border py-2 text-sm font-medium text-warm-gray-600 transition-colors hover:bg-warm-gray-50" style={{ borderColor: '#e5e0d8' }}>
                    <Play className="h-4 w-4" />
                    오디오북 듣기
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty state if no current and no archive */}
      {!current && archive.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <Mic className="mb-4 h-16 w-16 text-warm-gray-200" />
          <p className="text-lg font-medium text-muted">
            아직 등록된 낭독 프로젝트가 없습니다.
          </p>
          <p className="mt-1 text-sm text-warm-gray-400">
            곧 새로운 낭독 프로젝트가 시작됩니다!
          </p>
        </div>
      )}
    </div>
  );
}
