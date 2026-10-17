// lib/constants.ts

export const APP_NAME = 'ShopOS';
export const APP_TAGLINE = 'Construction Tools Shop Management';
export const CURRENCY = 'BDT';
export const CURRENCY_SYMBOL = '৳';

export const PASSWORD_HINT = 'Demo password: 1234';

export const DEMO_USERS = [
  { name: 'Admin User', email: 'admin@shop.com', role: 'admin' as const },
  { name: 'Manager User', email: 'manager@shop.com', role: 'manager' as const },
  { name: 'Cashier User', email: 'cashier@shop.com', role: 'cashier' as const },
  { name: 'Stock Manager', email: 'stock@shop.com', role: 'stockman' as const },
];

export const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  manager: 'Manager',
  cashier: 'Cashier',
  stockman: 'Stock Manager',
};

export const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-purple-500 text-white',
  manager: 'bg-blue-500 text-white',
  cashier: 'bg-amber-500 text-white',
  stockman: 'bg-emerald-500 text-white',
};

export const PRODUCT_CATEGORIES = [
  'Power Tools',
  'Hand Tools',
  'Accessories',
  'Safety',
  'Measuring',
];

export const PRODUCT_BRANDS = [
  'Bosch',
  'Makita',
  'DeWalt',
  'Stanley',
  'Taparia',
  'Black+Decker',
  'Generic',
];

export const PRODUCT_UNITS = [
  { name: 'Piece', shortName: 'pc' },
  { name: 'Box', shortName: 'box' },
  { name: 'Set', shortName: 'set' },
  { name: 'Kilogram', shortName: 'kg' },
  { name: 'Meter', shortName: 'm' },
  { name: 'Packet', shortName: 'pkt' },
];

export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'bkash', label: 'bKash' },
  { value: 'nagad', label: 'Nagad' },
  { value: 'card', label: 'Card' },
  { value: 'due', label: 'Due' },
] as const;

export const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'bg-amber-500' },
  { value: 'processing', label: 'Processing', color: 'bg-blue-500' },
  { value: 'shipped', label: 'Shipped', color: 'bg-indigo-500' },
  { value: 'delivered', label: 'Delivered', color: 'bg-emerald-500' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-500' },
] as const;

export const EXPENSE_CATEGORIES = [
  'Rent',
  'Salary',
  'Utility',
  'Transport',
  'Misc',
];

export const LOW_STOCK_THRESHOLD = 10;
export const PAGE_SIZE = 10;

export const CHART_COLORS = [
  '#6366f1', // indigo
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#ec4899', // pink
];