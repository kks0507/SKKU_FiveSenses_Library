'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';

type LikeButtonProps = {
  initialCount: number;
  initialLiked?: boolean;
};

export default function LikeButton({
  initialCount,
  initialLiked = false,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [animating, setAnimating] = useState(false);

  function handleClick() {
    setAnimating(true);
    if (liked) {
      setCount((c) => c - 1);
    } else {
      setCount((c) => c + 1);
    }
    setLiked((l) => !l);
    setTimeout(() => setAnimating(false), 300);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 text-sm transition-colors"
      aria-label={liked ? '좋아요 취소' : '좋아요'}
    >
      <Heart
        className={`h-5 w-5 transition-all duration-300 ${
          liked ? 'fill-red-500 text-red-500' : 'text-warm-gray-400'
        } ${animating ? 'scale-125' : 'scale-100'}`}
      />
      <span className={liked ? 'font-semibold text-red-500' : 'text-muted'}>
        {count}
      </span>
    </button>
  );
}
