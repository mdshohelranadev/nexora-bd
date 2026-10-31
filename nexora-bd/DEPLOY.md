# Deploy checklist

1. Supabase: run `supabase/production.sql` in SQL Editor.
2. Supabase: create admin user (Authentication > Users), then run the admin SQL at the bottom of the file.
3. Vercel: import repo, add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`, deploy.
4. Supabase: Authentication > URL Configuration > add the Vercel domain.
5. Admin: log in at `/admin/login`, set store name, logo, WhatsApp number and delivery charges.
