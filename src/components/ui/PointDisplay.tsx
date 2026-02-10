import { Trophy } from 'lucide-react';

interface PointDisplayProps {
  cumulative: number;
  available: number;
  rank?: number;
}

export default function PointDisplay({
  cumulative,
  available,
  rank,
}: PointDisplayProps) {
  return (
    <div
      className="rounded-2xl bg-card-bg border border-card-border p-5"
      style={{ boxShadow: 'var(--shadow-md)' }}
    >
      {/* Title Row */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-bold text-foreground">내 포인트</h3>
        {rank !== undefined && (
          <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1">
            <Trophy className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-bold text-amber-700">
              {rank}위
            </span>
          </div>
        )}
      </div>

      {/* Points Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Cumulative Points */}
        <div className="rounded-xl bg-amber-50 p-4 text-center">
          <p className="mb-1 text-xs font-medium text-amber-700">누적 포인트</p>
          <p className="text-2xl font-bold text-amber-600">
            {cumulative.toLocaleString()}
          </p>
          <p className="mt-0.5 text-xs text-amber-500">P</p>
        </div>

        {/* Available Points */}
        <div className="rounded-xl bg-green-50 p-4 text-center">
          <p className="mb-1 text-xs font-medium text-green-700">사용 가능</p>
          <p className="text-2xl font-bold text-green-600">
            {available.toLocaleString()}
          </p>
          <p className="mt-0.5 text-xs text-green-500">P</p>
        </div>
      </div>
    </div>
  );
}
