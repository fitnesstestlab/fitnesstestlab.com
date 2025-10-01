import { getAllPosts } from '@/lib/posts';

export async function GET() {
  const baseUrl = 'https://fitnesstestlab.github.io/fitnesstestlab.com';
  
  // Get all blog posts
  const posts = getAllPosts();
  
  // Static pages
  const staticPages = [
    '',
    '/about',
    '/blog',
    '/contact',
    // '/workouts', // Hidden until real content is ready
    // '/nutrition', // Hidden until real content is ready
    '/projects',
    '/resume',
  ];
  
  // Generate sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(page => `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('')}
  ${posts.map(post => `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${new Date(post.date).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
    },
  });
}
