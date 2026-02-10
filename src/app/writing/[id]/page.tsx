'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, PenTool } from 'lucide-react';
import LikeButton from '@/components/ui/LikeButton';
import CommentSection from '@/components/ui/CommentSection';

type WritingDetail = {
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

export default function WritingDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<WritingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/writing/${id}`);
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
        <div className="mb-8 h-[360px] animate-pulse rounded-xl bg-warm-gray-200" />
        <div className="space-y-3">
          <div className="h-6 w-3/4 animate-pulse rounded bg-warm-gray-200" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-warm-gray-200" />
          <div className="h-20 animate-pulse rounded-lg bg-warm-gray-200" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-12 text-center md:px-6">
        <p className="text-lg text-muted">필사를 찾을 수 없습니다.</p>
        <Link href="/writing" className="mt-4 inline-block text-primary hover:text-primary-hover">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 md:px-6">
      {/* Back */}
      <Link
        href="/writing"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        필사 목록
      </Link>

      {/* Image area */}
      <div className="mb-8 flex min-h-[360px] items-center justify-center rounded-xl bg-warm-gray-50 p-10">
        <PenTool className="h-20 w-20 text-amber-400" />
      </div>

      {/* Excerpt */}
      <blockquote className="mb-6 border-l-4 border-amber-400 pl-5">
        <p className="text-lg font-medium italic leading-relaxed text-foreground md:text-xl">
          &ldquo;{data.excerpt}&rdquo;
        </p>
      </blockquote>

      {/* Book info */}
      <p className="mb-6 text-sm text-muted">
        {data.bookTitle} — {data.bookAuthor}
      </p>

      {/* User comment */}
      {data.comment && (
        <div className="mb-6 rounded-xl border border-card-border bg-card-bg p-5">
          <p className="text-sm leading-relaxed text-warm-gray-700">
            {data.comment}
          </p>
        </div>
      )}

      {/* Author + Like + Date */}
      <div className="mb-6 flex items-center justify-between border-b border-card-border pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
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

      {/* Badge */}
      {data.isBanner && (
        <div className="mb-6">
          <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            이달의 필사
          </span>
        </div>
      )}

      {/* Comments */}
      <CommentSection comments={data.comments} />
    </div>
  );
}
