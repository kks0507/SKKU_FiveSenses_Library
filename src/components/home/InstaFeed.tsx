'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, Loader2 } from 'lucide-react';
import StarRating from '@/components/ui/StarRating';

type FeedItem = {
  id: string;
  type: 'writing' | 'review' | 'narration' | 'bookclub';
  title: string;
  content: string;
  userName: string;
  userDepartment: string;
  createdAt: string;
  likes: number;
  commentCount: number;
  detailUrl: string;
  rating?: number;
  bookTitle?: string;
  commentPreviews?: Array<{ userName: string; content: string }>;
};

const ZONE_BADGES: Record<string, { label: string; bg: string; text: string }> = {
  writing: { label: '필사', bg: 'bg-amber-100', text: 'text-amber-700' },
  review: { label: '서평', bg: 'bg-red-100', text: 'text-red-500' },
  narration: { label: '낭독', bg: 'bg-purple-100', text: 'text-purple-600' },
  bookclub: { label: '북클럽', bg: 'bg-green-100', text: 'text-green-700' },
};

const AVATAR_COLORS: Record<string, string> = {
  writing: 'bg-amber-100 text-amber-700',
  review: 'bg-red-100 text-red-500',
  narration: 'bg-purple-100 text-purple-600',
  bookclub: 'bg-green-100 text-green-700',
};

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}일 전`;
  const months = Math.floor(days / 30);
  return `${months}개월 전`;
}

export default function InstaFeed() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const fetchPage = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/feed?page=${p}&limit=10`);
      if (!res.ok) throw new Error('Failed');
      const json = await res.json();
      setItems((prev) => (p === 1 ? json.items : [...prev, ...json.items]));
      setHasMore(json.hasMore);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          setPage((p) => {
            const next = p + 1;
            fetchPage(next);
            return next;
          });
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, fetchPage]);

  return (
    <div className="container mx-auto max-w-2xl px-4 py-6">
      <div className="space-y-4">
        {items.map((item) => {
          const badge = ZONE_BADGES[item.type];
          const avatarColor = AVATAR_COLORS[item.type] || 'bg-warm-gray-100 text-warm-gray-600';

          return (
            <div
              key={`${item.type}-${item.id}`}
              className="overflow-hidden rounded-xl border border-card-border bg-card-bg"
            >
              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${avatarColor}`}>
                  {item.userName.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      {item.userName}
                    </span>
                    <span className="text-xs text-muted">{item.userDepartment}</span>
                  </div>
                </div>
                {badge && (
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${badge.bg} ${badge.text}`}>
                    {badge.label}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="px-4 pb-3">
                {item.type === 'writing' && (
                  <div className="mb-2 rounded-lg bg-amber-50 p-4">
                    <p className="text-sm italic leading-relaxed text-foreground">
                      &ldquo;{item.content}&rdquo;
                    </p>
                    {item.bookTitle && (
                      <p className="mt-2 text-xs text-muted">— {item.bookTitle}</p>
                    )}
                  </div>
                )}
                {item.type === 'review' && (
                  <div className="mb-2">
                    <h4 className="mb-1 text-sm font-bold text-foreground">{item.title}</h4>
                    {item.rating && <div className="mb-1.5"><StarRating rating={item.rating} size="sm" /></div>}
                    <p className="text-sm text-warm-gray-600">{item.content}</p>
                    {item.bookTitle && (
                      <p className="mt-1.5 text-xs text-muted">{item.bookTitle}</p>
                    )}
                  </div>
                )}
                {item.type === 'narration' && (
                  <div className="mb-2 rounded-lg bg-purple-50 p-4">
                    <p className="text-sm text-foreground">{item.title}</p>
                    <p className="mt-1 text-xs text-warm-gray-500">{item.content}</p>
                  </div>
                )}
                {item.type === 'bookclub' && (
                  <div className="mb-2 rounded-lg bg-green-50 p-4">
                    <h4 className="mb-1 text-sm font-bold text-foreground">{item.title}</h4>
                    <p className="text-sm text-warm-gray-600">{item.content}</p>
                  </div>
                )}
              </div>

              {/* Footer: likes, comments, time */}
              <div className="border-t border-card-border px-4 py-2.5">
                <div className="flex items-center gap-4 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    {item.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    {item.commentCount}
                  </span>
                  <span className="ml-auto">{timeAgo(item.createdAt)}</span>
                </div>

                {/* Comment previews */}
                {item.commentPreviews && item.commentPreviews.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {item.commentPreviews.map((cp, i) => (
                      <p key={i} className="text-xs text-warm-gray-600">
                        <span className="font-semibold text-foreground">{cp.userName}</span>{' '}
                        <span className="line-clamp-1">{cp.content}</span>
                      </p>
                    ))}
                    {item.commentCount > 2 && (
                      <Link
                        href={item.detailUrl}
                        className="text-xs text-muted transition-colors hover:text-foreground"
                      >
                        댓글 {item.commentCount}개 모두 보기
                      </Link>
                    )}
                  </div>
                )}

                {/* Detail link */}
                <Link
                  href={item.detailUrl}
                  className="mt-1 block text-xs font-medium text-primary transition-colors hover:text-primary-hover"
                >
                  자세히 보기
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted" />
        </div>
      )}

      {/* Sentinel for infinite scroll */}
      {hasMore && <div ref={sentinelRef} className="h-4" />}

      {!hasMore && items.length > 0 && (
        <p className="py-8 text-center text-sm text-muted">모든 피드를 불러왔습니다.</p>
      )}
    </div>
  );
}
