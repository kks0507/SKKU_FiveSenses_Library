'use client';

import { useState, useEffect } from 'react';
import { Music, BookOpen } from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import EmaxCarousel from '@/components/ui/EmaxCarousel';

type ListeningItem = {
  id: string;
  songTitle: string;
  songArtist: string;
  mood: string;
  emotions: string[];
  matchedBookExcerpts: Array<{
    bookId: string;
    excerpt: string;
    page: string;
    bookTitle?: string;
    bookAuthor?: string;
  }>;
};

export default function ListeningZoneSection() {
  const [items, setItems] = useState<ListeningItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/listening/playlist');
        if (!res.ok) throw new Error('Failed');
        const json = await res.json();
        setItems(json.items || json.playlist || []);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <SectionWrapper bgColor="bg-warm-gray-50" title="듣고 읽어보는 듣기 존">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-xl bg-warm-gray-200" />
          ))}
        </div>
      </SectionWrapper>
    );
  }

  if (items.length === 0) {
    return (
      <SectionWrapper bgColor="bg-warm-gray-50" title="듣고 읽어보는 듣기 존" moreHref="/listening">
        <div className="py-12 text-center">
          <Music className="mx-auto mb-3 h-12 w-12 text-warm-gray-300" />
          <p className="text-sm text-muted">아직 듣기 기록이 없습니다.</p>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper bgColor="bg-warm-gray-50" title="듣고 읽어보는 듣기 존" moreHref="/listening">
      <EmaxCarousel paginationClass="listening-pagination">
        {items.map((item) => (
          <div
            key={item.id}
            className="overflow-hidden rounded-xl bg-card-bg shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            {/* Music side */}
            <div className="flex min-h-[160px] items-center justify-center bg-blue-50 p-5">
              <div className="text-center">
                <Music className="mx-auto mb-2 h-10 w-10 text-blue-300" />
                <p className="text-sm font-semibold text-foreground">{item.songTitle}</p>
                <p className="text-xs text-muted">{item.songArtist}</p>
                {item.mood && (
                  <span className="mt-2 inline-block rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-500">
                    {item.mood}
                  </span>
                )}
              </div>
            </div>
            {/* Book side */}
            <div className="p-4">
              {item.matchedBookExcerpts[0] && (
                <>
                  <div className="mb-2 flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-warm-gray-400" />
                    <span className="text-xs font-medium text-muted">매칭 도서</span>
                  </div>
                  <p className="line-clamp-3 text-sm italic leading-relaxed text-warm-gray-600">
                    &ldquo;{item.matchedBookExcerpts[0].excerpt}&rdquo;
                  </p>
                  <p className="mt-1.5 text-xs text-muted">
                    {item.matchedBookExcerpts[0].page}
                  </p>
                </>
              )}
              {item.emotions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {item.emotions.slice(0, 3).map((e) => (
                    <span key={e} className="rounded-full bg-warm-gray-100 px-2 py-0.5 text-[10px] text-warm-gray-500">
                      {e}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </EmaxCarousel>
    </SectionWrapper>
  );
}
