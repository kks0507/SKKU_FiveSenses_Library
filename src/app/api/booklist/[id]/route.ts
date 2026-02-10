import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = db.books().find(b => b.id === id);

  if (!book) {
    return NextResponse.json({ error: '도서를 찾을 수 없습니다.' }, { status: 404 });
  }

  // Related reviews
  const reviews = db.reviews()
    .filter(r => r.bookId === id)
    .map(r => {
      const user = db.users().find(u => u.id === r.userId);
      return { ...r, userName: user?.name || '알 수 없음' };
    });

  return NextResponse.json({ book, reviews });
}
