/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Add trailing slash to match GitHub Pages behavior
  trailingSlash: true,
};

export default nextConfig;
