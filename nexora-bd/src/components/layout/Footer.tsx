'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCatalog } from '@/store/catalogStore';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '@/components/icons';
import { defaultSettings, useSettingsStore, type SiteSettings } from '@/store/settingsStore';
import { useHydrated } from '@/hooks/useHydrated';
import { NewsletterForm } from './NewsletterForm';

const customerService = [
  { label: 'Delivery information', href: '/help#delivery' },
  { label: 'Returns and refunds', href: '/help#returns' },
  { label: 'Payment', href: '/help#payment' },
  { label: 'Contact us', href: '/contact' },
];

const company = [
  { label: 'About us', href: '/about' },
  { label: 'Wishlist', href: '/wishlist' },
  { label: 'Cart', href: '/cart' },
];

const socialIconClass = 'grid h-11 w-11 place-items-center rounded-full bg-white/10 transition hover:bg-white/20 hover:text-white';

export function Footer() {
  const categories = useCatalog((s) => s.categories);
  const hydrated = useHydrated();
  const live = useSettingsStore();
  const s: SiteSettings = hydrated ? live : defaultSettings;
  const socials = [
    { url: s.facebookUrl, label: 'Facebook', icon: <FacebookIcon className="h-5 w-5" /> },
    { url: s.instagramUrl, label: 'Instagram', icon: <InstagramIcon className="h-5 w-5" /> },
    { url: s.youtubeUrl, label: 'YouTube', icon: <YoutubeIcon className="h-5 w-5" /> },
  ].filter((x) => x.url);

  return (
    <footer className="mt-0 bg-ink text-white/80">
      <div className="container-x grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-5">
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="https://i.postimg.cc/RZFP84QB/file-000000009eec8211aa6ba16c8ae2d815.png"
              alt="Nexora"
              width={200}
              height={60}
              className="h-10 w-auto object-contain"
              unoptimized
            />
          </Link>

          <p className="text-sm leading-relaxed">{s.aboutText || 'Authentic products, fast delivery across all 64 districts and easy returns.'}</p>
          {socials.length > 0 && (
            <div className="flex items-center gap-3">
              {socials.map((x) => (
                <a key={x.label} href={x.url} target="_blank" rel="noopener noreferrer" aria-label={x.label} className={socialIconClass}>
                  {x.icon}
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wide text-white">Shop</h2>
          <ul className="flex flex-col gap-2 text-sm">
            {categories.map((c) => (
              <li key={c.slug}><Link href={`/category/${c.slug}`} className="inline-flex min-h-[32px] items-center hover:text-accent">{c.name}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wide text-white">Customer Service</h2>
          <ul className="flex flex-col gap-2 text-sm">
            {customerService.map((l) => (
              <li key={l.label}><Link href={l.href} className="inline-flex min-h-[32px] items-center hover:text-accent">{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wide text-white">About</h2>
          <ul className="flex flex-col gap-2 text-sm">
            {company.map((l) => (
              <li key={l.label}><Link href={l.href} className="inline-flex min-h-[32px] items-center hover:text-accent">{l.label}</Link></li>
            ))}
          </ul>
          {(s.phone || s.email || s.address) && (
            <div className="mt-6 flex flex-col gap-2 text-sm">
              {s.phone && <a href={`tel:${s.phone}`} className="hover:text-accent">{s.phone}</a>}
              {s.email && <a href={`mailto:${s.email}`} className="hover:text-accent">{s.email}</a>}
              {s.address && <p>{s.address}</p>}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="font-display text-sm font-bold uppercase tracking-wide text-white">Newsletter</h2>
          <p className="text-sm">Get weekly deals and new arrivals in your inbox.</p>
          <NewsletterForm />
        </div>
      </div>

      {/* ✅ FIX: pb-24 diyechi jate mobile e text gulo nav er upore thake */}
      <div className="border-t border-white/10 pb-24 lg:pb-6">
        <div className="container-x flex flex-col items-center justify-center gap-4 py-6 text-center">
          
          <p className="text-sm text-white/80">Cash on Delivery only. Pay when your order arrives.</p>

          <div className="flex flex-col items-center justify-center gap-1 text-center">
            <p className="text-xs text-white/60">
              Copyright {new Date().getFullYear()} Nexora. All rights reserved.
            </p>
            <p className="text-xs text-white/60">
              Developed by{' '}
              <a 
                href="https://codeghorstudio.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-semibold text-white hover:text-accent hover:underline transition-colors"
              >
                Code Ghor Studio
              </a>
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}