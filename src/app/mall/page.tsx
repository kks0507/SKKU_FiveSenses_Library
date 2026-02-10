'use client';

import { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Gift,
  Coins,
  Package,
  AlertCircle,
  Check,
} from 'lucide-react';

type Product = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  stock: number;
  category: string;
  status: string;
};

const CATEGORIES = [
  { key: '', label: '전체' },
  { key: '문구류', label: '문구류' },
  { key: '인형', label: '인형' },
  { key: '기타', label: '기타' },
];

const CATEGORY_ICONS: Record<string, string> = {
  '문구류': '✏️',
  '인형': '🧸',
  '기타': '🎁',
};

function ExchangeButton({
  isExchanged,
  canAfford,
  stock,
  isExchanging,
  onExchange,
}: {
  isExchanged: boolean;
  canAfford: boolean;
  stock: number;
  isExchanging: boolean;
  onExchange: () => void;
}) {
  if (isExchanged) {
    return (
      <button
        type="button"
        disabled
        className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white"
      >
        <Check className="h-4 w-4" />
        교환 완료
      </button>
    );
  }

  if (!canAfford || stock === 0) {
    return (
      <button
        type="button"
        disabled
        className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-warm-gray-200 px-4 py-2 text-sm font-medium text-warm-gray-400 cursor-not-allowed"
      >
        <AlertCircle className="h-4 w-4" />
        {stock === 0 ? '품절' : '포인트 부족'}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onExchange}
      disabled={isExchanging}
      className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
    >
      {isExchanging ? (
        <span>교환 중...</span>
      ) : (
        <>
          <Gift className="h-4 w-4" />
          교환하기
        </>
      )}
    </button>
  );
}

export default function MallPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const [availablePoints, setAvailablePoints] = useState(0);
  const [exchangingId, setExchangingId] = useState<string | null>(null);
  const [exchangedIds, setExchangedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchPoints() {
      try {
        const res = await fetch('/api/mypage');
        if (res.ok) {
          const json = await res.json();
          setAvailablePoints(json.points.available);
        }
      } catch {
        // fallback
      }
    }
    fetchPoints();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const url = activeCategory
          ? `/api/mall?category=${encodeURIComponent(activeCategory)}`
          : '/api/mall';
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        setProducts(json.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [activeCategory]);

  function handleExchange(productId: string) {
    setExchangingId(productId);
    setTimeout(() => {
      setExchangedIds((prev) => new Set([...prev, productId]));
      setExchangingId(null);
    }, 1000);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
              <ShoppingBag className="h-7 w-7 text-accent" />
              오거서 몰
            </h1>
            <p className="mt-1 text-sm text-muted">
              포인트로 교환하세요
            </p>
          </div>
          <div
            className="flex items-center gap-2 rounded-xl bg-card-bg px-5 py-3"
            style={{ boxShadow: 'var(--shadow-md)' }}
          >
            <Coins className="h-5 w-5 text-accent" />
            <span className="text-sm text-muted">나의 가용 포인트:</span>
            <span className="text-lg font-bold text-foreground">
              {availablePoints.toLocaleString()}P
            </span>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => setActiveCategory(cat.key)}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === cat.key
                ? 'bg-primary text-white'
                : 'bg-card-bg text-muted hover:bg-warm-gray-100 hover:text-foreground'
            }`}
            style={activeCategory !== cat.key ? { boxShadow: 'var(--shadow-sm)' } : undefined}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl bg-card-bg p-4"
              style={{ boxShadow: 'var(--shadow-md)' }}
            >
              <div className="mb-3 aspect-square rounded-lg bg-warm-gray-200" />
              <div className="mb-2 h-4 w-3/4 rounded bg-warm-gray-200" />
              <div className="mb-3 h-3 w-1/2 rounded bg-warm-gray-200" />
              <div className="h-8 rounded-lg bg-warm-gray-200" />
            </div>
          ))}
          <p className="col-span-full mt-4 text-center text-muted">로딩 중...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="py-16 text-center">
          <Package className="mx-auto mb-3 h-12 w-12 text-warm-gray-300" />
          <p className="text-muted">해당 카테고리에 상품이 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {products.map((product) => {
            const canAfford = availablePoints >= product.price;
            const isExchanging = exchangingId === product.id;
            const isExchanged = exchangedIds.has(product.id);
            const icon = CATEGORY_ICONS[product.category] || '🎁';

            return (
              <div
                key={product.id}
                className="flex flex-col rounded-xl bg-card-bg overflow-hidden"
                style={{ boxShadow: 'var(--shadow-md)' }}
              >
                {/* Image Placeholder */}
                <div className="relative flex aspect-square items-center justify-center bg-warm-gray-100">
                  <span className="text-5xl">{icon}</span>
                  {product.stock <= 3 && product.stock > 0 && (
                    <span className="absolute top-2 right-2 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                      잔여 {product.stock}개
                    </span>
                  )}
                  {product.stock === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-warm-gray-700">
                        품절
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-sm font-semibold text-foreground leading-snug">
                    {product.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted leading-relaxed">
                    {product.description}
                  </p>

                  {/* Price */}
                  <div className="mt-auto pt-3">
                    <p className="text-base font-bold text-primary">
                      {product.price.toLocaleString()}P
                    </p>
                  </div>

                  {/* Exchange Button */}
                  <div className="mt-2">
                    <ExchangeButton
                      isExchanged={isExchanged}
                      canAfford={canAfford}
                      stock={product.stock}
                      isExchanging={isExchanging}
                      onExchange={() => handleExchange(product.id)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
