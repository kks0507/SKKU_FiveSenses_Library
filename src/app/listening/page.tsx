'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Music,
  Search,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Sparkles,
  BookOpen,
  Heart,
  ExternalLink,
  RotateCcw,
  Save,
  PlayCircle,
  Volume2,
  Library,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

type AnalysisResult = {
  emotionKeywords: string[];
  mood: string;
  emotionClass: string;
  description: string;
};

type MatchedExcerpt = {
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  coverImage: string;
  inLibrary: boolean;
  loanUrl: string | null;
  excerpt: string;
  page: string;
};

type AnalyzeResponse = {
  songTitle: string;
  songArtist: string;
  lyrics: string;
  analysis: AnalysisResult;
  matchedExcerpts: MatchedExcerpt[];
};

const STEPS = [
  { number: 1, title: '노래 검색', icon: <Search className="h-4 w-4" /> },
  { number: 2, title: '가사 입력', icon: <Music className="h-4 w-4" /> },
  { number: 3, title: '감정 분석', icon: <Sparkles className="h-4 w-4" /> },
  { number: 4, title: '책 추천', icon: <BookOpen className="h-4 w-4" /> },
];

const emotionColorMap: Record<string, string> = {
  '그리움': '#7c3aed',
  '외로움': '#6366f1',
  '사랑': '#ec4899',
  '슬픔': '#3b82f6',
  '행복': '#f59e0b',
  '희망': '#10b981',
  '분노': '#ef4444',
  '평온': '#06b6d4',
  '설렘': '#f472b6',
  '고독': '#8b5cf6',
  '위로': '#14b8a6',
  '용기': '#f97316',
  '자유': '#22d3ee',
  '추억': '#a78bfa',
};

function getEmotionColor(keyword: string): string {
  return emotionColorMap[keyword] || '#7c3aed';
}

