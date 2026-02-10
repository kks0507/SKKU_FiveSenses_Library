'use client';

import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type EmaxCarouselProps = {
  children: React.ReactNode[];
  paginationClass?: string;
  spaceBetween?: number;
  breakpoints?: Record<number, { slidesPerView: number }>;
  loop?: boolean;
};

export default function EmaxCarousel({
  children,
  paginationClass = 'emax-carousel-pagination',
  spaceBetween = 16,
  breakpoints,
  loop = true,
}: EmaxCarouselProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  const defaultBreakpoints = {
    640: { slidesPerView: 2 },
    768: { slidesPerView: 3 },
    1024: { slidesPerView: 4 },
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => swiperRef.current?.slidePrev()}
        className="absolute -left-5 top-[calc(50%-40px)] z-10 hidden h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl md:flex"
        aria-label="이전"
      >
        <ChevronLeft className="h-5 w-5 text-warm-gray-600" />
      </button>
      <button
        type="button"
        onClick={() => swiperRef.current?.slideNext()}
        className="absolute -right-5 top-[calc(50%-40px)] z-10 hidden h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl md:flex"
        aria-label="다음"
      >
        <ChevronRight className="h-5 w-5 text-warm-gray-600" />
      </button>

      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={spaceBetween}
        slidesPerView={1}
        loop={loop && children.length > 1}
        pagination={{
          clickable: true,
          el: `.${paginationClass}`,
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        breakpoints={breakpoints || defaultBreakpoints}
        className="!pb-2"
      >
        {children.map((child, i) => (
          <SwiperSlide key={i}>{child}</SwiperSlide>
        ))}
      </Swiper>

      <div className={`${paginationClass} mt-6 flex justify-center`} />
    </div>
  );
}
