import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume",
  description: "Professional resume and experience summary. Developer Advocate, API strategist, and technical leader with expertise in developer relations and cloud technologies.",
  openGraph: {
    title: "Resume | Fitness Test Lab",
    description: "Professional resume and experience summary.",
    type: "website",
  },
};

export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