export default function ListeningPage() {
  const [step, setStep] = useState(1);

  // Step 1 state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSong, setSelectedSong] = useState<{ title: string; artist: string } | null>(null);

  // Step 2 state
  const [songTitle, setSongTitle] = useState('');
  const [songArtist, setSongArtist] = useState('');
  const [lyrics, setLyrics] = useState('');

  // Step 3-4 state
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  // Simulated search results for step 1
  const mockSearchResults = searchQuery.trim().length > 0
    ? [
        { title: searchQuery, artist: '아티스트' },
        { title: `${searchQuery} (Acoustic Ver.)`, artist: '아티스트' },
        { title: `${searchQuery} - Remix`, artist: '아티스트' },
      ]
    : [];

  const handleSelectSong = useCallback((song: { title: string; artist: string }) => {
    setSelectedSong(song);
    setSongTitle(song.title);
    setSongArtist(song.artist);
    setStep(2);
  }, []);

  const handleSkipToStep2 = useCallback(() => {
    setStep(2);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!lyrics.trim()) {
      setError('가사를 입력해주세요.');
      return;
    }
    setError('');
    setAnalyzing(true);
    setStep(3);

    try {
      const res = await fetch('/api/listening/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songTitle, songArtist, lyrics }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || '분석에 실패했습니다.');
      }

      const data: AnalyzeResponse = await res.json();
      setResult(data);

      // Auto-advance to step 4 after a short delay to show analysis
      setTimeout(() => {
        setStep(4);
      }, 2000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '분석 중 오류가 발생했습니다.';
      setError(message);
      setStep(2);
    } finally {
      setAnalyzing(false);
    }
  }, [songTitle, songArtist, lyrics]);

  const handleSavePlaylist = useCallback(() => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }, []);

  const handleReset = useCallback(() => {
    setStep(1);
    setSearchQuery('');
    setSelectedSong(null);
    setSongTitle('');
    setSongArtist('');
    setLyrics('');
    setResult(null);
    setError('');
    setSaved(false);
    setAnalyzing(false);
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* ===== ZONE HEADER ===== */}
      <section className="mb-8 overflow-hidden rounded-2xl" style={{ background: '#eff6ff' }}>
        <div className="px-6 py-10 sm:px-10">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: '#dbeafe' }}>
              <Music className="h-7 w-7" style={{ color: '#2563eb' }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl" style={{ color: '#1e3a5f' }}>
                듣기 존 — 노래와 책을 잇다
              </h1>
              <p className="mt-1 text-sm" style={{ color: '#2563eb' }}>
                좋아하는 노래의 감정을 AI가 분석하고, 같은 감정을 담은 책 구절을 찾아드립니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STEPPER ===== */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          {STEPS.map((s, idx) => (
            <div key={s.number} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all ${
                    step >= s.number
                      ? 'text-white'
                      : 'border-2 border-warm-gray-200 bg-card-bg text-warm-gray-400'
                  }`}
                  style={step >= s.number ? { background: '#2563eb' } : undefined}
                >
                  {step > s.number ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    s.icon
                  )}
                </div>
                <span
                  className={`mt-1.5 text-xs font-medium ${
                    step >= s.number ? 'text-blue-500' : 'text-warm-gray-400'
                  }`}
                >
                  {s.title}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={`mx-2 h-0.5 w-10 rounded-full sm:mx-4 sm:w-16 ${
                    step > s.number ? 'bg-blue-500' : 'bg-warm-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-3 text-center text-sm text-muted">
          단계 {step} / {STEPS.length}
        </div>
      </div>

      {/* ===== STEP CONTENT ===== */}
      <div className="mx-auto max-w-3xl">
        {/* ── STEP 1: YouTube Search ── */}
        {step === 1 && (
          <div
            className="rounded-2xl bg-card-bg p-6 sm:p-8"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
          >
            <div className="mb-6 text-center">
              <div
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{ background: '#dbeafe' }}
              >
                <Search className="h-8 w-8" style={{ color: '#2563eb' }} />
              </div>
              <h2 className="text-xl font-bold text-warm-gray-900">
                좋아하는 노래를 검색하세요
              </h2>
              <p className="mt-2 text-sm text-muted">
                YouTube에서 노래를 검색하거나, 직접 정보를 입력할 수 있습니다.
              </p>
            </div>

            {/* Search input */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-warm-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="노래 제목 또는 아티스트를 입력하세요..."
                className="w-full rounded-xl border border-warm-gray-200 bg-warm-gray-50 py-3.5 pl-12 pr-4 text-sm text-warm-gray-800 placeholder-warm-gray-400 outline-none transition-all focus:border-blue-300 focus:bg-card-bg focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* YouTube placeholder area */}
            <div
              className="mb-6 flex h-48 flex-col items-center justify-center rounded-xl border-2 border-dashed"
              style={{ borderColor: '#bfdbfe', background: '#f8fafc' }}
            >
              <PlayCircle className="mb-3 h-12 w-12" style={{ color: '#93c5fd' }} />
              <p className="text-sm text-warm-gray-400">
                {searchQuery ? '검색 결과가 여기에 표시됩니다' : 'YouTube 검색 영역'}
              </p>
            </div>

            {/* Mock search results */}
            {mockSearchResults.length > 0 && (
              <div className="mb-6 space-y-2">
                <h3 className="text-sm font-semibold text-warm-gray-600">검색 결과</h3>
                {mockSearchResults.map((song, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectSong(song)}
                    className="flex w-full items-center gap-3 rounded-lg border border-warm-gray-100 bg-warm-gray-50 px-4 py-3 text-left transition-all hover:border-blue-200 hover:bg-blue-50"
                  >
                    <Volume2 className="h-5 w-5 flex-shrink-0" style={{ color: '#93c5fd' }} />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-warm-gray-800">{song.title}</span>
                      <span className="ml-2 text-xs text-muted">{song.artist}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-warm-gray-300" />
                  </button>
                ))}
              </div>
            )}

            {/* Skip to direct input */}
            <div className="text-center">
              <button
                onClick={handleSkipToStep2}
                className="inline-flex items-center gap-1 text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: '#2563eb' }}
              >
                검색 없이 직접 입력하기
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Song Title + Lyrics Input ── */}
        {step === 2 && (
          <div
            className="rounded-2xl bg-card-bg p-6 sm:p-8"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
          >
            <div className="mb-6 text-center">
              <div
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{ background: '#dbeafe' }}
              >
                <Music className="h-8 w-8" style={{ color: '#2563eb' }} />
              </div>
              <h2 className="text-xl font-bold text-warm-gray-900">
                노래 정보와 가사를 입력하세요
              </h2>
              <p className="mt-2 text-sm text-muted">
                가사의 감정을 분석하여 비슷한 느낌의 책 구절을 찾아드립니다.
              </p>
            </div>

            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-500">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-warm-gray-700">
                  노래 제목
                </label>
                <input
                  type="text"
                  value={songTitle}
                  onChange={(e) => setSongTitle(e.target.value)}
                  placeholder="예: 봄날"
                  className="w-full rounded-lg border border-warm-gray-200 bg-warm-gray-50 px-4 py-2.5 text-sm text-warm-gray-800 placeholder-warm-gray-400 outline-none transition-all focus:border-blue-300 focus:bg-card-bg focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-warm-gray-700">
                  아티스트
                </label>
                <input
                  type="text"
                  value={songArtist}
                  onChange={(e) => setSongArtist(e.target.value)}
                  placeholder="예: 방탄소년단"
                  className="w-full rounded-lg border border-warm-gray-200 bg-warm-gray-50 px-4 py-2.5 text-sm text-warm-gray-800 placeholder-warm-gray-400 outline-none transition-all focus:border-blue-300 focus:bg-card-bg focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="mb-1.5 block text-sm font-medium text-warm-gray-700">
                가사 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                placeholder="노래 가사를 입력하세요. 전체 가사가 아니어도 좋습니다. 인상적인 구절만 입력해도 분석이 가능합니다."
                rows={8}
                className="w-full resize-none rounded-lg border border-warm-gray-200 bg-warm-gray-50 px-4 py-3 text-sm leading-relaxed text-warm-gray-800 placeholder-warm-gray-400 outline-none transition-all focus:border-blue-300 focus:bg-card-bg focus:ring-2 focus:ring-blue-100"
              />
              <p className="mt-1 text-xs text-muted">
                {lyrics.length > 0 ? `${lyrics.length}자 입력됨` : '최소 10자 이상 입력해 주세요'}
              </p>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1 rounded-lg border border-warm-gray-200 px-4 py-2.5 text-sm font-medium text-warm-gray-600 transition-colors hover:bg-warm-gray-50"
              >
                <ChevronLeft className="h-4 w-4" />
                이전 단계
              </button>
              <button
                onClick={handleAnalyze}
                disabled={!lyrics.trim()}
                className="inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                style={{ background: '#2563eb' }}
              >
                <Sparkles className="h-4 w-4" />
                AI 감정 분석하기
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Analysis Loading / Result ── */}
        {step === 3 && (
          <div
            className="rounded-2xl bg-card-bg p-6 sm:p-8"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
          >
            {analyzing ? (
              <div className="flex flex-col items-center py-12">
                {/* Animated loader */}
                <div className="relative mb-8">
                  <div
                    className="h-24 w-24 animate-spin rounded-full border-4 border-t-transparent"
                    style={{ borderColor: '#93c5fd', borderTopColor: 'transparent' }}
                  />
                  <Sparkles
                    className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 animate-pulse"
                    style={{ color: '#2563eb' }}
                  />
                </div>
                <h2 className="mb-2 text-xl font-bold text-warm-gray-900">
                  AI가 가사의 감정을 분석하고 있습니다
                </h2>
                <p className="text-sm text-muted">잠시만 기다려 주세요...</p>

                {/* Animated dots */}
                <div className="mt-6 flex gap-2">
                  <div className="h-2.5 w-2.5 animate-bounce rounded-full" style={{ background: '#2563eb', animationDelay: '0ms' }} />
                  <div className="h-2.5 w-2.5 animate-bounce rounded-full" style={{ background: '#2563eb', animationDelay: '150ms' }} />
                  <div className="h-2.5 w-2.5 animate-bounce rounded-full" style={{ background: '#2563eb', animationDelay: '300ms' }} />
                </div>
              </div>
            ) : result ? (
              <div className="text-center">
                <div
                  className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                  style={{ background: '#dbeafe' }}
                >
                  <Sparkles className="h-8 w-8" style={{ color: '#2563eb' }} />
                </div>
                <h2 className="mb-2 text-xl font-bold text-warm-gray-900">
                  감정 분석 완료!
                </h2>
                <p className="mb-6 text-sm text-muted">{result.analysis.description}</p>

                {/* Emotion keywords */}
                <div className="mb-4 flex flex-wrap justify-center gap-2">
                  {result.analysis.emotionKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="rounded-full px-4 py-1.5 text-sm font-medium text-white"
                      style={{ background: getEmotionColor(kw) }}
                    >
                      {kw}
                    </span>
                  ))}
                </div>

                {/* Mood & Emotion class */}
                <div className="mb-6 inline-flex items-center gap-4 rounded-xl bg-warm-gray-50 px-6 py-3">
                  <div className="text-center">
                    <span className="block text-xs text-muted">분위기</span>
                    <span className="text-sm font-bold text-warm-gray-800">
                      {result.analysis.mood}
                    </span>
                  </div>
                  <div className="h-8 w-px bg-warm-gray-200" />
                  <div className="text-center">
                    <span className="block text-xs text-muted">감정 유형</span>
                    <span className="text-sm font-bold" style={{ color: '#2563eb' }}>
                      {result.analysis.emotionClass}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-muted">
                  같은 감정을 담은 책을 찾는 중...
                </p>
              </div>
            ) : null}
          </div>
        )}

        {/* ── STEP 4: Matched Book Excerpts ── */}
        {step === 4 && result && (
          <div>
            {/* Analysis Summary (compact) */}
            <div
              className="mb-6 rounded-2xl bg-card-bg p-5"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
            >
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <Music className="h-4 w-4" style={{ color: '#2563eb' }} />
                  <span className="text-sm font-semibold text-warm-gray-800">
                    {result.songTitle || '노래'}
                    {result.songArtist && ` — ${result.songArtist}`}
                  </span>
                </div>
                <div className="h-4 w-px bg-warm-gray-200" />
                <div className="flex flex-wrap gap-1.5">
                  {result.analysis.emotionKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                      style={{ background: getEmotionColor(kw) }}
                    >
                      {kw}
                    </span>
                  ))}
                </div>
                <span className="ml-auto text-xs text-muted">
                  {result.analysis.mood} / {result.analysis.emotionClass}
                </span>
              </div>
            </div>

            {/* Book Excerpt Cards */}
            <h2 className="mb-5 text-xl font-bold text-warm-gray-900">
              <BookOpen className="mr-2 inline h-5 w-5" style={{ color: '#2563eb' }} />
              이 감정을 담은 책 구절
            </h2>

            {result.matchedExcerpts.length > 0 ? (
              <div className="mb-8 space-y-5">
                {result.matchedExcerpts.map((excerpt, idx) => (
                  <div
                    key={idx}
                    className="overflow-hidden rounded-2xl bg-card-bg"
                    style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-4">
                      {/* Book info side */}
                      <div className="flex items-center gap-4 border-b p-5 sm:flex-col sm:border-b-0 sm:border-r sm:border-warm-gray-100 sm:p-6" style={{ background: '#fafafa' }}>
                        <div className="flex h-20 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-warm-gray-100 sm:h-28 sm:w-20">
                          <BookOpen className="h-8 w-8 text-warm-gray-300" />
                        </div>
                        <div className="sm:text-center">
                          <h4 className="text-sm font-bold text-warm-gray-800">
                            {excerpt.bookTitle}
                          </h4>
                          <p className="mt-0.5 text-xs text-muted">{excerpt.bookAuthor}</p>
                          {/* Library status */}
                          <div className="mt-2">
                            {excerpt.inLibrary ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                                <Library className="h-3 w-3" />
                                도서관 소장
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-warm-gray-100 px-2 py-0.5 text-[10px] font-semibold text-warm-gray-500">
                                미소장
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Excerpt content */}
                      <div className="col-span-3 p-5 sm:p-6">
                        <div className="mb-4 rounded-xl p-4" style={{ background: '#f0f7ff', borderLeft: '3px solid #2563eb' }}>
                          <p className="text-sm italic leading-relaxed text-warm-gray-700">
                            &ldquo;{excerpt.excerpt}&rdquo;
                          </p>
                          <p className="mt-2 text-xs text-muted">— p.{excerpt.page}</p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap gap-2">
                          {excerpt.inLibrary && excerpt.loanUrl && (
                            <a
                              href={excerpt.loanUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-white transition-all hover:opacity-90"
                              style={{ background: '#2563eb' }}
                            >
                              <Library className="h-3.5 w-3.5" />
                              도서관 대출하기
                            </a>
                          )}
                          <a
                            href={`https://search.kyobobook.co.kr/search?keyword=${encodeURIComponent(excerpt.bookTitle)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-warm-gray-200 px-3 py-2 text-xs font-medium text-warm-gray-600 transition-colors hover:bg-warm-gray-50"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            교보문고에서 보기
                          </a>
                          <button className="inline-flex items-center gap-1.5 rounded-lg border border-warm-gray-200 px-3 py-2 text-xs font-medium text-warm-gray-600 transition-colors hover:bg-warm-gray-50">
                            <Heart className="h-3.5 w-3.5" />
                            좋아요
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mb-8 flex flex-col items-center rounded-2xl bg-card-bg py-12" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <BookOpen className="mb-3 h-12 w-12 text-warm-gray-200" />
                <p className="text-sm text-muted">매칭된 책 구절이 없습니다.</p>
                <p className="mt-1 text-xs text-warm-gray-400">다른 가사로 다시 시도해 보세요.</p>
              </div>
            )}

            {/* Bottom Actions */}
            <div
              className="flex flex-col items-center gap-4 rounded-2xl bg-card-bg p-6 sm:flex-row sm:justify-center"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
            >
              <button
                onClick={handleSavePlaylist}
                disabled={saved}
                className={`inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-all ${
                  saved ? 'opacity-70' : 'hover:opacity-90'
                }`}
                style={{ background: saved ? '#16a34a' : '#2563eb' }}
              >
                {saved ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    저장 완료!
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    나의 플레이리스트에 저장
                  </>
                )}
              </button>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-lg border border-warm-gray-200 px-6 py-3 text-sm font-medium text-warm-gray-600 transition-colors hover:bg-warm-gray-50"
              >
                <RotateCcw className="h-4 w-4" />
                다시 하기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
