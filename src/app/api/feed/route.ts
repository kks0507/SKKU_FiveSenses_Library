import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

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
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  const users = db.users();
  const comments = db.comments();
  const writings = db.writings();
  const reviews = db.reviews();
  const narrations = db.narrations();
  const bookclubs = db.bookclubs();
  const books = db.books();

  const items: FeedItem[] = [];

  // Writings
  for (const w of writings) {
    const user = users.find((u) => u.id === w.userId);
    const commentCount = comments.filter(
      (c) => c.targetType === 'writing' && c.targetId === w.id
    ).length;
    items.push({
      id: w.id,
      type: 'writing',
      title: `${w.bookTitle} — 필사`,
      content: w.excerpt,
      userName: user?.name || '알 수 없음',
      userDepartment: user?.department || '',
      createdAt: w.createdAt,
      likes: w.likes,
      commentCount,
      detailUrl: `/writing/${w.id}`,
      bookTitle: w.bookTitle,
    });
  }

  // Reviews
  for (const r of reviews) {
    const user = users.find((u) => u.id === r.userId);
    const book = books.find((b) => b.id === r.bookId);
    const commentCount = comments.filter(
      (c) => c.targetType === 'review' && c.targetId === r.id
    ).length;
    items.push({
      id: r.id,
      type: 'review',
      title: r.title,
      content: r.summary,
      userName: user?.name || '알 수 없음',
      userDepartment: user?.department || '',
      createdAt: r.createdAt,
      likes: r.likes,
      commentCount,
      detailUrl: `/review/${r.id}`,
      rating: r.rating,
      bookTitle: book?.title,
    });
  }

  // Narration submissions
  for (const s of narrations.submissions) {
    const user = users.find((u) => u.id === s.userId);
    const book = books.find((b) => b.id === narrations.current.bookId);
    items.push({
      id: s.id,
      type: 'narration',
      title: `낭독: ${book?.title || ''}`,
      content: `${s.section} 구간 낭독 (${Math.floor(s.duration / 60)}분 ${s.duration % 60}초)`,
      userName: user?.name || '알 수 없음',
      userDepartment: user?.department || '',
      createdAt: s.createdAt,
      likes: 0,
      commentCount: 0,
      detailUrl: '/narration',
      bookTitle: book?.title,
    });
  }

  // Bookclubs
  for (const bc of bookclubs) {
    const book = books.find((b) => b.id === bc.bookId);
    items.push({
      id: bc.id,
      type: 'bookclub',
      title: bc.title,
      content: bc.description.slice(0, 100) + (bc.description.length > 100 ? '...' : ''),
      userName: '오거서 운영팀',
      userDepartment: '학술정보관',
      createdAt: bc.createdAt,
      likes: 0,
      commentCount: 0,
      detailUrl: `/bookclub/${bc.id}`,
      bookTitle: book?.title,
    });
  }

  // Sort by createdAt descending
  items.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const totalCount = items.length;
  const start = (page - 1) * limit;
  const paged = items.slice(start, start + limit);

  // Enrich with comment previews
  const enrichedItems = paged.map((item) => {
    const itemComments = comments
      .filter(
        (c) =>
          (c.targetType === item.type && c.targetId === item.id) ||
          (item.type === 'writing' && c.targetType === 'writing' && c.targetId === item.id) ||
          (item.type === 'review' && c.targetType === 'review' && c.targetId === item.id)
      )
      .slice(0, 2)
      .map((c) => {
        const u = users.find((u) => u.id === c.userId);
        return { userName: u?.name || '알 수 없음', content: c.content };
      });

    return { ...item, commentPreviews: itemComments };
  });

  return NextResponse.json({
    items: enrichedItems,
    totalCount,
    page,
    limit,
    hasMore: start + limit < totalCount,
  });
}
