# Setting Up Google Analytics with GitHub Pages

This document provides instructions for setting up Google Analytics 4 (GA4) on your GitHub Pages website.

## Prerequisites

1. A Google Analytics 4 account
2. A GA4 property created for your website (marioguerra.xyz)

## Setup Instructions

1. **Create a Google Analytics 4 Property (if you haven't already)**
   - Go to [Google Analytics](https://analytics.google.com/)
   - Create a new property and select GA4
   - Follow the prompts to set up a web data stream for your domain (marioguerra.xyz)
   - Once complete, you'll receive a Measurement ID (G-XXXXXXXXXX)

2. **Insert your Measurement ID directly in the code**
   - Open `src/components/GoogleAnalytics.tsx`
   - Replace the placeholder Measurement ID with your actual ID:
     ```typescript
     const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with your actual ID
     ```
   - Also update the same ID in `src/hooks/useAnalytics.ts`

3. **Build and deploy your site**
   - Commit and push the changes to your GitHub repository
   - GitHub Actions will automatically build and deploy your site if you have the workflow set up

## Verifying the Installation

1. Visit your live site at marioguerra.xyz
2. Open your browser's developer tools and check the Network tab
3. Filter for "google" or "analytics" to verify that the analytics requests are being sent
4. Visit your Google Analytics dashboard to confirm data is being collected (note that it may take up to 24 hours for data to appear)

## Alternative: Using GitHub Actions Environment Variables

If you prefer to keep your Measurement ID out of your source code, you can use GitHub Actions environment variables:

1. Go to your GitHub repository settings
2. Navigate to Secrets and Variables > Actions
3. Add a new repository secret named `GA_MEASUREMENT_ID` with your Google Analytics Measurement ID
4. Update your GitHub Actions workflow file to include this environment variable during build:

```yaml
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      # ... other steps
      - name: Build
        env:
          NEXT_PUBLIC_GA_MEASUREMENT_ID: ${{ secrets.GA_MEASUREMENT_ID }}
        run: npm run build
      # ... deployment steps
```

With this approach, you won't need to hardcode the Measurement ID in your source files.

## Privacy Considerations

Remember to update your privacy policy to disclose your use of Google Analytics and how you handle user data.
