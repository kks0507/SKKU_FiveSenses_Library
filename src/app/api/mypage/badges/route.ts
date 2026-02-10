import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id') || 'u1';
  const badges = db.badges().filter(b => b.userId === userId);
  const allZones = ['bookclub', 'narration', 'listening', 'writing', 'review'];
  const zoneNames: Record<string, string> = {
    bookclub: '북클럽 배지',
    narration: '낭독 배지',
    listening: '듣기 배지',
    writing: '필사 배지',
    review: '서평 배지',
  };
  const zoneIcons: Record<string, string> = {
    bookclub: '📖',
    narration: '🎙️',
    listening: '🎵',
    writing: '✍️',
    review: '📝',
  };

  const collection = allZones.map(zone => ({
    zone,
    name: zoneNames[zone],
    icon: zoneIcons[zone],
    earned: badges.some(b => b.zone === zone),
    earnedAt: badges.find(b => b.zone === zone)?.earnedAt || null,
  }));

  return NextResponse.json({
    badges: collection,
    count: badges.length,
    isMunho: badges.length >= 5,
  });
}
