// filepath: /Users/mariog/portfolio_website/src/app/projects/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { FiGithub, FiExternalLink, FiFilter, FiSearch } from "react-icons/fi";
import { useState } from "react";

// Project data
const projects = [
  {
    id: 1,
    title: "Modern Portfolio Website",
    description: "A modern, responsive portfolio website built with Next.js, TypeScript, and Tailwind CSS, created entirely using AI pair programming with Cline + GPT-4.1 and GitHub Copilot + Claude 3.7.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Markdown", "Responsive Design"],
    imageUrl: "/images/avatars/Chad_Jipiti_Avatar.jpg",
    githubUrl: "https://github.com/mario-guerra/portfolio-website",
    liveUrl: "https://marioguerra.xyz/portfolio-website",
    featured: false,
  },
  {
    id: 2,
    title: "VibeSpec",
    description: "Vibespec is an AI-powered agent that helps you create API definitions using TypeSpec from natural language descriptions. It converts your service ideas into structured, well-documented TypeSpec definitions that are ready to implement.",
    tags: ["Azure OpenAI", "Azure Cognitive Services", "TypeSpec", "Python"],
    imageUrl: "/images/blog/typespec-first-vibe-code-second-build-apis-that-last/TypeSpec_First_Vibe_Second.jpeg",
    githubUrl: "https://github.com/mario-guerra/vibespec",
    liveUrl: "/blog/typespec-first-vibe-code-second-build-apis-that-last",
    featured: false,
  },
  {
    id: 3,
    title: "AI-Powered Audio Translation Service",
    description: "A translation service that converts audio recordings between languages using Azure AI services, designed with TypeSpec as the blueprint and AI-assisted development.",
    tags: ["TypeSpec", "Azure Cognitive Services", "API Design", "AI-Assisted Development", "C#"],
    imageUrl: "/images/blog/building-a-translation-service-with-typespec-and-ai-a-blueprint-approach/TypeSpec-AI-Translation-Service.jpeg",
    githubUrl: "https://github.com/mario-guerra/translation-service",
    liveUrl: "/blog/building-a-translation-service-with-typespec-and-ai-a-blueprint-approach",
    featured: false,
  },
  {
    id: 4,
    title: "The Sliding Content Window",
    description: "A Python-based document summarization tool that uses Azure OpenAI and a sliding context window technique to generate cohesive summaries of large documents without exceeding token limits.",
    tags: ["Python", "Azure OpenAI", "NLP", "Document Processing"],
    imageUrl: "/images/blog/the-sliding-content-window-document-summarization-with-azure-openai/Summarizing-Documents-with-Azure-OpenAI.jpg",
    githubUrl: "https://github.com/mario-guerra/azure-openai-doc-summarizer",
    liveUrl: "/blog/the-sliding-content-window-document-summarization-with-azure-openai",
    featured: false,
  },
  {
    id: 5,
    title: "Building RAG-Enhanced Chatbots from Microsoft Teams Channel Data",
    description: "Turn Microsoft Teams conversations into smart chatbots that automatically answer frequently asked questions, saving developer time and preserving team knowledge.",
    tags: ["Microsoft Graph API", "Azure OpenAI", "RAG", "Microsoft Teams", "Knowledge Mining"],
    imageUrl: "/images/blog/building-intelligent-chatbots-with-microsoft-teams-data/Teams-Channel-Data-Export-Title-Pic.jpg",
    githubUrl: "https://github.com/mario-guerra/teams-channel-content-export",
    liveUrl: "/blog/building-intelligent-chatbots-with-microsoft-teams-data",
    featured: false,
  },
  {
    id: 6,
    title: "Azure SDK Copilot Extension for VS Code",
    description: "A VS Code extension with a chat interface that uses RAG to answer questions about Azure SDKs by querying a vector database of GitHub repo READMEs.",
    tags: ["TypeScript", "Python", "VS Code Extension", "RAG", "Semantic Kernel", "Azure OpenAI"],
    imageUrl: "/images/projects/github_copilot_chatbot/GH_Copilot_AZSDK.jpeg",
    githubUrl: "https://github.com/mario-guerra/azsdkchatbot",
    liveUrl: "https://github.com/mario-guerra/azsdkchatbot",
    featured: false,
  },
];

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  // Get all unique tags
  const allTags = Array.from(new Set(projects.flatMap(project => project.tags)));
  
  // Filter projects based on search and tag filter
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag ? project.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-16 md:py-24">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">My Projects</h1>
            <p className="mt-4 text-muted-foreground md:text-lg">
              A collection of my projects and experiments using AI
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between max-w-6xl mx-auto">
            <div className="flex items-center gap-2">
              <FiFilter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filter by:</span>
              <select
                className="rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={selectedTag || ""}
                onChange={(e) => setSelectedTag(e.target.value || null)}
              >
                <option value="">All Tags</option>
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-input bg-background pl-9 pr-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-8 md:py-16">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md"
                >
                  <div className="aspect-video overflow-hidden">
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      width={600}
                      height={400}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  {project.featured && (
                    <div className="absolute right-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                      Featured
                    </div>
                  )}
                  <div className="flex-1 space-y-4 p-6">
                    <h3 className="text-xl font-bold">{project.title}</h3>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={`${project.id}-${tag}`}
                          className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-border p-4">
                    <a
                      href={project.githubUrl}
                      className="text-muted-foreground hover:text-primary"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View ${project.title} on GitHub`}
                    >
                      <FiGithub className="h-5 w-5" />
                    </a>
                    <a
                      href={project.liveUrl}
                      className="text-muted-foreground hover:text-primary"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View live demo of ${project.title}`}
                    >
                      <FiExternalLink className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center">
                <p className="text-lg font-medium">No projects found matching your criteria.</p>
                <p className="text-muted-foreground">Try adjusting your search or filter.</p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="border-t border-border bg-muted/40 py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Interested in working together?</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                I'm always open to discussing new projects and opportunities.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
