# Setting Up Google Analytics for marioguerra.xyz

This document provides instructions for setting up Google Analytics 4 (GA4) on your website.

## Prerequisites

1. A Google Analytics 4 account
2. A GA4 property created for your website

## Setup Instructions

1. **Create a Google Analytics 4 Property (if you haven't already)**
   - Go to [Google Analytics](https://analytics.google.com/)
   - Create a new property and select GA4
   - Follow the prompts to set up a web data stream for your domain (marioguerra.xyz)
   - Once complete, you'll receive a Measurement ID (G-XXXXXXXXXX)

2. **Configure your environment variables**
   - Copy the `.env.local.example` file to `.env.local`:
     ```bash
     cp .env.local.example .env.local
     ```
   - Replace the placeholder value with your actual Measurement ID:
     ```
     NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
     ```

3. **Verify the installation**
   - Start your development server:
     ```bash
     npm run dev
     ```
   - Open the browser and visit your local site
   - Open the browser's developer tools and check the Network tab
   - Filter for "google" or "analytics" to verify that the analytics requests are being sent
   - Visit your Google Analytics dashboard to confirm data is being collected (note that it may take up to 24 hours for data to appear)

## Production Deployment

When deploying to production, make sure to:

1. Add the `NEXT_PUBLIC_GA_MEASUREMENT_ID` environment variable to your hosting platform
2. Build and deploy your site

## Troubleshooting

If you're not seeing data in your Google Analytics dashboard:

1. Check that the Measurement ID is correct in your `.env.local` file
2. Verify that the Google Analytics script is loading in the browser (check Network tab)
3. Make sure you don't have any ad blockers or privacy extensions that might be blocking Google Analytics
4. Confirm that your Google Analytics property is set up correctly and tracking is enabled

## Privacy Considerations

Remember to update your privacy policy to disclose your use of Google Analytics and how you handle user data.
