// components/website/footer.tsx

'use client';

import Link from 'next/link';
import {
  Wrench,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ArrowRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useState } from 'react';
import { useSettingsStore } from '@/lib/store/settings-store';

const SHOP_LINKS = [
  { href: '/shop', label: 'All Products' },
  { href: '/shop?category=Power Tools', label: 'Power Tools' },
  { href: '/shop?category=Hand Tools', label: 'Hand Tools' },
  { href: '/shop?category=Safety', label: 'Safety Gear' },
];

const HELP_LINKS = [
  { href: '/my-orders', label: 'Track Order' },
  { href: '/cart', label: 'Shopping Cart' },
  { href: '/checkout', label: 'Checkout' },
  { href: '/about', label: 'About Us' },
];

const SOCIAL = [
  { icon: Facebook, label: 'Facebook', href: '#' },
  { icon: Twitter, label: 'Twitter', href: '#' },
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Youtube, label: 'YouTube', href: '#' },
];

export function WebsiteFooter() {
  const { businessInfo } = useSettingsStore();
  const [email, setEmail] = useState('');

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      toast.error('Enter a valid email');
      return;
    }
    toast.success('Subscribed successfully');
    setEmail('');
  };

  return (
    <footer className="border-t border-border bg-muted/30 mt-auto">
      {/* Newsletter strip */}
      <div className="border-b border-border">
        <div className="container mx-auto py-6 md:py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-base md:text-lg font-bold">
                Get tool deals in your inbox
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                Subscribe for exclusive discounts and new arrivals.
              </p>
            </div>
            <form
              onSubmit={subscribe}
              className="flex gap-2 w-full md:w-auto md:min-w-[360px]"
            >
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 flex-1 bg-background"
              />
              <Button type="submit" className="h-10 shrink-0">
                Subscribe
                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1 space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                <Wrench className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-bold leading-tight">ShopOS</div>
                <div className="text-[10px] text-muted-foreground leading-tight">
                  Construction Tools
                </div>
              </div>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your trusted partner for professional construction tools,
              hardware and safety equipment in Bangladesh.
            </p>
            <div className="flex items-center gap-1">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  <s.icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Shop
            </h4>
            <ul className="space-y-2">
              {SHOP_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Help
            </h4>
            <ul className="space-y-2">
              {HELP_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{businessInfo.address}</span>
              </li>
              <li className="flex items-center gap-2 text-xs text-muted-foreground">
                <Phone className="h-3.5 w-3.5 shrink-0" />
                <span>{businessInfo.phone}</span>
              </li>
              <li className="flex items-center gap-2 text-xs text-muted-foreground">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{businessInfo.email}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="container mx-auto py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <div>
            © {new Date().getFullYear()} {businessInfo.name}. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/about" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <span>Powered by ShopOS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}