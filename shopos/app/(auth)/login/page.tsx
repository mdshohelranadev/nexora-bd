// app/(auth)/login/page.tsx

import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/login-form';
import { Boxes, ShieldCheck, TrendingUp, Wrench } from 'lucide-react';

export const metadata = { title: 'Login — ShopOS' };

const features = [
  { icon: Boxes, title: 'Full inventory control', text: 'Stock, purchase, sales and returns in one place.' },
  { icon: TrendingUp, title: 'Real-time analytics', text: 'Role-based dashboards with charts and reports.' },
  { icon: ShieldCheck, title: 'Role permissions', text: 'Admin, Manager, Cashier and Stockman.' },
  { icon: Wrench, title: 'Built for tool shops', text: 'Barcode, POS, PDF invoices and website store.' },
];

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Brand panel */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-12 text-white">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur">
            <Wrench className="h-6 w-6" />
          </div>
          <div>
            <div className="text-lg font-semibold leading-tight">ShopOS</div>
            <div className="text-xs text-white/70">Construction Tools Shop</div>
          </div>
        </div>

        <div className="space-y-6 max-w-md">
          <h1 className="text-3xl font-bold leading-tight">
            Run your tool shop the modern way.
          </h1>
          <p className="text-white/80 text-sm">
            A complete management demo with POS, inventory, purchases, orders,
            reports and a public website. Zero backend, all data lives in your browser.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl bg-white/10 backdrop-blur p-4">
                <f.icon className="h-5 w-5 mb-2" />
                <div className="font-medium text-sm">{f.title}</div>
                <div className="text-xs text-white/70 mt-1">{f.text}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-white/60">
          ShopOS demo — no signup required, use any role card.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 md:p-10 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold leading-tight">ShopOS</div>
              <div className="text-xs text-muted-foreground">Construction Tools Shop</div>
            </div>
          </div>

          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}