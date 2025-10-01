import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Fitness Test Lab. Have questions about home fitness, workouts, or nutrition? Reach out and let's connect.",
  openGraph: {
    title: "Contact | Fitness Test Lab",
    description: "Get in touch with Fitness Test Lab for all your home fitness questions.",
    type: "website",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
