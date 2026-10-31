'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState, type FormEvent } from 'react';
import { Button, Input } from '@/components/ui';
import { Skeleton } from '@/components/ui/Loading';
import { useHydrated } from '@/hooks/useHydrated';
import { safeNext, useCustomerStore } from '@/store/customerStore';

function LoginForm() {
  const router = useRouter();
  const hydrated = useHydrated();
  const ready = useCustomerStore((s) => s.ready);
  const session = useCustomerStore((s) => s.session);
  const login = useCustomerStore((s) => s.login);
  const next = safeNext(useSearchParams().get('next'));
  const signupHref = next === '/account' ? '/signup' : `/signup?next=${encodeURIComponent(next)}`;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (session) router.replace(next);
  }, [session, next, router]);

  if (!hydrated || !ready) return <Skeleton className="h-96 w-full rounded-xl" />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const err = await login(email.trim(), password);
    setBusy(false);
    if (err) setError(err);
    else router.replace(next);
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 rounded-xl bg-surface p-6 shadow-card sm:p-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Log in</h1>
        <p className="mt-1 text-sm text-muted">Track your orders and check out faster.</p>
      </div>
      <form onSubmit={submit} noValidate className="flex flex-col gap-5">
        <Input label="Email" type="email" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} />
        <Input label="Password" type="password" autoComplete="current-password" value={password} error={error} onChange={(e) => { setPassword(e.target.value); setError(''); }} />
        <Button type="submit" size="lg" fullWidth loading={busy}>Log in</Button>
      </form>
      <p className="text-center text-sm text-muted">
        New to Nexora? <Link href={signupHref} className="font-semibold text-primary hover:underline">Create an account</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="container-x py-8 md:py-12">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
