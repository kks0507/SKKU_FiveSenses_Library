'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Heart, Award } from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import EmaxCarousel from '@/components/ui/EmaxCarousel';
import StarRating from '@/components/ui/StarRating';

type ReviewItem = {
  id: string;
  rating: number;
  title: string;
  summary: string;
  likes: number;
  isExcellent: boolean;
  createdAt: string;
  userName: string;
  bookTitle: string;
  bookAuthor: string;
};

const CATEGORIES = ['전체', '문학', '인문', '사회', '과학', '예술'];

export default function ReviewZoneSection() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('전체');

  useEffect(() => {
    async function fetchData() {
      try {
        const url = category === '전체' ? '/api/review' : `/api/review?category=${category}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed');
        const json = await res.json();
        setReviews(json.reviews || []);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    setLoading(true);
    fetchData();
  }, [category]);

  return (
    <SectionWrapper bgColor="bg-warm-gray-50" title="읽고 생각을 나누는 서평 존" moreHref="/review">
      {/* Category filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              category === cat
                ? 'bg-primary text-white shadow-sm'
                : 'bg-card-bg text-warm-gray-600 hover:text-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-xl bg-warm-gray-200" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="py-12 text-center">
          <BookOpen className="mx-auto mb-3 h-12 w-12 text-warm-gray-300" />
          <p className="text-sm text-muted">서평이 없습니다.</p>
        </div>
      ) : (
        <EmaxCarousel paginationClass="review-pagination">
          {reviews.map((r) => (
            <Link
              key={r.id}
              href={`/review/${r.id}`}
              className="group block overflow-hidden rounded-xl bg-card-bg shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Cover placeholder */}
              <div className="relative flex min-h-[180px] items-center justify-center bg-red-50 p-5">
                <BookOpen className="h-10 w-10 text-red-200" />
                {r.isExcellent && (
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                    <Award className="h-3 w-3" />
                    우수
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="mb-1.5">
                  <StarRating rating={r.rating} size="sm" />
                </div>
                <h3 className="mb-1 line-clamp-1 text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                  {r.title}
                </h3>
                <p className="mb-2 line-clamp-2 text-xs italic text-warm-gray-500">
                  &ldquo;{r.summary}&rdquo;
                </p>
                <p className="mb-3 text-xs text-muted">
                  {r.bookTitle} — {r.bookAuthor}
                </p>
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>{r.userName}</span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-3.5 w-3.5" />
                    {r.likes}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </EmaxCarousel>
      )}
    </SectionWrapper>
  );
}
