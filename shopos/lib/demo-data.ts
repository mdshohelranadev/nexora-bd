// lib/demo-data.ts

import type {
  Product,
  Customer,
  Supplier,
  Order,
  Sale,
  Purchase,
  Expense,
  StockMovement,
  Category,
  Brand,
  Unit,
  ExpenseCategory,
  LedgerEntry,
} from './types';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const daysAgo = (n: number, hour = 10) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, Math.floor(Math.random() * 60), 0, 0);
  return d.toISOString();
};

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const phoneBD = (i: number) => {
  const prefix = ['171', '181', '191', '151', '161'][i % 5];
  const rest = String(1000000 + i * 137).slice(-7);
  return `+880 ${prefix}-${rest.slice(0, 3)}${rest.slice(3)}`;
};

const emailFor = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.|\.$/g, '') + '@example.com';

/* ------------------------------------------------------------------ */
/* Categories / Brands / Units                                         */
/* ------------------------------------------------------------------ */

export const demoCategories: Category[] = [
  { id: 'cat-power', name: 'Power Tools', description: 'Drills, grinders, saws and more', createdAt: daysAgo(180) },
  { id: 'cat-hand', name: 'Hand Tools', description: 'Hammers, wrenches, screwdrivers', createdAt: daysAgo(180) },
  { id: 'cat-access', name: 'Accessories', description: 'Bits, blades, discs and consumables', createdAt: daysAgo(180) },
  { id: 'cat-safety', name: 'Safety', description: 'Helmets, gloves, goggles and vests', createdAt: daysAgo(180) },
  { id: 'cat-measure', name: 'Measuring', description: 'Tapes, levels, calipers and meters', createdAt: daysAgo(180) },
];

export const demoBrands: Brand[] = [
  { id: 'brand-bosch', name: 'Bosch', description: 'German engineering power tools', createdAt: daysAgo(180) },
  { id: 'brand-makita', name: 'Makita', description: 'Japanese professional tools', createdAt: daysAgo(180) },
  { id: 'brand-dewalt', name: 'DeWalt', description: 'American tough tools', createdAt: daysAgo(180) },
  { id: 'brand-stanley', name: 'Stanley', description: 'Classic hand tools', createdAt: daysAgo(180) },
  { id: 'brand-taparia', name: 'Taparia', description: 'Indian hand tools', createdAt: daysAgo(180) },
  { id: 'brand-bd', name: 'Black+Decker', description: 'Everyday power tools', createdAt: daysAgo(180) },
  { id: 'brand-generic', name: 'Generic', description: 'Value-for-money tools', createdAt: daysAgo(180) },
];

export const demoUnits: Unit[] = [
  { id: 'unit-pc', name: 'Piece', shortName: 'pc', createdAt: daysAgo(180) },
  { id: 'unit-box', name: 'Box', shortName: 'box', createdAt: daysAgo(180) },
  { id: 'unit-set', name: 'Set', shortName: 'set', createdAt: daysAgo(180) },
  { id: 'unit-kg', name: 'Kilogram', shortName: 'kg', createdAt: daysAgo(180) },
  { id: 'unit-m', name: 'Meter', shortName: 'm', createdAt: daysAgo(180) },
  { id: 'unit-pkt', name: 'Packet', shortName: 'pkt', createdAt: daysAgo(180) },
];

/* ------------------------------------------------------------------ */
/* Products (55 items)                                                 */
/* ------------------------------------------------------------------ */

type Seed = [string, string, string, number, number, string];

