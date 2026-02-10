import Link from 'next/link';
import {
  Star,
  Award,
  TrendingUp,
  Gift,
  Search,
  Building2,
  BookMarked,
  MessageCircle,
  ChevronRight,
} from 'lucide-react';

/* ──────────────────────────────────────────────
   Service card configuration
   ────────────────────────────────────────────── */

interface ServiceCard {
  title: string;
  description: string;
  href: string;
  external?: boolean;
  icon: React.ReactNode;
  gradient: string;
  /** Special rendering for the "나의 현황" card */
  isMyStatus?: boolean;
}

const SERVICES: ServiceCard[] = [
  {
    title: '나의 현황',
    description: '포인트, 배지, 랭킹 한눈에',
    href: '/mypage',
    icon: <Star className="h-16 w-16 text-white/80" />,
    gradient: 'from-amber-500 to-amber-600',
    isMyStatus: true,
  },
  {
    title: '오거서 몰',
    description: '포인트로 교환하세요',
    href: '/mall',
    icon: <Gift className="h-16 w-16 text-white/80" />,
    gradient: 'from-purple-500 to-purple-600',
  },
  {
    title: '도서 검색',
    description: '학술정보관 소장 도서 검색',
    href: '/booklist',
    icon: <Search className="h-16 w-16 text-white/80" />,
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    title: '학술정보관',
    description: '운영시간 및 시설 안내',
    href: 'https://lib.skku.edu',
    external: true,
    icon: <Building2 className="h-16 w-16 text-white/80" />,
    gradient: 'from-green-600 to-green-700',
  },
  {
    title: '독서 기록',
    description: '나의 독서 활동 기록',
    href: '/mypage',
    icon: <BookMarked className="h-16 w-16 text-white/80" />,
    gradient: 'from-teal-500 to-teal-600',
  },
  {
    title: '문의하기',
    description: '궁금한 점을 물어보세요',
    href: 'mailto:library@skku.edu',
    icon: <MessageCircle className="h-16 w-16 text-white/80" />,
    gradient: 'from-red-400 to-red-500',
  },
];

/* ──────────────────────────────────────────────
   Mock data for "나의 현황" card
   ────────────────────────────────────────────── */

const MY_STATUS = {
  points: 1240,
  badges: 3,
  rank: 7,
};

const STATUS_ITEMS = [
  {
    label: '포인트',
    value: `${MY_STATUS.points.toLocaleString()}P`,
    icon: <Star className="h-4 w-4 text-white" />,
    bg: 'bg-amber-400',
  },
  {
    label: '배지',
    value: `${MY_STATUS.badges}개`,
    icon: <Award className="h-4 w-4 text-white" />,
    bg: 'bg-green-500',
  },
  {
    label: '랭킹',
    value: `${MY_STATUS.rank}위`,
    icon: <TrendingUp className="h-4 w-4 text-white" />,
    bg: 'bg-blue-500',
  },
];

/* ──────────────────────────────────────────────
   Component
   ────────────────────────────────────────────── */

export default function ServicesSection() {
  return (
    <div className="w-full bg-white py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* ═══ Section header ═══ */}
        <div className="flex items-center justify-center mb-10 md:mb-12 relative">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
            학술정보관과 함께
          </h2>
        </div>

        {/* ═══ Service grid ═══ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {SERVICES.map((service) => {
            const linkProps = service.external
              ? { target: '_blank' as const, rel: 'noopener noreferrer' }
              : {};

            return (
              <Link
                key={service.title}
                href={service.href}
                {...linkProps}
                className="group bg-card-bg rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* ─── Icon area ─── */}
                <div
                  className={`relative h-48 bg-gradient-to-br ${service.gradient} flex items-center justify-center overflow-hidden`}
                >
                  {/* Decorative circle */}
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-sm" />
                  <div className="absolute -left-6 -bottom-6 h-24 w-24 rounded-full bg-white/10 blur-sm" />

                  {service.isMyStatus ? (
                    /* Special: "나의 현황" shows mini stat badges */
                    <div className="relative flex items-center gap-3 md:gap-4">
                      {STATUS_ITEMS.map((item) => (
                        <div
                          key={item.label}
                          className="flex flex-col items-center gap-1.5"
                        >
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full ${item.bg}`}
                          >
                            {item.icon}
                          </div>
                          <span className="text-lg font-bold text-white">
                            {item.value}
                          </span>
                          <span className="text-[11px] text-white/70">
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Default: large centered icon */
                    <div className="relative transition-transform duration-300 group-hover:scale-110">
                      {service.icon}
                    </div>
                  )}
                </div>

                {/* ─── Info area ─── */}
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-foreground">
                        {service.title}
                      </h3>
                      <p className="text-base text-muted line-clamp-2 mt-1">
                        {service.description}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 flex-shrink-0 text-warm-gray-300 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
