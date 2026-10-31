'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState, type FormEvent } from 'react';
import { Button, Input } from '@/components/ui';
import { Skeleton } from '@/components/ui/Loading';
import { useHydrated } from '@/hooks/useHydrated';
import { safeNext, useCustomerStore } from '@/store/customerStore';
import { useSettingsStore } from '@/store/settingsStore';
import { validatePhone } from '@/utils/validation';

function Card({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto flex w-full max-w-md flex-col gap-6 rounded-xl bg-surface p-6 shadow-card sm:p-8">{children}</div>;
}

function SignupForm() {
  const router = useRouter();
  const hydrated = useHydrated();
  const next = safeNext(useSearchParams().get('next'));
  const session = useCustomerStore((s) => s.session);
  const ready = useCustomerStore((s) => s.ready);
  const signup = useCustomerStore((s) => s.signup);
  const loaded = useSettingsStore((s) => s.remoteLoaded);
  const enabled = useSettingsStore((s) => s.customerSignupEnabled);
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  useEffect(() => {
    if (session) router.replace(next);
  }, [session, next, router]);

  if (!hydrated || !ready || !loaded) return <Skeleton className="h-[480px] w-full rounded-xl" />;

  if (!enabled) {
    return (
      <Card>
        <h1 className="text-2xl font-extrabold">Registration is closed</h1>
        <p className="text-sm text-muted">New accounts are not available right now. You can still log in if you already have one.</p>
        <Link href="/login"><Button fullWidth>Go to login</Button></Link>
      </Card>
    );
  }

  if (checkEmail) {
    return (
      <Card>
        <h1 className="text-2xl font-extrabold">Check your email</h1>
        <p className="text-sm text-muted">We sent a confirmation link. Open it, then log in to continue.</p>
        <Link href="/login"><Button fullWidth>Go to login</Button></Link>
      </Card>
    );
  }

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((x) => ({ ...x, [key]: '' }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');
    const found: Record<string, string> = {};
    if (form.name.trim().length < 3) found.name = 'Enter your full name, at least 3 characters.';
    const phoneError = validatePhone(form.phone);
    if (phoneError) found.phone = phoneError;
    if (!form.email.includes('@')) found.email = 'Enter a valid email address.';
    if (form.password.length < 6) found.password = 'Use at least 6 characters.';
    if (form.confirm !== form.password) found.confirm = 'Passwords do not match.';
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setBusy(true);
    const res = await signup({ name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), password: form.password });
    setBusy(false);
    if (res.error) {
      setFormError(res.error);
      return;
    }
    if (res.hasSession) router.replace(next);
    else setCheckEmail(true);
  };

  return (
    <Card>
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Create account</h1>
        <p className="mt-1 text-sm text-muted">Save your details and follow every order in one place.</p>
      </div>
      <form onSubmit={submit} noValidate className="flex flex-col gap-5">
        <Input label="Full name" autoComplete="name" value={form.name} error={errors.name} onChange={set('name')} />
        <Input label="Mobile number" type="tel" inputMode="numeric" autoComplete="tel" placeholder="01XXXXXXXXX" value={form.phone} error={errors.phone} onChange={set('phone')} />
        <Input label="Email" type="email" autoComplete="email" value={form.email} error={errors.email} onChange={set('email')} />
        <Input label="Password" type="password" autoComplete="new-password" hint="At least 6 characters" value={form.password} error={errors.password} onChange={set('password')} />
        <Input label="Confirm password" type="password" autoComplete="new-password" value={form.confirm} error={errors.confirm} onChange={set('confirm')} />
        {formError && <p role="alert" className="text-sm font-medium text-danger">{formError}</p>}
        <Button type="submit" size="lg" fullWidth loading={busy}>Create account</Button>
      </form>
      <p className="text-center text-sm text-muted">
        Already have an account? <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-semibold text-primary hover:underline">Log in</Link>
      </p>
    </Card>
  );
}

export default function SignupPage() {
  return (
    <div className="container-x py-8 md:py-12">
      <Suspense fallback={null}>
        <SignupForm />
      </Suspense>
    </div>
  );
}
