import { Suspense } from 'react';
import { Listing } from '@/components/product/Listing';

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container-x py-12 text-muted">Loading results...</div>}>
      <Listing mode="search" title="Search results" description="Search across every category. Use the filters to narrow your results." />
    </Suspense>
  );
}
