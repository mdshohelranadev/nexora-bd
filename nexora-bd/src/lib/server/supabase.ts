import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';

// Server-only. Uses the service role key (set in Vercel env, never shipped to the browser).
export function serviceClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Server Supabase env missing: NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY');
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export function bearerToken(req: Request): string | null {
  const h = req.headers.get('authorization') || '';
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m ? m[1] : null;
}

// Returns the admin user if the bearer token belongs to an account with app_metadata.role = 'admin'.
export async function requireAdmin(req: Request): Promise<User | null> {
  const token = bearerToken(req);
  if (!token) return null;
  const { data, error } = await serviceClient().auth.getUser(token);
  if (error || !data.user) return null;
  return data.user.app_metadata?.role === 'admin' ? data.user : null;
}

// Returns the logged-in customer (any valid user), or null for guests.
export async function optionalUser(req: Request): Promise<User | null> {
  const token = bearerToken(req);
  if (!token) return null;
  const { data, error } = await serviceClient().auth.getUser(token);
  return error ? null : data.user;
}

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
}
