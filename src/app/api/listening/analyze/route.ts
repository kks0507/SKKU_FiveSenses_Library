import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { songTitle, songArtist, lyrics } = body;

  if (!lyrics) {
    return NextResponse.json({ error: '가사를 입력해주세요.' }, { status: 400 });
  }

  const responseData = db.listeningResponses();
  const mappings = db.emotionMappings();
  const books = db.books();
  const lyricsLower = lyrics.toLowerCase();

  // Find matching response based on keyword triggers
  let matched = responseData.responses.find(r =>
    r.trigger.keywords.some(kw => lyricsLower.includes(kw))
  );

  const responseTemplate = matched || { ...responseData.defaultResponse, trigger: { keywords: [] } };
  const analysis = matched ? matched.analysis : responseData.defaultResponse.analysis;
  const mappingIds = matched ? matched.mappingIds : responseData.defaultResponse.mappingIds;

  // Get matched book excerpts
  const matchedExcerpts = mappingIds.map(mid => {
    const mapping = mappings.find(m => m.id === mid);
    if (!mapping) return null;
    const book = books.find(b => b.id === mapping.bookId);
    return {
      bookId: mapping.bookId,
      bookTitle: book?.title || '',
      bookAuthor: book?.author || '',
      coverImage: book?.coverImage || '',
      inLibrary: book?.inLibrary || false,
      loanUrl: book?.loanUrl || null,
      excerpt: mapping.excerpt,
      page: mapping.page,
    };
  }).filter(Boolean);

  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 800));

  return NextResponse.json({
    songTitle,
    songArtist,
    lyrics,
    analysis,
    matchedExcerpts,
  });
}
