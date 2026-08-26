import { HeroSection } from "../components/home/HeroSection";
import { WhoWeAreSection } from "../components/home/WhoWeAreSection";
import { MissionSection } from "../components/home/MissionSection";
import { WhatWeDoSection } from "../components/home/WhatWeDoSection";
import { StatsSection } from "../components/home/StatsSection";
import { CoreProgramsSection } from "../components/home/CoreProgramsSection";
import { CampaignsSection } from "../components/home/CampaignsSection";
import { ProjectsSection } from "../components/home/ProjectsSection";
import { TestimonialsSection } from "../components/home/TestimonialsSection";
import { PartnersNewsSection } from "../components/home/PartnersNewsSection";
import { DonateCTASection } from "../components/home/DonateCTASection";
import { FAQSection } from "../components/home/FAQSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <StatsSection />
      <WhoWeAreSection />
      <MissionSection />
      <WhatWeDoSection />
      <CoreProgramsSection />
      <ProjectsSection />
      <CampaignsSection />
      <TestimonialsSection />
      <PartnersNewsSection />
      
      <div className="h-16 lg:h-24 bg-[#F6FBF8]" />
      <DonateCTASection />
      <FAQSection />
      {/* Spacer to transition smoothly into the footer */}
      <div className="h-16 lg:h-24 bg-[#F6FBF8]" />
    </main>
  );
}
