'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, BookOpen, Calendar, MapPin, Users, Clock } from 'lucide-react';

type BookClubDetail = {
  id: string;
  title: string;
  month: string;
  description: string;
  capacity: number;
  currentMembers: number;
  startDate: string;
  endDate: string;
  discussDate: string;
  discussLocation: string;
  status: 'recruiting' | 'active' | 'completed';
  createdAt: string;
  book?: {
    id: string;
    title: string;
    author: string;
    coverImage: string;
    description: string;
    publisher: string;
    category: string;
  };
  moderator?: {
    id: string;
    name: string;
    bio: string;
    profileImage: string;
    department: string;
    enrollYear: number;
    achievement: string;
  };
};

const STATUS_MAP = {
  recruiting: { label: '모집중', bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
  active: { label: '진행중', bg: 'bg-blue-100', text: 'text-blue-500', dot: 'bg-blue-500' },
  completed: { label: '완료', bg: 'bg-warm-gray-100', text: 'text-warm-gray-500', dot: 'bg-warm-gray-400' },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export default function BookclubDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<BookClubDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/bookclub/${id}`);
        if (!res.ok) throw new Error('Not found');
        const json = await res.json();
        setData(json);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12 md:px-6">
        <div className="mb-6 h-6 w-24 animate-pulse rounded bg-warm-gray-200" />
        <div className="mb-4 h-10 w-3/4 animate-pulse rounded-lg bg-warm-gray-200" />
        <div className="mb-8 h-6 w-32 animate-pulse rounded-full bg-warm-gray-200" />
        <div className="grid gap-8 md:grid-cols-2">
          <div className="h-80 animate-pulse rounded-xl bg-warm-gray-200" />
          <div className="space-y-4">
            <div className="h-6 w-full animate-pulse rounded bg-warm-gray-200" />
            <div className="h-6 w-3/4 animate-pulse rounded bg-warm-gray-200" />
            <div className="h-6 w-1/2 animate-pulse rounded bg-warm-gray-200" />
            <div className="h-32 animate-pulse rounded-lg bg-warm-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12 text-center md:px-6">
        <p className="text-lg text-muted">북클럽을 찾을 수 없습니다.</p>
        <Link href="/bookclub" className="mt-4 inline-block text-primary hover:text-primary-hover">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const status = STATUS_MAP[data.status];
  const progressPercent = Math.round((data.currentMembers / data.capacity) * 100);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 md:px-6">
      {/* Back */}
      <Link
        href="/bookclub"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        북클럽 목록
      </Link>

      {/* Title + Status */}
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            {data.title}
          </h1>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${status.bg} ${status.text}`}>
            {data.status === 'recruiting' && (
              <span className={`h-2 w-2 animate-pulse rounded-full ${status.dot}`} />
            )}
            {status.label}
          </span>
        </div>
        <p className="text-sm text-muted">{data.month}</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Left: Book Info */}
        <div>
          <div className="mb-6 flex min-h-[280px] items-center justify-center rounded-xl bg-warm-gray-50 p-8">
            <BookOpen className="h-16 w-16 text-warm-gray-300" />
          </div>
          {data.book && (
            <div className="rounded-xl border border-card-border bg-card-bg p-5">
              <h3 className="mb-1 text-lg font-bold text-foreground">
                {data.book.title}
              </h3>
              <p className="mb-3 text-sm text-muted">{data.book.author} · {data.book.publisher}</p>
              <span className="inline-block rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                {data.book.category}
              </span>
              {data.book.description && (
                <p className="mt-3 text-sm leading-relaxed text-warm-gray-600">
                  {data.book.description}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="space-y-6">
          {/* Description */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-muted">소개</h3>
            <p className="text-sm leading-relaxed text-warm-gray-700">
              {data.description}
            </p>
          </div>

          {/* Schedule */}
          <div className="space-y-3 rounded-xl border border-card-border bg-card-bg p-5">
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 text-green-600" />
              <div>
                <span className="font-medium text-foreground">진행 기간</span>
                <p className="text-muted">{formatDate(data.startDate)} ~ {formatDate(data.endDate)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="h-4 w-4 text-green-600" />
              <div>
                <span className="font-medium text-foreground">토론일</span>
                <p className="text-muted">{formatDate(data.discussDate)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 text-green-600" />
              <div>
                <span className="font-medium text-foreground">장소</span>
                <p className="text-muted">{data.discussLocation}</p>
              </div>
            </div>
          </div>

          {/* Capacity */}
          <div className="rounded-xl border border-card-border bg-card-bg p-5">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <Users className="h-4 w-4 text-green-600" />
                참여 현황
              </span>
              <span className="text-muted">
                {data.currentMembers}/{data.capacity}명
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-warm-gray-100">
              <div
                className="h-full rounded-full bg-green-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="mt-1.5 text-right text-xs text-muted">{progressPercent}%</p>
          </div>

          {/* Moderator */}
          {data.moderator && (
            <div className="rounded-xl border border-card-border bg-card-bg p-5">
              <h3 className="mb-3 text-sm font-semibold text-muted">좌장</h3>
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-green-100 text-lg font-bold text-green-700">
                  {data.moderator.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{data.moderator.name}</p>
                  <p className="text-xs text-muted">
                    {data.moderator.department} · {data.moderator.enrollYear}학번
                  </p>
                  <p className="mt-1.5 text-xs text-warm-gray-500">
                    {data.moderator.achievement}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-warm-gray-600">
                    {data.moderator.bio}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* CTA */}
          {data.status === 'recruiting' && (
            <button
              type="button"
              className="w-full rounded-xl bg-primary py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              북클럽 신청하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
