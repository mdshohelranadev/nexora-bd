// app/(website)/checkout/page.tsx

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  MapPin,
  Phone,
  Mail,
  User,
  CreditCard,
  Wallet,
  Smartphone,
  Banknote,
  Package,
  Truck,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { EmptyState } from '@/components/shared/empty-state';
import { useWebCart } from '@/lib/store/web-cart-store';
import { useOrderStore } from '@/lib/store/order-store';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { PaymentMethod } from '@/lib/types';

const FREE_DELIVERY_THRESHOLD = 5000;
const DELIVERY_CHARGE = 80;

const schema = z.object({
  name: z.string().min(2, 'Please enter your full name').max(80),
  phone: z.string().min(10, 'Enter a valid phone number').max(20),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  address: z.string().min(10, 'Please enter a complete delivery address').max(300),
  city: z.string().min(2, 'City is required').max(60),
  notes: z.string().max(300).optional(),
});

type FormValues = z.infer<typeof schema>;

const PAYMENT_OPTIONS: {
  value: PaymentMethod;
  label: string;
  description: string;
  icon: any;
}[] = [
  {
    value: 'cash',
    label: 'Cash on Delivery',
    description: 'Pay when your order arrives',
    icon: Banknote,
  },
  {
    value: 'bkash',
    label: 'bKash',
    description: 'Mobile wallet payment',
    icon: Smartphone,
  },
  {
    value: 'nagad',
    label: 'Nagad',
    description: 'Mobile wallet payment',
    icon: Smartphone,
  },
  {
    value: 'card',
    label: 'Card',
    description: 'Credit or debit card',
    icon: CreditCard,
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useWebCart();
  const placeOrder = useOrderStore((s) => s.placeOrder);

  // Reactive derived values (avoid stale reads from method calls)
  const items = useWebCart((s) => s.items);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [submitting, setSubmitting] = useState(false);

  const delivery =
    subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
  const total = subtotal + delivery;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      notes: '',
    },
  });

  // Redirect if cart empty (after a small delay so the empty state shows)
  useEffect(() => {
    if (items.length === 0 && !submitting) {
      // handled by empty state below
    }
  }, [items.length, submitting]);

  const onSubmit = (data: FormValues) => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setSubmitting(true);
    try {
      const order = placeOrder({
        customerName: data.name,
        customerPhone: data.phone,
        customerEmail: data.email || undefined,
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          sku: i.sku,
          price: i.price,
          qty: i.qty,
          subtotal: i.price * i.qty,
        })),
        subtotal,
        delivery,
        total,
        deliveryAddress: `${data.address}, ${data.city}`,
        paymentMethod,
        notes: data.notes || undefined,
      });

      cart.clear();
      toast.success(`Order placed · ${order.orderNo}`);
      router.push(`/my-orders?success=${order.orderNo}`);
    } catch (e) {
      toast.error('Failed to place order. Please try again.');
      setSubmitting(false);
    }
  };

  // Empty state
  if (items.length === 0) {
    return (
      <div className="container mx-auto py-10 md:py-16">
        <Card>
          <CardContent className="p-6 md:p-10">
            <EmptyState
              icon={Package}
              title="Your cart is empty"
              description="Add products before proceeding to checkout."
              action={
                <Button asChild>
                  <Link href="/shop">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Browse Products
                  </Link>
                </Button>
              }
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 md:py-8">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs -ml-2 mb-3"
          onClick={() => router.push('/cart')}
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1" />
          Back to cart
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Checkout
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground mt-1">
          Complete your order details below
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          {/* Left: form */}
          <div className="space-y-4">
            {/* Contact + Delivery */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-indigo-500" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="c-name">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="c-name"
                        placeholder="e.g. Rahim Ahmed"
                        className="pl-9"
                        {...register('name')}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-xs text-red-500">{errors.name.message}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="c-phone">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="c-phone"
                        placeholder="+880 1XXX-XXXXXX"
                        className="pl-9"
                        {...register('phone')}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-xs text-red-500">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="c-email">Email (optional)</Label>
                  <div className="relative">
                    <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="c-email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-9"
                      {...register('email')}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="c-address">Delivery Address *</Label>
                  <Textarea
                    id="c-address"
                    rows={2}
                    placeholder="House, road, area"
                    {...register('address')}
                  />
                  {errors.address && (
                    <p className="text-xs text-red-500">{errors.address.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="c-city">City *</Label>
                  <Input
                    id="c-city"
                    placeholder="e.g. Dhaka"
                    {...register('city')}
                  />
                  {errors.city && (
                    <p className="text-xs text-red-500">{errors.city.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Payment */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-indigo-500" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {PAYMENT_OPTIONS.map((p) => {
                    const selected = paymentMethod === p.value;
                    return (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => setPaymentMethod(p.value)}
                        className={cn(
                          'flex items-start gap-3 rounded-lg border p-3 text-left transition-all',
                          selected
                            ? 'border-indigo-500 bg-indigo-500/5 ring-2 ring-indigo-500/20'
                            : 'border-border hover:border-indigo-500/40 hover:bg-accent/40'
                        )}
                      >
                        <div
                          className={cn(
                            'h-9 w-9 rounded-lg flex items-center justify-center shrink-0',
                            selected
                              ? 'bg-indigo-500 text-white'
                              : 'bg-muted text-muted-foreground'
                          )}
                        >
                          <p.icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium">{p.label}</div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            {p.description}
                          </div>
                        </div>
                        {selected && (
                          <CheckCircle2 className="h-4 w-4 text-indigo-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Order notes */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Order Notes (optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  rows={3}
                  placeholder="Delivery instructions, preferred time, or any special request..."
                  {...register('notes')}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right: order summary */}
          <div className="lg:sticky lg:top-20 self-start">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">
                  Order Summary ({count} item{count === 1 ? '' : 's'})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Items list */}
                <ul className="max-h-[280px] overflow-y-auto -mx-1 px-1 space-y-2">
                  {items.map((it) => (
                    <li
                      key={it.productId}
                      className="flex items-start gap-2 text-sm"
                    >
                      <div className="h-9 w-9 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                        {it.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium leading-snug line-clamp-2">
                          {it.name}
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">
                          {formatCurrency(it.price)} × {it.qty}
                        </div>
                      </div>
                      <div className="text-xs font-semibold tabular-nums shrink-0">
                        {formatCurrency(it.price * it.qty)}
                      </div>
                    </li>
                  ))}
                </ul>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="tabular-nums font-medium">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="tabular-nums font-medium">
                      {delivery === 0 ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          FREE
                        </span>
                      ) : (
                        formatCurrency(delivery)
                      )}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-semibold">Total</span>
                  <span className="text-xl font-bold tabular-nums text-indigo-600 dark:text-indigo-400">
                    {formatCurrency(total)}
                  </span>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-11"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      Place Order · {formatCurrency(total)}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>

                <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
                  By placing this order, you agree to our terms of service and
                  refund policy.
                </p>

                <div className="pt-2 space-y-2 text-xs text-muted-foreground border-t border-border">
                  <div className="flex items-center gap-2">
                    <Truck className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                    <span>Delivery within 2-5 working days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>Quality checked before dispatch</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}