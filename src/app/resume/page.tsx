'use client';

import { FiDownload, FiGithub, FiLinkedin, FiYoutube, FiMail } from "react-icons/fi";
import { useRef, useState } from "react";

// Button component that will be hidden during PDF generation
const DownloadButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
  >
    <FiDownload className="mr-2 h-4 w-4" />
    Download Resume
  </button>
);

export default function Resume() {
  const resumeRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const handleDownload = async () => {
    if (typeof window !== "undefined") {
      try {
        // Set printing state to hide the download button
        setIsPrinting(true);
        
        // Small delay to ensure state update has applied
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const { default: jsPDF } = await import("jspdf");
        // We don't need jspdf-autotable for our direct PDF creation approach
        
        if (resumeRef.current) {
          // Create a new PDF document with better default settings
          const pdf = new jsPDF({
            orientation: "portrait",
            unit: "pt",
            format: "a4",
            compress: true,
            floatPrecision: 16 // Higher precision for better text positioning
          });
          
          // A4 page dimensions in points
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          const margin = 40; // Reduced margins to maximize text width
          const contentWidth = pageWidth - (margin * 2);
          
          // Set consistent default text color to pure black for better readability
          pdf.setTextColor(0, 0, 0);
          
          // Set font to Helvetica for clean, readable text
          pdf.setFont("helvetica");
          
          // Current vertical position for content
          let yPos = margin;
          const lineHeight = 12; // Reduced line height to make text more compact
          
          // Simple function to add text and handle overflow
          interface AddTextOptions {
            text: string;
            size: number;
            style?: "normal" | "bold" | "italic" | "bolditalic";
          }

          const addText = (
            text: string,
            size: number,
            style: "normal" | "bold" | "italic" | "bolditalic" = "normal"
          ): void => {
            pdf.setFontSize(size);
            pdf.setFont("helvetica", style);

            // Check if we need a page break
            if (yPos > pageHeight - margin) {
              pdf.addPage();
              yPos = margin;
            }

            pdf.text(text, margin, yPos);
            yPos += lineHeight + (size / 2);
          };
          
          // Add section with title - enhanced for better visual separation
          interface AddSectionOptions {
            title: string;
          }

          const addSection = (title: string): void => {
            // Add less spacing before section
            yPos += 14;
            
            // Check if we need a page break - with enough room for title and some content
            if (yPos > pageHeight - margin - 70) { // Slightly reduced space required
              pdf.addPage();
              yPos = margin;
            }
            
            // Add a section title with more prominence
            pdf.setFontSize(14); // Reduced font size for section headers
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(0, 0, 0); // Pure black for section titles
            pdf.text(title.toUpperCase(), margin, yPos); // Uppercase for better visual hierarchy
            yPos += lineHeight + 3; // Reduced spacing
            
            // Add a thicker line under the section title
            pdf.setDrawColor(0, 0, 0);
            pdf.setLineWidth(0.75);
            pdf.line(margin, yPos - 4, margin + 180, yPos - 4); // Slightly shorter line
            
            yPos += 6; // Less space after the line
            
            // Reset text color for content
            pdf.setTextColor(0, 0, 0);
          };
          
          // Function to add bullet point item - enhanced for better readability
          interface AddBulletPointOptions {
            text: string;
          }

          const addBulletPoint = (text: string): void => {
            // Check if we need a page break - with more space to avoid breaking mid-item
            if (yPos > pageHeight - margin - 20) {
              pdf.addPage();
              yPos = margin;
            }
            
            pdf.setFontSize(10); // Reduced font size for bullet points
            pdf.setFont("helvetica", "normal");
            pdf.setTextColor(0, 0, 0); // Ensure consistent dark text
            
            // Split text into multiple lines if too long - slightly reduced width for better line length
            const textLines: string[] = pdf.splitTextToSize(text, contentWidth - 15); // Slightly wider content
            
            // Add bullet and indent text
            pdf.circle(margin + 3, yPos - 3, 1, 'F'); // Smaller bullet
            pdf.text(textLines, margin + 12, yPos); // Less indentation
            
            // Move down based on number of lines with minimal extra spacing
            yPos += (lineHeight * textLines.length) + 1; // Reduced extra spacing
          };
          
          // Extract and simplify the content from the resume
          
          // Add name and title
          addText("Mario Guerra", 20, "bold"); // Reduced name font size
          addText("Technical Product Manager", 14, "normal"); // Reduced title font size
          yPos += 10; // Less spacing after title
          
          // Add contact information in a single line with better spacing and formatting with hyperlinks
          pdf.setFontSize(9); // Smaller font size for contact info
          pdf.setTextColor(0, 0, 150); // Blue color for hyperlinks
          
          const contactInfo = [
            { text: "marioguerra.xyz/contact", url: "https://marioguerra.xyz/contact" },
            { text: "github.com/mario-guerra", url: "https://github.com/mario-guerra" },
            { text: "linkedin.com/in/mario-guerra", url: "https://linkedin.com/in/mario-guerra" },
            { text: "youtube.com/@thisismarioguerra", url: "https://youtube.com/@thisismarioguerra" }
          ];
          
          // Calculate positions for each link
          let currentX = margin;
          const separator = " | ";
          
          // Add each contact info with hyperlink
          contactInfo.forEach((contact, index) => {
            // Calculate width of this text item
            const textWidth = pdf.getStringUnitWidth(contact.text) * 9 / pdf.internal.scaleFactor;
            
            // Add the hyperlink
            pdf.link(currentX, yPos - 8, textWidth, 10, { url: contact.url });
            
            // Add the text
            pdf.text(contact.text, currentX, yPos);
            
            // Move position for next item
            currentX += textWidth;
            
            // Add separator if not the last item
            if (index < contactInfo.length - 1) {
              pdf.setTextColor(0, 0, 0); // Black for separator
              pdf.text(separator, currentX, yPos);
              currentX += pdf.getStringUnitWidth(separator) * 9 / pdf.internal.scaleFactor;
              pdf.setTextColor(0, 0, 150); // Back to blue for links
            }
          });
          
          // Reset text color
          pdf.setTextColor(0, 0, 0);
          yPos += 18; // Less spacing after contact info
          
          // Professional Summary
          addSection("Professional Summary");
          // Ensure text uses full width by setting explicit font before calculating width
          pdf.setFontSize(10); // Smaller font size for summary
          pdf.setFont("helvetica", "normal");
          
          const summaryText = "Technical Product Manager with over 15 years of experience driving innovation in developer tools, APIs, AI-driven solutions, and scalable infrastructure. Proven ability to lead cross-functional teams, influence stakeholders, and deliver impactful solutions that align technical capabilities with business needs.";
          // Use the exact contentWidth for text wrapping, ensure it fills the available space
          // Explicitly set the width to be slightly less than contentWidth to account for any internal padding
          const textWidth = contentWidth - 3; // Smaller buffer to use more space
          const summaryLines = pdf.splitTextToSize(summaryText, textWidth);
          pdf.text(summaryLines, margin, yPos);
          yPos += (lineHeight * summaryLines.length) + 3; // Less spacing between paragraphs
          
          const summaryText2 = "At Microsoft, I spearheaded the zero-to-one launch of TypeSpec, a high-level API language and code-gen framework now adopted by over 30% of Azure services to produce SDKs for C#, Java, .NET, JavaScript, Rust, and Go, cutting SDK development and API review time by 30%.";
          // Use the same textWidth for consistent paragraph formatting
          const summaryLines2 = pdf.splitTextToSize(summaryText2, textWidth);
          pdf.text(summaryLines2, margin, yPos);
          yPos += (lineHeight * summaryLines2.length) + 6; // Less spacing after summary section
          
          // Key Skills section
          addSection("Key Skills");
          
          // Add two columns for skills
          const colWidth = (contentWidth - 15) / 2;
          
          // Technical Expertise title
          pdf.setFontSize(11); // Reduced font size for skill headers
          pdf.setFont("helvetica", "bold");
          pdf.text("Technical Expertise", margin, yPos);
          
          // Product & Leadership title
          pdf.text("Product & Leadership", margin + colWidth + 15, yPos);
          yPos += lineHeight + 2; // Less spacing after skill headers
          
          // Save position to align columns
          const skillsStartY = yPos;
          let techSkillsY = yPos;
          
          // Technical Expertise bullets
          const techSkills = [
            "APIs, LLMs, RAG, Distributed Systems",
            "Python, C/C++, Rust, Azure, Cloud Computing",
            "OpenAPI Specification, Secure API Design",
            "LLMOps, Prompt Management, Data Processing",
            "Azure Foundry, Cosmos DB, Power BI, DevOps",
            "CI/CD Automation, GitHub, Security Standards"
          ];
          
          // Product & Leadership bullets
          const leadershipSkills = [
            "Developer Tools, API-First Strategies",
            "Cross-Functional Team Leadership",
            "Data-Driven Decision Making",
            "Developer Advocacy, Community Engagement",
            "Strategic Product Thinking, Roadmapping",
            "Stakeholder Alignment, Requirements Gathering"
          ];
          
          // Add technical skills
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(9.5); // Smaller font size for skills
          
          for (const skill of techSkills) {
            // Split text to multiple lines if needed
            const textLines = pdf.splitTextToSize(skill, colWidth - 12);
            
            // Add bullet and text
            pdf.text("•", margin, techSkillsY);
            pdf.text(textLines, margin + 12, techSkillsY);
            
            // Move down based on number of lines with less spacing
            techSkillsY += (lineHeight * textLines.length) - 1; // Reduced spacing between skills
          }
          
          // Add leadership skills in second column
          let leadershipSkillsY = skillsStartY;
          for (const skill of leadershipSkills) {
            // Split text to multiple lines if needed
            const textLines = pdf.splitTextToSize(skill, colWidth - 12);
            
            // Add bullet and text in second column with less spacing
            pdf.text("•", margin + colWidth + 15, leadershipSkillsY);
            pdf.text(textLines, margin + colWidth + 27, leadershipSkillsY);
            
            // Move down based on number of lines with less spacing
            leadershipSkillsY += (lineHeight * textLines.length) - 1; // Reduced spacing between skills
          }
          
          // Update yPos to the highest column with less spacing after
          yPos = Math.max(techSkillsY, leadershipSkillsY) + 6;
          
          // Key Projects section
          addSection("Key Projects");
          
          // Array of projects
          const projects = [
            {
              title: "TypeSpec 1.0 Launch (Microsoft)",
              description: "Led the zero-to-one launch of TypeSpec, delivering an API definition language that achieved 8-10x code reduction and 30% faster review times, delivering measurable developer productivity."
            },
            {
              title: "RAG-Enhanced Chatbots with Microsoft Teams Data",
              description: "Built RAG-enhanced chatbots using Graph API and Azure Foundry, leveraging LLMs to optimize workflows and demonstrate API-driven user support with secure data exchange."
            },
            {
              title: "@azure Functionality in GitHub Copilot",
              description: "Contributed to LLM-driven API integrations, enhancing developer productivity through context-aware code suggestions with secure data handling."
            },
            {
              title: "AI Document Summarization (Personal Project)",
              description: "Developed an LLM-based solution to summarize large documents, optimizing data pipelines for efficient, secure processing with a sliding window approach."
            },
            {
              title: "Power BI Analytics for TypeSpec (Microsoft)",
              description: "Designed Power BI dashboards to track TypeSpec telemetry from VS Code extensions, enabling data-driven insights for developer productivity."
            },
            {
              title: "Hexagon DSP Toolchain Modernization (Qualcomm)",
              description: "Directed transition to LLVM, optimizing developer workflows and ensuring reliable infrastructure for millions of Snapdragon devices."
            }
          ];
          
          // Add each project with enhanced formatting but more compact
          for (const project of projects) {
            // Check if we need a page break with more space to avoid breaking mid-project
            if (yPos > pageHeight - margin - 50) {
              pdf.addPage();
              yPos = margin;
            }
            
            // Add project title with better visual distinction
            pdf.setFontSize(10.5); // Smaller font for project titles
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(0, 0, 0);
            pdf.text(project.title, margin, yPos);
            yPos += lineHeight - 2; // Less space after title
            
            // Add description with consistent text color
            pdf.setFontSize(9.5); // Smaller font for project descriptions
            pdf.setFont("helvetica", "normal");
            pdf.setTextColor(0, 0, 0);
            
            // Calculate lines with slightly reduced width for better readability
            const descLines = pdf.splitTextToSize(project.description, contentWidth - 3);
            
            // Add slight indent for description
            pdf.text(descLines, margin + 5, yPos);
            
            // Move down with less spacing between projects
            yPos += (lineHeight * descLines.length) + 8; // Reduced spacing between projects
          }
          
          // Work Experience section
          addSection("Work Experience");
          
          // Add Microsoft experience
          pdf.setFontSize(10.5); // Reduced font size for job title
          pdf.setFont("helvetica", "bold");
          pdf.text("Senior Product Manager - TypeSpec API Definition Language", margin, yPos);
          yPos += lineHeight - 2; // Less spacing after title
          
          pdf.setFontSize(10); // Reduced font size for company/date
          pdf.setFont("helvetica", "normal");
          pdf.text("Microsoft | June 2021 - Present", margin, yPos);
          yPos += lineHeight + 2; // Less spacing after company/date
          
          // Microsoft responsibilities
          const msResponsibilities = [
            "Drive product vision and strategy for TypeSpec, an open-source API definition language transforming API development.",
            "Define and execute a long-term roadmap, aligning with company goals and customer needs.",
            "Guide Azure service teams as a member of the Azure API Stewardship Board, driving best practices for API development.",
            "Conduct user research to identify pain points and translate insights into actionable product features.",
            "Define key performance indicators (KPIs) to measure product success and iterate based on real-world usage."
          ];
          
          for (const item of msResponsibilities) {
            addBulletPoint(item);
          }
          
          yPos += 10;
          
          // Add Qualcomm experience
          if (yPos > pageHeight - margin - 60) {
            pdf.addPage();
            yPos = margin;
          }
          
          pdf.setFontSize(10.5); // Reduced font size for job title
          pdf.setFont("helvetica", "bold");
          pdf.text("Principal Software Engineer / Manager", margin, yPos);
          yPos += lineHeight - 2; // Less spacing after title
          
          pdf.setFontSize(10); // Reduced font size for company/date
          pdf.setFont("helvetica", "normal");
          pdf.text("Qualcomm | June 2008 - June 2021", margin, yPos);
          yPos += lineHeight + 2; // Less spacing after company/date
          
          // Qualcomm responsibilities
          const qualcommResponsibilities = [
            "Led the development of tools and platforms for Qualcomm's Hexagon DSP, the core of Snapdragon modem and Neural Processing Unit technology.",
            "Served as de-facto product manager for Hexagon tools used by first-party software development teams.",
            "Improved on-time delivery by 35% through the implementation of data-driven development processes."
          ];
          
          for (const item of qualcommResponsibilities) {
            addBulletPoint(item);
          }
          
          // Add Education section if space permits, otherwise add a new page
          if (yPos > pageHeight - margin - 60) {
            pdf.addPage();
            yPos = margin;
          }
          
          // Education section
          yPos += 6; // Less spacing before education section
          addSection("Education");
          
          pdf.setFontSize(10.5); // Smaller font size for degree
          pdf.setFont("helvetica", "bold");
          pdf.text("Masters of Engineering, Embedded Systems", margin, yPos);
          yPos += lineHeight - 2; // Less spacing
          
          pdf.setFontSize(10); // Smaller font size for school
          pdf.setFont("helvetica", "normal");
          pdf.text("Arizona State University", margin, yPos);
          yPos += lineHeight + 3; // Less spacing
          
          pdf.setFontSize(10.5); // Smaller font size for degree
          pdf.setFont("helvetica", "bold");
          pdf.text("Bachelor of Science, Computer Engineering", margin, yPos);
          yPos += lineHeight - 2; // Less spacing
          
          pdf.setFontSize(10); // Smaller font size for school
          pdf.setFont("helvetica", "normal");
          pdf.text("St. Mary's University", margin, yPos);
          
          // Add Publications section if space permits, otherwise add a new page
          if (yPos > pageHeight - margin - 60) {
            pdf.addPage();
            yPos = margin;
          }
          
          // Publications section
          yPos += 10; // Less spacing before publications section
          addSection("Publications");
          
          // Array of publications with title and URL
          const publications = [
            {
              title: "TypeSpec 1.0 GA - API-First, Made Practical",
              description: "Highlighted TypeSpec's impact on scalable API development and developer productivity.",
              url: "https://typespec.io/blog/typespec-1-0-GA-release/"
            },
            {
              title: "TypeSpec First, Vibe Code Second",
              description: "Explores 'vibe coding' and introduces TypeSpec as a structured approach to building APIs, combining AI code generation with robust design principles.",
              url: "https://marioguerra.xyz/blog/typespec-first-vibe-code-second/"
            },
            {
              title: "AI Document Summarization with Sliding Content Window",
              description: "A practical solution for overcoming AI token limitations when summarizing large documents.",
              url: "https://marioguerra.xyz/blog/ai-document-summarization-with-sliding-content-window/"
            },
            {
              title: "Building Intelligent Chatbots with Microsoft Teams Data",
              description: "Demonstrates how to extract Microsoft Teams channel data using the Graph API to build RAG-enhanced chatbots, improving productivity.",
              url: "https://marioguerra.xyz/blog/building-intelligent-chatbots-with-microsoft-teams-data/"
            },
            {
              title: "Audio Alchemy: Transcribing and Translating with Azure SDKs",
              description: "Demonstrates how to translate and transcribe audio using Azure Cognitive Services and Azure OpenAI.",
              url: "https://devblogs.microsoft.com/azure-sdk/transcribing-and-translating-with-azure-sdks/"
            },
            {
              title: "Promoting APIs from Plumbing to Products",
              description: "Perspective on elevating APIs from hidden infrastructure to polished products by prioritizing developer experience and usability.",
              url: "https://marioguerra.xyz/blog/promoting-apis-from-plumbing-to-products/"
            },
            {
              title: "API Strategy and Governance",
              description: "Provided strategic guidance for effective API programs.",
              url: "https://marioguerra.xyz/documentation/api_strategy_governance/"
            },
            {
              title: "Making APIs Consumable by AI Agents",
              description: "Strategies for designing APIs that can be effectively discovered, understood, and utilized by AI agents and LLMs.",
              url: "https://marioguerra.xyz/documentation/making_apis_consumable_by_agents/"
            }
          ];
          
          // Add each publication with hyperlinks - more compact layout
          for (const pub of publications) {
            // Check if we need a page break
            if (yPos > pageHeight - margin - 35) {
              pdf.addPage();
              yPos = margin;
            }
            
            // Add title with hyperlink
            pdf.setFontSize(10); // Smaller font size for publication titles
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(0, 0, 150); // Blue color for hyperlinks
            
            // Add title as hyperlink
            const title = pub.title;
            const titleWidth = pdf.getStringUnitWidth(title) * 10 / pdf.internal.scaleFactor;
            pdf.link(margin, yPos - 10, titleWidth, 12, { url: pub.url });
            pdf.text(title, margin, yPos);
            
            // Add description in black
            yPos += lineHeight - 2; // Less spacing after title
            pdf.setTextColor(0, 0, 0); // Reset to black
            pdf.setFontSize(9); // Smaller font for publication descriptions
            pdf.setFont("helvetica", "normal");
            
            const descLines = pdf.splitTextToSize(pub.description, contentWidth - 3);
            pdf.text(descLines, margin, yPos);
            
            // Move down with less spacing between publications
            yPos += (lineHeight * descLines.length) + 6; // Less spacing between publications
          }
          
          // Save and download the PDF
          pdf.save("mario_guerra_resume.pdf");
        }
      } catch (error) {
        console.error("Error generating PDF:", error);
      } finally {
        // Reset printing state
        setIsPrinting(false);
      }
    }
  };

  return (
    <>
      <div ref={resumeRef}>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="mx-auto max-w-3xl space-y-8">
              {/* Header */}
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center space-y-2 text-center sm:flex-row sm:justify-between sm:space-y-0 sm:text-left">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                      Mario Guerra
                    </h1>
                    <p className="text-foreground/80">Technical Product Manager & AI Enthusiast</p>
                  </div>
                  <div className="flex flex-col gap-2 sm:items-end">
                    {!isPrinting && (
                      <DownloadButton onClick={handleDownload} />
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                  <div className="flex items-center text-sm text-foreground/80">
                    <FiMail className="mr-1 h-4 w-4" />
                    <a href="https://marioguerra.xyz/contact" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                      marioguerra.xyz/contact
                    </a>
                  </div>
                  <div className="flex items-center text-sm text-foreground/80">
                    <FiGithub className="mr-1 h-4 w-4" />
                    <a href="https://github.com/mario-guerra" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                      github.com/mario-guerra
                    </a>
                  </div>
                  <div className="flex items-center text-sm text-foreground/80">
                    <FiLinkedin className="mr-1 h-4 w-4" />
                    <a href="https://linkedin.com/in/mario-guerra" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                      linkedin.com/in/mario-guerra
                    </a>
                  </div>
                  <div className="flex items-center text-sm text-foreground/80">
                    <FiYoutube className="mr-1 h-4 w-4" />
                    <a href="https://www.youtube.com/@thisismarioguerra" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                      youtube.com/@thisismarioguerra
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Summary */}
              <div className="space-y-3">
                <h2 className="text-xl font-bold">Professional Summary</h2>
                <div className="border-l-2 border-primary pl-4">
                  <p className="text-foreground/80">
                    Technical Product Manager with over 15 years of experience driving innovation in developer tools, APIs, 
                    AI-driven solutions, and scalable infrastructure. Proven ability to lead cross-functional teams, influence 
                    stakeholders, and deliver impactful solutions that align technical capabilities with business needs. Skilled 
                    in designing intuitive, secure, and scalable APIs, leveraging Azure technologies, and applying data-driven 
                    roadmaps to optimize developer productivity and system reliability. Experienced in contributing to open source tools 
                    and fostering vibrant open source communities, driving collaboration and adoption across diverse developer ecosystems.
                  </p>
                  <p className="mt-2 text-foreground/80">
                    At Microsoft, I spearheaded the zero-to-one launch of TypeSpec, a high-level API language and code-gen framework now adopted by over 30% of Azure services to produce SDKs for C#, Java, .NET, JavaScript, Rust, and Go, cutting SDK development and API review time by 30%, with a plan to convert all Azure services to TypeSpec.
                  </p>
                  <p className="mt-2 text-foreground/80">
                    Interested in product leadership opportunities AI-driven companies building developer-first solutions.
                  </p>
                </div>
              </div>
              
              {/* Skills */}
              <div className="space-y-3">
                <h2 className="text-xl font-bold">Key Skills</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="text-lg font-semibold">Technical Expertise</h3>
                    <ul className="mt-2 space-y-1 text-foreground/80">
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>APIs, LLMs, RAG, Distributed Systems</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Python, C/C++, Rust, Azure, Cloud Computing</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>OpenAPI Specification, Secure API Design</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>LLMOps, Prompt Management, Data Processing</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Azure Foundry, Cosmos DB, Power BI, DevOps</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>CI/CD Automation, GitHub, Security Standards</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Product & Leadership</h3>
                    <ul className="mt-2 space-y-1 text-foreground/80">
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Developer Tools, API-First Strategies</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Cross-Functional Team Leadership</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Data-Driven Decision Making</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Developer Advocacy, Community Engagement</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Strategic Product Thinking, Roadmapping</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Stakeholder Alignment, Requirements Gathering</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Key Projects */}
              <div className="space-y-3">
                <h2 className="text-xl font-bold">Key Projects</h2>
                <div className="space-y-6">
                  <div className="space-y-3 rounded-lg border border-border p-4">
                    <h3 className="text-lg font-semibold">TypeSpec 1.0 Launch (Microsoft)</h3>
                    <p className="text-foreground/80">
                      Led the zero-to-one launch of TypeSpec, delivering an API definition language that achieved 8-10x code reduction 
                      and 30% faster review times, delivering measurable developer productivity.
                    </p>
                  </div>
                  
                  <div className="space-y-3 rounded-lg border border-border p-4">
                    <h3 className="text-lg font-semibold">RAG-Enhanced Chatbots with Microsoft Teams Data</h3>
                    <p className="text-foreground/80">
                      Built RAG-enhanced chatbots using Graph API and Azure Foundry, leveraging LLMs to optimize workflows and 
                      demonstrate API-driven user support with secure data exchange.
                    </p>
                  </div>
                  
                  <div className="space-y-3 rounded-lg border border-border p-4">
                    <h3 className="text-lg font-semibold">@azure Functionality in GitHub Copilot</h3>
                    <p className="text-foreground/80">
                      Contributed to LLM-driven API integrations, enhancing developer productivity through context-aware code 
                      suggestions with secure data handling.
                    </p>
                  </div>
                  
                  <div className="space-y-3 rounded-lg border border-border p-4">
                    <h3 className="text-lg font-semibold">AI Document Summarization (Personal Project)</h3>
                    <p className="text-foreground/80">
                      Developed an LLM-based solution to summarize large documents, optimizing data pipelines for efficient, 
                      secure processing with a sliding window approach.
                    </p>
                  </div>
                  
                  <div className="space-y-3 rounded-lg border border-border p-4">
                    <h3 className="text-lg font-semibold">Power BI Analytics for TypeSpec (Microsoft)</h3>
                    <p className="text-foreground/80">
                      Designed Power BI dashboards to track TypeSpec telemetry from VS Code extensions, enabling data-driven 
                      insights for developer productivity.
                    </p>
                  </div>
                  
                  <div className="space-y-3 rounded-lg border border-border p-4">
                    <h3 className="text-lg font-semibold">Hexagon DSP Toolchain Modernization (Qualcomm)</h3>
                    <p className="text-foreground/80">
                      Directed transition to LLVM, optimizing developer workflows and ensuring reliable infrastructure for 
                      millions of Snapdragon devices.
                    </p>
                  </div>
                  
                  <div className="space-y-3 rounded-lg border border-border p-4">
                    <h3 className="text-lg font-semibold">Azure Batch SDK for Distributed Computing (Microsoft)</h3>
                    <p className="text-foreground/80">
                      Led product management for Azure Batch SDKs, delivering libraries that enabled developers to build applications 
                      leveraging distributed compute capabilities across clusters for data processing and ML workloads.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Experience */}
              <div className="space-y-3">
                <h2 className="text-xl font-bold">Work Experience</h2>
                <div className="space-y-6">
                  {/* Microsoft */}
                  <div className="space-y-3 rounded-lg border border-border p-4">
                    <div className="flex flex-col justify-between gap-2 sm:flex-row">
                      <div>
                        <h3 className="text-lg font-semibold">Senior Product Manager - TypeSpec API Definition Language</h3>
                        <p className="text-foreground/80">Microsoft</p>
                      </div>
                      <div className="text-sm text-foreground/70">
                        <p>June 2021 - Present</p>
                      </div>
                    </div>
                    <ul className="space-y-1 text-foreground/80">
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>
                          Drive product vision and strategy for TypeSpec, an open-source API definition language transforming API development.
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>
                          Define and execute a long-term roadmap, aligning with company goals and customer needs.
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>
                          Guide Azure service teams as a member of the Azure API Stewardship Board, driving best practices for API development.
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>
                          Conduct user research to identify pain points and translate insights into actionable product features.
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>
                          Define key performance indicators (KPIs) to measure product success and iterate based on real-world usage.
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>
                          Led the zero-to-one product launch of TypeSpec, delivering a high-impact solution that simplifies API design and accelerates development.
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>
                          Achieved 8-10x code reduction and reduced API review times by 33% through improved readability and consistency.
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>
                          Led product management for Azure Batch SDKs, developing libraries that enable developers to build applications leveraging distributed computing capabilities.
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>
                          Champion TypeSpec's value proposition through community engagement, training, and thought leadership.
                        </span>
                      </li>
                    </ul>
                  </div>
                  
                  {/* Qualcomm */}
                  <div className="space-y-3 rounded-lg border border-border p-4">
                    <div className="flex flex-col justify-between gap-2 sm:flex-row">
                      <div>
                        <h3 className="text-lg font-semibold">Principal Software Engineer / Manager</h3>
                        <p className="text-foreground/80">Qualcomm</p>
                      </div>
                      <div className="text-sm text-foreground/70">
                        <p>June 2008 - June 2021</p>
                      </div>
                    </div>
                    <ul className="space-y-1 text-foreground/80">
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>
                          Led the development of tools and platforms for Qualcomm's Hexagon DSP, the core of Snapdragon modem (wireless) 
                          and Neural Processing Unit (NPU) technology.
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>
                          Served as de-facto product manager for Hexagon tools used by first-party software development teams, gathering 
                          requirements, defining roadmaps, and designing user experiences that addressed developer pain points.
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>
                          Improved on-time delivery by 35% through the implementation of data-driven development processes, 
                          optimizing project timelines and efficiency.
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>
                          Spearheaded the transition from legacy GNU binutils to LLVM binutils, modernizing the toolchain and driving 
                          Agile adoption across teams for improved workflow.
                        </span>
                      </li>
                    </ul>
                  </div>
                  
                  {/* ARM */}
                  <div className="space-y-3 rounded-lg border border-border p-4">
                    <div className="flex flex-col justify-between gap-2 sm:flex-row">
                      <div>
                        <h3 className="text-lg font-semibold">Senior Applications Engineer</h3>
                        <p className="text-foreground/80">ARM, Inc.</p>
                      </div>
                      <div className="text-sm text-foreground/70">
                        <p>October 2006 - June 2008</p>
                      </div>
                    </div>
                    <ul className="space-y-1 text-foreground/80">
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>
                          Delivered pre- and post-sales support for ARM's Cortex cores and software development tools.
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>
                          Developed training materials and hosted sessions to drive customer adoption.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Education */}
              <div className="space-y-3">
                <h2 className="text-xl font-bold">Education & Certification</h2>
                <div className="space-y-6">
                  <div className="space-y-3 rounded-lg border border-border p-4">
                    <div className="flex flex-col justify-between gap-2 sm:flex-row">
                      <div>
                        <h3 className="text-lg font-semibold">Masters of Engineering, Embedded Systems</h3>
                        <p className="text-foreground/80">Arizona State University</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 rounded-lg border border-border p-4">
                    <div className="flex flex-col justify-between gap-2 sm:flex-row">
                      <div>
                        <h3 className="text-lg font-semibold">Bachelor of Science, Computer Engineering</h3>
                        <p className="text-foreground/80">St. Mary's University</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Certifications */}
              <div className="space-y-3">
                <h2 className="text-xl font-bold">Professional Certifications</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-border p-4">
                    <h3 className="font-semibold">Pragmatic Management Certified (PMC-I)</h3>
                    <p className="text-sm text-foreground/70">Pragmatic Institute</p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <h3 className="font-semibold">Rust Essential Training</h3>
                    <p className="text-sm text-foreground/70">LinkedIn Learning</p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <h3 className="font-semibold">AZ-900: Microsoft Azure Fundamentals</h3>
                    <p className="text-sm text-foreground/70">Microsoft</p>
                  </div>
                </div>
              </div>
              
              {/* Publications */}
              <div className="space-y-3">
                <h2 className="text-xl font-bold">Publications</h2>
                <div className="space-y-3">
                  <div className="rounded-lg border border-border p-4">
                    <h3 className="font-semibold"><a href="https://typespec.io/blog/typespec-1-0-GA-release/" className="hover:text-primary">TypeSpec 1.0 GA - API-First, Made Practical</a></h3>
                    <p className="text-foreground/80">Highlighted TypeSpec's impact on scalable API development and developer productivity.</p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <h3 className="font-semibold"><a href="https://marioguerra.xyz/blog/typespec-first-vibe-code-second/" className="hover:text-primary">TypeSpec First, Vibe Code Second</a></h3>
                    <p className="text-foreground/80">Explores 'vibe coding' and introduces TypeSpec as a structured approach to building APIs, combining AI code generation with robust design principles.</p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <h3 className="font-semibold"><a href="https://marioguerra.xyz/blog/ai-document-summarization-with-sliding-content-window/" className="hover:text-primary">AI Document Summarization with Sliding Content Window</a></h3>
                    <p className="text-foreground/80">A practical solution for overcoming AI token limitations when summarizing large documents.</p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <h3 className="font-semibold"><a href="https://marioguerra.xyz/blog/building-intelligent-chatbots-with-microsoft-teams-data/" className="hover:text-primary">Building Intelligent Chatbots with Microsoft Teams Data</a></h3>
                    <p className="text-foreground/80">Demonstrates how to extract Microsoft Teams channel data using the Graph API to build RAG-enhanced chatbots, improving productivity.</p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <h3 className="font-semibold"><a href="https://devblogs.microsoft.com/azure-sdk/transcribing-and-translating-with-azure-sdks/" className="hover:text-primary">Audio Alchemy: Transcribing and Translating with Azure SDKs</a></h3>
                    <p className="text-foreground/80">Demonstrates how to translate and transcribe audio using Azure Cognitive Services and Azure OpenAI.</p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <h3 className="font-semibold"><a href="https://marioguerra.xyz/documentation/api_strategy_governance/" className="hover:text-primary">API Strategy and Governance</a></h3>
                    <p className="text-foreground/80">Provided strategic guidance for effective API programs.</p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <h3 className="font-semibold"><a href="https://marioguerra.xyz/documentation/making_apis_consumable_by_agents/" className="hover:text-primary">Making APIs Consumable by AI Agents</a></h3>
                    <p className="text-foreground/80">Strategies for designing APIs that can be effectively discovered, understood, and utilized by AI agents and LLMs.</p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <h3 className="font-semibold"><a href="https://marioguerra.xyz/blog/promoting-apis-from-plumbing-to-products/" className="hover:text-primary">Promoting APIs from Plumbing to Products</a></h3>
                    <p className="text-foreground/80">Perspective on elevating APIs from hidden infrastructure to polished products by prioritizing developer experience and usability.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
