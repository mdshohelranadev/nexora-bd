# ShopOS — Construction Tools Shop Management System

A **complete, production-quality demo** of a Construction Tools Shop Management System built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and shadcn/ui.

**Zero backend** — all data lives in your browser's localStorage using Zustand persist. Deploy to Vercel as-is.

---

## Features

### Staff Dashboard (`/dashboard`)
Role-based dashboards for 4 roles — Admin, Manager, Cashier, Stockman — with live charts (Recharts), stat cards, low-stock alerts, recent sales/orders/movements widgets.

### Point of Sale (`/pos`)
Full-screen POS with product grid, category filters, USB barcode scanner input, cart panel, per-item & invoice-level discounts, customer selection, payment modal (Cash / bKash / Nagad / Card), held carts, keyboard shortcuts (F2 pay / F4 hold / Esc clear), auto stock deduction, and printable invoice + thermal receipt PDFs.

### Catalog
- **Products** — table + grid views, search, filter by category/brand/stock, sort, pagination, bulk actions, CSV/JSON export, Zod-validated add/edit dialogs
- **Categories / Brands / Units** — full CRUD

### Inventory (`/inventory`)
Stock overview with tabs (All / Low / Out / Healthy), Stock In / Stock Out / Adjustment forms, complete movement history with filters and CSV export.

### Barcode (`/barcode`)
- **Generate** — EAN-13 previews, bulk select, PDF label export
- **Print Labels** — A4 sheet, 3×10 grid = 30 labels per page
- **Scan** — camera-based scanning (html5-qrcode) + manual lookup

### Sales (`/sales`)
- **All Sales** — filterable list, role-aware (Cashier sees own)
- **Invoices** — grid cards with quick PDF download
- **Returns** — full or partial return, auto stock restore, due reversal
- Sale detail dialog with Invoice PDF + Receipt PDF + Print actions

### Purchase (`/purchase`)
- **All Purchases** — filterable list with stats
- **Create Purchase** — multi-product entry with auto stock increase
- **Returns** — reduce stock, reverse supplier due

### Orders (`/orders`)
Website order management with status flow (Pending → Processing → Shipped → Delivered). Auto stock deduct on delivered, restore on cancel. Tabs by status.

### Customers & Suppliers (`/customers`, `/suppliers`)
- List with due highlighting
- Detail pages with tabs: Info / Ledger / Sales-Purchases / Statement
- Receive / Make Payment dialogs
- Due list, Payment history
- Statement PDF (A4) export

### Reports (`/reports`)
Six report types with date range filter + charts + tables + CSV/PDF export:
- Sales Report
- Purchase Report
- Stock Report
- Profit & Loss
- Customer Due
- Supplier Due

### Expense (`/expense`)
List, categories CRUD, monthly reports with charts.

### Users & Permissions (`/users`)
- User management with role assignment
- Role × Permission matrix
- Permission toggles (demo)

### Settings (`/settings`)
- Business Info
- Tax & VAT
- Receipt configuration
- Backup / Restore / Reset (localStorage JSON)

### Public Website (`/`)
- Homepage with hero, trust bar, categories, featured & latest products
- Products listing with sidebar filters (category, brand, price, stock)
- Product detail with tabs (Description / Specs) + related products
- Cart page with free-delivery progress
- Checkout with customer form + payment method
- Order history (per-browser, no login required)
- Customer register placeholder

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14.2 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 3.4 + shadcn/ui |
| State | Zustand + persist middleware |
| Auth | NextAuth v5 (Credentials, JWT) |
| Forms | react-hook-form + Zod |
| Tables | @tanstack/react-table |
| Charts | Recharts |
| PDFs | @react-pdf/renderer |
| Barcode | react-barcode (EAN-13) |
| Scanner | html5-qrcode |
| Icons | lucide-react |
| Animations | framer-motion |
| Toasts | sonner |
| Dates | date-fns |

---

## Demo Credentials

Login at `/login` — **password for all accounts is `1234`**

| Role | Email | Access |
|---|---|---|
| Admin | `admin@shop.com` | Full system (14 menus) |
| Manager | `manager@shop.com` | Operations + catalog + partners + reports (12 menus) |
| Cashier | `cashier@shop.com` | POS, own sales, customers (4 menus) |
| Stockman | `stock@shop.com` | Purchase, products, inventory, barcode, suppliers (6 menus) |

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
Copy `.env.example` to `.env.local` and fill in:
```bash
cp .env.example .env.local
```

Minimum required:
```
NEXTAUTH_SECRET=your-random-secret-here
NEXTAUTH_URL=http://localhost:3000
```

### 3. Run dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Build for production
```bash
npm run build
npm run start
```

---

## Folder Structure

