// app/(dashboard)/dashboard/page.tsx

import { RoleDashboard } from '@/components/dashboard/role-dashboard';

export const metadata = { title: 'Dashboard — ShopOS' };

export default function DashboardPage() {
  return <RoleDashboard />;
}