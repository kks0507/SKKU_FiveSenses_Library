import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  // Mock: always return the first student user for demo
  const userId = request.headers.get('x-user-id') || 'u1';
  const users = db.users();
  const user = users.find(u => u.id === userId);

  if (!user) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
  }

  const badges = db.badges().filter(b => b.userId === user.id);
  const rank = users
    .filter(u => u.role === 'student')
    .sort((a, b) => b.cumulativePoints - a.cumulativePoints)
    .findIndex(u => u.id === user.id) + 1;

  return NextResponse.json({
    ...user,
    badges: badges.map(b => b.zone),
    badgeCount: badges.length,
    rank,
  });
}
