# Next.js Static Generation Fix for Google Analytics

## Problem

When implementing Google Analytics with Next.js 14 static site generation, we encountered a common error:

```
useSearchParams() should be wrapped in a suspense boundary at page "/about"
```

This occurs because `useSearchParams()` is a client-side hook that requires a Suspense boundary when used in a static site generation (SSG) context.

## Solution

We implemented the following fixes to ensure Google Analytics works correctly with static site generation:

1. **Removed direct dependency on `useSearchParams()`**:
   - Replaced it with `window.location.search` inside a useEffect hook
   - This ensures the code only runs on the client side

2. **Added Suspense boundary**:
   - Created a `ClientAnalytics` component that wraps our `GoogleAnalytics` component in a Suspense boundary
   - This satisfies Next.js's requirement for client-side navigation hooks

3. **Updated analytics tracking logic**:
   - Modified our page view tracking to use a client-side approach
   - Ensured analytics code only runs in the browser context

## Technical Implementation

### 1. GoogleAnalytics.tsx

```tsx
// Replaced
const searchParams = useSearchParams();

// With
const [searchParams, setSearchParams] = useState('');
useEffect(() => {
  setSearchParams(window.location.search);
}, [pathname]);
```

### 2. ClientAnalytics.tsx

```tsx
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
```

### 3. Layout.tsx

```tsx
// Updated import
import ClientAnalytics from "@/components/ClientAnalytics";

// Updated component usage
<ClientAnalytics />
```

## Why This Works

1. **Static Generation**: The build process can now complete successfully because it doesn't encounter client-side hooks that require Suspense boundaries.

2. **Client Hydration**: When the page loads in the browser, the analytics code correctly hydrates and begins tracking.

3. **Error Prevention**: By properly isolating client-side code, we prevent the "missing Suspense boundary" errors.

This approach maintains all the tracking functionality while making it compatible with Next.js static site generation.
