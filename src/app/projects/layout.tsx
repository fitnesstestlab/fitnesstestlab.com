import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Explore professional projects and portfolio showcasing experience in software development, API design, DevOps, and modern web technologies.",
  openGraph: {
    title: "Projects | Fitness Test Lab",
    description: "Explore professional projects and portfolio.",
    type: "website",
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
