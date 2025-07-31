// src/components/ClientAnalytics.tsx
'use client';

import { Suspense } from 'react';
import GoogleAnalytics from './GoogleAnalytics';

export default function ClientAnalytics() {
  return (
    <Suspense fallback={null}>
      <GoogleAnalytics />
    </Suspense>
  );
}
