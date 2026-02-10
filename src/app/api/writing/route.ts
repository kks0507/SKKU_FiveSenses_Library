import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sort = searchParams.get('sort') || 'latest';

  const writings = db.writings();
  const users = db.users();

  let sorted = [...writings];
  if (sort === 'likes') {
    sorted.sort((a, b) => b.likes - a.likes);
  } else if (sort === 'banner') {
    sorted = sorted.filter(w => w.isBanner);
  } else {
    sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const enriched = sorted.map(w => {
    const user = users.find(u => u.id === w.userId);
    return {
      ...w,
      userName: user?.name || '알 수 없음',
      userDepartment: user?.department || '',
    };
  });

  return NextResponse.json({ writings: enriched });
}
