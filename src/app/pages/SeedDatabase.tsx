import { useEffect, useState } from "react";
import { saveFirestoreData } from "../../lib/useFirestore";

// Import all getters
import { getInitialMissionValues } from "./admin/sections/MissionAdminView";
import { getInitialStats } from "./admin/sections/StatsAdminView";
import { getInitialThematicAreas } from "./admin/sections/ThematicAreasView";
import { getInitialTestimonials } from "./admin/sections/TestimonialsView";
import { getInitialHeroSlides } from "./admin/sections/HeroAdminView";
import { getInitialFAQs } from "./admin/sections/FAQAdminView";
import { getInitialYouthInitiatives, getInitialYouthStats } from "./admin/sections/YouthAdminView";
import { getInitialResearchAreas } from "./admin/sections/ResearchAdminView";
import { getInitialPartners } from "./admin/sections/PartnersView";
import { getInitialWhoWeAreFeatures } from "./admin/sections/WhoWeAreAdminView";
import { getInitialCampaigns } from "./admin/sections/CampaignsView";
import { getInitialPrograms } from "./admin/sections/ProgramsView";
import { getInitialProjects } from "./admin/sections/ProjectsView";

export default function SeedDatabase() {
  const [status, setStatus] = useState("Seeding database... Please wait.");

  useEffect(() => {
    async function seed() {
      try {
        await saveFirestoreData("esn_mission_admin", getInitialMissionValues());
        await saveFirestoreData("esn_stats_admin", getInitialStats());
        await saveFirestoreData("esn_thematic_areas_admin", getInitialThematicAreas());
        await saveFirestoreData("esn_testimonials_admin", getInitialTestimonials());
        await saveFirestoreData("esn_hero_admin", getInitialHeroSlides());
        await saveFirestoreData("esn_faq_admin", getInitialFAQs());
        await saveFirestoreData("esn_youth_initiatives_admin", getInitialYouthInitiatives());
        await saveFirestoreData("esn_youth_stats", getInitialYouthStats());
        await saveFirestoreData("esn_research_admin", getInitialResearchAreas());
        await saveFirestoreData("esn_partners_admin", getInitialPartners());
        await saveFirestoreData("esn_whoweare_admin", getInitialWhoWeAreFeatures());
        await saveFirestoreData("esn_campaigns_admin", getInitialCampaigns());
        await saveFirestoreData("esn_programs", getInitialPrograms());
        await saveFirestoreData("esn_projects_admin", getInitialProjects());

        setStatus("Database seeded successfully! You can check your Firebase Console now.");
      } catch (e) {
        console.error(e);
        setStatus("Error seeding database.");
      }
    }
    seed();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 bg-white rounded-xl shadow-sm text-center">
        <h2 className="text-xl font-bold mb-4">Database Seeder</h2>
        <p className="text-gray-600">{status}</p>
      </div>
    </div>
  );
}
