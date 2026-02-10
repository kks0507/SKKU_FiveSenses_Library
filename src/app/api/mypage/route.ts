import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id') || 'u1';
  const users = db.users();
  const user = users.find(u => u.id === userId);

  if (!user) {
    return NextResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 });
  }

  const allBadges = db.badges().filter(b => b.userId === userId);
  const badgeZones = allBadges.map(b => b.zone);
  const allZones = ['bookclub', 'narration', 'listening', 'writing', 'review'];

  const rank = users
    .filter(u => u.role === 'student')
    .sort((a, b) => b.cumulativePoints - a.cumulativePoints)
    .findIndex(u => u.id === userId) + 1;

  const lc = db.lcs().find(l => l.id === user.lcId);

  // Recent activities (last 10 point records)
  const recentPoints = db.points()
    .filter(p => p.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  const badgeCollection = allZones.map(zone => ({
    zone,
    earned: badgeZones.includes(zone),
    earnedAt: allBadges.find(b => b.zone === zone)?.earnedAt || null,
  }));

  const isMunho = badgeZones.length >= 5;

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      department: user.department,
      enrollYear: user.enrollYear,
      studentId: user.studentId,
      profileImage: user.profileImage,
      title: isMunho ? '문호' : null,
      lcName: lc?.name || null,
    },
    points: {
      cumulative: user.cumulativePoints,
      available: user.availablePoints,
      rank,
    },
    badges: {
      collection: badgeCollection,
      count: badgeZones.length,
      total: 5,
      isMunho,
    },
    recentActivities: recentPoints,
  });
}