```
app/
├── (auth)/login/                # Staff login
├── (dashboard)/                 # Admin panel (protected)
│   ├── dashboard/               # Role-based dashboards
│   ├── pos/                     # Point of Sale
│   ├── sales/                   # Sales + invoices + returns
│   ├── purchase/                # Purchases + create + returns
│   ├── orders/                  # Website order management
│   ├── products/                # Products + categories + brands + units
│   ├── inventory/               # Stock in/out/adjust/movements
│   ├── barcode/                 # Generate / print / scan
│   ├── customers/               # Customers + detail + due + payments
│   ├── suppliers/               # Suppliers + detail + due + payments
│   ├── reports/                 # 6 report types
│   ├── expense/                 # Expenses + categories + reports
│   ├── users/                   # Users + roles + permissions
│   └── settings/                # Business / tax / receipt / backup
├── (website)/                   # Public storefront
│   ├── page.tsx                 # Homepage
│   ├── products/                # Listing
│   ├── product/[id]/            # Detail
│   ├── cart/                    # Cart
│   ├── checkout/                # Checkout
│   └── orders/                  # Order history
├── api/auth/[...nextauth]/      # NextAuth
├── layout.tsx
├── error.tsx
└── not-found.tsx
components/
├── ui/                          # shadcn primitives
├── auth/                        # Login form, role badge, permission gate
├── dashboard/                   # Charts + widgets + role dashboards
├── pos/                         # Product grid, cart, payment, barcode
├── products/                    # Product form, table, grid view
├── inventory/                   # Stock form
├── barcode/                     # Barcode preview
├── sales/                       # Sale detail dialog
├── purchase/                    # Purchase detail dialog
├── orders/                      # Order detail + columns
├── customers/                   # Customer form + payment dialog
├── suppliers/                   # Supplier form + payment dialog
├── expense/                     # Expense form dialog
├── users/                       # User form dialog
├── pdf/                         # Invoice, receipt, statement, labels, reports
├── website/                     # Navbar, footer, product card, cart drawer
├── catalog/                     # Generic catalog page
├── reports/                     # Date range picker + report shell
├── shared/                      # DataTable, EmptyState, ConfirmDialog, etc.
└── layout/                      # Sidebar, topbar, mobile nav, theme toggle
lib/
├── types.ts                     # All TypeScript interfaces
├── constants.ts                 # App constants
├── format.ts                    # Currency / date / number formatting
├── utils.ts                     # cn() + helpers
├── export.ts                    # CSV / JSON export
├── permissions.ts               # can / canAny / canAll
├── roles.ts                     # Role descriptions + menus
├── mock-users.ts                # Demo users (bcrypt hashed)
├── demo-data.ts                 # 55 products, 22 customers, 12 suppliers, etc.
├── auth.ts                      # NextAuth config
├── nav-config.ts                # Sidebar structure
├── store/                       # 11 Zustand stores
├── hooks/                       # Custom hooks
└── ...
middleware.ts                    # Route protection + role gating
```

---

## Data & Persistence

All data is stored in **browser localStorage** with these keys:

| Key | Contents |
|---|---|
| `shopos-products` | Products, categories, brands, units |
| `shopos-customers` | Customers |
| `shopos-suppliers` | Suppliers |
| `shopos-stock` | Stock movements |
| `shopos-sales` | Sales + returns |
| `shopos-purchases` | Purchases + returns |
| `shopos-orders` | Website orders |
| `shopos-expenses` | Expenses + categories |
| `shopos-cart` | POS cart |
| `shopos-web-cart` | Website cart |
| `shopos-settings` | Business / tax / receipt config |
| `shopos-users` | User accounts |
| `shopos-web-my-orders` | Customer order history |

### Reset to demo data
**Settings → Backup → Reset All Data**

### Export / Import
Same page — download JSON snapshot, restore anytime.

---

## Deployment (Vercel)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/shopos.git
git push -u origin main
```

### 2. Import to Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo
3. Framework preset → **Next.js** (auto-detected)
4. Add environment variables (see below)
5. Click **Deploy**

### 3. Environment variables
| Key | Value |
|---|---|
| `NEXTAUTH_SECRET` | Any random string (e.g. `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | Your Vercel URL (e.g. `https://shopos.vercel.app`) |

That's it. No database, no backend service.

---

## Notes & Limitations

This is a **demo** built without a backend. Some intentional simplifications:

- **User accounts created via UI** cannot login (login uses static `mock-users.ts`)
- **Password hashing** uses bcrypt client-side (demo only)
- **Multi-device sync** — data is per-browser, not shared
- **Payment gateways** (bKash/Nagad/Card) are UI-only, no real integration
- **Camera scanning** requires HTTPS (works on Vercel, localhost)
- **Images** — products use placeholder initials instead of real photos

For a production version, replace Zustand stores with API calls + a real database (PostgreSQL + Prisma recommended).

---

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## License

Demo project — free to use, modify, and learn from.

---

**Built with Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui**