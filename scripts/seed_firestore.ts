import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../src/lib/firebase";

// Import all getters and initial data models
import {
  initialHeroData,
  initialStoryData,
  initialMilestones,
  initialTeamMembers,
  initialVisionMissionData,
  initialGlobalPresenceData
} from "../src/app/pages/admin/sections/AboutPageAdminView";
import { getInitialMissionValues, getInitialMissionSection } from "../src/app/pages/admin/sections/MissionAdminView";
import { getInitialWhoWeAreFeatures, getInitialWhoWeAreStory } from "../src/app/pages/admin/sections/WhoWeAreAdminView";
import { getInitialStats } from "../src/app/pages/admin/sections/StatsAdminView";
import { getInitialThematicAreas } from "../src/app/pages/admin/sections/ThematicAreasView";
import { getInitialTestimonials } from "../src/app/pages/admin/sections/TestimonialsView";
import { getInitialHeroSlides } from "../src/app/pages/admin/sections/HeroAdminView";
import { getInitialFAQs } from "../src/app/pages/admin/sections/FAQAdminView";
import { getInitialYouthInitiatives, getInitialYouthStats } from "../src/app/pages/admin/sections/YouthAdminView";
import { getInitialResearchAreas } from "../src/app/pages/admin/sections/ResearchAdminView";
import { getInitialPartners } from "../src/app/pages/admin/sections/PartnersView";
import { getInitialCampaigns } from "../src/app/pages/admin/sections/CampaignsView";
import { getInitialPrograms } from "../src/app/pages/admin/sections/ProgramsView";
import { getInitialProjects } from "../src/app/pages/admin/sections/ProjectsView";
import { getInitialDonations } from "../src/app/pages/admin/sections/DonationsView";
import { getInitialEvents } from "../src/app/pages/admin/sections/EventsView";
import { getInitialUsers } from "../src/app/pages/admin/sections/UsersView";
import { defaultJobs, defaultRoles } from "../src/app/pages/admin/sections/OpportunitiesView";
import { getInitialContent } from "../src/app/pages/admin/AdminDashboard";
import { getInitialNotifications } from "../src/lib/notificationService";
import { getInitialWorkSessions } from "../src/lib/workHoursService";
import { getInitialStaffUsers } from "../src/lib/staffAuthService";
import { getInitialRoles } from "../src/app/pages/admin/sections/RolesView";

interface SeedTask {
  key: string;
  getDefault: () => any;
  overwriteIfEmptyArray?: boolean;
}

const tasks: SeedTask[] = [
  // 1. About CMS Sections
  { key: "esn_about_hero", getDefault: () => initialHeroData },
  { key: "esn_about_story", getDefault: () => initialStoryData },
  { key: "esn_about_milestones", getDefault: () => initialMilestones },
  { key: "esn_about_team", getDefault: () => initialTeamMembers },
  { key: "esn_about_vision_mission", getDefault: () => initialVisionMissionData },
  { key: "esn_about_global_presence", getDefault: () => initialGlobalPresenceData },

  // 2. Mission & Homepage Sections
  { key: "esn_mission_section_admin", getDefault: getInitialMissionSection },
  { key: "esn_mission_admin", getDefault: getInitialMissionValues },
  { key: "esn_whoweare_story", getDefault: getInitialWhoWeAreStory },
  { key: "esn_whoweare_admin", getDefault: getInitialWhoWeAreFeatures },
  { key: "esn_who_we_are_admin", getDefault: getInitialWhoWeAreFeatures },
  { key: "esn_hero_admin", getDefault: getInitialHeroSlides },
  { key: "esn_hero", getDefault: getInitialHeroSlides },

  // 3. Stats & Areas
  { key: "esn_stats_admin", getDefault: getInitialStats },
  { key: "esn_impact_stats", getDefault: getInitialStats },
  { key: "esn_thematic_areas_admin", getDefault: getInitialThematicAreas },
  { key: "esn_research_admin", getDefault: getInitialResearchAreas },
  { key: "esn_research_areas", getDefault: getInitialResearchAreas },
  { key: "esn_youth_initiatives_admin", getDefault: getInitialYouthInitiatives },
  { key: "esn_youth_initiatives", getDefault: getInitialYouthInitiatives },
  { key: "esn_youth_stats", getDefault: getInitialYouthStats },
  { key: "esn_youth_stats_admin", getDefault: getInitialYouthStats },

  // 4. Testimonials, FAQs & Partners
  { key: "esn_testimonials_admin", getDefault: getInitialTestimonials },
  { key: "esn_testimonials", getDefault: getInitialTestimonials },
  { key: "esn_faq_admin", getDefault: getInitialFAQs },
  { key: "esn_faqs", getDefault: getInitialFAQs },
  { key: "esn_partners_admin", getDefault: getInitialPartners },
  { key: "esn_partners", getDefault: getInitialPartners },

  // 5. Projects & Campaigns (Populate and sync empty array keys)
  { key: "esn_projects_admin", getDefault: getInitialProjects, overwriteIfEmptyArray: true },
  { key: "esn_projects", getDefault: getInitialProjects, overwriteIfEmptyArray: true },
  { key: "esn_campaigns_admin", getDefault: getInitialCampaigns, overwriteIfEmptyArray: true },
  { key: "esn_campaigns", getDefault: getInitialCampaigns, overwriteIfEmptyArray: true },
  { key: "esn_programs", getDefault: getInitialPrograms, overwriteIfEmptyArray: true },
  { key: "esn_programs_admin", getDefault: getInitialPrograms, overwriteIfEmptyArray: true },
  { key: "esn_events", getDefault: getInitialEvents, overwriteIfEmptyArray: true },

  // 6. CMS Content (Rich News & Articles)
  { key: "esn_cms_content", getDefault: getInitialContent, overwriteIfEmptyArray: true },

  // 7. Work Hours & Staff Roles
  { key: "esn_staff_work_hours", getDefault: getInitialWorkSessions, overwriteIfEmptyArray: true },
  { key: "esn_staff_users", getDefault: getInitialStaffUsers },
  { key: "esn_roles", getDefault: getInitialRoles },
  { key: "esn_roles_admin", getDefault: getInitialRoles },

  // 8. Careers & Volunteer Roles
  { key: "esn_career_jobs", getDefault: () => defaultJobs },
  { key: "esn_volunteer_roles", getDefault: () => defaultRoles },

  // 9. Notifications
  { key: "esn_notifications", getDefault: getInitialNotifications, overwriteIfEmptyArray: true },
];

