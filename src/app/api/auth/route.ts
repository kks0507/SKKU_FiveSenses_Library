import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body;

  const users = db.users();
  const user = users.find(u => u.email === email);

  if (!user) {
    return NextResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 401 });
  }

  // Mock auth — any password works for demo
  if (!password) {
    return NextResponse.json({ error: '비밀번호를 입력해주세요.' }, { status: 400 });
  }

  const badges = db.badges().filter(b => b.userId === user.id);
  const badgeZones = badges.map(b => b.zone);

  return NextResponse.json({
    user: {
      ...user,
      badges: badgeZones,
      badgeCount: badges.length,
    },
    token: `mock-token-${user.id}`,
  });
}
