'use client';

import { useState, type FormEvent } from 'react';
import { Input, Button } from '@/components/ui';
import { useUIStore } from '@/store/uiStore';
import { validateEmail } from '@/utils/validation';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();
  const pushToast = useUIStore((s) => s.pushToast);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const problem = validateEmail(email);
    setError(problem ?? undefined);
    if (problem) {
      document.getElementById('newsletter-email')?.focus();
      return;
    }
    setEmail('');
    pushToast('You are subscribed to weekly deals', 'success');
  };

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-3" aria-label="Newsletter signup">
      <Input
        id="newsletter-email"
        label="Email address"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error}
        className="bg-white/5 text-white placeholder:text-white/50 border-white/20"
      />
      <Button type="submit" variant="secondary" fullWidth>Subscribe</Button>
    </form>
  );
}
