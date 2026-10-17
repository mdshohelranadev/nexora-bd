// lib/nav-config.ts

import type { Permission } from './types';
import {
  LayoutDashboard,
  ShoppingCart,
  Receipt,
  Truck,
  PackageCheck,
  Wrench,
  Layers,
  ScanBarcode,
  Users,
  Factory,
  BarChart3,
  Wallet,
  UserCog,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export interface NavChild {
  title: string;
  href: string;
}

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  permission: Permission;
  badgeKey?: 'ordersPending' | 'lowStock' | 'customerDue' | 'supplierDue';
  children?: NavChild[];
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    label: 'Main',
    items: [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        permission: 'dashboard',
      },
    ],
  },
  {
    label: 'Operations',
    items: [
      {
        title: 'POS',
        href: '/pos',
        icon: ShoppingCart,
        permission: 'pos',
      },
      {
        title: 'Sales',
        href: '/sales',
        icon: Receipt,
        permission: 'sales',
        children: [
          { title: 'All Sales', href: '/sales' },
          { title: 'Invoices', href: '/sales/invoices' },
          { title: 'Returns', href: '/sales/returns' },
        ],
      },
      {
        title: 'Purchase',
        href: '/purchase',
        icon: Truck,
        permission: 'purchase',
        children: [
          { title: 'All Purchases', href: '/purchase' },
          { title: 'Create Purchase', href: '/purchase/create' },
          { title: 'Returns', href: '/purchase/returns' },
        ],
      },
      {
        title: 'Orders',
        href: '/orders',
        icon: PackageCheck,
        permission: 'orders',
        badgeKey: 'ordersPending',
        children: [
          { title: 'All Orders', href: '/orders' },
          { title: 'Pending', href: '/orders/pending' },
          { title: 'Processing', href: '/orders/processing' },
          { title: 'Delivered', href: '/orders/delivered' },
        ],
      },
    ],
  },
  {
    label: 'Catalog',
    items: [
      {
        title: 'Products',
        href: '/products',
        icon: Wrench,
        permission: 'products',
        children: [
          { title: 'All Products', href: '/products' },
          { title: 'Categories', href: '/products/categories' },
          { title: 'Brands', href: '/products/brands' },
          { title: 'Units', href: '/products/units' },
        ],
      },
      {
        title: 'Inventory',
        href: '/inventory',
        icon: Layers,
        permission: 'inventory',
        badgeKey: 'lowStock',
        children: [
          { title: 'Stock Overview', href: '/inventory' },
          { title: 'Stock In', href: '/inventory/stock-in' },
          { title: 'Stock Out', href: '/inventory/stock-out' },
          { title: 'Adjustment', href: '/inventory/adjustment' },
          { title: 'Movement History', href: '/inventory/movements' },
        ],
      },
      {
        title: 'Barcode',
        href: '/barcode/generate',
        icon: ScanBarcode,
        permission: 'barcode',
        children: [
          { title: 'Generate', href: '/barcode/generate' },
          { title: 'Print Labels', href: '/barcode/print' },
          { title: 'Scan', href: '/barcode/scan' },
        ],
      },
    ],
  },
  {
    label: 'Partners',
    items: [
      {
        title: 'Customers',
        href: '/customers',
        icon: Users,
        permission: 'customers',
        badgeKey: 'customerDue',
        children: [
          { title: 'All Customers', href: '/customers' },
          { title: 'Due List', href: '/customers/due' },
          { title: 'Payment History', href: '/customers/payments' },
        ],
      },
      {
        title: 'Suppliers',
        href: '/suppliers',
        icon: Factory,
        permission: 'suppliers',
        badgeKey: 'supplierDue',
        children: [
          { title: 'All Suppliers', href: '/suppliers' },
          { title: 'Due List', href: '/suppliers/due' },
          { title: 'Payment History', href: '/suppliers/payments' },
        ],
      },
    ],
  },
  {
    label: 'Reports',
    items: [
      {
        title: 'Reports',
        href: '/reports/sales',
        icon: BarChart3,
        permission: 'reports',
        children: [
          { title: 'Sales Report', href: '/reports/sales' },
          { title: 'Purchase Report', href: '/reports/purchase' },
          { title: 'Stock Report', href: '/reports/stock' },
          { title: 'Profit & Loss', href: '/reports/profit-loss' },
          { title: 'Customer Due', href: '/reports/customer-due' },
          { title: 'Supplier Due', href: '/reports/supplier-due' },
        ],
      },
      {
        title: 'Expense',
        href: '/expense',
        icon: Wallet,
        permission: 'expense',
        children: [
          { title: 'All Expenses', href: '/expense' },
          { title: 'Categories', href: '/expense/categories' },
          { title: 'Reports', href: '/expense/reports' },
        ],
      },
    ],
  },
  {
    label: 'System',
    items: [
      {
        title: 'Users',
        href: '/users',
        icon: UserCog,
        permission: 'users',
        children: [
          { title: 'All Users', href: '/users' },
          { title: 'Roles', href: '/users/roles' },
          { title: 'Permissions', href: '/users/permissions' },
        ],
      },
      {
        title: 'Settings',
        href: '/settings/business',
        icon: Settings,
        permission: 'settings',
        children: [
          { title: 'Business Info', href: '/settings/business' },
          { title: 'Tax & VAT', href: '/settings/tax' },
          { title: 'Receipt', href: '/settings/receipt' },
          { title: 'Backup', href: '/settings/backup' },
        ],
      },
    ],
  },
];