import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const narrations = db.narrations();
  const book = db.books().find(b => b.id === narrations.current.bookId);

  return NextResponse.json({
    ...narrations.current,
    book: book ? { id: book.id, title: book.title, author: book.author, coverImage: book.coverImage } : null,
  });
}
