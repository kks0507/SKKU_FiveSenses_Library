'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Mic,
  BookOpen,
  Users,
  ChevronRight,
  Clock,
  PenTool,
  FileText,
  Heart,
  Star,
  Award,
} from 'lucide-react';

type BookInfo = {
  id: string;
  title: string;
  author: string;
  coverImage: string;
};

type CurrentNarration = {
  id: string;
  month: string;
  bookId: string;
  section: string;
  pageRange: string;
  description: string;
  deadline: string;
  totalParticipants: number;
  currentParticipants: number;
  status: string;
  createdAt: string;
  book: BookInfo | null;
};

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

function getDaysLeft(deadline: string) {
  const diff = new Date(deadline).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86400000));
}

function MiniStarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${
            i <= Math.round(rating)
              ? 'fill-amber-400 text-amber-400'
              : 'fill-warm-gray-200 text-warm-gray-200'
          }`}
        />
      ))}
    </div>
  );
}

export default function LiveActivitySection() {
  const [narration, setNarration] = useState<CurrentNarration | null>(null);
  const [writings, setWritings] = useState<WritingItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/narration/current').then((r) => r.json()),
      fetch('/api/writing?sort=latest').then((r) => r.json()),
      fetch('/api/review').then((r) => r.json()),
    ])
      .then(([narrationData, writingData, reviewData]) => {
        setNarration(narrationData);
        setWritings((writingData.writings || []).slice(0, 2));
        setReviews((reviewData.reviews || []).slice(0, 2));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-cream py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="flex items-center justify-center mb-10 md:mb-12">
            <div className="h-9 w-56 animate-pulse rounded-lg bg-warm-gray-200" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <div className="min-h-[400px] animate-pulse rounded-2xl bg-warm-gray-100" />
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-48 animate-pulse rounded-xl bg-warm-gray-100" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-cream py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Section Header */}
        <div className="flex items-center justify-center mb-10 md:mb-12 relative">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
            실시간 활동
          </h2>
          <Link
            href="/narration"
            className="absolute right-0 text-sm md:text-base text-muted hover:text-foreground flex items-center gap-1 font-medium group"
          >
            더 보기
            <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* ===== LEFT: Current Narration ===== */}
          <div
            className="bg-card-bg rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col min-h-[400px] md:min-h-[480px]"
          >
            {/* Purple header bar */}
            <div
              className="flex items-center gap-3 px-5 py-3.5"
              style={{ background: '#7c3aed' }}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
              </span>
              <span className="text-sm font-bold text-white tracking-wide">LIVE</span>
              <span className="text-sm font-medium text-white/80">낭독 존</span>
            </div>

            {narration ? (
              <div className="flex flex-col flex-1 p-5 md:p-6">
                {/* Book info */}
                <div className="flex items-start gap-4 mb-5">
                  <div
                    className="flex h-20 w-14 flex-shrink-0 items-center justify-center rounded-lg"
                    style={{ background: '#f5f3ff' }}
                  >
                    <BookOpen className="h-7 w-7" style={{ color: '#a78bfa' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    {narration.book && (
                      <>
                        <h3 className="text-base font-bold text-warm-gray-900 line-clamp-1">
                          {narration.book.title}
                        </h3>
                        <p className="text-sm text-muted mt-0.5">{narration.book.author}</p>
                      </>
                    )}
                    <p className="text-sm text-warm-gray-600 mt-1.5">
                      {narration.section} &middot; {narration.pageRange}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed text-muted mb-5 line-clamp-2">
                  {narration.description}
                </p>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-sm text-warm-gray-600">
                      <Users className="h-4 w-4 text-muted" />
                      참여 현황
                    </div>
                    <span className="text-sm font-bold" style={{ color: '#7c3aed' }}>
                      {narration.currentParticipants}/{narration.totalParticipants}명 참여
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-warm-gray-200">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (narration.currentParticipants / narration.totalParticipants) * 100)}%`,
                        background: '#7c3aed',
                      }}
                    />
                  </div>
                </div>

                {/* D-day badge */}
                <div className="mb-5">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                    style={{ background: '#ede9fe', color: '#7c3aed' }}
                  >
                    <Clock className="h-3.5 w-3.5" />
                    D-{getDaysLeft(narration.deadline)}
                  </span>
                </div>

                {/* CTA */}
                <div className="mt-auto">
                  <Link
                    href="/narration"
                    className="flex items-center justify-center w-full rounded-xl px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ background: '#7c3aed' }}
                  >
                    <Mic className="h-4 w-4 mr-2" />
                    낭독 참여하기
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col flex-1 items-center justify-center p-8 text-center">
                <Mic className="h-12 w-12 text-warm-gray-200 mb-3" />
                <p className="text-sm font-medium text-muted">
                  현재 진행 중인 낭독이 없습니다.
                </p>
                <p className="text-xs text-warm-gray-400 mt-1">
                  곧 새로운 낭독 프로젝트가 시작됩니다!
                </p>
              </div>
            )}
          </div>

          {/* ===== RIGHT: Recent Activity 2x2 Grid ===== */}
          <div className="grid grid-cols-2 gap-4">
            {/* Writing Card 1 */}
            {writings[0] ? (
              <Link
                href={`/writing/${writings[0].id}`}
                className="bg-card-bg rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col group"
              >
                <div className="flex h-24 items-center justify-center bg-amber-50">
                  <PenTool className="h-8 w-8 text-amber-300" />
                </div>
                <div className="p-3.5 flex flex-col flex-1">
                  <p className="text-xs text-muted line-clamp-2 mb-2 leading-relaxed group-hover:text-warm-gray-700">
                    &ldquo;{writings[0].excerpt}&rdquo;
                  </p>
                  <p className="text-[11px] text-warm-gray-400 mb-2">
                    — {writings[0].bookTitle} &middot; {writings[0].bookAuthor}
                  </p>
                  <div className="mt-auto flex items-center gap-1 text-xs text-muted">
                    <Heart className="h-3 w-3" />
                    {writings[0].likes}
                  </div>
                </div>
              </Link>
            ) : (
              <div className="bg-card-bg rounded-xl shadow-md flex items-center justify-center p-4">
                <div className="text-center">
                  <PenTool className="h-6 w-6 text-warm-gray-200 mx-auto mb-1.5" />
                  <p className="text-xs text-warm-gray-400">필사 없음</p>
                </div>
              </div>
            )}

            {/* Writing Card 2 */}
            {writings[1] ? (
              <Link
                href={`/writing/${writings[1].id}`}
                className="bg-card-bg rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col group"
              >
                <div className="flex h-24 items-center justify-center bg-amber-50">
                  <PenTool className="h-8 w-8 text-amber-300" />
                </div>
                <div className="p-3.5 flex flex-col flex-1">
                  <p className="text-xs text-muted line-clamp-2 mb-2 leading-relaxed group-hover:text-warm-gray-700">
                    &ldquo;{writings[1].excerpt}&rdquo;
                  </p>
                  <p className="text-[11px] text-warm-gray-400 mb-2">
                    — {writings[1].bookTitle} &middot; {writings[1].bookAuthor}
                  </p>
                  <div className="mt-auto flex items-center gap-1 text-xs text-muted">
                    <Heart className="h-3 w-3" />
                    {writings[1].likes}
                  </div>
                </div>
              </Link>
            ) : (
              <div className="bg-card-bg rounded-xl shadow-md flex items-center justify-center p-4">
                <div className="text-center">
                  <PenTool className="h-6 w-6 text-warm-gray-200 mx-auto mb-1.5" />
                  <p className="text-xs text-warm-gray-400">필사 없음</p>
                </div>
              </div>
            )}

            {/* Review Card 1 */}
            {reviews[0] ? (
              <Link
                href={`/review/${reviews[0].id}`}
                className="bg-card-bg rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col group"
              >
                <div
                  className="flex h-24 items-center justify-center"
                  style={{ background: '#fef2f2' }}
                >
                  <FileText className="h-8 w-8" style={{ color: '#fca5a5' }} />
                </div>
                <div className="p-3.5 flex flex-col flex-1">
                  <h4 className="text-xs font-bold text-warm-gray-800 line-clamp-1 mb-1 group-hover:text-primary">
                    {reviews[0].title}
                  </h4>
                  <MiniStarRating rating={reviews[0].rating} />
                  <p className="text-[11px] text-warm-gray-400 mt-1.5 line-clamp-1">
                    {reviews[0].bookTitle}
                  </p>
                  {reviews[0].isExcellent && (
                    <div className="mt-auto pt-2">
                      <span
                        className="inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                        style={{ background: '#fee2e2', color: '#dc2626' }}
                      >
                        <Award className="h-2.5 w-2.5" />
                        우수 서평
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ) : (
              <div className="bg-card-bg rounded-xl shadow-md flex items-center justify-center p-4">
                <div className="text-center">
                  <FileText className="h-6 w-6 text-warm-gray-200 mx-auto mb-1.5" />
                  <p className="text-xs text-warm-gray-400">서평 없음</p>
                </div>
              </div>
            )}

            {/* Review Card 2 */}
            {reviews[1] ? (
              <Link
                href={`/review/${reviews[1].id}`}
                className="bg-card-bg rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col group"
              >
                <div
                  className="flex h-24 items-center justify-center"
                  style={{ background: '#fef2f2' }}
                >
                  <FileText className="h-8 w-8" style={{ color: '#fca5a5' }} />
                </div>
                <div className="p-3.5 flex flex-col flex-1">
                  <h4 className="text-xs font-bold text-warm-gray-800 line-clamp-1 mb-1 group-hover:text-primary">
                    {reviews[1].title}
                  </h4>
                  <MiniStarRating rating={reviews[1].rating} />
                  <p className="text-[11px] text-warm-gray-400 mt-1.5 line-clamp-1">
                    {reviews[1].bookTitle}
                  </p>
                  {reviews[1].isExcellent && (
                    <div className="mt-auto pt-2">
                      <span
                        className="inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                        style={{ background: '#fee2e2', color: '#dc2626' }}
                      >
                        <Award className="h-2.5 w-2.5" />
                        우수 서평
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ) : (
              <div className="bg-card-bg rounded-xl shadow-md flex items-center justify-center p-4">
                <div className="text-center">
                  <FileText className="h-6 w-6 text-warm-gray-200 mx-auto mb-1.5" />
                  <p className="text-xs text-warm-gray-400">서평 없음</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
