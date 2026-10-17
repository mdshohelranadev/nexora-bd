// app/page.tsx

import Link from 'next/link';
import {
  ArrowRight,
  Shield,
  Truck,
  Sparkles,
  Headphones,
  Wrench,
  Zap,
  Hammer,
  HardHat,
  Ruler,
  Package,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WebsiteProductCard } from '@/components/website/product-card';
import { WebsiteNavbar } from '@/components/website/navbar';
import { WebsiteFooter } from '@/components/website/footer';
import { WebsiteCartDrawer } from '@/components/website/cart-drawer';
import { demoProducts, demoCategories } from '@/lib/demo-data';
import { cn } from '@/lib/utils';

const CATEGORY_ICONS: Record<string, any> = {
  'Power Tools': Zap,
  'Hand Tools': Hammer,
  'Accessories': Package,
  'Safety': HardHat,
  'Measuring': Ruler,
};

export default function HomePage() {
  const products = demoProducts;
  const categories = demoCategories;

  const activeProducts = products.filter((p) => p.status === 'active');
  const featured = activeProducts
    .filter((p) => p.grade === 'A' && p.stock > 0)
    .slice(0, 8);
  const latest = [...activeProducts]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 8);

  const stats = {
    products: activeProducts.length,
    categories: categories.length,
    brands: new Set(activeProducts.map((p) => p.brand)).size,
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <WebsiteNavbar />
      <main className="flex-1">
        <div className="flex flex-col">
          <section className="relative overflow-hidden border-b border-border">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800" />
            <div className="relative container mx-auto py-14 md:py-20 lg:py-28 text-white">
              <div className="max-w-2xl space-y-5">
                <Badge variant="secondary" className="bg-white/15 text-white border-0 backdrop-blur">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Trusted by 500+ construction businesses
                </Badge>

                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                  Build with the
                  <br />
                  <span className="text-white/90">right tools.</span>
                </h1>

                <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-lg">
                  Professional-grade power tools, hand tools, safety gear and
                  measuring instruments. Sourced from world-class brands,
                  delivered to your site.
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button asChild size="lg" className="bg-white text-indigo-700 hover:bg-white/90 h-11">
                    <Link href="/shop">
                      Shop All Tools
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="bg-transparent text-white border-white/30 hover:bg-white/10 hover:text-white h-11">
                    <Link href="/shop?category=Power%20Tools">
                      Browse Power Tools
                    </Link>
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-6 max-w-md">
                  <div>
                    <div className="text-2xl md:text-3xl font-bold tabular-nums">{stats.products}+</div>
                    <div className="text-[11px] text-white/70 uppercase tracking-wider mt-0.5">Products</div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold tabular-nums">{stats.brands}</div>
                    <div className="text-[11px] text-white/70 uppercase tracking-wider mt-0.5">Brands</div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold tabular-nums">{stats.categories}</div>
                    <div className="text-[11px] text-white/70 uppercase tracking-wider mt-0.5">Categories</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="border-b border-border bg-muted/30">
            <div className="container mx-auto py-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Truck, title: 'Free Delivery', sub: 'On orders above ৳5,000' },
                  { icon: Shield, title: 'Genuine Products', sub: '100% authentic' },
                  { icon: Wrench, title: 'Expert Support', sub: 'Technical help' },
                  { icon: Headphones, title: '24/7 Service', sub: 'Always here' },
                ].map((f) => (
                  <div key={f.title} className="flex items-center gap-3">
                    <div className="h-9 w-9 shrink-0 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <f.icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs md:text-sm font-semibold truncate">{f.title}</div>
                      <div className="text-[10px] text-muted-foreground truncate">{f.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="container mx-auto py-10 md:py-14">
            <div className="flex items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">Shop by Category</h2>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">Find exactly what you need.</p>
              </div>
              <Link href="/shop" className="text-xs md:text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 shrink-0">
                View all
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {categories.map((c) => {
                const Icon = CATEGORY_ICONS[c.name] ?? Package;
                const count = activeProducts.filter((p) => p.category === c.name).length;
                return (
                  <Link
                    key={c.id}
                    href={`/shop?category=${encodeURIComponent(c.name)}`}
                    className={cn(
                      'group rounded-xl border bg-card p-4 md:p-5 transition-all',
                      'hover:shadow-md hover:border-indigo-500/40 hover:-translate-y-0.5'
                    )}
                  >
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500/10 to-violet-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="text-sm font-semibold truncate">{c.name}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {count} product{count === 1 ? '' : 's'}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {featured.length > 0 && (
            <section className="container mx-auto pb-10 md:pb-14">
              <div className="flex items-end justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight">Featured Tools</h2>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">Hand-picked premium tools.</p>
                </div>
                <Link href="/shop" className="text-xs md:text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                  View all
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {featured.map((p) => (
                  <WebsiteProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}

          <section className="container mx-auto pb-10 md:pb-14">
            <Card className="overflow-hidden border-0 bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
              <CardContent className="p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-lg">
                  <Badge variant="secondary" className="bg-white/15 text-white border-0">
                    Limited Time
                  </Badge>
                  <h3 className="text-2xl md:text-3xl font-bold leading-tight">
                    Bulk order discounts up to 25% off
                  </h3>
                  <p className="text-sm text-white/70">
                    Order in bulk and save more. Custom quotes available.
                  </p>
                </div>
                <Button asChild size="lg" className="bg-white text-zinc-900 hover:bg-white/90 h-11 shrink-0">
                  <Link href="/shop">
                    Start Shopping
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </section>

          <section className="container mx-auto pb-14">
            <div className="flex items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">New Arrivals</h2>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">Fresh stock just added.</p>
              </div>
              <Link href="/shop" className="text-xs md:text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                View all
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {latest.map((p) => (
                <WebsiteProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        </div>
      </main>
      <WebsiteFooter />
      <WebsiteCartDrawer />
    </div>
  );
}