// [name, category, brand, purchasePrice, sellingPrice, unitShort]
const productSeeds: Seed[] = [
  ['Bosch Impact Drill 500W', 'Power Tools', 'Bosch', 7200, 8500, 'pc'],
  ['Bosch Rotary Hammer 800W', 'Power Tools', 'Bosch', 14500, 17500, 'pc'],
  ['Bosch Angle Grinder 4 inch', 'Power Tools', 'Bosch', 5400, 6500, 'pc'],
  ['Bosch Jigsaw 550W', 'Power Tools', 'Bosch', 8200, 9800, 'pc'],
  ['Bosch Circular Saw 1400W', 'Power Tools', 'Bosch', 12800, 15200, 'pc'],
  ['Makita Angle Grinder 720W', 'Power Tools', 'Makita', 5200, 6200, 'pc'],
  ['Makita Cordless Drill 18V', 'Power Tools', 'Makita', 18500, 22000, 'pc'],
  ['Makita Sander 300W', 'Power Tools', 'Makita', 6800, 8200, 'pc'],
  ['Makita Heat Gun 1800W', 'Power Tools', 'Makita', 8900, 10800, 'pc'],
  ['DeWalt Circular Saw 1800W', 'Power Tools', 'DeWalt', 10200, 12000, 'pc'],
  ['DeWalt Reciprocating Saw', 'Power Tools', 'DeWalt', 13500, 16000, 'pc'],
  ['DeWalt Impact Driver 20V', 'Power Tools', 'DeWalt', 16800, 19900, 'pc'],
  ['DeWalt Air Compressor 2HP', 'Power Tools', 'DeWalt', 19500, 22000, 'pc'],
  ['Black+Decker Drill 550W', 'Power Tools', 'Black+Decker', 5800, 6900, 'pc'],
  ['Black+Decker Blower 600W', 'Power Tools', 'Black+Decker', 4400, 5400, 'pc'],
  ['Welding Machine Inverter 200A', 'Power Tools', 'Generic', 12500, 15000, 'pc'],
  ['Air Compressor 3HP Portable', 'Power Tools', 'Generic', 18000, 22000, 'pc'],
  ['Bench Grinder 6 inch', 'Power Tools', 'Generic', 6200, 7500, 'pc'],

  ['Stanley Claw Hammer 16oz', 'Hand Tools', 'Stanley', 720, 850, 'pc'],
  ['Stanley Screwdriver Set 6pc', 'Hand Tools', 'Stanley', 620, 750, 'set'],
  ['Stanley Adjustable Wrench 10 inch', 'Hand Tools', 'Stanley', 850, 1050, 'pc'],
  ['Stanley Pliers Set 3pc', 'Hand Tools', 'Stanley', 780, 950, 'set'],
  ['Stanley Utility Knife', 'Hand Tools', 'Stanley', 280, 380, 'pc'],
  ['Taparia Wrench Set 12pc', 'Hand Tools', 'Taparia', 1050, 1200, 'set'],
  ['Taparia Combination Plier 8 inch', 'Hand Tools', 'Taparia', 480, 620, 'pc'],
  ['Taparia Screwdriver Set 8pc', 'Hand Tools', 'Taparia', 620, 780, 'set'],
  ['Taparia Hex Key Set 9pc', 'Hand Tools', 'Taparia', 380, 520, 'set'],
  ['Stanley Chisel Set 4pc', 'Hand Tools', 'Stanley', 890, 1150, 'set'],
  ['Stanley Hacksaw 12 inch', 'Hand Tools', 'Stanley', 380, 520, 'pc'],
  ['Stanley Tape Measure 5m', 'Hand Tools', 'Stanley', 320, 450, 'pc'],

  ['Bosch Drill Bit Set 15pc', 'Accessories', 'Bosch', 850, 1100, 'set'],
  ['Bosch Grinding Disc 4 inch (10pc)', 'Accessories', 'Bosch', 950, 1250, 'pkt'],
  ['Makita Cutting Disc 4 inch (10pc)', 'Accessories', 'Makita', 780, 1050, 'pkt'],
  ['DeWalt Saw Blade 7 inch', 'Accessories', 'DeWalt', 620, 850, 'pc'],
  ['Bit Set 50pc Screwdriver', 'Accessories', 'Generic', 380, 450, 'set'],
  ['Drill Chuck Key 13mm', 'Accessories', 'Generic', 180, 280, 'pc'],
  ['Welding Rod 3.2mm (5kg)', 'Accessories', 'Generic', 950, 1250, 'box'],
  ['Grinding Wheel 7 inch', 'Accessories', 'Generic', 280, 420, 'pc'],
  ['Sandpaper Sheet (50pc)', 'Accessories', 'Generic', 220, 320, 'pkt'],

  ['Safety Helmet Yellow', 'Safety', 'Generic', 380, 450, 'pc'],
  ['Safety Helmet White', 'Safety', 'Generic', 380, 450, 'pc'],
  ['Work Gloves Leather', 'Safety', 'Generic', 150, 180, 'pc'],
  ['Safety Goggles Clear', 'Safety', 'Generic', 220, 320, 'pc'],
  ['Ear Protection Muff', 'Safety', 'Generic', 480, 650, 'pc'],
  ['Safety Vest Reflective', 'Safety', 'Generic', 280, 420, 'pc'],
  ['Safety Shoes Steel Toe', 'Safety', 'Generic', 1450, 1850, 'pc'],
  ['Dust Mask N95 (10pc)', 'Safety', 'Generic', 180, 250, 'pkt'],
  ['First Aid Kit Small', 'Safety', 'Generic', 850, 1200, 'set'],

  ['Measuring Tape 5m Stanley', 'Measuring', 'Stanley', 320, 450, 'pc'],
  ['Measuring Tape 10m Stanley', 'Measuring', 'Stanley', 620, 780, 'pc'],
  ['Spirit Level 24 inch', 'Measuring', 'Generic', 780, 1050, 'pc'],
  ['Digital Vernier Caliper', 'Measuring', 'Generic', 1250, 1650, 'pc'],
  ['Laser Distance Meter 40m', 'Measuring', 'Generic', 4200, 5400, 'pc'],
  ['Infrared Thermometer', 'Measuring', 'Generic', 1850, 2400, 'pc'],
  ['Angle Finder Digital', 'Measuring', 'Generic', 950, 1250, 'pc'],
];

