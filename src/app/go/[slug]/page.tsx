import { notFound } from 'next/navigation';
import affiliateLinks from '@/data/affiliate-links.json';
import RedirectClient from './RedirectClient';

// Type for our affiliate link data
type AffiliateLink = {
  url: string;
  note?: string;
};

type AffiliateLinks = {
  [key: string]: AffiliateLink;
};

const links = affiliateLinks as AffiliateLinks;

// Generate static params for all affiliate links at build time
export async function generateStaticParams() {
  return Object.keys(links).map((slug) => ({
    slug,
  }));
}

// Metadata for the redirect pages
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const link = links[params.slug];
  
  if (!link) {
    return {
      title: 'Link Not Found',
    };
  }
  
  return {
    title: `Redirecting to ${link.note || 'product'}...`,
    description: `You are being redirected to ${link.note || 'the product page'}.`,
    robots: 'noindex, nofollow', // Don't index redirect pages
  };
}

export default function RedirectPage({ params }: { params: { slug: string } }) {
  const link = links[params.slug];
  
  // If link doesn't exist, show 404
  if (!link) {
    notFound();
  }
  
  // Return the client component that handles the redirect
  return <RedirectClient url={link.url} note={link.note} />;
}
