// Pure helpers over catalog arrays. Arrays come from catalogStore (Supabase), never hardcoded.
import type { Category, Product, Review } from '@/types';

export const getProductById = (list: Product[], id: string) => list.find((p) => p.id === id);
export const getProductBySlug = (list: Product[], slug: string) => list.find((p) => p.slug === slug);
export const getCategoryBySlug = (list: Category[], slug: string) => list.find((c) => c.slug === slug);

export function getRelatedProducts(list: Product[], product: Product, limit = 4): Product[] {
  const same = list.filter((p) => p.category === product.category && p.id !== product.id);
  const others = list.filter((p) => p.category !== product.category);
  return [...same, ...others].slice(0, limit);
}

export const getFeaturedProducts = (list: Product[], limit = 8) =>
  list.filter((p) => p.rating >= 4.4).slice(0, limit);

export const getBestSellers = (list: Product[], limit = 4) =>
  list.filter((p) => p.badges?.includes('Best Seller')).slice(0, limit);

export const getProductReviews = (reviews: Review[], productId: string) =>
  reviews.filter((r) => r.productId === productId);
