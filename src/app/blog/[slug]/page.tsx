import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { FiCalendar, FiClock, FiTag } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
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
  
  return (
    <article className="container mx-auto px-4 py-12 md:py-24">
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
            src={post.coverImage}
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
      
      {/* Related Posts - You would need to implement this */}
      
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
  );
}