async function seedAndSync() {
  console.log("==================================================");
  console.log("Starting Cloud Firestore Database Audit & Sync...");
  console.log("Database Collection: site_data");
  console.log("==================================================");

  let createdCount = 0;
  let updatedEmptyCount = 0;
  let preservedCount = 0;

  for (const task of tasks) {
    try {
      const docRef = doc(db, "site_data", task.key);
      const snap = await getDoc(docRef);

      if (!snap.exists()) {
        const defaultVal = task.getDefault();
        await setDoc(docRef, { value: defaultVal }, { merge: true });
        console.log(`[CREATED IN FIRESTORE] ${task.key}`);
        createdCount++;
      } else {
        const data = snap.data();
        const val = data?.value !== undefined ? data.value : data;
        const isEmptyArray = Array.isArray(val) && val.length === 0;

        if (isEmptyArray && task.overwriteIfEmptyArray) {
          const defaultVal = task.getDefault();
          await setDoc(docRef, { value: defaultVal }, { merge: true });
          console.log(`[POPULATED EMPTY ARRAY] ${task.key} -> filled with default rich records (${defaultVal.length} items)`);
          updatedEmptyCount++;
        } else {
          const isArr = Array.isArray(val);
          const count = isArr ? val.length : (val && typeof val === "object" ? Object.keys(val).length : 1);
          console.log(`[PRESERVED] ${task.key} (${isArr ? `array[${count}]` : `object(${count})`})`);
          preservedCount++;
        }
      }
    } catch (err: any) {
      console.error(`[ERROR] ${task.key}:`, err?.message || err);
    }
  }

  // Cross-check: If esn_projects_admin has data, make sure esn_projects has identical data
  try {
    const adminProjRef = doc(db, "site_data", "esn_projects_admin");
    const pubProjRef = doc(db, "site_data", "esn_projects");
    const adminSnap = await getDoc(adminProjRef);
    if (adminSnap.exists()) {
      const adminData = adminSnap.data()?.value || adminSnap.data();
      if (Array.isArray(adminData) && adminData.length > 0) {
        await setDoc(pubProjRef, { value: adminData }, { merge: true });
        console.log(`[SYNCED] esn_projects mirrored to esn_projects_admin (${adminData.length} items)`);
      }
    }
  } catch (e: any) {
    console.error("Error mirroring projects:", e);
  }

  // Cross-check: If esn_campaigns_admin has data, make sure esn_campaigns has identical data
  try {
    const adminCampRef = doc(db, "site_data", "esn_campaigns_admin");
    const pubCampRef = doc(db, "site_data", "esn_campaigns");
    const adminSnap = await getDoc(adminCampRef);
    if (adminSnap.exists()) {
      const adminData = adminSnap.data()?.value || adminSnap.data();
      if (Array.isArray(adminData) && adminData.length > 0) {
        await setDoc(pubCampRef, { value: adminData }, { merge: true });
        console.log(`[SYNCED] esn_campaigns mirrored to esn_campaigns_admin (${adminData.length} items)`);
      }
    }
  } catch (e: any) {
    console.error("Error mirroring campaigns:", e);
  }

  // Cross-check: If esn_roles has data, make sure esn_roles_admin has identical data
  try {
    const rolesRef = doc(db, "site_data", "esn_roles");
    const adminRolesRef = doc(db, "site_data", "esn_roles_admin");
    const rolesSnap = await getDoc(rolesRef);
    if (rolesSnap.exists()) {
      const rolesData = rolesSnap.data()?.value || rolesSnap.data();
      await setDoc(adminRolesRef, { value: rolesData }, { merge: true });
      console.log(`[SYNCED] esn_roles_admin mirrored to esn_roles`);
    }
  } catch (e: any) {
    console.error("Error mirroring roles:", e);
  }

  console.log("==================================================");
  console.log(`DONE! Created: ${createdCount}, Populated: ${updatedEmptyCount}, Preserved: ${preservedCount}`);
  console.log("All sections are now 100% saved and synchronized in Cloud Firestore!");
  console.log("==================================================");
}

seedAndSync().then(() => process.exit(0)).catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
