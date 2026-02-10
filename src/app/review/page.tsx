'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  FileText,
  Star,
  Heart,
  MessageCircle,
  Plus,
  Calendar,
  User,
  BookOpen,
  ChevronRight,
  Award,
} from 'lucide-react';

type ReviewItem = {
  id: string;
  userId: string;
  bookId: string;
  rating: number;
  title: string;
  content: string;
  summary: string;
  likes: number;
  isExcellent: boolean;
  createdAt: string;
  userName: string;
  bookTitle: string;
  bookAuthor: string;
  bookCoverImage: string;
};

type ReviewData = {
  reviews: ReviewItem[];
};

const categories = [
  { key: '', label: '전체' },
  { key: '문학', label: '문학' },
  { key: '인문', label: '인문' },
  { key: '사회', label: '사회' },
  { key: '과학', label: '과학' },
  { key: '예술', label: '예술' },
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= rating
              ? 'fill-amber-400 text-amber-400'
              : 'fill-warm-gray-200 text-warm-gray-200'
          }`}
        />
      ))}
      <span className="ml-1 text-xs font-medium text-warm-gray-500">{rating}.0</span>
    </div>
  );
}

export default function ReviewPage() {
  const [data, setData] = useState<ReviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');

  const fetchData = useCallback((category: string) => {
    setLoading(true);
    const url = category
      ? `/api/review?category=${encodeURIComponent(category)}`
      : '/api/review';

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchData(activeCategory);
  }, [activeCategory, fetchData]);

  const handleCategoryChange = useCallback((category: string) => {
    setActiveCategory(category);
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* ===== ZONE HEADER ===== */}
      <section className="mb-8 overflow-hidden rounded-2xl" style={{ background: '#fef2f2' }}>
        <div className="px-6 py-10 sm:px-10">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: '#fee2e2' }}>
              <FileText className="h-7 w-7" style={{ color: '#dc2626' }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl" style={{ color: '#991b1b' }}>
                서평 존 — 읽고, 생각하고, 나누다
              </h1>
              <p className="mt-1 text-sm" style={{ color: '#dc2626' }}>
                책을 읽고 느낀 감상을 다른 학우들과 나누는 공간입니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORY FILTER TABS ===== */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => handleCategoryChange(cat.key)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeCategory === cat.key
                  ? 'text-white'
                  : 'bg-warm-gray-100 text-warm-gray-500 hover:text-warm-gray-700'
              }`}
              style={
                activeCategory === cat.key
                  ? { background: '#dc2626' }
                  : undefined
              }
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ===== LOADING ===== */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 animate-pulse rounded-xl bg-warm-gray-100" />
          ))}
        </div>
      )}

      {/* ===== REVIEW LIST ===== */}
      {!loading && data && data.reviews.length > 0 && (
        <div className="space-y-4">
          {data.reviews.map((review) => (
            <Link
              key={review.id}
              href={`/review/${review.id}`}
              className="group block overflow-hidden rounded-xl bg-card-bg transition-all hover:translate-y-[-1px]"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-6">
                {/* Book cover placeholder */}
                <div className="flex items-center justify-center border-b border-warm-gray-100 p-4 sm:border-b-0 sm:border-r sm:p-5" style={{ background: '#fafafa' }}>
                  <div className="flex h-24 w-16 items-center justify-center rounded-lg bg-warm-gray-100 sm:h-28 sm:w-20">
                    <BookOpen className="h-8 w-8 text-warm-gray-300" />
                  </div>
                </div>

                {/* Content */}
                <div className="col-span-5 p-5">
                  {/* Top row */}
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <StarRating rating={review.rating} />
                    {review.isExcellent && (
                      <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: '#fee2e2', color: '#dc2626' }}>
                        <Award className="h-3 w-3" />
                        우수 서평
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="mb-1 text-base font-bold text-warm-gray-900 group-hover:text-primary">
                    {review.title}
                  </h3>

                  {/* Book info */}
                  <p className="mb-2 text-sm text-warm-gray-500">
                    《{review.bookTitle}》 — {review.bookAuthor}
                  </p>

                  {/* Excerpt of content */}
                  <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-muted">
                    {review.summary || review.content}
                  </p>

                  {/* Footer */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-warm-gray-400">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {review.userName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(review.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {review.likes}
                    </span>
                    <ChevronRight className="ml-auto h-4 w-4 text-warm-gray-300 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && data && data.reviews.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <FileText className="mb-4 h-16 w-16 text-warm-gray-200" />
          <p className="text-lg font-medium text-muted">
            {activeCategory
              ? `'${activeCategory}' 카테고리에 등록된 서평이 없습니다.`
              : '아직 등록된 서평이 없습니다.'}
          </p>
          <p className="mt-1 text-sm text-warm-gray-400">
            첫 번째 서평을 작성해 보세요!
          </p>
        </div>
      )}

      {/* ===== FLOATING WRITE BUTTON ===== */}
      <button
        className="fixed bottom-8 right-8 z-40 flex h-14 items-center gap-2 rounded-full px-6 text-sm font-semibold text-white transition-all hover:shadow-lg"
        style={{ background: '#dc2626', boxShadow: '0 4px 16px rgba(220, 38, 38, 0.3)' }}
      >
        <Plus className="h-5 w-5" />
        서평 작성하기
      </button>
    </div>
  );
}
