import Link from 'next/link';

type EmaxCardProps = {
  href?: string;
  imageContent?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export default function EmaxCard({
  href,
  imageContent,
  children,
  className = '',
}: EmaxCardProps) {
  const cardContent = (
    <>
      {imageContent && (
        <div className="flex min-h-[240px] items-center justify-center bg-warm-gray-50 p-5 md:min-h-[280px] md:p-6">
          {imageContent}
        </div>
      )}
      <div className="bg-card-bg px-4 py-4">{children}</div>
    </>
  );

  const cardClasses = `group block overflow-hidden rounded-xl bg-card-bg shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${className}`;

  if (href) {
    return (
      <Link href={href} className={cardClasses}>
        {cardContent}
      </Link>
    );
  }

  return <div className={cardClasses}>{cardContent}</div>;
}
