import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

type SectionWrapperProps = {
  bgColor?: string;
  title: string;
  moreHref?: string;
  moreLabel?: string;
  children: React.ReactNode;
};

export default function SectionWrapper({
  bgColor = 'bg-background',
  title,
  moreHref,
  moreLabel = '더 보기',
  children,
}: SectionWrapperProps) {
  return (
    <section className={`w-full ${bgColor} py-12 md:py-16 lg:py-20`}>
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl lg:text-4xl">
            {title}
          </h2>
          {moreHref && (
            <Link
              href={moreHref}
              className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary-hover"
            >
              {moreLabel}
              <ChevronRight className="h-4 w-4" />
            </Link>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
