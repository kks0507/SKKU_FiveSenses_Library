import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md';
}

export default function StarRating({ rating, size = 'md' }: StarRatingProps) {
  const starCount = 5;
  const sizeClasses = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';

  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`${rating}점`}>
      {Array.from({ length: starCount }, (_, i) => {
        const starIndex = i + 1;
        const isFilled = starIndex <= Math.round(rating);

        return (
          <Star
            key={starIndex}
            className={`${sizeClasses} ${
              isFilled
                ? 'fill-amber-400 text-amber-400'
                : 'fill-none text-warm-gray-300'
            }`}
          />
        );
      })}
    </div>
  );
}
