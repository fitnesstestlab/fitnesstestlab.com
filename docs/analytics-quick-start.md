# Setting Up Google Analytics - Quick Start Guide

## Option 1: Use GitHub Secrets (Recommended)

1. **Get your Google Analytics Measurement ID**
   - Create a GA4 property at [Google Analytics](https://analytics.google.com/)
   - Set up a web data stream for marioguerra.xyz
   - Note your Measurement ID (G-XXXXXXXXXX)

2. **Add the ID as a GitHub Secret**
   - Go to your GitHub repository: https://github.com/mario-guerra/mario-guerra.github.io
   - Navigate to Settings > Secrets and Variables > Actions
   - Click "New repository secret"
   - Name: `GA_MEASUREMENT_ID`
   - Value: Your actual Measurement ID (e.g., G-XXXXXXXXXX)
   - Click "Add secret"

3. **Deploy your site**
   - The GitHub workflow has been updated to use this secret
   - Either push a new commit or manually trigger the workflow
   - Your analytics will be active on the next deployment

## Option 2: Hardcode the ID (Quick but less secure)

If you prefer a quicker solution:

1. Open `src/components/GoogleAnalytics.tsx`
2. Replace the placeholder:
   ```typescript
   const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with your actual ID
   ```
3. Also update the same in `src/hooks/useAnalytics.ts`
4. Commit and push to deploy

> **Note:** We've updated the implementation to avoid the `useSearchParams()` Suspense boundary error by using `window.location.search` instead. This ensures the site builds correctly with static generation.

## Verify It's Working

1. Visit your live site at marioguerra.xyz
2. Open browser dev tools (F12) > Network tab
3. Filter for "google" or "analytics"
4. You should see requests to Google Analytics
5. Check your GA4 dashboard for data (may take up to 24 hours)

## Using Analytics Events in Components

For tracking custom events, import from the hooks:

```tsx
import { trackButtonClick, trackExternalLink } from '@/hooks/useAnalytics';

// In your component:
<button onClick={() => trackButtonClick('download-resume', '/resume')}>
  Download
</button>
```

See `docs/using-analytics.md` for more examples.
