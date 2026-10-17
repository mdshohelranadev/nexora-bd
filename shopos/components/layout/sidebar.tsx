// components/layout/sidebar.tsx

'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { PanelLeftClose, PanelLeft, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';

import { useSidebar } from '@/lib/hooks/use-sidebar';
import { SidebarNav } from './sidebar-nav';
import { UserCard } from './user-card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Role } from '@/lib/types';

interface Props {
  variant?: 'desktop' | 'mobile';
}

export function Sidebar({ variant = 'desktop' }: Props) {
  const { data } = useSession();
  const role = (data?.user?.role ?? 'cashier') as Role;
  const { collapsed, toggle, setMobileOpen } = useSidebar();

  const isMobile = variant === 'mobile';
  const width = isMobile ? 280 : collapsed ? 72 : 260;

  return (
    <motion.aside
      initial={false}
      animate={{ width }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className={cn(
        'relative flex h-screen flex-col border-r border-border bg-card',
        isMobile ? 'w-[280px]' : 'hidden lg:flex'
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          'flex h-14 items-center border-b border-border px-3 shrink-0',
          collapsed && !isMobile ? 'justify-center' : 'justify-between gap-2'
        )}
      >
        <Link
          href="/dashboard"
          className="flex items-center gap-2 min-w-0"
          onClick={() => isMobile && setMobileOpen(false)}
        >
          <div className="h-8 w-8 shrink-0 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
            <Wrench className="h-4 w-4" />
          </div>
          {(!collapsed || isMobile) && (
            <div className="min-w-0">
              <div className="text-sm font-bold leading-tight truncate">ShopOS</div>
              <div className="text-[10px] text-muted-foreground leading-tight truncate">
                Tools Shop
              </div>
            </div>
          )}
        </Link>

        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            title={collapsed ? 'Expand' : 'Collapse'}
            className="shrink-0"
          >
            {collapsed ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {/* Nav */}
      <SidebarNav
        role={role}
        collapsed={!isMobile && collapsed}
        onNavigate={() => isMobile && setMobileOpen(false)}
      />

      {/* User */}
      <UserCard collapsed={!isMobile && collapsed} />
    </motion.aside>
  );
}