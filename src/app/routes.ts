import { lazy } from "react";
import { createBrowserRouter } from "react-router";
import { Root } from "./Root";
import Home from "./pages/Home";

const About = lazy(() => import("./pages/About"));
const Projects = lazy(() => import("./pages/Projects"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const NewsArticle = lazy(() => import("./pages/NewsArticle"));
const Impact = lazy(() => import("./pages/Impact"));
const Contact = lazy(() => import("./pages/Contact"));
const Donate = lazy(() => import("./pages/Donate"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const ThematicAreaPage = lazy(() => import("./pages/ThematicAreaPage"));
const ProgramPage = lazy(() => import("./pages/ProgramPage"));
const OrganizationPage = lazy(() => import("./pages/OrganizationPage"));
const GetInvolvedPage = lazy(() => import("./pages/GetInvolvedPage"));
const AllPrograms = lazy(() => import("./pages/AllPrograms"));
const Campaigns = lazy(() => import("./pages/Campaigns"));
const KnowledgeHub = lazy(() => import("./pages/KnowledgeHub"));
const MediaCenter = lazy(() => import("./pages/MediaCenter"));
const LegalPage = lazy(() => import("./pages/LegalPage"));
const TechPartnerPage = lazy(() => import("./pages/TechPartnerPage"));
const ResearchAreaPage = lazy(() => import("./pages/ResearchAreaPage"));
const YouthEngagement = lazy(() => import("./pages/YouthEngagement"));
const ResearchPolicy = lazy(() => import("./pages/ResearchPolicy"));

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
      // Thematic Areas Directory & Detail Pages
      { path: "thematic-areas", Component: ThematicAreaPage },
      { path: "thematic-areas/:area", Component: ThematicAreaPage },
      // Methodology / What We Do
      { path: "what-we-do", Component: Home },
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
      { path: "global-representatives", Component: GetInvolvedPage },
      { path: "representatives", Component: GetInvolvedPage },
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
      { path: "admin/dashboard/:section", Component: AdminDashboard },
      { path: "admin/:section", Component: AdminDashboard },
      // Catch-all
      { path: "*", Component: Home },
    ],
  },
]);
