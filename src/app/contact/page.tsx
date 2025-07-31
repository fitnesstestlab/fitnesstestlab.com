"use client";

import { useState, useEffect, useRef } from "react";
import { FiSend, FiMail, FiPhone, FiMapPin } from "react-icons/fi";

export default function Contact() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const honeypotRef = useRef<HTMLDivElement>(null);
  const honeypotInputRef = useRef<HTMLInputElement>(null);
  const formStartTimeRef = useRef<number>(0);
  const fieldRefs = useRef<{[key: string]: HTMLInputElement | HTMLTextAreaElement | null}>({
    name: null,
    email: null,
    subject: null,
    message: null,
  });

  function generateRandomString(length: number) {
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  useEffect(() => {
    if (formRef.current) {
      formStartTimeRef.current = new Date().getTime();
      
      const part1 = 'aHR0cHM6Ly9zdWI=';
      const part2 = 'bWl0LWZvcm0uY29t';
      const part3 = 'L1gyYUdPS0t0OQ==';
      const endpoint = atob(part1) + atob(part2) + atob(part3);
      formRef.current.action = endpoint;
      
      if (honeypotRef.current && honeypotInputRef.current) {
        const randomHoneypotName = generateRandomString(10);
        const honeypotLabel = honeypotRef.current.querySelector('label');
        
        if (honeypotLabel) {
          honeypotLabel.setAttribute('for', randomHoneypotName);
        }
        
        honeypotInputRef.current.id = randomHoneypotName;
        honeypotInputRef.current.name = randomHoneypotName;
        honeypotRef.current.style.display = 'none';
      }
      
      // Randomize all regular field names
      Object.keys(fieldRefs.current).forEach(key => {
        const field = fieldRefs.current[key];
        if (field) {
          const randomName = generateRandomString(10);
          field.name = randomName;
        }
      });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const submissionTime = new Date().getTime() - formStartTimeRef.current;
    const honeypotValue = honeypotInputRef.current?.value;
    const isHumanCheckbox = (document.getElementById('human') as HTMLInputElement)?.checked;
    
    if (submissionTime < 5000 || honeypotValue || !isHumanCheckbox) {
      setError("Your submission couldn't be processed. Please try again.");
      setIsSubmitting(false);
      return;
    }

    // Create a hidden iframe to handle the form submission without page navigation
    const iframe = document.createElement('iframe');
    iframe.name = 'hidden_iframe';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    // Add JS detection field
    const jsInput = document.createElement('input');
    jsInput.type = 'hidden';
    jsInput.name = 'js_input';
    jsInput.value = 'js_present';
    formRef.current?.appendChild(jsInput);
    
    // Set the form target to the iframe to prevent page navigation
    if (formRef.current) {
      formRef.current.target = 'hidden_iframe';
      
      // Submit the form
      formRef.current.submit();
      
      // Show success message immediately after submission
      setTimeout(() => {
        // Clean up
        document.body.removeChild(iframe);
        if (jsInput.parentNode) {
          jsInput.parentNode.removeChild(jsInput);
        }
        
        // Reset the form and show success state
        setIsSubmitted(true);
        setFormState({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
        setIsSubmitting(false);
      }, 500);
    } else {
      setError("There was a problem submitting the form. Please try again.");
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="mx-auto max-w-4xl space-y-6">
            <div className="space-y-4 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Get in Touch
              </h1>
              <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl">
                Have questions about fitness, nutrition, or home workouts? We'd love to hear from you!
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-6">
                {isSubmitted ? (
                  <div className="rounded-lg border border-green-500 bg-green-50 p-6 dark:bg-green-900/20">
                    <h3 className="text-xl font-semibold text-green-700 dark:text-green-300">
                      Thank you for your message!
                    </h3>
                    <p className="mt-2 text-green-600 dark:text-green-400">
                      We've received your message and will get back to you as soon as possible.
                    </p>
                  </div>
                ) : (
                  <form 
                    ref={formRef}
                    method="POST"
                    onSubmit={handleSubmit} 
                    className="space-y-4 rounded-lg border border-border bg-card p-6 shadow-sm"
                  >
                    <div ref={honeypotRef}>
                      <label htmlFor="websiteDetails">Website Details</label>
                      <input
                        ref={honeypotInputRef}
                        id="websiteDetails"
                        type="text"
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Name
                        </label>
                        <input
                          ref={(el) => { fieldRefs.current.name = el; }}
                          id="name"
                          type="text"
                          value={formState.name}
                          onChange={handleChange}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          placeholder="Your Name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email
                        </label>
                        <input
                          ref={(el) => { fieldRefs.current.email = el; }}
                          id="email"
                          type="email"
                          value={formState.email}
                          onChange={handleChange}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">
                        Subject
                      </label>
                      <input
                        ref={(el) => { fieldRefs.current.subject = el; }}
                        id="subject"
                        type="text"
                        value={formState.subject}
                        onChange={handleChange}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder="Your fitness question or topic"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Message
                      </label>
                      <textarea
                        ref={(el) => { fieldRefs.current.message = el; }}
                        id="message"
                        value={formState.message}
                        onChange={handleChange}
                        className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder="Tell us about your fitness goals, questions, or feedback..."
                        required
                      />
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="human"
                            name="human"
                            className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            required
                          />
                          <label htmlFor="human" className="text-sm text-foreground/80">
                            I am human
                          </label>
                        </div>
                        <a href="/privacy" className="text-sm text-gray-500 underline">
                          Privacy Policy
                        </a>
                      </div>
                      
                      {error && (
                        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                          {error}
                        </div>
                      )}
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            <span className="flex items-center">
                              <svg
                                className="mr-2 h-4 w-4 animate-spin"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Sending...
                            </span>
                          ) : (
                            <span className="flex items-center">
                              Send Message
                              <FiSend className="ml-2 h-4 w-4" />
                            </span>
                          )}
                        </button>
                      </form>
                    )}
              </div>
              
              <div className="space-y-6">
                <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <FiMail className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Email</h3>
                        <p className="text-foreground/80">info@fitnesstestlab.com</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FiPhone className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Phone</h3>
                        <p className="text-foreground/80">+1 (555) 123-4567</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FiMapPin className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Location</h3>
                        <p className="text-foreground/80">Online Fitness Community</p>
                        <p className="text-foreground/80">Available Worldwide</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Quick Response</h2>
                  <p className="text-foreground/80 mb-4">
                    We typically respond to all inquiries within 24-48 hours. For urgent matters, 
                    please call us during business hours.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-foreground/80">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span>Usually responds within a few hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Social Links Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/40">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="mx-auto max-w-4xl space-y-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Connect With Our Community
                </h2>
                <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl">
                  Join our fitness community and stay updated with the latest articles and tips.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://instagram.com/fitnesstestlab"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-6 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Instagram
              </a>
              <a
                href="https://youtube.com/fitnesstestlab"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-6 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                YouTube
              </a>
              <a
                href="https://twitter.com/fitnesstestlab"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-6 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Twitter
              </a>
              <a
                href="https://facebook.com/fitnesstestlab"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-6 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
