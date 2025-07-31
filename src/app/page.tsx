"use client";

import Link from "next/link";
import Image from "next/image";
import { FiArrowRight, FiClock, FiUser, FiHeart, FiDroplet, FiTarget } from "react-icons/fi";

export default function Home() {
  // Featured fitness articles data
  const featuredArticles = [
    {
      id: 1,
      title: "The Science of Home Workouts",
      excerpt: "Discover evidence-based approaches to maximize your home fitness results with minimal equipment.",
      readTime: "8 min read",
      category: "Workouts",
      imageUrl: "/images/blog/state-management-cover.jpg",
      slug: "science-of-home-workouts",
    },
    {
      id: 2,
      title: "Nutrition for Optimal Performance",
      excerpt: "Fuel your body right with our comprehensive guide to pre and post-workout nutrition.",
      readTime: "6 min read",
      category: "Nutrition",
      imageUrl: "/images/blog/state-management-cover.jpg",
      slug: "nutrition-for-performance",
    },
    {
      id: 3,
      title: "Building Sustainable Fitness Habits",
      excerpt: "Learn how to create lasting fitness routines that fit your lifestyle and goals.",
      readTime: "10 min read",
      category: "Lifestyle",
      imageUrl: "/images/blog/state-management-cover.jpg",
      slug: "sustainable-fitness-habits",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 -z-10 animated-gradient bg-gradient-to-r from-primary/20 via-background to-secondary/20"></div>
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px] mx-auto max-w-6xl">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter text-foreground sm:text-5xl xl:text-6xl/none">
                  Fitness Test Lab
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Optimal Home Fitness
                </p>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Evidence-based fitness guidance, workout routines, and nutrition advice for your home fitness journey.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link
                  href="/blog"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Explore Articles
                  <FiArrowRight className="ml-2" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  About Me
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative aspect-square overflow-hidden rounded-full border-2 border-primary bg-background/50 p-2">
                <Image
                  src="/images/avatars/Mario_avatar.jpg"
                  alt="Fitness Test Lab Avatar"
                  width={288}
                  height={288}
                  className="w-72 h-72 object-cover rounded-full"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Articles Section */}
      <section className="bg-muted/40 py-16 md:py-24">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Featured Articles</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Latest insights on home fitness, nutrition, and wellness.
              </p>
            </div>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3 mx-auto max-w-6xl">
            {featuredArticles.map((article) => (
              <div key={article.id} className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
                <div className="aspect-video overflow-hidden">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    width={600}
                    height={400}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex-1 space-y-4 p-6">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      {article.category}
                    </div>
                    <div className="flex items-center text-xs text-foreground/70">
                      <FiClock className="mr-1 h-3 w-3" />
                      {article.readTime}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold">{article.title}</h3>
                  <p className="text-sm text-muted-foreground">{article.excerpt}</p>
                </div>
                <div className="flex items-center justify-between border-t border-border p-4">
                  <Link 
                    href={`/blog/${article.slug}`} 
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80"
                    aria-label={`Read ${article.title}`}
                  >
                    <span>Read More</span>
                    <FiArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <Link
              href="/blog"
              className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              View All Articles
              <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Fitness Categories Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Fitness Categories</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Explore our comprehensive guides and resources.
              </p>
            </div>
          </div>
          <div className="mt-12 mx-auto max-w-6xl">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { name: "Workout Routines", icon: <FiTarget className="h-6 w-6" />, description: "Effective home workout programs" },
                { name: "Nutrition Guide", icon: <FiDroplet className="h-6 w-6" />, description: "Fuel your body for optimal performance" },
                { name: "Recovery", icon: <FiHeart className="h-6 w-6" />, description: "Rest and recovery strategies" },
                { name: "Lifestyle", icon: <FiUser className="h-6 w-6" />, description: "Building sustainable fitness habits" }
              ].map((category, index) => (
                <div key={index} className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="rounded-full bg-primary/10 p-3 text-primary">
                    {category.icon}
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="border-t border-border bg-muted/40 py-16 md:py-24">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-6xl mx-auto">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Start Your Fitness Journey</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Join my community of home fitness enthusiasts and get evidence-based guidance.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link
                href="/blog"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Get Started
                <FiArrowRight className="ml-2" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Contact Me
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
