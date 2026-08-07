import { HeroSection } from "../components/home/HeroSection";
import { TrustedBySection } from "../components/home/TrustedBySection";
import { WhoWeAreSection } from "../components/home/WhoWeAreSection";
import { WhatWeDoSection } from "../components/home/WhatWeDoSection";
import { StatsSection } from "../components/home/StatsSection";
import { CoreProgramsSection } from "../components/home/CoreProgramsSection";
import { ResearchKnowledgeSection } from "../components/home/ResearchKnowledgeSection";
import { CampaignsSection } from "../components/home/CampaignsSection";
import { ProjectsSection } from "../components/home/ProjectsSection";
import { YouthDevelopmentSection } from "../components/home/YouthDevelopmentSection";
import { CollaborationSection } from "../components/home/CollaborationSection";
import { TestimonialsSection } from "../components/home/TestimonialsSection";
import { PartnersNewsSection } from "../components/home/PartnersNewsSection";
import { NewsletterSection } from "../components/home/NewsletterSection";
import { DonateCTASection } from "../components/home/DonateCTASection";
import { FAQSection } from "../components/home/FAQSection";
import { ContactSection } from "../components/home/ContactSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <WhoWeAreSection />
      <WhatWeDoSection />
      <StatsSection />
      <CoreProgramsSection />
      <TrustedBySection />
      <ResearchKnowledgeSection />
      <CampaignsSection />
      <ProjectsSection />
      <YouthDevelopmentSection />
      <CollaborationSection />
      <TestimonialsSection />
      <PartnersNewsSection />
      
      <NewsletterSection />
      {/* Spacer between Newsletter and Donate CTA */}
      <div className="h-16 lg:h-24 bg-[#F6FBF8]" />
      <DonateCTASection />
      <FAQSection />
      <ContactSection />
      {/* Spacer to transition smoothly into the footer SVG wave */}
      <div className="h-16 lg:h-24 bg-[#F6FBF8]" />
    </main>
  );
}
