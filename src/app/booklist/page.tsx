'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Search,
  Library,
  Tag,
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

const CATEGORIES = [
  { key: '', label: '\uC804\uCCB4' },
  { key: '\uBB38\uD559', label: '\uBB38\uD559' },
  { key: '\uC778\uBB38', label: '\uC778\uBB38' },
  { key: '\uC0AC\uD68C', label: '\uC0AC\uD68C' },
  { key: '\uACFC\uD559', label: '\uACFC\uD559' },
  { key: '\uC608\uC220', label: '\uC608\uC220' },
];

const CATEGORY_COLORS: Record<string, { bg: string; text: string; cover: string }> = {
  '\uBB38\uD559': { bg: 'bg-green-100', text: 'text-green-700', cover: 'bg-green-600' },
  '\uC778\uBB38': { bg: 'bg-amber-100', text: 'text-amber-700', cover: 'bg-amber-600' },
  '\uC0AC\uD68C': { bg: 'bg-blue-100', text: 'text-blue-500', cover: 'bg-blue-500' },
  '\uACFC\uD559': { bg: 'bg-red-100', text: 'text-red-500', cover: 'bg-red-500' },
  '\uC608\uC220': { bg: 'bg-purple-100', text: 'text-purple-600', cover: 'bg-purple-500' },
};

const DEFAULT_CATEGORY_COLOR = { bg: 'bg-warm-gray-100', text: 'text-warm-gray-600', cover: 'bg-warm-gray-500' };

export default function BooklistPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeCategory) params.set('category', activeCategory);
      if (debouncedSearch) params.set('search', debouncedSearch);
      const qs = params.toString();
      const url = `/api/booklist${qs ? `?${qs}` : ''}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setBooks(json.books);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, debouncedSearch]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
          <BookOpen className="h-7 w-7 text-primary" />
          \uC624\uAC70\uC11C \uBD81\uB9AC\uC2A4\uD2B8
        </h1>
        <p className="mt-1 text-sm text-muted">
          \uC624\uAC70\uC11C \uD504\uB85C\uADF8\uB7A8 \uC120\uC815 \uB3C4\uC11C \uBAA9\uB85D
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div
          className="flex items-center gap-2 rounded-xl bg-card-bg px-4 py-3"
          style={{ boxShadow: 'var(--shadow-md)' }}
        >
          <Search className="h-5 w-5 text-muted" />
          <input
            type="text"
            placeholder="\uB3C4\uC11C\uBA85 \uB610\uB294 \uC800\uC790\uB85C \uAC80\uC0C9\uD558\uC138\uC694..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-warm-gray-400 outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-xs text-muted hover:text-foreground"
            >
              \uCD08\uAE30\uD654
            </button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => setActiveCategory(cat.key)}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === cat.key
                ? 'bg-primary text-white'
                : 'bg-card-bg text-muted hover:bg-warm-gray-100 hover:text-foreground'
            }`}
            style={activeCategory !== cat.key ? { boxShadow: 'var(--shadow-sm)' } : undefined}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl bg-card-bg overflow-hidden"
              style={{ boxShadow: 'var(--shadow-md)' }}
            >
              <div className="aspect-[3/4] bg-warm-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-3/4 rounded bg-warm-gray-200" />
                <div className="h-3 w-1/2 rounded bg-warm-gray-200" />
              </div>
            </div>
          ))}
          <p className="col-span-full mt-4 text-center text-muted">\uB85C\uB529 \uC911...</p>
        </div>
      ) : books.length === 0 ? (
        <div className="py-16 text-center">
          <Library className="mx-auto mb-3 h-12 w-12 text-warm-gray-300" />
          <p className="text-muted">
            {debouncedSearch
              ? `"${debouncedSearch}"\uC5D0 \uB300\uD55C \uAC80\uC0C9 \uACB0\uACFC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.`
              : '\uD574\uB2F9 \uCE74\uD14C\uACE0\uB9AC\uC5D0 \uB3C4\uC11C\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.'}
          </p>
        </div>
      ) : (
        /* Book Grid */
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {books.map((book) => {
            const categoryColor = CATEGORY_COLORS[book.category] || DEFAULT_CATEGORY_COLOR;
            return (
              <Link
                key={book.id}
                href={`/booklist/${book.id}`}
                className="group block overflow-hidden rounded-xl bg-card-bg transition-all duration-200 hover:-translate-y-1"
                style={{ boxShadow: 'var(--shadow-md)' }}
              >
                {/* Cover Placeholder */}
                <div className={`relative flex aspect-[3/4] items-center justify-center ${categoryColor.cover}`}>
                  <BookMarked className="h-16 w-16 text-white/30" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
                    <p className="text-sm font-bold text-white leading-tight line-clamp-3">
                      {book.title}
                    </p>
                    <p className="mt-1 text-xs text-white/70">{book.author}</p>
                  </div>

                  {/* Library Badge */}
                  <div className="absolute top-2 right-2">
                    {book.inLibrary ? (
                      <span className="rounded-full bg-green-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                        \uC18C\uC7A5
                      </span>
                    ) : (
                      <span className="rounded-full bg-warm-gray-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                        \uBBF8\uC18C\uC7A5
                      </span>
                    )}
                  </div>
                </div>

                {/* Book Info */}
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {book.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted">{book.author}</p>

                  {/* Category Tag */}
                  <div className="mt-2 flex items-center gap-1">
                    <Tag className="h-3 w-3 text-muted" />
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${categoryColor.bg} ${categoryColor.text}`}>
                      {book.category}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Results count */}
      {!loading && books.length > 0 && (
        <p className="mt-6 text-center text-xs text-muted">
          \uCD1D {books.length}\uAD8C\uC758 \uB3C4\uC11C
        </p>
      )}
    </div>
  );
}
