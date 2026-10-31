import Link from 'next/link';
import { Button } from '@/components/ui';
import { SearchIcon } from '@/components/icons';

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[60vh] flex-col items-center justify-center gap-4 py-20 text-center">
      <p className="font-display text-7xl font-extrabold text-primary">404</p>
      <h1 className="text-2xl font-extrabold">This page is not available</h1>
      <p className="max-w-md text-muted">The link may be old or the product may have moved. Try searching or go back to the home page.</p>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <Link href="/"><Button size="lg">Go to home</Button></Link>
        <Link href="/search"><Button size="lg" variant="outline"><SearchIcon className="h-5 w-5" />Search products</Button></Link>
      </div>
    </div>
  );
}
