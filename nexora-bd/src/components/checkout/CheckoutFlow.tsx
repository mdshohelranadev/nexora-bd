'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import type { DeliveryZoneKey, PaymentMethod, ShippingDetails } from '@/types';
import { useHydrated } from '@/hooks/useHydrated';
import { useCartStore } from '@/store/cartStore';
import { useOrderStore } from '@/store/orderStore';
import { useUIStore } from '@/store/uiStore';
import { Button, Input, RadioCard, Select, EmptyState } from '@/components/ui';
import { CartIcon, CheckIcon, TruckIcon } from '@/components/icons';
import { districts } from '@/data/districts';
import { getCartLines, getSubtotal } from '@/utils/cart';
import { DHAKA, describeCharge, getDeliveryCharge, getDeliveryEstimate } from '@/utils/delivery';
import { useSettingsStore } from '@/store/settingsStore';
import { apiCall, customerToken } from '@/lib/api';
import { track } from '@/lib/pixel';
import { useCatalog } from '@/store/catalogStore';
import { customerInfo, useCustomerStore } from '@/store/customerStore';
import { formatBDT } from '@/utils/format';
import { createId, createOrderNumber } from '@/utils/orders';
import { validatePhone } from '@/utils/validation';
import { cn } from '@/utils/cn';

type ShippingErrors = Partial<Record<keyof ShippingDetails, string>>;

const emptyShipping: ShippingDetails = { fullName: '', phone: '', address: '', district: '', area: '', zone: '' };

const paymentOptions: { value: PaymentMethod; title: string; description: string; mark: ReactNode }[] = [
  { value: 'cod', title: 'Cash on Delivery', description: 'Pay in cash when your parcel arrives.', mark: <TruckIcon /> },
];

function validateShipping(s: ShippingDetails): ShippingErrors {
  const errors: ShippingErrors = {};
  if (s.fullName.trim().length < 3) errors.fullName = 'Enter your full name, at least 3 characters.';
  const phoneError = validatePhone(s.phone);
  if (phoneError) errors.phone = phoneError;
  if (s.address.trim().length < 10) errors.address = 'Enter your full address, at least 10 characters.';
  if (!s.district) errors.district = 'Select your district.';
  if (!s.zone) errors.zone = 'Select a delivery area.';
  if (s.area.trim().length < 2) errors.area = 'Enter your area or thana.';
  return errors;
}

