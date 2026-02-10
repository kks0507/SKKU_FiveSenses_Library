'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Users,
  ChevronRight,
  CalendarDays,
  UserCircle,
  MessageCircle,
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
  const config: Record<string, { label: string; dotColor: string; bgColor: string; textColor: string; animated: boolean }> = {
    recruiting: {
      label: '모집중',
      dotColor: '#16a34a',
      bgColor: '#dcfce7',
      textColor: '#166534',
      animated: true,
    },
    active: {
      label: '진행중',
      dotColor: '#3b82f6',
      bgColor: '#dbeafe',
      textColor: '#1e40af',
      animated: false,
    },
    completed: {
      label: '완료',
      dotColor: '#9ca3af',
      bgColor: '#f3f4f6',
      textColor: '#6b7280',
      animated: false,
    },
  };
  const c = config[status] || config.completed;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{ background: c.bgColor, color: c.textColor }}
    >
      <span className="relative flex h-2 w-2">
        {c.animated && (
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
            style={{ background: c.dotColor }}
          />
        )}
        <span
          className="relative inline-flex h-2 w-2 rounded-full"
          style={{ background: c.dotColor }}
        />
      </span>
      {c.label}
    </span>
  );
}

export default function BookclubSection() {
  const [featured, setFeatured] = useState<BookClubItem | null>(null);
  const [others, setOthers] = useState<BookClubItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/bookclub')
      .then((res) => res.json())
      .then((json: BookClubData) => {
        const allCurrent = json.current || [];
        const allArchive = json.archive || [];

        // Featured: first recruiting bookclub, or first active, or first from current
        const recruiting = allCurrent.find((bc) => bc.status === 'recruiting');
        const active = allCurrent.find((bc) => bc.status === 'active');
        const feat = recruiting || active || allCurrent[0] || null;

        // Others: remaining items (current + archive), take 2
        const remaining = [...allCurrent, ...allArchive].filter(
          (bc) => bc.id !== feat?.id
        );
        setFeatured(feat);
        setOthers(remaining.slice(0, 2));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-warm-gray-50 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="flex items-center justify-center mb-10 md:mb-12">
            <div className="h-9 w-52 animate-pulse rounded-lg bg-warm-gray-200" />
          </div>
          <div className="h-80 animate-pulse rounded-2xl bg-warm-gray-100 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-44 animate-pulse rounded-xl bg-warm-gray-100" />
            <div className="h-44 animate-pulse rounded-xl bg-warm-gray-100" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-warm-gray-50 py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Section Header */}
        <div className="flex items-center justify-center mb-10 md:mb-12 relative">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
            이달의 북클럽
          </h2>
          <Link
            href="/bookclub"
            className="absolute right-0 text-sm md:text-base text-muted hover:text-foreground flex items-center gap-1 font-medium group"
          >
            더 보기
            <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* ===== Featured Bookclub Card ===== */}
        {featured ? (
          <div className="bg-card-bg rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden mb-6 md:mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3">
              {/* Left: Book cover placeholder */}
              <div className="flex flex-col items-center justify-center gap-4 p-8 md:p-10 bg-green-50">
                <div className="flex h-44 w-32 items-center justify-center rounded-xl bg-white shadow-sm">
                  <span className="text-5xl">📖</span>
                </div>
                {featured.book && (
                  <div className="text-center">
                    <p className="text-sm font-bold text-warm-gray-800">
                      『{featured.book.title}』
                    </p>
                    <p className="text-xs text-muted mt-0.5">{featured.book.author}</p>
                  </div>
                )}
              </div>

              {/* Right: Details */}
              <div className="col-span-2 p-6 md:p-8 flex flex-col">
                {/* Status badge */}
                <div className="mb-4">
                  <StatusBadge status={featured.status} />
                </div>

                {/* Bookclub name */}
                <h3 className="text-xl md:text-2xl font-bold text-warm-gray-900 mb-3">
                  {featured.title}
                </h3>

                {/* Moderator */}
                {featured.moderator && (
                  <div className="flex items-center gap-2 mb-3">
                    <UserCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-warm-gray-700">
                      좌장: {featured.moderator.name}
                    </span>
                  </div>
                )}

                {/* Book title */}
                {featured.book && (
                  <p className="text-sm text-warm-gray-600 mb-2">
                    선정 도서: 『{featured.book.title}』
                  </p>
                )}

                {/* Description */}
                <p className="text-sm leading-relaxed text-muted mb-5 line-clamp-2">
                  {featured.description}
                </p>

                {/* Capacity progress bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-sm text-warm-gray-600">
                      <Users className="h-4 w-4 text-muted" />
                      모집 현황
                    </div>
                    <span className="text-sm font-bold text-primary">
                      {featured.currentMembers}/{featured.capacity}명
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-warm-gray-200">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (featured.currentMembers / featured.capacity) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Date range and discussion schedule */}
                <div className="flex flex-wrap items-center gap-4 mb-5 text-sm text-warm-gray-500">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4 text-muted" />
                    {formatDate(featured.startDate)} ~ {formatDate(featured.endDate)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageCircle className="h-4 w-4 text-muted" />
                    토론일: {formatDate(featured.discussDate)}
                  </span>
                </div>

                {/* CTA */}
                <div className="mt-auto">
                  {featured.status === 'recruiting' ? (
                    <Link
                      href={`/bookclub/${featured.id}`}
                      className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      참여 신청하기
                    </Link>
                  ) : featured.status === 'active' ? (
                    <Link
                      href={`/bookclub/${featured.id}`}
                      className="inline-flex items-center justify-center rounded-xl border border-warm-gray-200 px-6 py-3 text-sm font-medium text-warm-gray-600 transition-colors hover:bg-warm-gray-50"
                    >
                      상세보기
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-card-bg rounded-2xl shadow-md flex flex-col items-center justify-center py-16 mb-6 md:mb-8">
            <BookOpen className="h-14 w-14 text-warm-gray-200 mb-3" />
            <p className="text-base font-medium text-muted">
              이달의 북클럽이 아직 등록되지 않았습니다.
            </p>
            <p className="text-sm text-warm-gray-400 mt-1">
              곧 새로운 북클럽이 시작됩니다!
            </p>
          </div>
        )}

        {/* ===== Other Bookclubs (2-column grid) ===== */}
        {others.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {others.map((bc) => (
              <Link
                key={bc.id}
                href={`/bookclub/${bc.id}`}
                className="bg-card-bg rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden group"
              >
                <div className="p-5">
                  {/* Top row: status + month */}
                  <div className="flex items-center justify-between mb-3">
                    <StatusBadge status={bc.status} />
                    <span className="text-xs text-muted">{bc.month}</span>
                  </div>

                  {/* Title */}
                  <h4 className="text-base font-bold text-warm-gray-900 mb-2 group-hover:text-primary line-clamp-1">
                    {bc.title}
                  </h4>

                  {/* Book title */}
                  {bc.book && (
                    <p className="text-sm text-warm-gray-500 mb-2 line-clamp-1">
                      『{bc.book.title}』 — {bc.book.author}
                    </p>
                  )}

                  {/* Moderator */}
                  {bc.moderator && (
                    <div className="flex items-center gap-1.5 text-xs text-warm-gray-400">
                      <UserCircle className="h-3.5 w-3.5" />
                      좌장: {bc.moderator.name}
                    </div>
                  )}

                  {/* Members count */}
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-warm-gray-400">
                    <Users className="h-3.5 w-3.5" />
                    {bc.currentMembers}/{bc.capacity}명
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
