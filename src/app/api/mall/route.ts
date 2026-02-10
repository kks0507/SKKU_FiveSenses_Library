import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  let products = db.mallProducts().filter(p => p.status === 'available');
  if (category) {
    products = products.filter(p => p.category === category);
  }

  return NextResponse.json({ products });
}
