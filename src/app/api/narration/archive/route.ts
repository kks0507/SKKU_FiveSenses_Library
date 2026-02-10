import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const narrations = db.narrations();
  const books = db.books();

  const archive = narrations.archive.map(a => {
    const book = books.find(b => b.id === a.bookId);
    return {
      ...a,
      book: book ? { id: book.id, title: book.title, author: book.author, coverImage: book.coverImage } : null,
    };
  });

  return NextResponse.json({ archive });
}
