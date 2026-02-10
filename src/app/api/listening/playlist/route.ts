import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const listenings = db.listenings();
  const books = db.books();

  // Enrich with book info
  const enriched = listenings.map(l => ({
    ...l,
    matchedBookExcerpts: l.matchedBookExcerpts.map(mbe => {
      const book = books.find(b => b.id === mbe.bookId);
      return {
        ...mbe,
        bookTitle: book?.title || '',
        bookAuthor: book?.author || '',
        coverImage: book?.coverImage || '',
        inLibrary: book?.inLibrary || false,
      };
    }),
  }));

  return NextResponse.json({ playlist: enriched });
}
