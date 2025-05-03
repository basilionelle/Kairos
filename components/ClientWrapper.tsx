'use client';

import { Suspense, ReactNode } from 'react';

// This component wraps any client components that might use useSearchParams
// to ensure they're properly wrapped in a Suspense boundary
export function ClientWrapper({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {children}
    </Suspense>
  );
}
