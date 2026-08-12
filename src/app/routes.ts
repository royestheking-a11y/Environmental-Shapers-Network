import { createBrowserRouter } from "react-router";
import { Root } from "./Root";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import NewsArticle from "./pages/NewsArticle";
import Impact from "./pages/Impact";
import Contact from "./pages/Contact";
import Donate from "./pages/Donate";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ThematicAreaPage from "./pages/ThematicAreaPage";
import ProgramPage from "./pages/ProgramPage";
import OrganizationPage from "./pages/OrganizationPage";
import GetInvolvedPage from "./pages/GetInvolvedPage";
import AllPrograms from "./pages/AllPrograms";
import Campaigns from "./pages/Campaigns";
import KnowledgeHub from "./pages/KnowledgeHub";
import MediaCenter from "./pages/MediaCenter";
import LegalPage from "./pages/LegalPage";
import TechPartnerPage from "./pages/TechPartnerPage";
import ResearchAreaPage from "./pages/ResearchAreaPage";
import YouthEngagement from "./pages/YouthEngagement";
import ResearchPolicy from "./pages/ResearchPolicy";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "projects", Component: Projects },
      { path: "projects/:id", Component: ProjectDetail },
      { path: "impact", Component: Impact },
      { path: "contact", Component: Contact },
      { path: "donate", Component: Donate },
      // Thematic Areas
      { path: "thematic-areas/:area", Component: ThematicAreaPage },
      // Programs
      { path: "programs", Component: AllPrograms },
      { path: "programs/youth", Component: YouthEngagement },
      { path: "programs/:program", Component: ProgramPage },
      { path: "insights", Component: ProgramPage },
      { path: "events", Component: ProgramPage },
      // Campaigns (public)
      { path: "campaigns", Component: Campaigns },
      // Organization
      { path: "our-team", Component: OrganizationPage },
      { path: "board", Component: OrganizationPage },
      { path: "reports", Component: OrganizationPage },
      { path: "awards", Component: OrganizationPage },
      // Get Involved
      { path: "volunteer", Component: GetInvolvedPage },
      { path: "membership", Component: GetInvolvedPage },
      { path: "campus-chapters", Component: GetInvolvedPage },
      { path: "partner", Component: GetInvolvedPage },
      { path: "careers", Component: GetInvolvedPage },
      // Resources
      { path: "knowledge-hub", Component: KnowledgeHub },
      { path: "media-center", Component: MediaCenter },
      { path: "research", Component: ResearchPolicy },
      { path: "research/:area", Component: ResearchAreaPage },
      // News articles
      { path: "news/:id", Component: NewsArticle },
      // Legal
      { path: "privacy", Component: LegalPage },
      { path: "terms", Component: LegalPage },
      { path: "cookie-policy", Component: LegalPage },
      { path: "accessibility", Component: LegalPage },
      { path: "tech-partner", Component: TechPartnerPage },
      // Admin
      { path: "admin", Component: AdminLogin },
      { path: "admin/dashboard", Component: AdminDashboard },
      // Catch-all
      { path: "*", Component: Home },
    ],
  },
]);
