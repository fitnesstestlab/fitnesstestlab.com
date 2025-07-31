import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';

// Define the posts directory
const postsDirectory = path.join(process.cwd(), 'content/blog');

// Get all post slugs
export function getPostSlugs() {
  const allDirs = fs.readdirSync(postsDirectory);
  return allDirs.map(dir => {
    // Extract the slug from directory name (removing the date prefix)
    const match = dir.match(/^\d{4}-\d{2}-\d{2}-(.+)$/);
    return match ? match[1] : dir;
  });
}

// Get all unique categories from posts
export function getCategories() {
  const posts = getAllPosts();
  const categories = posts.map(post => post.category);
  return Array.from(new Set(categories)).filter(Boolean).sort();
}

// Get all posts data for the blog index page
export function getAllPosts() {
  const allDirs = fs.readdirSync(postsDirectory);
  const posts = allDirs
    .map(dir => {
      // Extract the slug from directory name (removing the date prefix)
      const match = dir.match(/^\d{4}-\d{2}-\d{2}-(.+)$/);
      const slug = match ? match[1] : dir;
      
      // Get the full path to the index.md file
      const fullPath = path.join(postsDirectory, dir, 'index.md');
      
      // Read the file content
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      
      // Use gray-matter to parse the post metadata section
      const { data, content } = matter(fileContents);
      
      // Calculate reading time
      const readTime = getReadingTime(content);
      
      // Combine the data with the slug
      return {
        slug,
        ...data,
        // Ensure we have these fields even if not in frontmatter
        title: data.title || '',
        date: data.date || '',
        excerpt: data.excerpt || '',
        coverImage: data.coverImage || '',
        category: data.category || '',
        author: data.author || '',
        blogpost: data.blogpost || data.featured || false, // Support both blogpost and legacy featured flag
        tags: data.tags || [],
        readTime
      };
    })
    // Sort posts by date in descending order
    .sort((a, b) => (new Date(b.date) as any) - (new Date(a.date) as any));
  
  return posts;
}

// Get a specific post by slug
export async function getPostBySlug(slug: string) {
  // Find the directory with this slug (accounting for date prefix)
  const allDirs = fs.readdirSync(postsDirectory);
  const dirName = allDirs.find(dir => {
    const match = dir.match(/^\d{4}-\d{2}-\d{2}-(.+)$/);
    return match && match[1] === slug;
  });
  
  if (!dirName) {
    return null;
  }
  
  // Get the full path to the index.md file
  const fullPath = path.join(postsDirectory, dirName, 'index.md');
  
  // Read the file content
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  
  // Use gray-matter to parse the post metadata section
  const { data, content } = matter(fileContents);
  
  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html, { sanitize: false })
    .use(remarkGfm)
    .process(content);
    
  const contentHtml = processedContent.toString();
  
  // Combine the data with the slug and content
  return {
    slug,
    content: contentHtml,
    ...data,
    // Ensure we have these fields even if not in frontmatter
    title: data.title || '',
    date: data.date || '',
    excerpt: data.excerpt || '',
    coverImage: data.coverImage || '',
    category: data.category || '',
    author: data.author || '',
    blogpost: data.blogpost || data.featured || false, // Support both blogpost and legacy featured flag
    tags: data.tags || []
  };
}

// Calculate estimated reading time
export function getReadingTime(content: string) {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readingTime} min read`;
}
