'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, BookOpen, Award } from 'lucide-react';
import StarRating from '@/components/ui/StarRating';
import LikeButton from '@/components/ui/LikeButton';
import CommentSection from '@/components/ui/CommentSection';

type ReviewDetail = {
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
  userDepartment: string;
  book?: {
    id: string;
    title: string;
    author: string;
    coverImage: string;
    description: string;
    publisher: string;
    category: string;
  };
  comments: Array<{
    id: string;
    userId: string;
    content: string;
    createdAt: string;
    userName: string;
  }>;
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export default function ReviewDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<ReviewDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/review/${id}`);
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
      <div className="container mx-auto max-w-3xl px-4 py-12 md:px-6">
        <div className="mb-6 h-6 w-24 animate-pulse rounded bg-warm-gray-200" />
        <div className="mb-4 h-10 w-3/4 animate-pulse rounded-lg bg-warm-gray-200" />
        <div className="mb-6 h-5 w-32 animate-pulse rounded bg-warm-gray-200" />
        <div className="mb-8 h-64 animate-pulse rounded-xl bg-warm-gray-200" />
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-warm-gray-200" />
          <div className="h-4 w-full animate-pulse rounded bg-warm-gray-200" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-warm-gray-200" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-12 text-center md:px-6">
        <p className="text-lg text-muted">서평을 찾을 수 없습니다.</p>
        <Link href="/review" className="mt-4 inline-block text-primary hover:text-primary-hover">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 md:px-6">
      {/* Back */}
      <Link
        href="/review"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        서평 목록
      </Link>

      {/* Title + Badge */}
      <div className="mb-4 flex items-start gap-3">
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">
          {data.title}
        </h1>
        {data.isExcellent && (
          <span className="mt-1 inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
            <Award className="h-3.5 w-3.5" />
            우수 서평
          </span>
        )}
      </div>

      {/* Rating */}
      <div className="mb-6">
        <StarRating rating={data.rating} />
      </div>

      {/* Summary */}
      <p className="mb-8 rounded-xl border border-card-border bg-warm-gray-50 px-5 py-4 text-sm italic leading-relaxed text-warm-gray-600">
        &ldquo;{data.summary}&rdquo;
      </p>

      {/* Book info */}
      {data.book && (
        <div className="mb-8 flex items-start gap-5 rounded-xl border border-card-border bg-card-bg p-5">
          <div className="flex h-24 w-20 shrink-0 items-center justify-center rounded-lg bg-warm-gray-50">
            <BookOpen className="h-8 w-8 text-warm-gray-300" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{data.book.title}</h3>
            <p className="text-sm text-muted">{data.book.author} · {data.book.publisher}</p>
            <span className="mt-2 inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
              {data.book.category}
            </span>
          </div>
        </div>
      )}

      {/* Full content */}
      <div className="mb-8">
        <p className="whitespace-pre-line text-sm leading-[1.8] text-warm-gray-700">
          {data.content}
        </p>
      </div>

      {/* Author + Like + Date */}
      <div className="mb-6 flex items-center justify-between border-b border-card-border pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-500">
            {data.userName.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{data.userName}</p>
            <p className="text-xs text-muted">{data.userDepartment}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <LikeButton initialCount={data.likes} />
          <span className="text-xs text-muted">{formatDate(data.createdAt)}</span>
        </div>
      </div>

      {/* Comments */}
      <CommentSection comments={data.comments} />
    </div>
  );
}