export function CheckoutFlow() {
  useCatalog((s) => s.products);
  const router = useRouter();
  const hydrated = useHydrated();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clear);
  const addOrder = useOrderStore((s) => s.addOrder);
  const pushToast = useUIStore((s) => s.pushToast);
  const settings = useSettingsStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [shipping, setShipping] = useState<ShippingDetails>(emptyShipping);
  const [errors, setErrors] = useState<ShippingErrors>({});
  const [payment, setPayment] = useState<PaymentMethod>('cod');
  const [placing, setPlacing] = useState(false);
  const [gateMessage, setGateMessage] = useState<{ text: string; hint?: string } | null>(null);
  const whatsapp = useSettingsStore((s) => s.whatsapp);
  const customerSession = useCustomerStore((s) => s.session);
  useEffect(() => {
    const customer = customerInfo(customerSession);
    if (!customer) return;
    setShipping((s) => (s.fullName ? s : { ...s, fullName: customer.name, phone: s.phone || customer.phone }));
  }, [customerSession]);

  if (!hydrated || !settings.remoteLoaded) {
    return <div className="h-96 animate-pulse rounded-xl bg-line" aria-hidden="true" />;
  }

  const lines = getCartLines(items);
  if (lines.length === 0) {
    return (
      <EmptyState
        icon={<CartIcon className="h-7 w-7" />}
        title="Your cart is empty"
        description="Add a few products before you check out."
        action={<Link href="/"><Button>Browse products</Button></Link>}
      />
    );
  }

  const subtotal = getSubtotal(lines);
  const deliveryCharge = getDeliveryCharge(shipping.zone, subtotal, settings);
  const total = subtotal + deliveryCharge;

  const submitShipping = (e: FormEvent) => {
    e.preventDefault();
    const found = validateShipping(shipping);
    setErrors(found);
    const firstKey = Object.keys(found)[0] as keyof ShippingDetails | undefined;
    if (firstKey) {
      document.getElementById(`field-${firstKey}`)?.focus();
      return;
    }
    setStep(2);
  };


  const placeOrder = async () => {
    setPlacing(true);
    setGateMessage(null);
    track('InitiateCheckout', { value: total, currency: 'BDT', num_items: lines.length });
    const token = await customerToken();
    const { ok, status, data } = await apiCall('/api/orders', {
      method: 'POST',
      token,
      body: JSON.stringify({
        shipping,
        paymentMethod: payment,
        items: lines.map(({ item }) => ({ productId: item.productId, quantity: item.quantity, size: item.size, color: item.color })),
      }),
    });
    setPlacing(false);

    if (!ok) {
      if (status === 409 && data.code === 'ORDER_PENDING') {
        setGateMessage({ text: data.error, hint: data.hint });
        pushToast('An order is already waiting for confirmation.', 'warning');
      } else {
        pushToast(data.error || 'Could not place the order.', 'danger');
      }
      return;
    }

    const order = {
      id: data.id,
      orderNumber: data.orderNumber,
      createdAt: new Date().toISOString(),
      items: lines.map(({ item, product }) => ({
        productId: product.id, name: product.name, image: product.images[0], price: product.price,
        quantity: item.quantity, size: item.size, color: item.color,
      })),
      subtotal,
      deliveryCharge: data.total - subtotal,
      total: data.total,
      shipping,
      paymentMethod: payment,
    };
    addOrder(order);
    track('Purchase', { value: data.total, currency: 'BDT', num_items: lines.length }, data.id);
    clearCart();
    pushToast('Order placed successfully');
    router.push(`/thank-you?order=${data.id}`);
  };

  const whatsappHref = whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, '')}` : null;

  const steps = ['Shipping', 'Payment', 'Review'];

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="flex flex-col gap-6">
        <ol className="flex items-center gap-2" aria-label="Checkout progress">
          {steps.map((label, i) => {
            const n = (i + 1) as 1 | 2 | 3;
            const done = step > n;
            const active = step === n;
            return (
              <li key={label} className="flex flex-1 items-center gap-2">
                <span
                  aria-current={active ? 'step' : undefined}
                  className={cn(
                    'grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold',
                    done ? 'bg-success text-white' : active ? 'bg-primary text-white' : 'bg-line text-muted',
                  )}
                >
                  {done ? <CheckIcon className="h-4 w-4" /> : n}
                </span>
                <span className={cn('hidden text-sm font-semibold sm:block', active ? 'text-ink' : 'text-muted')}>{label}</span>
                {i < steps.length - 1 && <span className="h-px flex-1 bg-line" aria-hidden="true" />}
              </li>
            );
          })}
        </ol>

        {step === 1 && (
          <form onSubmit={submitShipping} noValidate className="flex flex-col gap-5 rounded-xl bg-surface p-6 shadow-card" aria-labelledby="shipping-heading">
            <h1 id="shipping-heading" className="text-2xl font-extrabold">Shipping details</h1>
            <div className="grid gap-5 sm:grid-cols-2">
              <Input id="field-fullName" label="Full name" autoComplete="name" value={shipping.fullName} error={errors.fullName} onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })} />
              <Input id="field-phone" label="Mobile number" type="tel" inputMode="numeric" autoComplete="tel" placeholder="01XXXXXXXXX" hint="11 digits, starting 013 to 019" value={shipping.phone} error={errors.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} />
            </div>
            <Input id="field-address" label="Full address" autoComplete="street-address" placeholder="House, road, and landmark" value={shipping.address} error={errors.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} />
            <div className="grid gap-5 sm:grid-cols-2">
              <Select
                id="field-district"
                label="District"
                placeholder="Select a district"
                options={districts.map((d) => ({ value: d, label: d }))}
                value={shipping.district}
                error={errors.district}
                onChange={(e) => setShipping({ ...shipping, district: e.target.value, zone: e.target.value === DHAKA ? 'insideDhaka' : 'outsideDhaka' })}
              />
              <Input id="field-area" label="Area or thana" value={shipping.area} error={errors.area} onChange={(e) => setShipping({ ...shipping, area: e.target.value })} />
            </div>
            <div role="radiogroup" aria-label="Delivery area" className="flex flex-col gap-3">
              <p className="text-sm font-medium text-ink">Delivery area</p>
              {(['insideDhaka', 'outsideDhaka'] as const).map((key) => (
                <RadioCard
                  key={key}
                  name="zone"
                  value={key}
                  checked={shipping.zone === key}
                  onChange={(v) => setShipping({ ...shipping, zone: v as DeliveryZoneKey })}
                  title={key === 'insideDhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}
                  description={`Arrives in ${settings[key].estimate}. ${describeCharge(settings[key])}.`}
                  icon={<TruckIcon className="h-6 w-6 text-primary" />}
                />
              ))}
              {errors.zone && <p className="text-xs font-medium text-danger">{errors.zone}</p>}
            </div>
            <div className="flex justify-end">
              <Button type="submit" size="lg">Continue to payment</Button>
            </div>
          </form>
        )}

        {step === 2 && (
          <section className="flex flex-col gap-5 rounded-xl bg-surface p-6 shadow-card" aria-labelledby="payment-heading">
            <h1 id="payment-heading" className="text-2xl font-extrabold">Payment method</h1>
            <div role="radiogroup" aria-label="Payment method" className="grid gap-3">
              {paymentOptions.map((opt) => (
                <RadioCard
                  key={opt.value}
                  name="payment"
                  value={opt.value}
                  checked={payment === opt.value}
                  onChange={(v) => setPayment(v as PaymentMethod)}
                  title={opt.title}
                  description={opt.description}
                  icon={opt.mark}
                />
              ))}
            </div>
            <div className="flex flex-col-reverse justify-between gap-3 sm:flex-row">
              <Button variant="outline" size="lg" onClick={() => setStep(1)}>Back</Button>
              <Button size="lg" onClick={() => setStep(3)}>Review order</Button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="flex flex-col gap-6 rounded-xl bg-surface p-6 shadow-card" aria-labelledby="review-heading">
            <h1 id="review-heading" className="text-2xl font-extrabold">Review and confirm</h1>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-line p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold">Shipping to</h2>
                  <button type="button" onClick={() => setStep(1)} className="min-h-[44px] text-sm font-semibold text-primary hover:underline">Edit</button>
                </div>
                <p className="mt-2 text-sm">{shipping.fullName}</p>
                <p className="text-sm text-muted">{shipping.phone}</p>
                <p className="text-sm text-muted">{shipping.address}, {shipping.area}, {shipping.district}</p>
                <p className="mt-2 flex items-center gap-2 text-xs text-muted"><TruckIcon className="h-3.5 w-3.5" /> {getDeliveryEstimate(shipping.zone, settings)}</p>
              </div>
              <div className="rounded-lg border border-line p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold">Payment</h2>
                  <button type="button" onClick={() => setStep(2)} className="min-h-[44px] text-sm font-semibold text-primary hover:underline">Edit</button>
                </div>
                <p className="mt-2 text-sm">{paymentOptions.find((p) => p.value === payment)?.title}</p>
                <p className="text-xs text-muted">Pay the courier when you receive the parcel.</p>
              </div>
            </div>
            <ul className="divide-y divide-line rounded-lg border border-line">
              {lines.map(({ item, product, lineTotal }) => (
                <li key={item.lineKey} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                  <span>{product.name} <span className="text-muted">x {item.quantity}</span></span>
                  <span className="font-semibold">{formatBDT(lineTotal)}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-col-reverse justify-between gap-3 sm:flex-row">
              <Button variant="outline" size="lg" onClick={() => setStep(2)}>Back</Button>
              {gateMessage && (
                <div role="alert" className="flex flex-col gap-3 rounded-xl border border-warning bg-warning/10 p-4 text-sm">
                  <p className="font-semibold text-ink">{gateMessage.text}</p>
                  {gateMessage.hint && <p className="text-muted">{gateMessage.hint}</p>}
                  {whatsappHref ? (
                    <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex w-fit items-center rounded-md bg-[#25D366] px-4 py-2 font-semibold text-white">
                      Chat with us on WhatsApp
                    </a>
                  ) : (
                    <p className="text-muted">Please call our support team for details.</p>
                  )}
                </div>
              )}
              <Button size="lg" variant="secondary" loading={placing} onClick={placeOrder}>Place order</Button>
            </div>
          </section>
        )}
      </div>

      <aside aria-label="Order summary" className="h-fit rounded-xl bg-surface p-6 shadow-card lg:sticky lg:top-32">
        <h2 className="text-lg font-bold">Order summary</h2>
        <dl className="mt-4 flex flex-col gap-3 text-sm">
          <div className="flex justify-between"><dt className="text-muted">Items ({lines.reduce((n, l) => n + l.item.quantity, 0)})</dt><dd>{formatBDT(subtotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-muted">Delivery</dt><dd>{shipping.zone ? (deliveryCharge === 0 ? 'Free' : formatBDT(deliveryCharge)) : 'Select delivery area'}</dd></div>
          <div className="flex justify-between border-t border-line pt-3 text-base font-bold"><dt>Total</dt><dd className="font-display">{formatBDT(total)}</dd></div>
        </dl>
      </aside>
    </div>
  );
}
