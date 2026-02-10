import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  const reviews = db.reviews();
  const users = db.users();
  const books = db.books();

  let filtered = [...reviews];
  if (category) {
    const categoryBookIds = books.filter(b => b.category === category).map(b => b.id);
    filtered = filtered.filter(r => categoryBookIds.includes(r.bookId));
  }

  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const enriched = filtered.map(r => {
    const user = users.find(u => u.id === r.userId);
    const book = books.find(b => b.id === r.bookId);
    return {
      ...r,
      userName: user?.name || '알 수 없음',
      bookTitle: book?.title || '',
      bookAuthor: book?.author || '',
      bookCoverImage: book?.coverImage || '',
    };
  });

  return NextResponse.json({ reviews: enriched });
}
