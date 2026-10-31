'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { useAdminStore } from '@/store/adminStore';
import { Button, Input } from '@/components/ui';

function EyeIcon({ off }: { off: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
      {off && <path d="M3 3l18 18" />}
    </svg>
  );
}

export default function AdminLoginPage() {
  const router = useRouter();
  const login = useAdminStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const err = await login(email.trim(), password);
    setBusy(false);
    if (err) setError(err);
    else router.replace('/admin');
  };

  return (
    <form onSubmit={submit} noValidate className="mx-auto mt-6 flex w-full max-w-sm flex-col gap-5 rounded-xl bg-surface p-6 shadow-card">
      <h1 className="text-2xl font-extrabold">Admin login</h1>
      <Input label="Email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />

      <div className="flex flex-col gap-2">
        <label htmlFor="admin-password" className="text-sm font-semibold text-ink">Password</label>
        <div className="relative">
          <input
            id="admin-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            aria-invalid={Boolean(error)}
            className="h-12 w-full rounded-md border border-line bg-white px-4 pr-12 text-base focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
            className="absolute right-1 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-md text-muted transition-colors hover:text-primary"
          >
            <EyeIcon off={showPassword} />
          </button>
        </div>
        {error && <p role="alert" className="text-xs text-danger">{error}</p>}
      </div>

      <Button type="submit" size="lg" fullWidth loading={busy}>Login</Button>
    </form>
  );
}
