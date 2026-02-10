'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  PenTool,
  Heart,
  Plus,
  BookOpen,
  User,
  Calendar,
  SlidersHorizontal,
  ImageIcon,
} from 'lucide-react';

type WritingItem = {
  id: string;
  userId: string;
  bookTitle: string;
  bookAuthor: string;
  excerpt: string;
  imageUrl: string;
  comment: string | null;
  likes: number;
  isBanner: boolean;
  createdAt: string;
  userName: string;
  userDepartment: string;
};

type WritingData = {
  writings: WritingItem[];
};

const sortTabs = [
  { key: 'latest', label: '최신순' },
  { key: 'likes', label: '좋아요순' },
  { key: 'banner', label: '이달의 필사' },
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

// Generate pseudo-random height classes for masonry effect
function getMasonryHeight(idx: number): string {
  const heights = ['h-64', 'h-72', 'h-56', 'h-80', 'h-60', 'h-68'];
  return heights[idx % heights.length];
}

export default function WritingPage() {
  const [data, setData] = useState<WritingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSort, setActiveSort] = useState('latest');

  const fetchData = useCallback((sort: string) => {
    setLoading(true);
    fetch(`/api/writing?sort=${sort}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchData(activeSort);
  }, [activeSort, fetchData]);

  const handleSortChange = useCallback((sortKey: string) => {
    setActiveSort(sortKey);
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* ===== ZONE HEADER ===== */}
      <section className="mb-8 overflow-hidden rounded-2xl bg-amber-50">
        <div className="px-6 py-10 sm:px-10">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100">
              <PenTool className="h-7 w-7 text-amber-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-amber-700 sm:text-3xl" style={{ color: '#92400e' }}>
                필사 존 — 한 글자, 한 문장의 울림
              </h1>
              <p className="mt-1 text-sm text-amber-600">
                아름다운 문장을 손으로 옮겨 적고, 그 울림을 나누는 공간입니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SORT TABS ===== */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-1 rounded-lg bg-warm-gray-100 p-1">
          {sortTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleSortChange(tab.key)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
                activeSort === tab.key
                  ? 'bg-card-bg text-warm-gray-900'
                  : 'text-warm-gray-500 hover:text-warm-gray-700'
              }`}
              style={activeSort === tab.key ? { boxShadow: '0 1px 3px rgba(0,0,0,0.08)' } : undefined}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 text-sm text-muted">
          <SlidersHorizontal className="h-4 w-4" />
          {data ? `총 ${data.writings.length}건` : ''}
        </div>
      </div>

      {/* ===== LOADING ===== */}
      {loading && (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className={`mb-4 break-inside-avoid animate-pulse rounded-xl bg-warm-gray-100 ${getMasonryHeight(i)}`}
            />
          ))}
        </div>
      )}

      {/* ===== MASONRY GRID ===== */}
      {!loading && data && data.writings.length > 0 && (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {data.writings.map((item, idx) => (
            <Link
              key={item.id}
              href={`/writing/${item.id}`}
              className="group mb-4 block break-inside-avoid overflow-hidden rounded-xl bg-card-bg transition-all hover:translate-y-[-2px]"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
            >
              {/* Image placeholder */}
              <div className={`flex items-center justify-center bg-warm-gray-100 ${getMasonryHeight(idx)}`}>
                <div className="flex flex-col items-center gap-2">
                  <ImageIcon className="h-10 w-10 text-warm-gray-300" />
                  <span className="text-xs text-warm-gray-400">필사 이미지</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Banner badge */}
                {item.isBanner && (
                  <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                    <PenTool className="h-3 w-3" />
                    이달의 필사
                  </div>
                )}

                {/* Excerpt */}
                <p className="mb-2 line-clamp-3 text-sm leading-relaxed text-warm-gray-700 group-hover:text-warm-gray-900">
                  &ldquo;{item.excerpt}&rdquo;
                </p>

                {/* Source */}
                <p className="mb-3 text-xs text-muted">
                  — 《{item.bookTitle}》 {item.bookAuthor}
                </p>

                {/* Comment */}
                {item.comment && (
                  <p className="mb-3 rounded-lg bg-amber-50 p-2.5 text-xs leading-relaxed text-warm-gray-600">
                    {item.comment}
                  </p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-warm-gray-100 pt-3">
                  <div className="flex items-center gap-1.5">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100">
                      <User className="h-3 w-3 text-amber-700" />
                    </div>
                    <span className="text-xs font-medium text-warm-gray-600">
                      {item.userName}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-xs text-muted">
                      <Heart className="h-3 w-3" />
                      {item.likes}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted">
                      <Calendar className="h-3 w-3" />
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && data && data.writings.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <PenTool className="mb-4 h-16 w-16 text-warm-gray-200" />
          <p className="text-lg font-medium text-muted">
            {activeSort === 'banner'
              ? '이달의 필사가 아직 선정되지 않았습니다.'
              : '아직 등록된 필사가 없습니다.'}
          </p>
          <p className="mt-1 text-sm text-warm-gray-400">
            첫 번째 필사를 등록해 보세요!
          </p>
        </div>
      )}

      {/* ===== FLOATING UPLOAD BUTTON ===== */}
      <button
        className="fixed bottom-8 right-8 z-40 flex h-14 items-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-white transition-all hover:bg-accent-hover hover:shadow-lg"
        style={{ boxShadow: '0 4px 16px rgba(199, 141, 43, 0.3)' }}
      >
        <Plus className="h-5 w-5" />
        필사 업로드하기
      </button>
    </div>
  );
}
