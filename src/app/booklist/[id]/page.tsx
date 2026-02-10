'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpen,
  ArrowLeft,
  Building2,
  Tag,
  User,
  Star,
  ExternalLink,
  MessageSquare,
  ThumbsUp,
  CheckCircle,
  XCircle,
  BookMarked,
} from 'lucide-react';

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

type Review = {
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
};

type BookDetailData = {
  book: Book;
  reviews: Review[];
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string; cover: string }> = {
  '\uBB38\uD559': { bg: 'bg-green-100', text: 'text-green-700', cover: 'bg-green-600' },
  '\uC778\uBB38': { bg: 'bg-amber-100', text: 'text-amber-700', cover: 'bg-amber-600' },
  '\uC0AC\uD68C': { bg: 'bg-blue-100', text: 'text-blue-500', cover: 'bg-blue-500' },
  '\uACFC\uD559': { bg: 'bg-red-100', text: 'text-red-500', cover: 'bg-red-500' },
  '\uC608\uC220': { bg: 'bg-purple-100', text: 'text-purple-600', cover: 'bg-purple-500' },
};

const DEFAULT_CATEGORY_COLOR = { bg: 'bg-warm-gray-100', text: 'text-warm-gray-600', cover: 'bg-warm-gray-500' };

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < rating ? 'fill-amber-400 text-amber-400' : 'text-warm-gray-200'
          }`}
        />
      ))}
    </div>
  );
}

export default function BookDetailPage() {
  const params = useParams();
  const bookId = params.id as string;

  const [data, setData] = useState<BookDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/booklist/${bookId}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    if (bookId) {
      fetchData();
    }
  }, [bookId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="space-y-6">
          <div className="h-5 w-24 animate-pulse rounded bg-warm-gray-200" />
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="aspect-[3/4] w-full animate-pulse rounded-xl bg-warm-gray-200 md:w-64" />
            <div className="flex-1 space-y-3">
              <div className="h-7 w-3/4 animate-pulse rounded bg-warm-gray-200" />
              <div className="h-4 w-1/3 animate-pulse rounded bg-warm-gray-200" />
              <div className="h-4 w-1/4 animate-pulse rounded bg-warm-gray-200" />
              <div className="h-20 animate-pulse rounded bg-warm-gray-200" />
            </div>
          </div>
        </div>
        <p className="mt-8 text-center text-muted">\uB85C\uB529 \uC911...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <BookOpen className="mx-auto mb-3 h-12 w-12 text-warm-gray-300" />
        <p className="text-warm-gray-500">\uB3C4\uC11C \uC815\uBCF4\uB97C \uBD88\uB7EC\uC62C \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.</p>
        <Link
          href="/booklist"
          className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          \uBD81\uB9AC\uC2A4\uD2B8\uB85C \uB3CC\uC544\uAC00\uAE30
        </Link>
      </div>
    );
  }

  const { book, reviews } = data;
  const categoryColor = CATEGORY_COLORS[book.category] || DEFAULT_CATEGORY_COLOR;
  const avgRating =
    reviews.length > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
      : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Back Link */}
      <Link
        href="/booklist"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        \uBD81\uB9AC\uC2A4\uD2B8
      </Link>

      {/* Book Detail */}
      <div
        className="rounded-xl bg-card-bg overflow-hidden"
        style={{ boxShadow: 'var(--shadow-md)' }}
      >
        <div className="flex flex-col md:flex-row">
          {/* Cover */}
          <div className={`relative flex aspect-[3/4] items-center justify-center md:w-72 ${categoryColor.cover}`}>
            <BookMarked className="h-20 w-20 text-white/20" />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              <p className="text-lg font-bold text-white leading-tight">{book.title}</p>
              <p className="mt-2 text-sm text-white/70">{book.author}</p>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-1 flex-col p-6">
            <div>
              {/* Category Tag */}
              <div className="mb-3 flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColor.bg} ${categoryColor.text}`}>
                  <Tag className="h-3 w-3" />
                  {book.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-xl font-bold text-foreground leading-tight">{book.title}</h1>

              {/* Author & Publisher */}
              <div className="mt-3 space-y-1.5">
                <p className="flex items-center gap-2 text-sm text-muted">
                  <User className="h-4 w-4 text-warm-gray-400" />
                  <span>\uC800\uC790: <span className="font-medium text-foreground">{book.author}</span></span>
                </p>
                <p className="flex items-center gap-2 text-sm text-muted">
                  <Building2 className="h-4 w-4 text-warm-gray-400" />
                  <span>\uCD9C\uD310\uC0AC: <span className="font-medium text-foreground">{book.publisher}</span></span>
                </p>
              </div>

              {/* Library Status */}
              <div className="mt-4">
                {book.inLibrary ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    \uD559\uC220\uC815\uBCF4\uAD00 \uC18C\uC7A5
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-warm-gray-100 px-3 py-1 text-sm font-medium text-warm-gray-500">
                    <XCircle className="h-4 w-4" />
                    \uBBF8\uC18C\uC7A5
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="mt-5">
                <h3 className="mb-2 text-sm font-semibold text-foreground">\uC791\uD488 \uC18C\uAC1C</h3>
                <p className="text-sm leading-relaxed text-muted">{book.description}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              {book.inLibrary && book.loanUrl ? (
                <a
                  href={book.loanUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
                >
                  <ExternalLink className="h-4 w-4" />
                  \uB300\uCD9C \uC2E0\uCCAD
                </a>
              ) : book.inLibrary ? (
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
                >
                  <BookOpen className="h-4 w-4" />
                  \uB300\uCD9C \uC2E0\uCCAD
                </button>
              ) : (
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
                >
                  <BookOpen className="h-4 w-4" />
                  \uAD6C\uC785 \uC694\uCCAD
                </button>
              )}
              <Link
                href="/booklist"
                className="inline-flex items-center gap-2 rounded-lg border border-warm-gray-200 px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-warm-gray-50 hover:text-foreground"
              >
                \uBAA9\uB85D\uC73C\uB85C
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <MessageSquare className="h-5 w-5 text-primary" />
            \uAD00\uB828 \uC11C\uD3C9
          </h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <StarRating rating={Math.round(avgRating)} />
              <span className="text-sm font-semibold text-foreground">{avgRating}</span>
              <span className="text-xs text-muted">({reviews.length}\uAC74)</span>
            </div>
          )}
        </div>

        {reviews.length === 0 ? (
          <div
            className="rounded-xl bg-card-bg py-12 text-center"
            style={{ boxShadow: 'var(--shadow-md)' }}
          >
            <MessageSquare className="mx-auto mb-3 h-10 w-10 text-warm-gray-300" />
            <p className="text-sm text-muted">\uC544\uC9C1 \uC11C\uD3C9\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.</p>
            <p className="mt-1 text-xs text-warm-gray-400">\uCCAB \uBC88\uC9F8 \uC11C\uD3C9\uC744 \uC791\uC131\uD574 \uBCF4\uC138\uC694!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <div
                key={review.id}
                className={`rounded-xl bg-card-bg p-5 ${
                  review.isExcellent ? 'ring-1 ring-amber-200' : ''
                }`}
                style={{ boxShadow: 'var(--shadow-md)' }}
              >
                {/* Review Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                      {review.userName.slice(-2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">
                          {review.userName}
                        </span>
                        {review.isExcellent && (
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                            <Star className="h-2.5 w-2.5 fill-amber-500" />
                            \uC6B0\uC218 \uC11C\uD3C9
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <StarRating rating={review.rating} />
                        <span className="text-xs text-muted">{formatDate(review.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted">
                    <ThumbsUp className="h-3 w-3" />
                    {review.likes}
                  </div>
                </div>

                {/* Review Content */}
                <div className="mt-3">
                  <h4 className="text-sm font-semibold text-foreground">{review.title}</h4>
                  <p className="mt-1 text-sm leading-relaxed text-muted line-clamp-4">
                    {review.content}
                  </p>
                </div>

                {/* Summary */}
                {review.summary && (
                  <div className="mt-3 rounded-lg bg-warm-gray-50 px-3 py-2">
                    <p className="text-xs text-muted">
                      <span className="font-semibold">\uD55C \uC904 \uC694\uC57D:</span>{' '}
                      {review.summary}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
