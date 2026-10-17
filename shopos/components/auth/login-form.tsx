// components/auth/login-form.tsx

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2, LogIn } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { demoCredentials } from '@/lib/mock-users';
import { RoleBadge } from './role-badge';
import type { Role } from '@/lib/types';
import { cn } from '@/lib/utils';
import { PASSWORD_HINT } from '@/lib/constants';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const from = search.get('from') || '/dashboard';

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const res = await signIn('credentials', {
        email: values.email.trim().toLowerCase(),
        password: values.password,
        redirect: false,
      });

      if (!res || res.error) {
        toast.error('Invalid email or password');
        setSubmitting(false);
        return;
      }

      toast.success('Welcome back');
      router.push(from);
      router.refresh();
    } catch {
      toast.error('Something went wrong');
      setSubmitting(false);
    }
  };

  const fillDemo = (role: Role, email: string, password: string) => {
    setValue('email', email);
    setValue('password', password);
  };

  return (
    <Card className="border-border/60 shadow-sm">
      <CardContent className="p-6 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Use a demo role to explore the system.
          </p>
        </div>

        {/* Role chips */}
        <div className="mb-6">
          <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
            Demo accounts
          </div>
          <div className="grid grid-cols-2 gap-2">
            {demoCredentials.map((d) => (
              <button
                type="button"
                key={d.role}
                onClick={() => fillDemo(d.role, d.email, d.password)}
                className={cn(
                  'flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-left text-xs',
                  'hover:bg-accent hover:border-primary/40 transition-colors'
                )}
              >
                <span className="font-medium">{d.name}</span>
                <RoleBadge role={d.role} />
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@shop.com"
              autoComplete="email"
              autoFocus
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••"
                autoComplete="current-password"
                className="pr-10"
                {...register('password')}
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:bg-accent"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" disabled={submitting} className="w-full h-10">
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4 mr-2" />
                Sign in
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center pt-1">
            {PASSWORD_HINT}
          </p>
        </form>
      </CardContent>
    </Card>
  );
}