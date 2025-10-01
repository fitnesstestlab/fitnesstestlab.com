import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { FiCalendar, FiClock, FiTag, FiChevronRight, FiHome, FiTwitter, FiLinkedin, FiFacebook, FiLink } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import ShareButtons from "@/components/ShareButtons";
import { withBasePath } from "@/utils/getBasePath";
import "./styles.css";

export const dynamic = 'force-static';

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.'
    };
  }
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  
  if (!post) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold mb-6">Post Not Found</h1>
        <p className="mb-8">The blog post you're looking for doesn't exist or has been moved.</p>
        <Link 
          href="/blog" 
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          Back to Blog
        </Link>
      </div>
    );
  }
  
  // Calculate reading time based on content length (rough estimate)
  const wordsPerMinute = 200;
  const wordCount = post.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  
  // Get related posts (same category, excluding current post, max 3)
  const relatedPosts = getAllPosts()
    .filter(p => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);
  
  // Create JSON-LD structured data for the article
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ? `https://fitnesstestlab.github.io${post.coverImage}` : undefined,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author || 'Mario',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Fitness Test Lab',
      logo: {
        '@type': 'ImageObject',
        url: 'https://fitnesstestlab.github.io/mario-initial.svg',
      },
    },
    articleSection: post.category,
    keywords: post.tags?.join(', '),
    timeRequired: `PT${readingTime}M`,
  };
  
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <article className="container mx-auto px-4 py-12 md:py-24">
      {/* Breadcrumbs */}
      <nav className="mx-auto max-w-4xl mb-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-foreground/70">
          <li>
            <Link href="/" className="hover:text-primary flex items-center">
              <FiHome className="h-4 w-4" />
            </Link>
          </li>
          <FiChevronRight className="h-4 w-4" />
          <li>
            <Link href="/blog" className="hover:text-primary">
              Blog
            </Link>
          </li>
          <FiChevronRight className="h-4 w-4" />
          <li>
            <Link href={`/blog#${post.category.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-primary">
              {post.category}
            </Link>
          </li>
          <FiChevronRight className="h-4 w-4" />
          <li className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none" aria-current="page">
            {post.title}
          </li>
        </ol>
      </nav>
      
      {/* Post Header */}
      <div className="mx-auto max-w-4xl mb-12">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Link
            href={`/blog?category=${post.category}`}
            className="inline-flex items-center justify-center rounded-full border border-primary bg-primary/10 px-4 py-1 text-sm font-medium text-primary shadow-sm transition-colors hover:bg-primary/20"
          >
            {post.category}
          </Link>
          
          <div className="flex items-center text-sm text-foreground/70">
            <FiClock className="mr-1 h-4 w-4" />
            {readingTime} min read
          </div>
        </div>
        
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl mb-6">
          {post.title}
        </h1>
        
        <p className="text-xl text-foreground/80 mb-8">
          {post.excerpt}
        </p>
        
        {post.author && (
          <div className="flex items-center gap-3 mb-8">
            <Image
              src="/images/avatars/Mario_Guerra_avatar.png"
              alt={post.author}
              width={48}
              height={48}
              className="rounded-full"
            />
            <div>
              <p className="font-medium">{post.author}</p>
              <p className="text-sm text-foreground/70">Author</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Featured Image */}
      {post.coverImage && (
        <div className="mx-auto max-w-4xl mb-12 rounded-lg overflow-hidden">
          <Image
            src={withBasePath(post.coverImage)}
            alt={post.title}
            width={1200}
            height={675}
            className="w-full h-auto object-cover"
            priority
          />
        </div>
      )}
      
      {/* Post Content */}
      <div className="mx-auto max-w-3xl prose prose-lg dark:prose-invert prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-lg">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
      
      {/* Tags */}
      {post.tags && (
        <div className="mx-auto max-w-3xl mt-12">
          <h3 className="font-medium mb-4">Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag: string) => (
              <Link
                key={tag}
                href={`/blog?tag=${tag}`}
                className="inline-flex items-center justify-center rounded-full border border-input bg-background px-3 py-1 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <FiTag className="mr-1 h-3 w-3" />
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="mx-auto max-w-4xl mt-16">
          <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.slug}
                href={`/blog/${relatedPost.slug}`}
                className="group block rounded-lg border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md"
              >
                {relatedPost.coverImage && (
                  <div className="aspect-video w-full overflow-hidden rounded-md mb-4">
                    <Image
                      src={withBasePath(relatedPost.coverImage)}
                      alt={relatedPost.title}
                      width={400}
                      height={225}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary inline-block mb-2">
                  {relatedPost.category}
                </div>
                <h3 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-2">
                  {relatedPost.title}
                </h3>
                {relatedPost.excerpt && (
                  <p className="mt-2 text-sm text-foreground/70 line-clamp-2">
                    {relatedPost.excerpt}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* Back to Blog Link */}
      <div className="mx-auto max-w-3xl mt-12 text-center">
        <Link
          href="/blog"
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          Back to Blog
        </Link>
      </div>
    </article>
    </>
  );
}