const makeBarcode = (i: number) => {
  // EAN-13-ish: 13 digits. Prefix 890 (Bangladesh)
  const base = '890' + String(100000000 + i).slice(-10);
  return base.slice(0, 13);
};

export const demoProducts: Product[] = productSeeds.map((seed, i) => {
  const [name, category, brand, purchasePrice, sellingPrice, unitShort] = seed;
  const minStock = randomInt(5, 15);
  // Make some low-stock / out-of-stock for demo
  let stock: number;
  if (i % 17 === 0) stock = 0;
  else if (i % 11 === 0) stock = randomInt(1, minStock);
  else stock = randomInt(minStock + 5, minStock + 60);

  const sku = `SKU-${String(i + 1).padStart(4, '0')}`;
  return {
    id: `prod-${String(i + 1).padStart(3, '0')}`,
    name,
    sku,
    barcode: makeBarcode(i + 1),
    category,
    brand,
    unit: unitShort,
    purchasePrice,
    sellingPrice,
    stock,
    minStock,
    grade: i % 5 === 0 ? 'A' : i % 3 === 0 ? 'B' : 'C',
    description: `${name} — professional grade tool suitable for construction and DIY use.`,
    status: 'active' as const,
    createdAt: daysAgo(180 - i),
  };
});

/* ------------------------------------------------------------------ */
/* Customers (22)                                                      */
/* ------------------------------------------------------------------ */

const customerNames = [
  'Karim Traders',
  'Rahim Construction',
  'Jamal Enterprise',
  'Hossain Builders',
  'Sultan Hardware',
  'Mayer Doa Traders',
  'Bangladesh Steel Works',
  'Rupganj Construction',
  'Dhaka Builders Ltd',
  'Chittagong Hardware',
  'Khulna Tools Center',
  'Rajshahi Engineering',
  'Sylhet Builders Hub',
  'Narayanganj Traders',
  'Gazipur Hardware Mart',
  'Savar Construction Co',
  'Mirpur Tools & Supply',
  'Uttara Building Materials',
  'Bashundhara Hardware',
  'Dhanmondi Enterprises',
  'Mohammad Ali & Sons',
  'Akbar Traders BD',
];

const cities = ['Dhaka', 'Chittagong', 'Khulna', 'Rajshahi', 'Sylhet', 'Narayanganj', 'Gazipur', 'Savar'];

export const demoCustomers: Customer[] = customerNames.map((name, i) => {
  const totalPurchase = randomInt(20000, 400000);
  const paid = totalPurchase - randomInt(0, 60000);
  const due = Math.max(0, totalPurchase - paid);
  return {
    id: `cust-${String(i + 1).padStart(3, '0')}`,
    name,
    phone: phoneBD(i),
    email: emailFor(name),
    address: `${randomInt(1, 200)}, ${pick(['Mirpur', 'Uttara', 'Dhanmondi', 'Gulshan', 'Banani', 'Motijheel', 'Agrabad', 'Sonadanga'])} ${pick(['Road', 'Avenue', 'Lane'])}, ${pick(cities)}`,
    due,
    paid,
    totalPurchase,
    createdAt: daysAgo(150 - i * 5),
  };
});

/* ------------------------------------------------------------------ */
/* Suppliers (12)                                                      */
/* ------------------------------------------------------------------ */

