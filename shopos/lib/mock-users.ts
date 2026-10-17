// lib/mock-users.ts

import bcrypt from 'bcryptjs';
import type { User, Role } from './types';

/**
 * Pre-hashed password for "1234" so we don't hash on every request.
 * bcrypt.hashSync('1234', 10)  ->  constant
 */
const PASSWORD_HASH = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

export const mockUsers: User[] = [
  {
    id: 'u-admin',
    name: 'Admin User',
    email: 'admin@shop.com',
    password: PASSWORD_HASH,
    role: 'admin',
    phone: '+880 1700-000001',
    active: true,
    createdAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'u-manager',
    name: 'Manager User',
    email: 'manager@shop.com',
    password: PASSWORD_HASH,
    role: 'manager',
    phone: '+880 1700-000002',
    active: true,
    createdAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'u-cashier',
    name: 'Cashier User',
    email: 'cashier@shop.com',
    password: PASSWORD_HASH,
    role: 'cashier',
    phone: '+880 1700-000003',
    active: true,
    createdAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'u-stock',
    name: 'Stock Manager',
    email: 'stock@shop.com',
    password: PASSWORD_HASH,
    role: 'stockman',
    phone: '+880 1700-000004',
    active: true,
    createdAt: '2025-01-01T00:00:00.000Z',
  },
];

export function findUserByEmail(email: string): User | undefined {
  return mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/** Used by login form to auto-login demo users */
export const demoCredentials = [
  { role: 'admin' as Role, email: 'admin@shop.com', password: '1234', name: 'Admin User' },
  { role: 'manager' as Role, email: 'manager@shop.com', password: '1234', name: 'Manager User' },
  { role: 'cashier' as Role, email: 'cashier@shop.com', password: '1234', name: 'Cashier User' },
  { role: 'stockman' as Role, email: 'stock@shop.com', password: '1234', name: 'Stock Manager' },
];