'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mic, Play, Clock, Users } from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';

type CurrentNarration = {
  id: string;
  month: string;
  section: string;
  pageRange: string;
  description: string;
  deadline: string;
  totalParticipants: number;
  currentParticipants: number;
  status: string;
  book?: { title: string; author: string };
};

type ArchiveItem = {
  id: string;
  month: string;
  title: string;
  section: string;
  totalParticipants: number;
  duration: number;
  book?: { title: string; author: string };
};

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function daysUntil(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86400000));
}

export default function NarrationZoneSection() {
  const [current, setCurrent] = useState<CurrentNarration | null>(null);
  const [archive, setArchive] = useState<ArchiveItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [curRes, archRes] = await Promise.all([
          fetch('/api/narration/current'),
          fetch('/api/narration/archive'),
        ]);
        if (curRes.ok) {
          const curJson = await curRes.json();
          setCurrent(curJson);
        }
        if (archRes.ok) {
          const archJson = await archRes.json();
          setArchive(archJson.archive || []);
        }
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
      <SectionWrapper bgColor="bg-background" title="소리 내어 완성하는 낭독 존">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-80 animate-pulse rounded-xl bg-warm-gray-200" />
          <div className="space-y-4">
            <div className="h-24 animate-pulse rounded-xl bg-warm-gray-200" />
            <div className="h-24 animate-pulse rounded-xl bg-warm-gray-200" />
          </div>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper bgColor="bg-background" title="소리 내어 완성하는 낭독 존" moreHref="/narration">
      <div className="grid gap-6 md:grid-cols-2">
        {/* LIVE - Current narration */}
        {current && (
          <div className="overflow-hidden rounded-xl bg-card-bg shadow-sm">
            <div className="flex items-center justify-center bg-purple-50 p-8" style={{ minHeight: 200 }}>
              <Mic className="h-14 w-14 text-purple-300" />
            </div>
            <div className="p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-500">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                  LIVE
                </span>
                {current.status === 'open' && (
                  <span className="text-xs text-muted">D-{daysUntil(current.deadline)}</span>
                )}
              </div>
              <h3 className="mb-1 text-lg font-bold text-foreground">
                {current.book?.title ? `《${current.book.title}》` : ''} {current.section}
              </h3>
              <p className="mb-3 text-sm text-muted">{current.pageRange}</p>
              <p className="mb-4 line-clamp-2 text-sm text-warm-gray-600">{current.description}</p>
              <div className="flex items-center justify-between text-xs text-muted">
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {current.currentParticipants}/{current.totalParticipants}명 참여
                </span>
                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-warm-gray-100">
                  <div
                    className="h-full rounded-full bg-purple-500"
                    style={{ width: `${(current.currentParticipants / current.totalParticipants) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Archive */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted">아카이브</h3>
          {archive.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">아카이브가 없습니다.</p>
          ) : (
            archive.map((item) => (
              <div
                key={item.id}
                className="group flex items-center gap-4 rounded-xl bg-card-bg p-4 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-purple-50">
                  <Play className="h-5 w-5 text-purple-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="line-clamp-1 text-sm font-semibold text-foreground">
                    {item.title}
                  </h4>
                  <p className="text-xs text-muted">
                    {item.section} · {item.totalParticipants}명 참여
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDuration(item.duration)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}
