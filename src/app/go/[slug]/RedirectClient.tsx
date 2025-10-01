'use client';

import { useEffect } from 'react';

type RedirectClientProps = {
  url: string;
  note?: string;
};

export default function RedirectClient({ url, note }: RedirectClientProps) {
  useEffect(() => {
    // Open the affiliate link in a new tab/window
    window.open(url, '_blank', 'noopener,noreferrer');
    
    // Redirect back to home page after a brief delay
    const timer = setTimeout(() => {
      window.location.href = '/';
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [url]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4 p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
        <h1 className="text-2xl font-semibold">Opening link in new tab...</h1>
        {note && (
          <p className="text-muted-foreground">
            Opening {note}
          </p>
        )}
        <p className="text-sm text-muted-foreground mt-4">
          The affiliate link is opening in a new tab.
        </p>
        <p className="text-sm text-muted-foreground">
          If it didn't open,{' '}
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            click here
          </a>
          .
        </p>
        <p className="text-xs text-muted-foreground mt-6">
          Returning to homepage...
        </p>
      </div>
    </div>
  );
}
