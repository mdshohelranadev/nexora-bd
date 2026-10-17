// app/(website)/product/[id]/page.tsx

'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Package,
  CheckCircle2,
  Tag,
  Ruler,
} from 'lucide-react';
import { toast } from 'sonner';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState } from '@/components/shared/empty-state';
import { StatusBadge } from '@/components/shared/status-badge';
import { WebsiteProductCard } from '@/components/website/product-card';
import { useProductStore } from '@/lib/store/product-store';
import { useWebCart } from '@/lib/store/web-cart-store';
import { formatCurrency } from '@/lib/format';
import { getStockStatus, cn } from '@/lib/utils';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const products = useProductStore((s) => s.products);
  const cart = useWebCart();

  const product = products.find((p) => p.id === id);

  const [qty, setQty] = useState(1);

  const related = useMemo(() => {
    if (!product) return [];
    return products
      .filter(
        (p) =>
          p.id !== product.id &&
          p.status === 'active' &&
          (p.category === product.category || p.brand === product.brand)
      )
      .slice(0, 4);
  }, [product, products]);

  if (!product) {
    return (
      <div className="container mx-auto py-16">
        <Card>
          <CardContent className="p-8">
            <EmptyState
              icon={Package}
              title="Product not found"
              description="This product may have been removed or the link is incorrect."
              action={
                <Button onClick={() => router.push('/shop')}>
                  Browse all products
                </Button>
              }
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  const outOfStock = product.stock <= 0;
  const lowStock = !outOfStock && product.stock <= product.minStock;
  const st = getStockStatus(product.stock, product.minStock);

  const handleAdd = () => {
    if (outOfStock) {
      toast.error(`${product.name} is out of stock`);
      return;
    }
    cart.add(product, qty);
    toast.success(`Added ${qty} × ${product.name} to cart`);
    cart.setDrawerOpen(true);
  };

  const handleBuyNow = () => {
    if (outOfStock) {
      toast.error(`${product.name} is out of stock`);
      return;
    }
    cart.add(product, qty);
    router.push('/checkout');
  };

  return (
    <div className="container mx-auto py-6 md:py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground flex-wrap">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-foreground">
          Products
        </Link>
        <span>/</span>
        <Link
          href={`/shop?category=${encodeURIComponent(product.category)}`}
          className="hover:text-foreground"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-foreground truncate max-w-[200px]">
          {product.name}
        </span>
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="h-8 text-xs -ml-2 mb-4"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-3.5 w-3.5 mr-1" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-10">
        {/* Left: image / placeholder */}
        <div className="space-y-3">
          <div className="aspect-square rounded-xl border bg-gradient-to-br from-indigo-500/5 via-violet-500/5 to-indigo-500/10 flex items-center justify-center relative overflow-hidden">
            <div className="text-7xl md:text-8xl font-bold text-indigo-500/25 select-none">
              {product.name.slice(0, 2).toUpperCase()}
            </div>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              {outOfStock && (
                <Badge variant="destructive" className="text-xs px-2 py-1">
                  Out of Stock
                </Badge>
              )}
              {lowStock && (
                <Badge className="bg-amber-500 text-white text-xs px-2 py-1">
                  Low Stock
                </Badge>
              )}
              {product.grade === 'A' && (
                <Badge className="bg-purple-500 text-white text-xs px-2 py-1">
                  Premium Grade
                </Badge>
              )}
            </div>
          </div>

          {/* Thumbnail strip (mock) */}
          <div className="grid grid-cols-4 gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  'aspect-square rounded-lg border-2 flex items-center justify-center cursor-pointer transition-colors',
                  i === 0
                    ? 'border-indigo-500 bg-indigo-500/5'
                    : 'border-border hover:border-indigo-500/50'
                )}
              >
                <span className="text-sm font-bold text-indigo-500/30">
                  {product.name.slice(0, 2).toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: info */}
        <div className="space-y-4">
          {/* Brand + name */}
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant="secondary" className="text-[10px] uppercase">
                {product.brand}
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                {product.category}
              </Badge>
              {product.grade && (
                <Badge variant="outline" className="text-[10px]">
                  Grade {product.grade}
                </Badge>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={cn(
                      'h-3.5 w-3.5',
                      s <= 4
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-muted-foreground/40'
                    )}
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-1">
                  4.0 · 24 reviews
                </span>
              </div>
              <Separator orientation="vertical" className="h-4 hidden sm:block" />
              <span className="text-xs text-muted-foreground">
                SKU: <span className="font-mono">{product.sku}</span>
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="rounded-xl border bg-card p-4">
            <div className="text-3xl font-bold tabular-nums">
              {formatCurrency(product.sellingPrice)}
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <Tag className="h-3 w-3" />
              Inclusive of all taxes
            </div>

            <div className="flex items-center gap-2 mt-3">
              <StatusBadge
                variant={
                  st.variant === 'success'
                    ? 'success'
                    : st.variant === 'warning'
                    ? 'warning'
                    : 'danger'
                }
              >
                {st.label}
              </StatusBadge>
              <span className="text-xs text-muted-foreground">
                {outOfStock
                  ? 'Currently unavailable'
                  : `${product.stock} ${product.unit} available`}
              </span>
            </div>
          </div>

          {/* Quantity + Add */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center border rounded-lg h-11 bg-background">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={outOfStock || qty <= 1}
                  className="w-11 h-full flex items-center justify-center hover:bg-muted rounded-l-lg disabled:opacity-40"
                  aria-label="Decrease"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <div className="w-12 text-center text-sm font-semibold tabular-nums">
                  {outOfStock ? 0 : qty}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setQty((q) => Math.min(product.stock, q + 1))
                  }
                  disabled={outOfStock || qty >= product.stock}
                  className="w-11 h-full flex items-center justify-center hover:bg-muted rounded-r-lg disabled:opacity-40"
                  aria-label="Increase"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <span className="text-xs text-muted-foreground">
                Max {product.stock}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button
                size="lg"
                onClick={handleAdd}
                disabled={outOfStock}
                className="h-12"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleBuyNow}
                disabled={outOfStock}
                className="h-12"
              >
                Buy Now
              </Button>
            </div>
          </div>

          {/* Trust icons */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="text-center p-3 rounded-lg border">
              <Truck className="h-4 w-4 mx-auto text-indigo-500 mb-1" />
              <div className="text-[11px] font-medium">Free Delivery</div>
              <div className="text-[10px] text-muted-foreground">Above ৳5,000</div>
            </div>
            <div className="text-center p-3 rounded-lg border">
              <Shield className="h-4 w-4 mx-auto text-indigo-500 mb-1" />
              <div className="text-[11px] font-medium">Genuine</div>
              <div className="text-[10px] text-muted-foreground">100% authentic</div>
            </div>
            <div className="text-center p-3 rounded-lg border">
              <RotateCcw className="h-4 w-4 mx-auto text-indigo-500 mb-1" />
              <div className="text-[11px] font-medium">Returns</div>
              <div className="text-[10px] text-muted-foreground">7-day policy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: description / specs */}
      <div className="mb-10">
        <Tabs defaultValue="description">
          <TabsList className="h-9">
            <TabsTrigger value="description" className="text-xs">
              Description
            </TabsTrigger>
            <TabsTrigger value="specs" className="text-xs">
              Specifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description">
            <Card>
              <CardContent className="p-5 prose-sm max-w-none">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {product.description ||
                    `${product.name} is a professional-grade tool designed for
                    construction and DIY use. Made with high-quality materials
                    and tested for durability on the job site.`}
                </p>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Premium build quality with long service life</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Suitable for professional and semi-professional use</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Backed by brand warranty and local service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Available in multiple quantities for bulk orders</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specs">
            <Card>
              <CardContent className="p-5">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                  {[
                    ['Brand', product.brand],
                    ['Category', product.category],
                    ['SKU', product.sku],
                    ['Barcode', product.barcode],
                    ['Unit', product.unit],
                    ['Grade', product.grade ?? '—'],
                    ['Min Stock', String(product.minStock)],
                    ['Current Stock', String(product.stock)],
                  ].map(([label, val]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between py-2 border-b border-border"
                    >
                      <dt className="text-muted-foreground">{label}</dt>
                      <dd className="font-medium truncate">{val}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section>
          <div className="flex items-end justify-between gap-4 mb-4">
            <h2 className="text-xl font-bold tracking-tight">
              Related Products
            </h2>
            <Link
              href={`/shop?category=${encodeURIComponent(product.category)}`}
              className="text-xs md:text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {related.map((p) => (
              <WebsiteProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}