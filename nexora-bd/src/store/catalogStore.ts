'use client';

import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Category, Product, Review } from '@/types';

// Row shapes from Supabase (snake_case). Mapped to the app's camelCase types below.
interface ProductRow {
  id: string; slug: string; name: string; brand: string; category: string; subcategory: string;
  price: number; original_price: number; rating: number; review_count: number;
  short_description: string; description: string; specifications: Record<string, string>;
  images: string[]; variants: Product['variants'] | null; stock: number; badges: string[] | null;
}
interface CategoryRow { slug: string; name: string; description: string; subcategories: string[] }
interface ReviewRow {
  id: string; product_id: string; author: string; district: string; rating: number;
  review_date: string; title: string; body: string; verified: boolean;
}

const mapProduct = (r: ProductRow): Product => ({
  id: r.id,
  slug: r.slug,
  name: r.name,
  brand: r.brand,
  category: r.category,
  subcategory: r.subcategory,
  price: Number(r.price),
  originalPrice: Number(r.original_price),
  discountPercent: r.original_price > r.price ? Math.round(((r.original_price - r.price) / r.original_price) * 100) : 0,
  rating: Number(r.rating),
  reviewCount: r.review_count,
  shortDescription: r.short_description,
  description: r.description,
  specifications: r.specifications ?? {},
  images: r.images ?? [],
  variants: r.variants ?? undefined,
  stock: r.stock,
  badges: r.badges ?? [],
});

const mapCategory = (r: CategoryRow): Category => ({
  slug: r.slug,
  name: r.name,
  description: r.description,
  subcategories: r.subcategories ?? [],
});

const mapReview = (r: ReviewRow): Review => ({
  id: r.id,
  productId: r.product_id,
  author: r.author,
  district: r.district,
  rating: r.rating,
  date: r.review_date,
  title: r.title,
  body: r.body,
  verified: r.verified,
});

interface CatalogState {
  products: Product[];
  categories: Category[];
  reviews: Review[];
  loaded: boolean;
  load: () => Promise<void>;
}

export const useCatalog = create<CatalogState>()((set) => ({
  products: [],
  categories: [],
  reviews: [],
  loaded: false,
  load: async () => {
    if (!supabase) {
      set({ loaded: true });
      return;
    }
    const [p, c, r] = await Promise.all([
      supabase.from('products').select('*').eq('is_active', true).order('sort_order'),
      supabase.from('categories').select('*').order('sort_order'),
      supabase.from('reviews').select('*').order('review_date', { ascending: false }),
    ]);
    if (p.error) console.error('Products load failed:', p.error.message);
    set({
      products: ((p.data ?? []) as ProductRow[]).map(mapProduct),
      categories: ((c.data ?? []) as CategoryRow[]).map(mapCategory),
      reviews: ((r.data ?? []) as ReviewRow[]).map(mapReview),
      loaded: true,
    });
  },
}));
