'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Users, ChevronRight } from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';

type BookClubItem = {
  id: string;
  title: string;
  month: string;
  description: string;
  capacity: number;
  currentMembers: number;
  startDate: string;
  endDate: string;
  discussDate: string;
  status: 'recruiting' | 'active' | 'completed';
  book?: { title: string; author: string };
  moderator?: { name: string; department: string };
};

const STATUS_STYLES = {
  recruiting: { label: '모집중', bg: 'bg-green-100', text: 'text-green-700', dot: true },
  active: { label: '진행중', bg: 'bg-blue-100', text: 'text-blue-500', dot: false },
  completed: { label: '완료', bg: 'bg-warm-gray-100', text: 'text-warm-gray-500', dot: false },
};

export default function BookclubZoneSection() {
  const [bookclubs, setBookclubs] = useState<BookClubItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/bookclub');
        if (!res.ok) throw new Error('Failed');
        const json = await res.json();
        setBookclubs([...(json.current || []), ...(json.archive || [])]);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <SectionWrapper bgColor="bg-green-50" title="함께 읽고 토론하는 북클럽 존">
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-xl bg-warm-gray-200" />
          ))}
        </div>
      </SectionWrapper>
    );
  }

  const featured = bookclubs.find((bc) => bc.status === 'recruiting' || bc.status === 'active');
  const others = bookclubs.filter((bc) => bc.id !== featured?.id).slice(0, 4);

  return (
    <SectionWrapper bgColor="bg-green-50" title="함께 읽고 토론하는 북클럽 존" moreHref="/bookclub">
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Featured */}
        {featured && (
          <Link
            href={`/bookclub/${featured.id}`}
            className="group overflow-hidden rounded-xl bg-card-bg shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg lg:col-span-3"
          >
            <div className="flex min-h-[240px] items-center justify-center bg-green-100 p-8">
              <BookOpen className="h-16 w-16 text-green-300" />
            </div>
            <div className="p-5">
              <div className="mb-2 flex items-center gap-2">
                {(() => {
                  const s = STATUS_STYLES[featured.status];
                  return (
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.bg} ${s.text}`}>
                      {s.dot && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />}
                      {s.label}
                    </span>
                  );
                })()}
                {featured.moderator && (
                  <span className="text-xs text-muted">좌장: {featured.moderator.name}</span>
                )}
              </div>
              <h3 className="mb-1.5 text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                {featured.title}
              </h3>
              {featured.book && (
                <p className="mb-3 text-sm text-muted">
                  선정 도서: {featured.book.title} — {featured.book.author}
                </p>
              )}
              {/* Progress */}
              <div className="mb-2 flex items-center justify-between text-xs text-muted">
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {featured.currentMembers}/{featured.capacity}명
                </span>
                <span>{Math.round((featured.currentMembers / featured.capacity) * 100)}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-warm-gray-100">
                <div
                  className="h-full rounded-full bg-green-500 transition-all"
                  style={{ width: `${(featured.currentMembers / featured.capacity) * 100}%` }}
                />
              </div>
              {featured.status === 'recruiting' && (
                <div className="mt-4 rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors group-hover:bg-primary-hover">
                  신청하기
                </div>
              )}
            </div>
          </Link>
        )}

        {/* Others */}
        <div className="space-y-4 lg:col-span-2">
          {others.map((bc) => {
            const s = STATUS_STYLES[bc.status];
            return (
              <Link
                key={bc.id}
                href={`/bookclub/${bc.id}`}
                className="group flex gap-4 rounded-xl bg-card-bg p-4 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-green-50">
                  <BookOpen className="h-6 w-6 text-green-300" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${s.bg} ${s.text}`}>
                      {s.label}
                    </span>
                  </div>
                  <h4 className="line-clamp-1 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                    {bc.title}
                  </h4>
                  <p className="mt-0.5 text-xs text-muted">
                    {bc.currentMembers}/{bc.capacity}명
                  </p>
                </div>
                <ChevronRight className="mt-2 h-4 w-4 shrink-0 text-warm-gray-300" />
              </Link>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