const supplierNames = [
  'Bosch Bangladesh',
  'Makita BD',
  'DeWalt Trading',
  'Stanley BD',
  'Taparia Imports',
  'Black+Decker BD',
  'Dhaka Tools Wholesale',
  'Chittagong Tool House',
  'BD Hardware Importers',
  'Power Tool Distributors',
  'National Hardware Supply',
  'Metro Tools & Machinery',
];

export const demoSuppliers: Supplier[] = supplierNames.map((name, i) => {
  const totalPurchase = randomInt(80000, 800000);
  const paid = totalPurchase - randomInt(0, 120000);
  const due = Math.max(0, totalPurchase - paid);
  return {
    id: `sup-${String(i + 1).padStart(3, '0')}`,
    name,
    contactPerson: pick(['Mr. Rahman', 'Mr. Karim', 'Ms. Sultana', 'Mr. Hossain', 'Mr. Alam']),
    phone: phoneBD(i + 40),
    email: emailFor(name),
    address: `${randomInt(1, 100)}, Industrial Area, ${pick(cities)}`,
    due,
    paid,
    totalPurchase,
    createdAt: daysAgo(200 - i * 10),
  };
});

/* ------------------------------------------------------------------ */
/* Orders (30)                                                         */
/* ------------------------------------------------------------------ */

const orderStatuses = ['pending', 'processing', 'shipped', 'delivered'] as const;
const orderCounts = { pending: 5, processing: 8, shipped: 7, delivered: 10 };

export const demoOrders: Order[] = (() => {
  const out: Order[] = [];
  let idx = 1;
  for (const status of orderStatuses) {
    for (let k = 0; k < orderCounts[status]; k++) {
      const cust = demoCustomers[(idx - 1) % demoCustomers.length];
      const itemCount = randomInt(1, 4);
      const items = Array.from({ length: itemCount }).map(() => {
        const p = pick(demoProducts);
        const qty = randomInt(1, 3);
        return {
          productId: p.id,
          name: p.name,
          sku: p.sku,
          price: p.sellingPrice,
          qty,
          subtotal: p.sellingPrice * qty,
        };
      });
      const subtotal = items.reduce((s, it) => s + it.subtotal, 0);
      const delivery = pick([60, 80, 100, 120]);
      const total = subtotal + delivery;
      out.push({
        id: `order-${String(idx).padStart(3, '0')}`,
        orderNo: `ORD-${String(1000 + idx)}`,
        customerName: cust.name,
        customerPhone: cust.phone,
        customerEmail: cust.email,
        items,
        subtotal,
        delivery,
        total,
        status,
        deliveryAddress: cust.address || 'Dhaka',
        paymentMethod: pick(['cash', 'bkash', 'nagad', 'card']),
        date: daysAgo(randomInt(1, 45), randomInt(9, 20)),
      });
      idx++;
    }
  }
  return out.sort((a, b) => (a.date < b.date ? 1 : -1));
})();

/* ------------------------------------------------------------------ */
/* Sales (52)                                                          */
/* ------------------------------------------------------------------ */

const cashiers = ['cashier@shop.com', 'manager@shop.com', 'admin@shop.com'];

export const demoSales: Sale[] = (() => {
  const out: Sale[] = [];
  for (let i = 0; i < 52; i++) {
    const isWalkIn = i % 3 === 0;
    const cust = isWalkIn ? null : demoCustomers[i % demoCustomers.length];
    const itemCount = randomInt(1, 5);
    const items = Array.from({ length: itemCount }).map(() => {
      const p = pick(demoProducts);
      const qty = randomInt(1, 4);
      const discount = i % 5 === 0 ? randomInt(0, 50) : 0;
      return {
        productId: p.id,
        name: p.name,
        sku: p.sku,
        price: p.sellingPrice,
        purchasePrice: p.purchasePrice,
        qty,
        discount,
        subtotal: p.sellingPrice * qty - discount,
      };
    });
    const subtotal = items.reduce((s, it) => s + it.subtotal, 0);
    const discount = i % 7 === 0 ? randomInt(50, 300) : 0;
    const tax = Math.round((subtotal - discount) * 0.05);
    const total = subtotal - discount + tax;
    const due = i % 6 === 0 ? randomInt(0, Math.floor(total * 0.5)) : 0;
    const paid = total - due;
    out.push({
      id: `sale-${String(i + 1).padStart(3, '0')}`,
      invoiceNo: `INV-${String(5000 + i + 1)}`,
      customerId: cust?.id ?? null,
      customerName: cust?.name ?? 'Walk-in Customer',
      items,
      subtotal,
      discount,
      tax,
      total,
      paid,
      due,
      paymentMethod: due > 0 ? 'due' : pick(['cash', 'bkash', 'nagad', 'card']),
      cashier: pick(cashiers),
      date: daysAgo(randomInt(0, 60), randomInt(9, 20)),
      status: 'completed',
    });
  }
  return out.sort((a, b) => (a.date < b.date ? 1 : -1));
})();

