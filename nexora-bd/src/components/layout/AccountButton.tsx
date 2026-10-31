'use client';

import Link from 'next/link';
import { UserIcon } from '@/components/icons';
import { customerInfo, useCustomerStore } from '@/store/customerStore';

export function AccountButton() {
  const session = useCustomerStore((s) => s.session);
  const user = customerInfo(session);
  return (
    <Link
      href={user ? '/account' : '/login'}
      aria-label={user ? `My account, ${user.name || user.email}` : 'Log in or sign up'}
      className="grid h-11 w-11 place-items-center rounded-full text-ink transition hover:bg-canvas"
    >
      <UserIcon className="h-6 w-6" />
    </Link>
  );
}
