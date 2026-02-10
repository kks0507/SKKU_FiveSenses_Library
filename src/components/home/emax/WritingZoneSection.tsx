'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PenTool, Heart } from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';

type WritingItem = {
  id: string;
  bookTitle: string;
  bookAuthor: string;
  excerpt: string;
  likes: number;
  isBanner: boolean;
  createdAt: string;
  userName: string;
  userDepartment: string;
};

export default function WritingZoneSection() {
  const [writings, setWritings] = useState<WritingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/writing?sort=latest');
        if (!res.ok) throw new Error('Failed');
        const json = await res.json();
        setWritings(json.writings || []);
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
      <SectionWrapper bgColor="bg-background" title="따라 쓰며 새기는 필사 존">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-xl bg-warm-gray-200" />
          ))}
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper bgColor="bg-background" title="따라 쓰며 새기는 필사 존" moreHref="/writing">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {writings.slice(0, 6).map((w) => (
          <Link
            key={w.id}
            href={`/writing/${w.id}`}
            className="group overflow-hidden rounded-xl bg-card-bg shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            {/* Image area */}
            <div className="relative flex min-h-[200px] items-center justify-center overflow-hidden bg-amber-50 p-6">
              <PenTool className="h-10 w-10 text-amber-300 transition-transform duration-300 group-hover:scale-110" />
              {w.isBanner && (
                <span className="absolute right-3 top-3 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                  이달의 필사
                </span>
              )}
            </div>

            {/* Info */}
            <div className="p-4">
              <p className="mb-2 line-clamp-2 text-sm font-medium italic leading-relaxed text-foreground">
                &ldquo;{w.excerpt}&rdquo;
              </p>
              <p className="mb-3 text-xs text-muted">
                {w.bookTitle} — {w.bookAuthor}
              </p>
              <div className="flex items-center justify-between text-xs text-muted">
                <span>{w.userName} · {w.userDepartment}</span>
                <span className="flex items-center gap-1">
                  <Heart className="h-3.5 w-3.5" />
                  {w.likes}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </SectionWrapper>
  );
}
