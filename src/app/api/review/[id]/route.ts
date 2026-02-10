import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const reviews = db.reviews();
  const review = reviews.find(r => r.id === id);

  if (!review) {
    return NextResponse.json({ error: '서평을 찾을 수 없습니다.' }, { status: 404 });
  }

  const user = db.users().find(u => u.id === review.userId);
  const book = db.books().find(b => b.id === review.bookId);
  const comments = db.comments().filter(c => c.targetType === 'review' && c.targetId === id);
  const users = db.users();

  const enrichedComments = comments.map(c => {
    const commentUser = users.find(u => u.id === c.userId);
    return { ...c, userName: commentUser?.name || '알 수 없음' };
  });

  return NextResponse.json({
    ...review,
    userName: user?.name || '알 수 없음',
    userDepartment: user?.department || '',
    book,
    comments: enrichedComments,
  });
}