/* ------------------------------------------------------------------ */
/* Purchases (30)                                                      */
/* ------------------------------------------------------------------ */

export const demoPurchases: Purchase[] = (() => {
  const out: Purchase[] = [];
  for (let i = 0; i < 30; i++) {
    const sup = demoSuppliers[i % demoSuppliers.length];
    const itemCount = randomInt(2, 6);
    const items = Array.from({ length: itemCount }).map(() => {
      const p = pick(demoProducts);
      const qty = randomInt(3, 20);
      return {
        productId: p.id,
        name: p.name,
        sku: p.sku,
        purchasePrice: p.purchasePrice,
        qty,
        subtotal: p.purchasePrice * qty,
      };
    });
    const subtotal = items.reduce((s, it) => s + it.subtotal, 0);
    const discount = i % 4 === 0 ? randomInt(100, 800) : 0;
    const tax = Math.round((subtotal - discount) * 0.05);
    const total = subtotal - discount + tax;
    const due = i % 3 === 0 ? randomInt(0, Math.floor(total * 0.4)) : 0;
    const paid = total - due;
    out.push({
      id: `pur-${String(i + 1).padStart(3, '0')}`,
      purchaseNo: `PUR-${String(3000 + i + 1)}`,
      supplierId: sup.id,
      supplierName: sup.name,
      items,
      subtotal,
      discount,
      tax,
      total,
      paid,
      due,
      date: daysAgo(randomInt(1, 90), randomInt(9, 18)),
      status: 'received',
    });
  }
  return out.sort((a, b) => (a.date < b.date ? 1 : -1));
})();

/* ------------------------------------------------------------------ */
/* Expense categories + Expenses (25)                                  */
/* ------------------------------------------------------------------ */

export const demoExpenseCategories: ExpenseCategory[] = [
  { id: 'exp-rent', name: 'Rent', description: 'Shop rent', createdAt: daysAgo(180) },
  { id: 'exp-salary', name: 'Salary', description: 'Staff salaries', createdAt: daysAgo(180) },
  { id: 'exp-util', name: 'Utility', description: 'Electricity, water, internet', createdAt: daysAgo(180) },
  { id: 'exp-trans', name: 'Transport', description: 'Delivery & transport', createdAt: daysAgo(180) },
  { id: 'exp-misc', name: 'Misc', description: 'Miscellaneous', createdAt: daysAgo(180) },
];

export const demoExpenses: Expense[] = Array.from({ length: 25 }).map((_, i) => {
  const cat = demoExpenseCategories[i % demoExpenseCategories.length];
  return {
    id: `exp-${String(i + 1).padStart(3, '0')}`,
    categoryId: cat.id,
    categoryName: cat.name,
    amount: randomInt(5000, 50000),
    note: `${cat.name} expense #${i + 1}`,
    date: daysAgo(randomInt(1, 60), randomInt(9, 18)),
    createdBy: 'admin@shop.com',
  };
});

/* ------------------------------------------------------------------ */
/* Stock movements (derived from sales / purchases + a few adjustments) */
/* ------------------------------------------------------------------ */

