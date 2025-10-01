import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiHeart, FiTarget, FiUsers, FiAward } from "react-icons/fi";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Fitness Test Lab - your trusted source for evidence-based home fitness guidance. Discover my mission, approach, and commitment to optimal wellness solutions.",
  openGraph: {
    title: "About | Fitness Test Lab",
    description: "Learn about Fitness Test Lab - your trusted source for evidence-based home fitness guidance.",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-12 max-w-6xl mx-auto">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About Fitness Test Lab</h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Your trusted source for evidence-based home fitness guidance and optimal wellness solutions, run by a real person.
                </p>
              </div>
              <div className="max-w-[600px] space-y-4 text-foreground/90">
                <p>
                  Welcome to Fitness Test Lab, where I believe that optimal fitness should be accessible, sustainable, and science-backed. My mission is to provide you with the knowledge and tools needed to achieve your fitness goals from the comfort of your home.
                </p>
                <p>
                  I focus on evidence-based approaches to fitness, nutrition, and wellness, cutting through the noise of fitness fads to deliver what actually works. Whether you're a beginner starting your fitness journey or an experienced athlete looking to optimize your performance, I have resources tailored to your needs.
                </p>
                <p>
                  My approach combines the latest research in exercise science, nutrition, and behavioral psychology to create practical, sustainable fitness solutions that fit into your busy lifestyle.
                </p>
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

      {/* Mission Section */}
      <section className="bg-muted/40 py-16 md:py-24">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">My Mission</h2>
              <p className="mt-2 text-muted-foreground">
                Empowering you with optimal home fitness solutions and trusted, hands-on equipment reviews from a real person.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-4 p-6 rounded-lg border border-border bg-card">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <FiTarget className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold">Evidence-Based Guidance</h3>
                </div>
                <p className="text-muted-foreground">
                  I provide fitness advice backed by scientific research, ensuring you get results that are both effective and safe.
                </p>
              </div>

              <div className="space-y-4 p-6 rounded-lg border border-border bg-card">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <FiUsers className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold">First-Party Equipment Reviews</h3>
                </div>
                <p className="text-muted-foreground">
                  I conduct hands-on, first-party reviews of home fitness equipment to ensure it stands up to the rigors of real-world home gym use and delivers genuine value for your investment.
                </p>
              </div>

              <div className="space-y-4 p-6 rounded-lg border border-border bg-card">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <FiHeart className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold">Sustainability</h3>
                </div>
                <p className="text-muted-foreground">
                  I teach habits and routines that you can maintain for life, not just quick fixes that don't last.
                </p>
              </div>

              <div className="space-y-4 p-6 rounded-lg border border-border bg-card">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <FiAward className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold">Optimal Results</h3>
                </div>
                <p className="text-muted-foreground">
                  My goal is to help you achieve the best possible results with the resources and time you have available.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">My Approach</h2>
              <p className="mt-2 text-muted-foreground">
                How I deliver optimal home fitness solutions
              </p>
            </div>
            
            <div className="space-y-8">
              <div className="relative border-l border-border pl-6">
                <div className="absolute -left-[7px] top-[5px] h-3.5 w-3.5 rounded-full border-2 border-primary bg-background"></div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Scientific Research</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    I base my recommendations on peer-reviewed research and evidence-based practices from exercise science, nutrition, and sports medicine.
                  </p>
                </div>
              </div>
              
              <div className="relative border-l border-border pl-6">
                <div className="absolute -left-[7px] top-[5px] h-3.5 w-3.5 rounded-full border-2 border-primary bg-background"></div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Practical Application</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    I translate complex scientific concepts into actionable advice that works in real-world home environments.
                  </p>
                </div>
              </div>
              
              <div className="relative border-l border-border pl-6">
                <div className="absolute -left-[7px] top-[5px] h-3.5 w-3.5 rounded-full border-2 border-primary bg-background"></div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Personalization</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    I recognize that everyone's fitness journey is unique and provide guidance that can be adapted to different goals, fitness levels, and lifestyles.
                  </p>
                </div>
              </div>
              
              <div className="relative border-l border-border pl-6">
                <div className="absolute -left-[7px] top-[5px] h-3.5 w-3.5 rounded-full border-2 border-primary bg-background"></div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Continuous Learning</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    I stay up-to-date with the latest research and continuously refine my approach based on new evidence and reader feedback.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-muted/40 py-16 md:py-24">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">My Values</h2>
              <p className="mt-2 text-muted-foreground">
                Principles that guide everything I do
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4 p-6 rounded-lg border border-border bg-card">
                <h3 className="text-lg font-semibold">Integrity</h3>
                <p className="text-sm text-muted-foreground">
                  I'm honest about what works and what doesn't, citing my sources and acknowledging limitations in the research.
                </p>
              </div>
              
              <div className="space-y-4 p-6 rounded-lg border border-border bg-card">
                <h3 className="text-lg font-semibold">Inclusivity</h3>
                <p className="text-sm text-muted-foreground">
                  Fitness is for everyone. I provide guidance that works for different body types, fitness levels, and cultural backgrounds.
                </p>
              </div>
              
              <div className="space-y-4 p-6 rounded-lg border border-border bg-card">
                <h3 className="text-lg font-semibold">Sustainability</h3>
                <p className="text-sm text-muted-foreground">
                  I promote long-term lifestyle changes over quick fixes, helping you build habits that last a lifetime.
                </p>
              </div>
              
              <div className="space-y-4 p-6 rounded-lg border border-border bg-card">
                <h3 className="text-lg font-semibold">Empowerment</h3>
                <p className="text-sm text-muted-foreground">
                  I equip you with knowledge and tools to make informed decisions about your fitness journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border py-16 md:py-24">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-4xl mx-auto">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">Start Your Journey</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground">
                Ready to achieve optimal home fitness? Explore my articles and join my community today.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link
                href="/blog"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                Explore Articles
                <FiArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                Contact Me
                <FiArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
