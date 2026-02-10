import Link from 'next/link';

interface ZoneCardProps {
  id: string;
  name: string;
  icon: string;
  status: string;
  href: string;
}

const zoneColorMap: Record<string, string> = {
  bookclub: 'zone-bookclub',
  narration: 'zone-narration',
  listening: 'zone-listening',
  writing: 'zone-writing',
  review: 'zone-review',
};

export default function ZoneCard({ id, name, icon, status, href }: ZoneCardProps) {
  const zoneClass = zoneColorMap[id] || 'zone-bookclub';

  return (
    <Link
      href={href}
      className="group block rounded-2xl bg-card-bg border border-card-border p-5 transition-all duration-200 hover:-translate-y-1"
      style={{ boxShadow: 'var(--shadow-md)' }}
    >
      <div className="flex flex-col items-center text-center gap-3">
        {/* Icon */}
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-xl text-2xl ${zoneClass} transition-transform duration-200 group-hover:scale-110`}
        >
          {icon}
        </div>

        {/* Zone Name */}
        <h3 className="text-base font-bold text-foreground">{name}</h3>

        {/* Status Text */}
        <p className="text-sm text-muted leading-snug">{status}</p>
      </div>
    </Link>
  );
}