export const demoStockMovements: StockMovement[] = (() => {
  const out: StockMovement[] = [];

  // Sales → negative movements
  demoSales.forEach((sale) => {
    sale.items.forEach((it, j) => {
      const p = demoProducts.find((p) => p.id === it.productId);
      if (!p) return;
      out.push({
        id: `mv-sale-${sale.id}-${j}`,
        productId: p.id,
        productName: p.name,
        type: 'sale',
        qty: -it.qty,
        before: p.stock + it.qty,
        after: p.stock,
        reference: sale.invoiceNo,
        user: sale.cashier,
        date: sale.date,
      });
    });
  });

  // Purchases → positive movements
  demoPurchases.forEach((pur) => {
    pur.items.forEach((it, j) => {
      const p = demoProducts.find((p) => p.id === it.productId);
      if (!p) return;
      out.push({
        id: `mv-pur-${pur.id}-${j}`,
        productId: p.id,
        productName: p.name,
        type: 'purchase',
        qty: it.qty,
        before: Math.max(0, p.stock - it.qty),
        after: p.stock,
        reference: pur.purchaseNo,
        user: 'admin@shop.com',
        date: pur.date,
      });
    });
  });

  // A few manual adjustments
  for (let i = 0; i < 15; i++) {
    const p = pick(demoProducts);
    const qty = pick([-3, -2, -1, 1, 2, 3, 5]);
    out.push({
      id: `mv-adj-${i + 1}`,
      productId: p.id,
      productName: p.name,
      type: 'adjustment',
      qty,
      before: p.stock,
      after: p.stock + qty,
      reference: `ADJ-${String(100 + i)}`,
      note: qty < 0 ? 'Damaged in transit' : 'Found in stock count',
      user: 'admin@shop.com',
      date: daysAgo(randomInt(1, 90), randomInt(9, 18)),
    });
  }

  return out.sort((a, b) => (a.date < b.date ? 1 : -1));
})();

/* ------------------------------------------------------------------ */
/* Customer / Supplier ledgers                                         */
/* ------------------------------------------------------------------ */

export const demoLedger: LedgerEntry[] = (() => {
  const out: LedgerEntry[] = [];

  demoCustomers.forEach((c) => {
    const entries = randomInt(2, 6);
    let balance = 0;
    for (let i = 0; i < entries; i++) {
      const isSale = i % 2 === 0;
      const amount = isSale ? randomInt(2000, 30000) : randomInt(1000, 15000);
      const paid = isSale ? (i % 3 === 0 ? 0 : amount) : 0;
      balance += amount - paid;
      out.push({
        id: `led-c-${c.id}-${i}`,
        partnerId: c.id,
        partnerType: 'customer',
        type: isSale ? 'sale' : 'payment',
        reference: isSale ? `INV-${randomInt(5000, 5200)}` : `PAY-${randomInt(200, 300)}`,
        amount,
        paid,
        balance: Math.max(0, balance),
        date: daysAgo(randomInt(1, 90), randomInt(10, 18)),
      });
    }
  });

  demoSuppliers.forEach((s) => {
    const entries = randomInt(2, 5);
    let balance = 0;
    for (let i = 0; i < entries; i++) {
      const isPurchase = i % 2 === 0;
      const amount = isPurchase ? randomInt(10000, 80000) : randomInt(5000, 40000);
      const paid = isPurchase ? (i % 3 === 0 ? 0 : amount) : 0;
      balance += amount - paid;
      out.push({
        id: `led-s-${s.id}-${i}`,
        partnerId: s.id,
        partnerType: 'supplier',
        type: isPurchase ? 'purchase' : 'payment',
        reference: isPurchase ? `PUR-${randomInt(3000, 3050)}` : `PAY-${randomInt(400, 500)}`,
        amount,
        paid,
        balance: Math.max(0, balance),
        date: daysAgo(randomInt(1, 120), randomInt(10, 18)),
      });
    }
  });

  return out.sort((a, b) => (a.date < b.date ? 1 : -1));
})();

/* ------------------------------------------------------------------ */
/* Aggregate helper (used by dashboard)                                */
/* ------------------------------------------------------------------ */

export function computeDemoStats() {
  const totalSales = demoSales.reduce((s, x) => s + x.total, 0);
  const totalPurchase = demoPurchases.reduce((s, x) => s + x.total, 0);
  const profit = demoSales.reduce((s, sale) => {
    const cost = sale.items.reduce((cs, it) => cs + it.purchasePrice * it.qty, 0);
    return s + (sale.subtotal - sale.discount - cost);
  }, 0);
  const customerDue = demoCustomers.reduce((s, c) => s + c.due, 0);
  const supplierDue = demoSuppliers.reduce((s, c) => s + c.due, 0);
  const stockValue = demoProducts.reduce((s, p) => s + p.stock * p.purchasePrice, 0);
  const lowStockCount = demoProducts.filter((p) => p.stock > 0 && p.stock <= p.minStock).length;
  const outOfStockCount = demoProducts.filter((p) => p.stock <= 0).length;
  return {
    totalSales,
    totalPurchase,
    profit,
    totalDue: customerDue,
    customerDue,
    supplierDue,
    stockValue,
    lowStockCount,
    outOfStockCount,
    totalProducts: demoProducts.length,
  };
}