import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const writings = db.writings();
  const writing = writings.find(w => w.id === id);

  if (!writing) {
    return NextResponse.json({ error: '필사를 찾을 수 없습니다.' }, { status: 404 });
  }

  const user = db.users().find(u => u.id === writing.userId);
  const comments = db.comments().filter(c => c.targetType === 'writing' && c.targetId === id);
  const users = db.users();

  const enrichedComments = comments.map(c => {
    const commentUser = users.find(u => u.id === c.userId);
    return { ...c, userName: commentUser?.name || '알 수 없음' };
  });

  return NextResponse.json({
    ...writing,
    userName: user?.name || '알 수 없음',
    userDepartment: user?.department || '',
    comments: enrichedComments,
  });
}
