import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';

export default function CampaignBanner() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background: deep green gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-900 via-green-800 to-green-900" />

      {/* Subtle radial overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.04) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(255,255,255,0.03) 0%, transparent 50%)',
        }}
      />

      {/* Decorative scattered book icons */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Top-left book icon */}
        <div className="absolute top-10 left-[8%] opacity-[0.06] rotate-[-15deg]">
          <BookOpen className="h-20 w-20 text-white sm:h-24 sm:w-24" />
        </div>
        {/* Top-right book icon */}
        <div className="absolute top-16 right-[10%] opacity-[0.05] rotate-[12deg]">
          <BookOpen className="h-16 w-16 text-white sm:h-20 sm:w-20" />
        </div>
        {/* Bottom-left book icon */}
        <div className="absolute bottom-14 left-[15%] opacity-[0.04] rotate-[8deg]">
          <BookOpen className="h-14 w-14 text-white sm:h-18 sm:w-18" />
        </div>
        {/* Bottom-right book icon */}
        <div className="absolute bottom-20 right-[18%] opacity-[0.06] rotate-[-10deg]">
          <BookOpen className="h-18 w-18 text-white sm:h-22 sm:w-22" />
        </div>
        {/* Center-left small icon */}
        <div className="absolute top-1/2 left-[4%] -translate-y-1/2 opacity-[0.03] rotate-[20deg]">
          <BookOpen className="h-12 w-12 text-white" />
        </div>
        {/* Center-right small icon */}
        <div className="absolute top-1/3 right-[5%] opacity-[0.04] rotate-[-20deg]">
          <BookOpen className="h-10 w-10 text-white" />
        </div>
      </div>

      {/* Main content */}
      <div className="relative flex min-h-[400px] flex-col items-center justify-center px-4 sm:min-h-[480px] md:min-h-[540px]">
        <div className="mx-auto max-w-3xl text-center">
          {/* Small label */}
          <p className="mb-4 text-sm font-medium uppercase tracking-wider text-amber-400">
            2026 독서 캠페인
          </p>

          {/* Main heading */}
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            책으로 연결되는 우리
          </h2>

          {/* Subtitle */}
          <p className="mb-10 text-lg text-green-100/80">
            오거서와 함께하는 성균관대 독서 문화
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/bookclub"
              className="inline-flex items-center gap-2 rounded-lg bg-white/90 px-6 py-3 text-sm font-semibold text-green-900 transition-all duration-200 hover:bg-white hover:shadow-lg"
            >
              존 활동 시작하기
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/booklist"
              className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-white/10"
            >
              도서 목록 보기
              <BookOpen className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
