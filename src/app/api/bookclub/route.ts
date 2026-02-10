import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const bookclubs = db.bookclubs();
  const books = db.books();
  const moderators = db.moderators();

  const enriched = bookclubs.map(bc => {
    const book = books.find(b => b.id === bc.bookId);
    const moderator = moderators.find(m => m.id === bc.moderatorId);
    return {
      ...bc,
      book: book ? { id: book.id, title: book.title, author: book.author, coverImage: book.coverImage } : null,
      moderator: moderator ? { id: moderator.id, name: moderator.name, bio: moderator.bio, profileImage: moderator.profileImage, achievement: moderator.achievement } : null,
    };
  });

  const current = enriched.filter(bc => bc.status !== 'completed');
  const archive = enriched.filter(bc => bc.status === 'completed');

  return NextResponse.json({ current, archive });
}
