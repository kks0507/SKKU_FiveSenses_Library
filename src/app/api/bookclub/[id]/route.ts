import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bookclubs = db.bookclubs();
  const bc = bookclubs.find(b => b.id === id);

  if (!bc) {
    return NextResponse.json({ error: '북클럽을 찾을 수 없습니다.' }, { status: 404 });
  }

  const book = db.books().find(b => b.id === bc.bookId);
  const moderator = db.moderators().find(m => m.id === bc.moderatorId);

  return NextResponse.json({
    ...bc,
    book,
    moderator,
  });
}
