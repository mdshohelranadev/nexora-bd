import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { ToastViewport } from '@/components/ui';
import { StoreChrome } from '@/components/layout/StoreChrome';
import { RemoteSync } from '@/components/layout/RemoteSync';
import { BottomNav } from '@/components/layout/BottomNav';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { Analytics } from '@/components/layout/Analytics';

const inter = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: { default: 'Nexora | Online Shopping in Bangladesh', template: '%s | Nexora' },
  description: 'Nexora: smartphones, laptops, audio, TVs, cameras and smart home electronics with delivery across all 64 districts of Bangladesh.',
};

export const viewport: Viewport = {
  themeColor: '#D81B60',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover', 
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="flex min-h-screen w-full flex-col overflow-x-hidden">
        <a href="#main" className="sr-only z-[70] rounded-md bg-surface px-4 py-2 font-semibold focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          Skip to content
        </a>
        <StoreChrome>
          <AnnouncementBar />
          <Header />
        </StoreChrome>
        
        {/* ✅ FIX: main theke pb-16 ba pb-20 sorate hobe na, kintu page scroll er niche jeno gap thake seta Footer e diyechi */}
        <main id="main" className="flex-1 w-full min-w-0">
          {children}
        </main>
        
        <StoreChrome>
          <Footer />
          <CartDrawer />
        </StoreChrome>
        <ToastViewport />
        <RemoteSync />
        <BottomNav />
        <WhatsAppFloat />
        <Analytics />
      </body>
    </html>
  );
}