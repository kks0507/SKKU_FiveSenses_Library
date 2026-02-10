'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  CalendarDays,
  MapPin,
  Users,
  ChevronRight,
  Clock,
  UserCircle,
  Award,
} from 'lucide-react';

type BookInfo = {
  id: string;
  title: string;
  author: string;
  coverImage: string;
};

type ModeratorInfo = {
  id: string;
  name: string;
  bio: string;
  profileImage: string;
  achievement: string;
};

type BookClubItem = {
  id: string;
  title: string;
  month: string;
  moderatorId: string;
  bookId: string;
  description: string;
  capacity: number;
  currentMembers: number;
  startDate: string;
  endDate: string;
  discussDate: string;
  discussLocation: string;
  status: 'recruiting' | 'active' | 'completed';
  createdAt: string;
  book: BookInfo | null;
  moderator: ModeratorInfo | null;
};

type BookClubData = {
  current: BookClubItem[];
  archive: BookClubItem[];
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    recruiting: { label: '모집중', className: 'bg-green-100 text-green-700' },
    active: { label: '진행중', className: 'bg-blue-100 text-blue-500' },
    completed: { label: '완료', className: 'bg-warm-gray-100 text-warm-gray-500' },
  };
  const c = config[status] || config.completed;
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${c.className}`}>
      {c.label}
    </span>
  );
}

export default function BookClubPage() {
  const [data, setData] = useState<BookClubData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/bookclub')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Zone header skeleton */}
        <div className="mb-8 rounded-2xl bg-green-50 p-8">
          <div className="h-8 w-64 animate-pulse rounded-lg bg-green-100" />
          <div className="mt-3 h-4 w-96 animate-pulse rounded-lg bg-green-100" />
        </div>
        {/* Cards skeleton */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-72 animate-pulse rounded-xl bg-warm-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center py-24 text-muted">
        데이터를 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* ===== ZONE HEADER ===== */}
      <section className="mb-10 overflow-hidden rounded-2xl bg-green-50">
        <div className="px-6 py-10 sm:px-10">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100">
              <BookOpen className="h-7 w-7 text-green-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-green-900 sm:text-3xl">
                북클럽 존 — 성균 프라이드
              </h1>
              <p className="mt-1 text-sm text-green-700">
                매달 좌장이 선정한 도서를 함께 읽고 토론하는 북클럽입니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CURRENT BOOKCLUBS ===== */}
      {data.current.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-5 text-xl font-bold text-warm-gray-900">
            현재 진행 중인 북클럽
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {data.current.map((bc) => (
              <div
                key={bc.id}
                className="overflow-hidden rounded-xl bg-card-bg"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
              >
                {/* Top bar with status */}
                <div className="flex items-center justify-between border-b border-warm-gray-100 px-5 py-3">
                  <span className="text-sm font-medium text-muted">{bc.month}</span>
                  <StatusBadge status={bc.status} />
                </div>

                <div className="p-5">
                  {/* Moderator */}
                  {bc.moderator && (
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <UserCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-warm-gray-800">
                            좌장: {bc.moderator.name}
                          </span>
                          <Award className="h-4 w-4 text-amber-500" />
                        </div>
                        <p className="text-xs text-muted">{bc.moderator.achievement}</p>
                      </div>
                    </div>
                  )}

                  {/* Title & Book */}
                  <h3 className="mb-1 text-lg font-bold text-warm-gray-900">{bc.title}</h3>
                  {bc.book && (
                    <p className="mb-3 text-sm text-warm-gray-600">
                      선정 도서: 《{bc.book.title}》 — {bc.book.author}
                    </p>
                  )}
                  <p className="mb-4 text-sm leading-relaxed text-muted">{bc.description}</p>

                  {/* Meta info */}
                  <div className="mb-4 space-y-2 rounded-lg bg-warm-gray-50 p-3">
                    <div className="flex items-center gap-2 text-sm text-warm-gray-600">
                      <Users className="h-4 w-4 text-muted" />
                      <span>
                        인원: {bc.currentMembers}/{bc.capacity}명
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-warm-gray-600">
                      <CalendarDays className="h-4 w-4 text-muted" />
                      <span>
                        {formatDate(bc.startDate)} ~ {formatDate(bc.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-warm-gray-600">
                      <Clock className="h-4 w-4 text-muted" />
                      <span>토론일: {formatDate(bc.discussDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-warm-gray-600">
                      <MapPin className="h-4 w-4 text-muted" />
                      <span>{bc.discussLocation}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    {bc.status === 'recruiting' ? (
                      <button className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover">
                        참여 신청하기
                      </button>
                    ) : (
                      <button className="flex-1 cursor-not-allowed rounded-lg bg-warm-gray-200 px-4 py-2.5 text-sm font-semibold text-warm-gray-500">
                        모집 마감
                      </button>
                    )}
                    <Link
                      href={`/bookclub/${bc.id}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-warm-gray-200 px-4 py-2.5 text-sm font-medium text-warm-gray-600 transition-colors hover:bg-warm-gray-50"
                    >
                      상세보기
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== ARCHIVE ===== */}
      {data.archive.length > 0 && (
        <section>
          <h2 className="mb-5 text-xl font-bold text-warm-gray-900">
            지난 북클럽 아카이브
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.archive.map((bc) => (
              <Link
                key={bc.id}
                href={`/bookclub/${bc.id}`}
                className="group overflow-hidden rounded-xl bg-card-bg transition-all hover:translate-y-[-2px]"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
              >
                {/* Cover placeholder */}
                <div className="flex h-32 items-center justify-center bg-warm-gray-100">
                  <BookOpen className="h-10 w-10 text-warm-gray-300" />
                </div>
                <div className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs text-muted">{bc.month}</span>
                    <StatusBadge status={bc.status} />
                  </div>
                  <h3 className="mb-1 line-clamp-1 text-sm font-bold text-warm-gray-800 group-hover:text-primary">
                    {bc.title}
                  </h3>
                  {bc.book && (
                    <p className="line-clamp-1 text-xs text-muted">
                      《{bc.book.title}》 — {bc.book.author}
                    </p>
                  )}
                  {bc.moderator && (
                    <p className="mt-2 text-xs text-warm-gray-500">
                      좌장: {bc.moderator.name}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {data.current.length === 0 && data.archive.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <BookOpen className="mb-4 h-16 w-16 text-warm-gray-200" />
          <p className="text-lg font-medium text-muted">
            아직 등록된 북클럽이 없습니다.
          </p>
          <p className="mt-1 text-sm text-warm-gray-400">
            곧 새로운 북클럽이 시작됩니다. 기대해 주세요!
          </p>
        </div>
      )}
    </div>
  );
}
