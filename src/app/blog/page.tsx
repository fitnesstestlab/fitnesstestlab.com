import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiClock, FiHeart, FiTarget, FiCoffee } from "react-icons/fi";
import { getAllPosts, getCategories } from "@/lib/posts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fitness Articles & Guides",
  description: "Evidence-based fitness guidance, workout routines, and nutrition advice for your home fitness journey. Browse comprehensive articles on workouts, nutrition, wellness, and more.",
  openGraph: {
    title: "Fitness Articles & Guides | Fitness Test Lab",
    description: "Evidence-based fitness guidance, workout routines, and nutrition advice for your home fitness journey.",
    type: "website",
  },
};

export const dynamic = 'force-static';

export default function Blog() {
  // Get all posts from our Markdown files
  const allPosts = getAllPosts().map((post, index) => ({
    id: index + 1,
    title: post.title,
    excerpt: post.excerpt,
    date: new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
    readTime: post.readTime || "5 min read",
    imageUrl: post.coverImage || "/images/blog/state-management-cover.jpg",
    category: post.category,
    slug: post.slug,
  }));

  // Group posts by category
  const categorizedPosts: Record<string, typeof allPosts> = {};
  allPosts.forEach(post => {
    if (!categorizedPosts[post.category]) {
      categorizedPosts[post.category] = [];
    }
    categorizedPosts[post.category].push(post);
  });

  // Get unique categories
  const categories = Object.keys(categorizedPosts);

  // Get featured posts (first 3)
  const featuredPosts = allPosts.slice(0, 3);

  return (
    <>
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 border-b border-border/40">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-6xl mx-auto">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Fitness Articles & Guides
              </h1>
              <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl">
                Evidence-based fitness guidance, workout routines, and nutrition advice for your home fitness journey.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {categories.map(category => (
                <Link
                  key={category}
                  href={`#${category.toLowerCase().replace(/\s+/g, '-')}`}
                  className="inline-flex items-center justify-center rounded-full border border-input bg-background px-4 py-1 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Articles */}
      {featuredPosts.length > 0 && (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/20">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-start gap-4 max-w-6xl mx-auto">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
                  Featured Articles
                </h2>
                <p className="max-w-[700px] text-foreground/80">
                  Our most popular and impactful fitness guides and resources.
                </p>
              </div>
              <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
                {featuredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="group relative overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="aspect-video w-full overflow-hidden">
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        width={800}
                        height={450}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex items-center gap-2 p-4">
                      <div className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                        {post.category}
                      </div>
                      <div className="flex items-center text-xs text-foreground/70">
                        <FiClock className="mr-1 h-3 w-3" />
                        {post.readTime}
                      </div>
                    </div>
                    <div className="p-4 pt-0">
                      <h3 className="text-xl font-bold">
                        <Link href={`/blog/${post.slug}`} className="hover:text-primary">
                          {post.title}
                        </Link>
                      </h3>
                      <p className="mt-2 line-clamp-2 text-foreground/80">
                        {post.excerpt}
                      </p>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
                      >
                        Read More
                        <FiArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Categorized Articles */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-6xl mx-auto mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                All Articles
              </h2>
              <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl">
                Browse our comprehensive collection of fitness resources.
              </p>
            </div>
          </div>
          
          <div className="max-w-6xl mx-auto space-y-16">
            {categories.map(category => (
              <div key={category} id={category.toLowerCase().replace(/\s+/g, '-')} className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-8">
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    {category === 'Workouts' && <FiTarget className="h-5 w-5" />}
                    {category === 'Nutrition' && <FiCoffee className="h-5 w-5" />}
                    {category === 'Wellness' && <FiHeart className="h-5 w-5" />}
                    {(category !== 'Workouts' && category !== 'Nutrition' && category !== 'Wellness') && <FiHeart className="h-5 w-5" />}
                  </div>
                  <h3 className="text-2xl font-bold tracking-tighter">{category}</h3>
                </div>
                <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {categorizedPosts[category].map((post) => (
                    <div
                      key={post.id}
                      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:shadow-md"
                    >
                      <div className="aspect-video w-full overflow-hidden">
                        <Image
                          src={post.imageUrl}
                          alt={post.title}
                          width={800}
                          height={450}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex flex-1 flex-col p-4">
                        <div className="flex items-center gap-2 pb-2">
                          <div className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                            {post.category}
                          </div>
                        </div>
                        <h3 className="text-lg font-bold">
                          <Link href={`/blog/${post.slug}`} className="hover:text-primary">
                            {post.title}
                          </Link>
                        </h3>
                        <p className="mt-2 flex-1 line-clamp-2 text-sm text-foreground/80">
                          {post.excerpt}
                        </p>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="text-xs text-foreground/70">
                            <FiClock className="mr-1 inline-block h-3 w-3" />
                            {post.readTime}
                          </div>
                          <Link
                            href={`/blog/${post.slug}`}
                            className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                          >
                            Read More
                            <FiArrowRight className="ml-1 h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
