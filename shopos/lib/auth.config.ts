// lib/auth.config.ts
// Edge-safe NextAuth config (NO bcrypt / mock-users imports here).
// Used by middleware.ts so the Edge bundle stays small and valid.

import type { NextAuthConfig } from 'next-auth';
import type { Role } from './types';

export const authConfig = {
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  trustHost: true,
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as Role;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
