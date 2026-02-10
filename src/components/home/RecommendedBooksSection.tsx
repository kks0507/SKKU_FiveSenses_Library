'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type Book = {
  id: string;
  title: string;
  author: string;
  publisher: string;
  category: string;
  coverImage: string;
  description: string;
  inLibrary: boolean;
  loanUrl: string | null;
  createdAt: string;
};

const CATEGORY_COLORS: Record<
  string,
  { bg: string; text: string; accent: string }
> = {
  문학: { bg: 'bg-green-100', text: 'text-green-700', accent: 'bg-green-500' },
  인문: { bg: 'bg-amber-100', text: 'text-amber-700', accent: 'bg-amber-500' },
  사회: { bg: 'bg-blue-100', text: 'text-blue-600', accent: 'bg-blue-500' },
  과학: { bg: 'bg-red-100', text: 'text-red-600', accent: 'bg-red-500' },
  예술: { bg: 'bg-purple-100', text: 'text-purple-600', accent: 'bg-purple-500' },
};

const DEFAULT_CATEGORY_COLOR = {
  bg: 'bg-warm-gray-100',
  text: 'text-warm-gray-600',
  accent: 'bg-warm-gray-400',
};

export default function RecommendedBooksSection() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await fetch('/api/booklist');
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        setBooks(json.books || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <div className="w-full bg-white py-12 md:py-16 lg:py-20">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          {/* Header skeleton */}
          <div className="mb-8 flex items-center justify-between">
            <div className="h-8 w-40 animate-pulse rounded-lg bg-warm-gray-200" />
            <div className="h-5 w-20 animate-pulse rounded-lg bg-warm-gray-200" />
          </div>
          {/* Cards skeleton */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse overflow-hidden rounded-xl bg-card-bg"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
              >
                <div className="min-h-[200px] bg-warm-gray-200 md:min-h-[240px]" />
                <div className="space-y-2 p-4">
                  <div className="h-4 w-16 rounded bg-warm-gray-200" />
                  <div className="h-4 w-3/4 rounded bg-warm-gray-200" />
                  <div className="h-3 w-1/2 rounded bg-warm-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (books.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-white py-12 md:py-16 lg:py-20">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        {/* Section header */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl">
            사서 추천 도서
          </h2>
          <Link
            href="/booklist"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary-hover"
          >
            전체 보기
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Swiper carousel */}
        <div className="relative">
          {/* Custom navigation arrows */}
          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute -left-5 top-[calc(50%-40px)] z-10 hidden h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl md:flex"
            aria-label="이전 도서"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <button
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute -right-5 top-[calc(50%-40px)] z-10 hidden h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl md:flex"
            aria-label="다음 도서"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>

          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={16}
            slidesPerView={1}
            loop={true}
            pagination={{
              clickable: true,
              el: '.recommended-books-pagination',
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            className="!pb-2"
          >
            {books.map((book) => {
              const categoryColor =
                CATEGORY_COLORS[book.category] || DEFAULT_CATEGORY_COLOR;

              return (
                <SwiperSlide key={book.id}>
                  <Link
                    href={`/booklist/${book.id}`}
                    className="group block overflow-hidden rounded-xl bg-card-bg shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    {/* Image section */}
                    <div className="relative min-h-[200px] bg-warm-gray-100 md:min-h-[240px]">
                      {/* Category accent strip at top */}
                      <div
                        className={`absolute left-0 right-0 top-0 h-1 ${categoryColor.accent}`}
                      />
                      {/* Centered book icon */}
                      <div className="flex h-full min-h-[200px] items-center justify-center md:min-h-[240px]">
                        <BookOpen className="h-12 w-12 text-warm-gray-300" />
                      </div>
                    </div>

                    {/* Info section */}
                    <div className="bg-card-bg px-4 py-4">
                      {/* Category badge */}
                      <span
                        className={`mb-2 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${categoryColor.bg} ${categoryColor.text}`}
                      >
                        {book.category}
                      </span>

                      {/* Book title */}
                      <h3 className="line-clamp-2 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                        {book.title}
                      </h3>

                      {/* Author */}
                      <p className="mt-1 text-xs text-muted">{book.author}</p>

                      {/* Library status */}
                      <div className="mt-2">
                        {book.inLibrary ? (
                          <span className="inline-block rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                            소장
                          </span>
                        ) : (
                          <span className="inline-block rounded-full bg-warm-gray-100 px-2 py-0.5 text-[10px] font-semibold text-warm-gray-500">
                            미소장
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Pagination dots */}
          <div className="recommended-books-pagination mt-6 flex justify-center" />
        </div>
      </div>
    </div>
  );
}
