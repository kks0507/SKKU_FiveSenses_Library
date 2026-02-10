import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const users = db.users();
  const lcs = db.lcs();
  const badges = db.badges();

  // Personal ranking
  const students = users.filter(u => u.role === 'student');
  const personalRanking = students
    .sort((a, b) => b.cumulativePoints - a.cumulativePoints)
    .map((u, i) => {
      const userBadges = badges.filter(b => b.userId === u.id);
      return {
        rank: i + 1,
        userId: u.id,
        name: u.name,
        department: u.department,
        enrollYear: u.enrollYear,
        cumulativePoints: u.cumulativePoints,
        badgeCount: userBadges.length,
        isMunho: userBadges.length >= 5,
      };
    });

  // LC ranking
  const lcRanking = lcs.map(lc => {
    const members = users.filter(u => lc.memberIds.includes(u.id));
    const totalPoints = members.reduce((sum, m) => sum + m.cumulativePoints, 0);
    const avgPoints = members.length > 0 ? Math.round(totalPoints / members.length) : 0;
    return {
      lcId: lc.id,
      name: lc.name,
      totalPoints,
      avgPoints,
      memberCount: members.length,
    };
  }).sort((a, b) => b.totalPoints - a.totalPoints).map((lc, i) => ({ ...lc, rank: i + 1 }));

  // Scholarship candidates (5 badges + top cumulative)
  const scholarshipCandidates = personalRanking
    .filter(p => p.isMunho)
    .slice(0, 5);

  return NextResponse.json({ personalRanking, lcRanking, scholarshipCandidates });
}
