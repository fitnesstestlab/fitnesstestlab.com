/**
 * Get the configured basePath for the application
 * Returns '/fitnesstestlab.com' in production, empty string in development
 */
export function getBasePath(): string {
  const isProd = process.env.NODE_ENV === 'production';
  return isProd ? '/fitnesstestlab.com' : '';
}

/**
 * Prepend basePath to an image or asset URL
 * @param path - The path to the asset (should start with /)
 * @returns The full path with basePath prepended in production
 */
export function withBasePath(path: string): string {
  if (!path) return path;
  
  // If path already starts with basePath, return as-is
  if (path.startsWith('/fitnesstestlab.com/')) {
    return path;
  }
  
  // If path starts with /, prepend basePath
  if (path.startsWith('/')) {
    return `${getBasePath()}${path}`;
  }
  
  // Otherwise return as-is (relative path)
  return path;
}
