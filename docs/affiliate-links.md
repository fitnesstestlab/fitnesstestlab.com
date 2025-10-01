# Affiliate Link Forwarding System

## Overview
This system provides friendly `/go/*` URLs that redirect to affiliate links. All redirects are pre-generated as static HTML pages at build time, making them perfect for GitHub Pages deployment.

## How It Works

1. **JSON Data File**: `src/data/affiliate-links.json` contains all slug → URL mappings
2. **Dynamic Route**: `src/app/go/[slug]/page.tsx` handles all `/go/*` routes
3. **Static Generation**: At build time, Next.js generates a static HTML page for each slug
4. **New Tab Redirect**: Each page opens the affiliate link in a new tab using `window.open()`
5. **Auto-Return**: After opening the link, user is redirected back to homepage after 1 second
6. **Fallbacks**: Manual links for browsers with JavaScript disabled or popup blockers

## Adding New Links

Simply edit `src/data/affiliate-links.json`:

```json
{
  "your-slug": {
    "url": "https://example.com/affiliate-link",
    "note": "Partner Name - Product Description (optional)"
  }
}
```

Then rebuild and deploy:
```bash
npm run build
```

## Usage Examples

Add links in your blog posts or pages:

```markdown
Check out the [Xebex AirPlus Rower](/go/xebex-airplus-rower-4/)
```

Or in JSX/TSX:

```tsx
<Link href="/go/rogue-kettlebells">Rogue Kettlebells</Link>
```

## File Structure

```
src/
├── app/
│   └── go/
│       └── [slug]/
│           ├── page.tsx           # Server component with generateStaticParams
│           └── RedirectClient.tsx # Client component for redirect
├── data/
│   └── affiliate-links.json       # Slug → URL mappings (EDIT THIS)
scripts/
└── parse-affiliate-links.js       # One-time migration script (not needed going forward)
```

## Features

✅ **225+ affiliate links** pre-configured and ready to use  
✅ **Opens in new tab** - keeps users on your site while visiting affiliate links  
✅ **Auto-return** - automatically returns to homepage after opening link  
✅ **SEO-friendly** with noindex/nofollow meta tags  
✅ **Fallback support** for browsers with popup blockers or JavaScript disabled  
✅ **Static pages** - works perfectly on GitHub Pages  
✅ **Easy maintenance** - just edit JSON and rebuild  

## Current Links

The system includes 225 affiliate links for partners including:
- Rogue Fitness
- Kettlebell Kings
- American Barbell
- Rep Fitness
- Fringe Sport
- Vulcan Strength
- And many more!

See `src/data/affiliate-links.json` for the complete list.

## Technical Details

- **Build Output**: Each slug generates ~15KB HTML file in `.next/server/app/go/`
- **Redirect Method**: `window.open(url, '_blank')` (opens in new tab with noopener/noreferrer)
- **Loading State**: Animated spinner with "Opening link in new tab..." message
- **Auto-Return**: After 1 second, user is redirected back to homepage
- **404 Handling**: Invalid slugs show Next.js 404 page
- **TypeScript**: Fully typed with proper interfaces

## Maintenance

To update links:
1. Edit `src/data/affiliate-links.json`
2. Run `npm run build`
3. Deploy to GitHub Pages

No code changes needed!
