import type { ImageResponse } from 'next/og';

// Define image size and type
export const size = { width: 32, height: 32 };
export const contentType = 'image/svg+xml';

// Use a Response object to return a proper route handler response
export default function Icon() {
  // Just redirect to the static SVG file
  return new Response(null, {
    status: 302,
    headers: {
      'Location': '/mario-initial.svg',
      'Content-Type': contentType,
    },
  });
}
