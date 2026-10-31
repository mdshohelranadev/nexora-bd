# Nexora

Electronics e-commerce for Bangladesh. Next.js 14 (App Router), Tailwind CSS, Framer Motion, Supabase (DB, auth, storage). Deploys to Vercel. UI language: English.

## Features

**Storefront**
- Pink brand, mobile bottom nav with cart badge, animated WhatsApp float (number from admin).
- Home sections (hero, categories, flash sale, featured, best sellers, new arrivals, newsletter, footer).
- Categories and products come from the database. Nothing product-related is hardcoded.
- Search, filters, product pages with reviews and related items.
- Cart, wishlist, checkout (Cash on Delivery only), order confirmation.
- Order tracking page (`/track`): order number + mobile number, shows status and courier status.
- Order gate: a customer with an order still "pending" cannot place another. They see a clear message and a WhatsApp button.
- Facebook Meta Pixel (admin controlled): PageView, ViewContent, InitiateCheckout, Purchase.
- Favicon set from admin.

**Admin (`/admin`, responsive for mobile and desktop)**
- Login with show/hide password.
- Products: add, edit, upload images, hide/show, delete. Dynamic category choice.
- Categories: create, edit, delete (blocked while products use it).
- Orders: list with status badges. Order detail page to edit customer/delivery info, change status, and send to Steadfast in one click.
- Every status change sends the customer a WhatsApp message.
- Settings: store name, logo, favicon, phone, WhatsApp number, delivery charges, flash sale, testimonials, Facebook Pixel ID and on/off.
- Toasts for feedback, skeletons while loading.

## Project structure

```
nexora/
├── README.md
├── .env.example                  env var template (copy to .env.local)
├── package.json
├── tailwind.config.ts            brand colours (primary = pink #D81B60)
├── supabase/
│   └── production.sql            full DB setup: tables, RLS, seed, v2 migration
└── src/
    ├── app/
    │   ├── layout.tsx            root layout, metadata, bottom nav, WhatsApp, Analytics
    │   ├── page.tsx              home
    │   ├── product/[slug]/       product page (client, reads catalog store)
    │   ├── category/[slug]/      category listing
    │   ├── categories/           all categories
    │   ├── cart/, checkout/, thank-you/, order-confirmation/, wishlist/
    │   ├── track/                customer order tracking
    │   ├── admin/
    │   │   ├── login/            admin login (password show/hide)
    │   │   ├── products/         product CRUD
    │   │   ├── categories/       category CRUD
    │   │   ├── orders/           order list
    │   │   ├── orders/[id]/      order detail: edit, status, Steadfast
    │   │   ├── settings/         brand, contact, pixel, favicon, delivery, flash sale
    │   │   └── home/             home layout, hero slides
    │   └── api/                  SERVER ROUTES (secrets stay here)
    │       ├── orders/route.ts                    POST place order (gate, price check, WhatsApp)
    │       ├── track/route.ts                     GET order status
    │       └── admin/orders/[id]/
    │           ├── status/route.ts                POST change status (+ WhatsApp)
    │           └── courier/route.ts               POST send to Steadfast (+ WhatsApp)
    ├── components/
    │   ├── layout/               header, footer, BottomNav, WhatsAppFloat, Analytics, RemoteSync
    │   ├── home/                 HeroBanner, CategoryGrid, FlashSale, HomeSections, Testimonials
    │   ├── product/              Listing, ProductGrid, ProductTabs, AddToCartPanel
    │   ├── checkout/             CheckoutFlow (calls /api/orders)
    │   └── ui/                   Button, Input, Modal, Toast, Skeleton, etc.
    ├── lib/
    │   ├── supabase.ts           browser clients (anon key only)
    │   ├── api.ts                calls to /api routes, sends user/admin token
    │   ├── pixel.ts              Meta Pixel track() helper
    │   ├── upload.ts             uploads to Supabase "assets" bucket
    │   ├── remote.ts             admin orders hook, remote helpers
    │   └── server/               SERVER ONLY
    │       ├── supabase.ts       service-role client, requireAdmin()
    │       ├── phone.ts          BD mobile validation / WhatsApp format
    │       ├── whatsapp.ts       WhatsApp Cloud API sender
    │       ├── steadfast.ts      Steadfast create_order / status
    │       └── orderStatus.ts    status list and labels
    ├── store/
    │   ├── catalogStore.ts       products, categories, reviews from Supabase
    │   ├── settingsStore.ts      site settings (synced from Supabase)
    │   ├── cartStore.ts, orderStore.ts, uiStore.ts (toasts), customerStore.ts
    ├── utils/                    catalog helpers, cart, delivery, format, slug
    ├── data/districts.ts         64 districts (geography, not product data)
    └── types/index.ts
```

