import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const users = db.users().filter(u => u.role === 'student');
  const writings = db.writings();
  const reviews = db.reviews();
  const narrations = db.narrations();
  const badges = db.badges();
  const points = db.points();

  // Monthly stats (Feb 2026)
  const thisMonth = '2026-02';
  const monthlyPoints = points.filter(p =>
    p.type === 'earn' && p.createdAt.startsWith(thisMonth)
  );
  const monthlyBadges = badges.filter(b => b.earnedAt.startsWith(thisMonth));

  // Zone participation counts
  const zoneParticipation = {
    bookclub: monthlyPoints.filter(p => p.zone === 'bookclub').length,
    narration: monthlyPoints.filter(p => p.zone === 'narration').length,
    listening: monthlyPoints.filter(p => p.zone === 'listening').length,
    writing: monthlyPoints.filter(p => p.zone === 'writing').length,
    review: monthlyPoints.filter(p => p.zone === 'review').length,
  };

  const totalParticipation = Object.values(zoneParticipation).reduce((a, b) => a + b, 0);
  const totalPointsIssued = monthlyPoints.reduce((sum, p) => sum + p.amount, 0);

  const munhoCount = users.filter(u => {
    const userBadges = badges.filter(b => b.userId === u.id);
    return userBadges.length >= 5;
  }).length;

  // Recent activity log
  const recentActivities = points
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10)
    .map(p => {
      const user = db.users().find(u => u.id === p.userId);
      return {
        userName: user?.name || '알 수 없음',
        description: p.description,
        date: p.createdAt,
      };
    });

  return NextResponse.json({
    cards: {
      totalParticipation,
      totalUsers: users.length,
      monthlyBadges: monthlyBadges.length,
      totalPointsIssued,
      munhoCount,
    },
    zoneParticipation,
    recentActivities,
    narrationStatus: {
      current: narrations.current.currentParticipants,
      total: narrations.current.totalParticipants,
      deadline: narrations.current.deadline,
    },
    contentCounts: {
      writings: writings.length,
      reviews: reviews.length,
    },
  });
}
