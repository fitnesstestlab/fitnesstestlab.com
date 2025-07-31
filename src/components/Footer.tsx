"use client";

import Link from "next/link";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { SiX } from "react-icons/si";
import { useState, useEffect } from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [mounted, setMounted] = useState(false);
  const [randomJoke, setRandomJoke] = useState("");

  // Update the joke client-side only after component mounts
  useEffect(() => {
    // Array of motivational fitness quotes
    const fitnessQuotes = [
      "The only bad workout is the one that didn’t happen.",
      "Push yourself, because no one else is going to do it for you.",
      "Success starts with self-discipline.",
      "Don’t limit your challenges. Challenge your limits.",
      "Strength doesn’t come from what you can do. It comes from overcoming the things you once thought you couldn’t.",
      "It’s not about having time. It’s about making time.",
      "Small progress is still progress.",
      "You don’t have to be extreme, just consistent.",
      "Sweat is just fat crying.",
      "Your body can stand almost anything. It’s your mind you have to convince.",
      "The difference between try and triumph is a little ‘umph’.",
      "Motivation is what gets you started. Habit is what keeps you going.",
      "If it doesn’t challenge you, it won’t change you.",
      "Fall in love with taking care of yourself.",
      "You are stronger than you think.",
      "Fitness is not about being better than someone else. It’s about being better than you used to be.",
      "Don’t count the days, make the days count.",
      "A one hour workout is 4% of your day. No excuses.",
      "The pain you feel today will be the strength you feel tomorrow.",
      "Every accomplishment starts with the decision to try."
    ];
    const randomIndex = Math.floor(Math.random() * fitnessQuotes.length);
    setRandomJoke(fitnessQuotes[randomIndex]);
    setMounted(true);
  }, []);

  return (
    <footer className="w-full border-t border-border/40 bg-background py-8">
      <div className="container mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-x-10">
          <div className="flex flex-col space-y-4">
            <h2 className="text-lg font-semibold">Fitness Test Lab</h2>
            <p className="text-sm text-foreground/80">
              Trusted, hands-on equipment reviews and evidence-based fitness guidance for your home gym journey.
            </p>
          </div>

          <div className="flex flex-col space-y-4 md:items-center">
            <h2 className="text-lg font-semibold">Links</h2>
            <div className="flex flex-col space-y-2">
              <Link href="/" className="text-sm text-foreground/80 hover:text-primary">
                Home
              </Link>
              <Link href="/blog" className="text-sm text-foreground/80 hover:text-primary">
                Articles
              </Link>
              <Link href="/workouts" className="text-sm text-foreground/80 hover:text-primary">
                Workouts
              </Link>
              <Link href="/nutrition" className="text-sm text-foreground/80 hover:text-primary">
                Nutrition
              </Link>
              <Link href="/about" className="text-sm text-foreground/80 hover:text-primary">
                About
              </Link>
              <Link href="/contact" className="text-sm text-foreground/80 hover:text-primary">
                Contact
              </Link>
            </div>
          </div>

          <div className="flex flex-col space-y-4 md:items-center">
            <h2 className="text-lg font-semibold">Motivation</h2>
            <p className="text-sm text-foreground/80 md:text-center italic">
              {mounted ? randomJoke : "Loading quote..."}
            </p>
          </div>

          <div className="flex flex-col space-y-4 md:items-center">
            <h2 className="text-lg font-semibold">Connect</h2>
            <div className="flex space-x-4">
              <a
                href="https://github.com/mario-guerra"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/80 hover:text-primary"
                aria-label="GitHub"
              >
                <FiGithub className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/in/mario-guerra"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/80 hover:text-primary"
                aria-label="LinkedIn"
              >
                <FiLinkedin className="h-5 w-5" />
              </a>
              <a
                href="https://x.com/_marioguerra_"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/80 hover:text-primary"
                aria-label="X (formerly Twitter)"
              >
                <SiX className="h-5 w-5" />
              </a>
              <a
                href="/contact"
                className="text-foreground/80 hover:text-primary"
                aria-label="Email"
              >
                <FiMail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border/40 pt-6 text-center text-sm text-foreground/60">
          <p>© {currentYear} Fitness Test Lab. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