## Setup (local)

Requires Node.js 18.17+.

```bash
npm install
cp .env.example .env.local      # fill in values
npm run dev                     # http://localhost:3000
```

## Supabase (one time)

1. Create a project at supabase.com.
2. SQL Editor: paste all of `supabase/production.sql`, Run. Safe to re-run.
3. Authentication > Users > Add user (your admin email + password).
4. At the bottom of the same SQL file, uncomment the admin block, put your email, Run.
5. Project Settings > API: copy Project URL, anon key, and service_role key.

## Env variables

Public (browser):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Server only (Vercel > Environment Variables, never `NEXT_PUBLIC_`):
- `SUPABASE_SERVICE_ROLE_KEY`: needed by /api routes (order gate, courier, tracking).
- `STEADFAST_API_KEY`, `STEADFAST_SECRET_KEY`, `STEADFAST_BASE_URL` (optional).
- `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_TEMPLATE_NAME`, `WHATSAPP_TEMPLATE_LANG`.

If WhatsApp or Steadfast vars are missing, the app still works. Messages are skipped and the admin sees a warning.

## WhatsApp setup (Meta)

WhatsApp Cloud API only sends business-initiated messages through approved templates.
1. Meta Business Manager > WhatsApp > create a template named `order_update` (language `en`).
2. Body with 3 variables: `{{1}}` order number, `{{2}}` status text, `{{3}}` tracking note.
3. Wait for approval, then set the env vars above.

## Steadfast setup

Get API and Secret keys from your Steadfast merchant panel and set them as env vars. Check endpoint paths against the current Steadfast API docs before going live (`src/lib/server/steadfast.ts`).

## Facebook Pixel

Admin > Settings > Marketing: enter the Pixel ID (numbers only), turn it on, save. Verify with Meta Pixel Helper (Chrome extension) before running ads. Events: PageView on every page, ViewContent on product pages, InitiateCheckout when placing an order, Purchase after the order is accepted.

## Deploy to Vercel

1. Push to GitHub. Import in Vercel (framework: Next.js, build: `npm run build`).
2. Add all env variables above.
3. Deploy. In Supabase > Authentication > URL Configuration, add the Vercel domain.

## Order flow

1. Customer places order: `/api/orders` re-prices items on the server, rejects if the phone has a pending order, saves as `pending`, sends a WhatsApp message.
2. Admin confirms (status `confirmed`). Customer is messaged. The phone can order again.
3. Admin clicks Send to Steadfast: consignment ID is saved, status becomes `shipped`, customer gets the consignment ID.
4. Each status change in admin sends a WhatsApp message.
5. Customer tracks at `/track` with order number + mobile.

## Known limits

- Not yet built and tested end to end in this environment. Run `npm run build` once and fix any errors.
- Product and category pages render on the client after the catalog loads. For SEO, convert them to server components.
- No rate limit by IP on /api/orders. Add Upstash or Vercel firewall rules before heavy traffic.
- Payment is Cash on Delivery only. No online payment gateway.
- Admin users are created manually in Supabase (no sign-up in the admin).
- Steadfast and WhatsApp endpoint details must be verified against current vendor docs.
