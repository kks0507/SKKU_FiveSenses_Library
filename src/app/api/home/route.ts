import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const users = db.users();
  const books = db.books();
  const bookclubs = db.bookclubs();
  const writings = db.writings();
  const badges = db.badges();
  const lcs = db.lcs();
  const moderators = db.moderators();
  const narrations = db.narrations();

  // Hero highlights
  const activeBookclub = bookclubs.find(bc => bc.status === 'recruiting' || bc.status === 'active');
  const currentNarration = narrations.current;
  const topWriting = [...writings].sort((a, b) => b.likes - a.likes)[0];

  const highlights = [];
  if (activeBookclub) {
    const mod = moderators.find(m => m.id === activeBookclub.moderatorId);
    const book = books.find(b => b.id === activeBookclub.bookId);
    highlights.push({
      type: 'bookclub',
      title: `이달의 북클럽 좌장: ${mod?.name}`,
      subtitle: book?.title ? `선정 도서: 《${book.title}》` : '',
      linkUrl: `/bookclub/${activeBookclub.id}`,
    });
  }
  if (currentNarration) {
    const book = books.find(b => b.id === currentNarration.bookId);
    highlights.push({
      type: 'narration',
      title: `이달의 낭독: 《${book?.title}》`,
      subtitle: `${currentNarration.section} | 참여: ${currentNarration.currentParticipants}/${currentNarration.totalParticipants}명`,
      linkUrl: '/narration',
    });
  }
  if (topWriting) {
    const author = users.find(u => u.id === topWriting.userId);
    highlights.push({
      type: 'writing',
      title: `이달의 인기 필사`,
      subtitle: `"${topWriting.excerpt.slice(0, 30)}..." — ${author?.name}`,
      linkUrl: `/writing/${topWriting.id}`,
    });
  }

  // Zone statuses
  const zones = [
    { id: 'bookclub', name: '북클럽 존', icon: '📖', status: activeBookclub ? '모집중' : '준비중', count: activeBookclub?.currentMembers || 0, href: '/bookclub' },
    { id: 'narration', name: '낭독 존', icon: '🎙️', status: currentNarration.status === 'open' ? `D-${Math.ceil((new Date(currentNarration.deadline).getTime() - Date.now()) / 86400000)}` : '마감', count: currentNarration.currentParticipants, href: '/narration' },
    { id: 'listening', name: '듣기 존', icon: '🎵', status: '자유참여', count: null, href: '/listening' },
    { id: 'writing', name: '필사 존', icon: '✍️', status: `${writings.length}건`, count: writings.length, href: '/writing' },
    { id: 'review', name: '서평 존', icon: '📝', status: `${db.reviews().length}건`, count: db.reviews().length, href: '/review' },
  ];

  // Personal ranking (top 5)
  const students = users.filter(u => u.role === 'student').sort((a, b) => b.cumulativePoints - a.cumulativePoints);
  const personalRanking = students.slice(0, 5).map((u, i) => ({
    rank: i + 1,
    name: u.name,
    department: u.department,
    points: u.cumulativePoints,
  }));

  // LC ranking
  const lcRanking = lcs.map(lc => {
    const members = users.filter(u => lc.memberIds.includes(u.id));
    const totalPoints = members.reduce((sum, m) => sum + m.cumulativePoints, 0);
    return { name: lc.name, totalPoints, memberCount: members.length };
  }).sort((a, b) => b.totalPoints - a.totalPoints).slice(0, 3);

  // Recommended books
  const recommendedBooks = books.slice(0, 4).map(b => ({
    id: b.id,
    title: b.title,
    author: b.author,
    coverImage: b.coverImage,
    category: b.category,
  }));

  return NextResponse.json({
    highlights,
    zones,
    personalRanking,
    lcRanking,
    recommendedBooks,
    stats: {
      totalUsers: students.length,
      totalBadges: badges.length,
      totalWritings: writings.length,
    },
  });
}
