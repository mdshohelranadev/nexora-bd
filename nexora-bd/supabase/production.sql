-- Nexora: production database setup
-- Run this whole file once: Supabase > SQL Editor > New query > Run.
-- Safe to run again (IF NOT EXISTS, ON CONFLICT, DROP POLICY IF EXISTS).

-- ---------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------

-- Store settings (one row, id = 1). Logo, store name, WhatsApp number, etc. Admin edits these.
create table if not exists public.site_settings (
  id int primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- Categories (shown in menu, footer, home grid)
create table if not exists public.categories (
  slug text primary key,
  name text not null,
  description text not null default '',
  subcategories text[] not null default '{}',
  sort_order int not null default 0
);

-- Products. Text id keeps compatibility with cart and wishlist ids.
create table if not exists public.products (
  id text primary key,
  slug text not null unique,
  name text not null,
  brand text not null default '',
  category text not null references public.categories(slug) on update cascade,
  subcategory text not null default '',
  price numeric(12, 2) not null check (price >= 0),
  original_price numeric(12, 2) not null default 0 check (original_price >= 0),
  rating numeric(2, 1) not null default 0 check (rating between 0 and 5),
  review_count int not null default 0 check (review_count >= 0),
  short_description text not null default '',
  description text not null default '',
  specifications jsonb not null default '{}'::jsonb,
  images text[] not null default '{}',
  variants jsonb,
  stock int not null default 0 check (stock >= 0),
  badges text[] not null default '{}',
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists products_category_idx on public.products (category);

-- Product reviews
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.products(id) on delete cascade,
  author text not null,
  district text not null default '',
  rating int not null check (rating between 1 and 5),
  review_date date not null default current_date,
  title text not null default '',
  body text not null default '',
  verified boolean not null default false
);
create index if not exists reviews_product_idx on public.reviews (product_id);

-- Orders placed by customers. user_id is set when the customer was logged in.
create table if not exists public.orders (
  id text primary key,
  order_number text not null unique,
  created_at timestamptz not null default now(),
  total numeric(12, 2) not null check (total >= 0),
  zone text,
  data jsonb not null,
  user_id uuid references auth.users(id) on delete set null
);
alter table public.orders add column if not exists user_id uuid references auth.users(id) on delete set null;
create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_user_idx on public.orders (user_id);

-- ---------------------------------------------------------------
-- Admin check
-- Admins are accounts whose app_metadata.role = 'admin' (set at the end of this file).
-- Customers cannot change app_metadata, so they never pass this check.
-- ---------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

-- ---------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------

alter table public.site_settings enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.reviews enable row level security;
alter table public.orders enable row level security;

drop policy if exists "settings public read" on public.site_settings;
create policy "settings public read" on public.site_settings
  for select to anon, authenticated using (true);
drop policy if exists "settings admin write" on public.site_settings;
create policy "settings admin write" on public.site_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "categories public read" on public.categories;
create policy "categories public read" on public.categories
  for select to anon, authenticated using (true);
drop policy if exists "categories admin write" on public.categories;
create policy "categories admin write" on public.categories
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "products public read" on public.products;
create policy "products public read" on public.products
  for select to anon, authenticated using (true);
drop policy if exists "products admin write" on public.products;
create policy "products admin write" on public.products
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "reviews public read" on public.reviews;
create policy "reviews public read" on public.reviews
  for select to anon, authenticated using (true);
drop policy if exists "reviews admin write" on public.reviews;
create policy "reviews admin write" on public.reviews
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "orders public insert" on public.orders;
create policy "orders public insert" on public.orders
  for insert to anon, authenticated with check (total > 0 and order_number <> '');
drop policy if exists "orders own read" on public.orders;
create policy "orders own read" on public.orders
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists "orders admin read" on public.orders;
create policy "orders admin read" on public.orders
  for select to authenticated using (public.is_admin());
drop policy if exists "orders admin update" on public.orders;
create policy "orders admin update" on public.orders
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "orders admin delete" on public.orders;
create policy "orders admin delete" on public.orders
  for delete to authenticated using (public.is_admin());

-- ---------------------------------------------------------------
-- Default settings (only inserted if the row does not exist yet)
-- ---------------------------------------------------------------

insert into public.site_settings (id, data) values (1, '{
  "storeName": "Nexora",
  "logoUrl": "",
  "phone": "",
  "whatsapp": "",
  "email": "",
  "announcement": "",
  "customerSignupEnabled": true,
  "insideDhaka": {"charge": 60, "freeAbove": 0, "estimate": "1 to 2 business days"},
  "outsideDhaka": {"charge": 120, "freeAbove": 0, "estimate": "3 to 5 business days"},
  "flashSale": {"enabled": false, "title": "Flash Sale", "subtitle": "", "endsAt": "", "productSlugs": []},
  "reviews": [
    {"name": "Nusrat Jahan", "district": "Chattogram", "rating": 5, "quote": "Ordered a laptop with a clear warranty and a proper invoice. Checkout was easy to follow."},
    {"name": "Tanvir Ahmed", "district": "Sylhet", "rating": 5, "quote": "Headphones arrived sealed and genuine. bKash payment took less than a minute."},
    {"name": "Farzana Akter", "district": "Dhaka", "rating": 4, "quote": "Same-day delivery inside Dhaka. Packaging was careful and the box was intact."},
    {"name": "Imran Hossain", "district": "Rajshahi", "rating": 5, "quote": "Outside Dhaka delivery timeline was shown before I paid. No surprises."}
  ]
}'::jsonb)
on conflict (id) do nothing;

-- ---------------------------------------------------------------
-- Seed: categories (only if empty)
-- ---------------------------------------------------------------

insert into public.categories (slug, name, description, subcategories, sort_order) values
  ('mobile', 'Mobile', 'Latest smartphones and tablets.', '{Smartphones,Tablets,Accessories}', 1),
  ('laptops', 'Laptops', 'High performance laptops and MacBooks.', '{Gaming,Business,MacBooks}', 2),
  ('tv', 'TV', 'Smart TVs and LED displays.', '{"Smart TV","LED TV","QLED TV"}', 3),
  ('audio', 'Audio', 'Headphones, speakers and soundbars.', '{Headphones,Earbuds,Speakers,Soundbars}', 4),
  ('cameras', 'Cameras', 'DSLR, mirrorless and action cameras.', '{DSLR,Mirrorless,"Action Cam"}', 5),
  ('gaming', 'Gaming', 'Consoles, controllers and games.', '{Consoles,Controllers,Games}', 6),
  ('smart-watches', 'Smart Watches', 'Apple Watch, fitness bands and smart wearables.', '{"Apple Watch",Fitness,Bands}', 7),
  ('home-appliances', 'Home Appliances', 'Fridges, ACs and microwaves for your home.', '{Fridge,AC,Microwave}', 8),
  ('computer-parts', 'Computer Parts', 'GPUs, RAM, SSDs and PC components.', '{GPU,RAM,SSD}', 9),
  ('accessories', 'Accessories', 'Cables, chargers and power banks.', '{Cables,Chargers,"Power Banks"}', 10)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------
-- Seed: products (only inserted if id is new). Edit or add rows in Table Editor later.
-- Images: Unsplash URLs. Replace with your own uploads any time.
-- ---------------------------------------------------------------

insert into public.products (id, slug, name, brand, category, subcategory, price, original_price, rating, review_count, short_description, description, specifications, images, variants, stock, badges, sort_order) values
('m-1','iphone-15-pro-max-256gb','iPhone 15 Pro Max 256GB','Apple','mobile','Smartphones',149999,159999,4.9,342,'Titanium design, A17 Pro chip, 48MP Main camera.','Forged in titanium and featuring the A17 Pro chip, a customizable Action button and a more versatile Pro camera system.','{"Display":"6.7-inch Super Retina XDR","Chip":"A17 Pro","Camera":"48MP Main","Storage":"256GB"}', array['https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=900&q=80'], '{"colors":["Natural Titanium","Blue Titanium","Black Titanium"]}', 15, '{"Best Seller","New"}', 1),
('m-2','samsung-galaxy-s24-ultra','Samsung Galaxy S24 Ultra','Samsung','mobile','Smartphones',135000,145000,4.8,210,'Galaxy AI is here. 200MP camera and S Pen included.','Galaxy S24 Ultra brings a new titanium exterior and a 6.8-inch flat display.','{"Display":"6.8-inch QHD+","Chip":"Snapdragon 8 Gen 3","Camera":"200MP Main","Storage":"256GB"}', array['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=900&q=80'], '{"colors":["Titanium Gray","Titanium Black"]}', 22, '{"Top Rated"}', 2),
('l-1','macbook-pro-14-m3-pro','MacBook Pro 14" M3 Pro','Apple','laptops','MacBooks',215000,230000,4.9,128,'M3 Pro chip, 18GB RAM, 512GB SSD.','MacBook Pro delivers massive performance and incredible battery life with the M3 Pro chip.','{"Chip":"Apple M3 Pro","Memory":"18GB","Storage":"512GB SSD","Display":"14.2-inch Liquid Retina XDR"}', array['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80'], '{"colors":["Space Black","Silver"]}', 10, '{"Best Seller"}', 3),
('l-2','asus-rog-strix-g16-gaming','ASUS ROG Strix G16 Gaming','ASUS','laptops','Gaming',165000,180000,4.7,85,'Intel Core i7, RTX 4060, 16GB RAM.','Dominate the game with the ROG Strix G16, 13th Gen Intel Core and NVIDIA GeForce RTX 40 Series graphics.','{"Processor":"Intel Core i7-13650HX","Graphics":"RTX 4060 8GB","Memory":"16GB DDR5","Storage":"1TB SSD"}', array['https://images.unsplash.com/photo-1603305722963-474df39a9ad1?auto=format&fit=crop&w=900&q=80'], null, 8, '{"New"}', 4),
('t-1','sony-bravia-55-4k-ultra-hd','Sony Bravia 55" 4K Ultra HD','Sony','tv','Smart TV',85000,95000,4.8,156,'4K HDR Processor X1, Google TV.','See real entertainment with the BRAVIA 4K HDR TV with Google TV.','{"Screen":"55-inch 4K","RefreshRate":"120Hz","OS":"Google TV","HDR":"Dolby Vision"}', array['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=900&q=80'], null, 12, '{"Top Rated"}', 5),
('t-2','samsung-65-qled-4k-smart-tv','Samsung 65" QLED 4K Smart TV','Samsung','tv','QLED TV',115000,130000,4.6,98,'100% Color Volume with Quantum Dot.','Experience brilliant color and contrast with Samsung QLED technology.','{"Screen":"65-inch 4K","Panel":"QLED","OS":"Tizen","Sound":"Object Tracking Sound"}', array['https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=900&q=80'], null, 6, '{}', 6),
('a-1','sony-wh-1000xm5-wireless','Sony WH-1000XM5 Wireless','Sony','audio','Headphones',38500,42000,4.9,450,'Industry-leading noise cancellation.','WH-1000XM5 headphones rewrite the rules for distraction-free listening.','{"Type":"Over-ear","Battery":"30 hours","Connectivity":"Bluetooth 5.2","Feature":"Active Noise Cancelling"}', array['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=900&q=80'], '{"colors":["Black","Silver"]}', 30, '{"Best Seller"}', 7),
('a-2','airpods-pro-2nd-generation','AirPods Pro (2nd Generation)','Apple','audio','Earbuds',26500,28500,4.8,380,'Active Noise Cancellation, Adaptive Audio.','AirPods Pro feature up to 2x more Active Noise Cancellation, plus Adaptive Audio.','{"Type":"In-ear","Chip":"H2","Battery":"6 hours (30 with case)","Water":"IP54"}', array['https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=900&q=80'], null, 45, '{"Top Rated"}', 8),
('c-1','sony-alpha-a7-iii-mirrorless','Sony Alpha a7 III Mirrorless','Sony','cameras','Mirrorless',185000,195000,4.9,210,'24.2MP Full-Frame Sensor, 4K Video.','An ideal full-frame mirrorless camera for photographers and videographers.','{"Sensor":"24.2MP Full-Frame","Video":"4K HDR","AF":"693 Phase Detection","Lens":"Body Only"}', array['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80'], null, 5, '{"Best Seller"}', 9),
('c-2','canon-eos-r6-mark-ii','Canon EOS R6 Mark II','Canon','cameras','Mirrorless',245000,260000,4.8,85,'24.2MP Full-Frame, 40fps continuous shooting.','High-speed performance and exceptional image quality from the EOS R6 Mark II.','{"Sensor":"24.2MP Full-Frame","Video":"4K 60p","AF":"Dual Pixel CMOS AF II","Lens":"Body Only"}', array['https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=900&q=80'], null, 4, '{}', 10)
on conflict (id) do nothing;

-- ---------------------------------------------------------------
-- Seed: sample reviews (only inserted if the table is empty)
-- ---------------------------------------------------------------

insert into public.reviews (product_id, author, district, rating, review_date, title, body, verified)
select * from (values
  ('m-1','Rafiqul Islam','Dhaka',5,date '2026-04-12','Worth every taka','Camera is excellent and it matches the photos. Delivery came within two days.',true),
  ('m-1','Sadia Rahman','Mymensingh',4,date '2026-04-15','Great phone','Battery lasts all day. Packaging was sealed and genuine.',true),
  ('a-1','Mahbub Alam','Barishal',5,date '2026-04-10','Fast and reliable','Noise cancelling is superb on buses. Ordered Friday, received Sunday.',true),
  ('l-1','Tanvir Ahmed','Sylhet',5,date '2026-04-18','Solid value','Fast, quiet and great screen. Warranty card was included.',true)
) as seed(product_id, author, district, rating, review_date, title, body, verified)
where not exists (select 1 from public.reviews);

-- ---------------------------------------------------------------
-- Logo upload bucket (public read, admin write)
-- ---------------------------------------------------------------

insert into storage.buckets (id, name, public) values ('assets', 'assets', true)
  on conflict (id) do nothing;

drop policy if exists "assets public read" on storage.objects;
create policy "assets public read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'assets');
drop policy if exists "assets admin insert" on storage.objects;
create policy "assets admin insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'assets' and public.is_admin());
drop policy if exists "assets admin update" on storage.objects;
create policy "assets admin update" on storage.objects
  for update to authenticated using (bucket_id = 'assets' and public.is_admin()) with check (bucket_id = 'assets' and public.is_admin());

-- ---------------------------------------------------------------
-- v2: order workflow, courier, WhatsApp, pixel, favicon
-- ---------------------------------------------------------------

-- Existing orders become "confirmed" (they predate the gate). New rows default to pending.
alter table public.orders add column if not exists status text;
update public.orders set status = 'confirmed' where status is null;
alter table public.orders alter column status set default 'pending';
alter table public.orders alter column status set not null;
alter table public.orders add column if not exists customer_phone text;
alter table public.orders add column if not exists consignment_id text;
alter table public.orders add column if not exists tracking_code text;
alter table public.orders add column if not exists courier_status text;
alter table public.orders add column if not exists updated_at timestamptz not null default now();
create index if not exists orders_phone_status_idx on public.orders (customer_phone, status);

-- Orders are now written only by the server (/api/orders) using the service role,
-- so the gate (one pending order per phone) cannot be bypassed from the browser.
drop policy if exists "orders public insert" on public.orders;

-- Pixel + favicon live in site_settings (public, non-secret values)
update public.site_settings
  set data = '{"faviconUrl": "", "facebookPixelId": "", "facebookPixelEnabled": false, "whatsapp": ""}'::jsonb || data
  where id = 1;

-- ---------------------------------------------------------------
-- STEP AFTER CREATING YOUR ADMIN USER (run once, replace the email)
-- Create the admin in Authentication > Users first, then run:
--
-- update auth.users
--   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
--   where email = 'you@example.com';
-- ---------------------------------------------------------------
