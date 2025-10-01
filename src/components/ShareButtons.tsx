"use client";

import { FiTwitter, FiLinkedin, FiFacebook, FiLink } from "react-icons/fi";
import { useState } from "react";

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  
  const url = typeof window !== 'undefined' 
    ? `${window.location.origin}/blog/${slug}`
    : '';
  
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  
  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  };
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-foreground/70">Share:</span>
      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
        aria-label="Share on Twitter"
      >
        <FiTwitter className="h-4 w-4" />
      </a>
      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
        aria-label="Share on LinkedIn"
      >
        <FiLinkedin className="h-4 w-4" />
      </a>
      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
        aria-label="Share on Facebook"
      >
        <FiFacebook className="h-4 w-4" />
      </a>
      <button
        onClick={copyToClipboard}
        className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors relative"
        aria-label="Copy link"
      >
        <FiLink className="h-4 w-4" />
        {copied && (
          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap">
            Copied!
          </span>
        )}
      </button>
    </div>
  );
}
