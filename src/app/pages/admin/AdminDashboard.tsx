import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useFirestoreData, fetchFirestoreData, saveFirestoreData } from "../../../lib/useFirestore";
import { DonationsView } from "./sections/DonationsView";
import { EventsView } from "./sections/EventsView";
import { MediaLibraryView } from "./sections/MediaLibraryView";
import { NewsletterView } from "./sections/NewsletterView";
import { CampaignsView } from "./sections/CampaignsView";
import { RolesView } from "./sections/RolesView";
import { DataBackupView } from "./sections/DataBackupView";
import { SettingsView } from "./sections/SettingsView";
import { MessagesView } from "./sections/MessagesView";
import FAQAdminView from "./sections/FAQAdminView";
import { ProjectsView } from "./sections/ProjectsView";
import { ProgramsView } from "./sections/ProgramsView";
import { UsersView } from "./sections/UsersView";
import { ApplicationsView } from "./sections/ApplicationsView";
import { OpportunitiesView } from "./sections/OpportunitiesView";
import TestimonialsView from "./sections/TestimonialsView";
import ThematicAreasView from "./sections/ThematicAreasView";
import PartnersView from "./sections/PartnersView";
import HeroAdminView from "./sections/HeroAdminView";
import WhoWeAreAdminView from "./sections/WhoWeAreAdminView";
import StatsAdminView from "./sections/StatsAdminView";
import MissionAdminView from "./sections/MissionAdminView";
import ResearchAdminView from "./sections/ResearchAdminView";
import YouthAdminView from "./sections/YouthAdminView";
import { ImageUploadField } from "../../components/ui/ImageUploadField";
import { ActivityLogItem, getInitialActivityLogs } from "../../../lib/activityLogger";
import {
  LayoutDashboard, TreePine, Globe2, Users, Heart, Megaphone, Calendar, BarChart3, FileText, Settings,
  Bell, Search, LogOut, ChevronDown, Menu, X, TrendingUp, TrendingDown, Eye, Edit3, Trash2,
  Plus, Filter, Download, RefreshCw, Shield, Mail, Image, Database, Leaf, Target, Award,
  AlertCircle, CheckCircle2, Clock, MapPin, Star, Briefcase, MessageSquare, MonitorPlay, Focus,
  Activity,
} from "lucide-react";
import { AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface AdminUser {
  email: string;
  role: string;
  name: string;
}

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: FileText, label: "Content (CMS)", id: "cms", badge: 3 },
  { icon: MonitorPlay, label: "Hero Section", id: "hero" },
  { icon: Focus, label: "Who We Are", id: "whoweare" },
  { icon: BarChart3, label: "Impact Stats", id: "stats" },
  { icon: Heart, label: "Mission Values", id: "mission" },
  { icon: Target, label: "Thematic Areas", id: "thematic" },
  { icon: Globe2, label: "Research", id: "research" },
  { icon: TreePine, label: "Programs", id: "programs" },
  { icon: Users, label: "Youth Development", id: "youth" },
  { icon: Globe2, label: "Projects", id: "projects" },
  { icon: Megaphone, label: "Campaigns", id: "campaigns" },
  { icon: Calendar, label: "Events", id: "events" },
  { icon: Award, label: "Partners", id: "partners" },
  { icon: MessageSquare, label: "Testimonials", id: "testimonials" },
    { icon: MessageSquare, label: "FAQ / Q&A", id: "faq" },
  { icon: Heart, label: "Donations", id: "donations" },
  { icon: Users, label: "Members & Users", id: "users" },
  { icon: BarChart3, label: "Analytics", id: "analytics" },
  { icon: Image, label: "Media Library", id: "media" },
  { icon: Mail, label: "Newsletter", id: "newsletter" },
  { icon: MessageSquare, label: "Messages", id: "messages" },
  { icon: Shield, label: "Roles & Permissions", id: "roles" },
  { icon: Users, label: "Applications", id: "applications", badge: 0 },
  { icon: Briefcase, label: "Careers & Volunteering", id: "opportunities" },
  { icon: Database, label: "Data & Backup", id: "data" },
  { icon: Settings, label: "Settings", id: "settings" },
];

const weeklyData = [
  { day: "Mon", visitors: 1200, actions: 340 },
  { day: "Tue", visitors: 1890, actions: 520 },
  { day: "Wed", visitors: 2100, actions: 680 },
  { day: "Thu", visitors: 1700, actions: 450 },
  { day: "Fri", visitors: 2450, actions: 790 },
  { day: "Sat", visitors: 3200, actions: 1100 },
  { day: "Sun", visitors: 2800, actions: 950 },
];

const monthlyDonations = [
  { month: "Jan", amount: 42000 }, { month: "Feb", amount: 58000 }, { month: "Mar", amount: 71000 },
  { month: "Apr", amount: 65000 }, { month: "May", amount: 89000 }, { month: "Jun", amount: 104000 },
];

const kpiCards = [
  { label: "Total Donations", value: "$2.4M", change: "+18%", up: true, icon: Heart, color: "#0B5D3F" },
  { label: "Active Members", value: "48,291", change: "+12%", up: true, icon: Users, color: "#173B63" },
  { label: "Active Projects", value: "470", change: "+24", up: true, icon: Globe2, color: "#4CAF50" },
  { label: "Monthly Visitors", value: "186K", change: "+31%", up: true, icon: Eye, color: "#D6A95A" },
];

const recentDonations = [
  { name: "Anonymous", amount: 500, project: "Plant A Million Trees", time: "2 min ago", status: "completed" },
  { name: "Sarah Chen", amount: 250, project: "Ocean Initiative", time: "15 min ago", status: "completed" },
  { name: "Ahmad Raza", amount: 100, project: "Youth Program", time: "1 hr ago", status: "completed" },
  { name: "Maria Santos", amount: 1000, project: "Forest Hub Brazil", time: "3 hrs ago", status: "completed" },
  { name: "John Doe", amount: 50, project: "General Fund", time: "5 hrs ago", status: "pending" },
];

const recentActivity = [
  { type: "project", action: "New project added", subject: "Sundarbans Phase 3", time: "10m", icon: TreePine, color: "#0B5D3F" },
  { type: "campaign", action: "Campaign updated", subject: "Ocean Initiative 2026", time: "25m", icon: Megaphone, color: "#4CAF50" },
  { type: "member", action: "New volunteer registered", subject: "Priya Sharma, India", time: "1h", icon: Users, color: "#173B63" },
  { type: "donation", action: "Large donation received", subject: "$5,000 from TechCorp", time: "2h", icon: Heart, color: "#D6A95A" },
  { type: "news", action: "Article published", subject: "Mangrove Project Results", time: "3h", icon: FileText, color: "#5B8DB8" },
];

function getInitialContent() {
  return [
    {
      id: 1,
      title: "ESN Launches Largest Mangrove Restoration Project in South Asia",
      type: "News",
      category: "Projects",
      status: "Published",
      author: "Admin",
      date: "July 22, 2026",
      views: 4821,
      excerpt: "A landmark initiative across Bangladesh and Myanmar targets 50,000 hectares of degraded coastal mangroves over five years.",
      image: "https://images.unsplash.com/photo-1656740978447-d61858ee2f11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=600",
      readTime: "5 min read",
      featured: true,
    },
    {
      id: 2,
      title: "Youth Climate Delegates from ESN Speak at UN General Assembly",
      type: "Event",
      category: "Policy",
      status: "Published",
      author: "Editor",
      date: "July 18, 2026",
      views: 3244,
      excerpt: "12 youth leaders from ESN Campus Chapters addressed world leaders on intergenerational climate justice.",
      image: "https://images.unsplash.com/photo-1616680214084-22670de1bc82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=600",
      readTime: "4 min read",
      featured: false,
    },
    {
      id: 3,
      title: "New Research: Nature-Based Solutions Can Deliver 30% of Climate Mitigation",
      type: "Report",
      category: "Research",
      status: "Published",
      author: "Admin",
      date: "July 10, 2026",
      views: 5210,
      excerpt: "ESN researchers publish landmark study in Nature Climate Change highlighting the potential of ecosystem-based approaches.",
      image: "https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=600",
      readTime: "8 min read",
      featured: true,
    }
  ];
}

const sectionAliases: Record<string, string> = {
  "thematic-areas": "thematic",
  "thematic_areas": "thematic",
  "faqs": "faq",
  "faq-qa": "faq",
  "members": "users",
  "users-members": "users",
  "roles-permissions": "roles",
  "data-backup": "data",
  "backup": "data",
  "careers": "opportunities",
  "volunteers": "opportunities",
  "content": "cms",
  "hero-section": "hero",
  "who-we-are": "whoweare",
  "impact-stats": "stats",
  "mission-values": "mission",
  "youth-development": "youth",
  "media-library": "media",
};

export default function AdminDashboard() {
  const { section } = useParams<{ section?: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const activeSection = useMemo(() => {
    // If route is /admin/dashboard/:section or /admin/:section
    const secParam = section || (location.pathname.startsWith("/admin/") && !location.pathname.endsWith("/dashboard") && !location.pathname.endsWith("/admin") ? location.pathname.split("/").pop() : "dashboard");
    if (!secParam || secParam === "dashboard") return "dashboard";
    const lower = secParam.toLowerCase();
    return sectionAliases[lower] || lower;
  }, [section, location.pathname]);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [cmsContent, setCmsContent, loadingCms] = useFirestoreData<any[]>("esn_cms_content", getInitialContent());
  const [user, setUser] = useState<AdminUser | null>(null);
  const [showAddContent, setShowAddContent] = useState(false);
  const [newContent, setNewContent] = useState({ title: "", type: "News", status: "Draft" });
  const [editingContent, setEditingContent] = useState<any>(null);
  const [cmsDeleteConfirmId, setCmsDeleteConfirmId] = useState<number | null>(null);
  const [pendingAppsCount, setPendingAppsCount] = useState(0);
  const [activityLogs] = useFirestoreData<ActivityLogItem[]>("esn_activity_logs", getInitialActivityLogs());

  useEffect(() => {
    const u = localStorage.getItem("esn_admin_user");
    if (!u) {
      navigate("/admin");
    } else {
      setUser(JSON.parse(u));
    }
    const fetchPendingApps = async () => {
      const keys = ["esn_apps_volunteer", "esn_apps_partner", "esn_apps_member", "esn_apps_career"];
      let pending = 0;
      for (const k of keys) {
        try {
          const apps = await fetchFirestoreData<any[]>(k, []);
          pending += apps.filter((a) => a.status === "Pending").length;
        } catch {}
      }
      setPendingAppsCount(pending);
    };
    fetchPendingApps();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("esn_admin_user");
    navigate("/admin");
  };

  const saveContent = async (content: typeof cmsContent) => {
    setCmsContent(content);
    await saveFirestoreData("esn_cms_content", content);
  };

  const addContent = () => {
    if (!newContent.title) return;
    const item = {
      id: Date.now(),
      title: newContent.title,
      type: newContent.type,
      status: newContent.status,
      author: user?.name || "Admin",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      views: 0,
    };
    saveContent([item, ...cmsContent]);
    setNewContent({ title: "", type: "News", status: "Draft" });
    setShowAddContent(false);
  };

  const deleteContent = (id: number) => {
    setCmsDeleteConfirmId(id);
  };

  const confirmDeleteContent = () => {
    if (cmsDeleteConfirmId === null) return;
    saveContent(cmsContent.filter((c: any) => c.id !== cmsDeleteConfirmId));
    setCmsDeleteConfirmId(null);
  };

  const startEditContent = (item: any) => {
    setEditingContent({ ...item });
  };

  const saveEditContent = () => {
    if (!editingContent) return;
    saveContent(cmsContent.map((c: any) => c.id === editingContent.id ? editingContent : c));
    setEditingContent(null);
  };

  const toggleStatus = (id: number) => {
    saveContent(cmsContent.map((c: any) => c.id === id ? { ...c, status: c.status === "Published" ? "Draft" : "Published" } : c));
  };

  if (!user) return null;

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardView kpiCards={kpiCards} weeklyData={weeklyData} monthlyDonations={monthlyDonations} recentDonations={recentDonations} recentActivity={activityLogs} />;
      case "cms":
        return <CMSView content={cmsContent} onDelete={deleteContent} onToggle={toggleStatus} onShowAdd={() => setShowAddContent(true)} showAdd={showAddContent} newContent={newContent} setNewContent={setNewContent} onAdd={addContent} onCancelAdd={() => setShowAddContent(false)} onEdit={startEditContent} editingContent={editingContent} setEditingContent={setEditingContent} onSaveEdit={saveEditContent} deleteConfirmId={cmsDeleteConfirmId} onConfirmDelete={confirmDeleteContent} onCancelDelete={() => setCmsDeleteConfirmId(null)} />;
      case "hero":
        return <HeroAdminView />;
      case "whoweare":
        return <WhoWeAreAdminView />;
      case "stats":
        return <StatsAdminView />;
      case "mission":
        return <MissionAdminView />;
      case "research":
        return <ResearchAdminView />;
      case "youth":
        return <YouthAdminView />;
      case "projects":
        return <ProjectsView />;
      case "programs":
        return <ProgramsView />;
      case "donations":
        return <DonationsView />;
      case "events":
        return <EventsView />;
      case "media":
        return <MediaLibraryView />;
      case "newsletter":
        return <NewsletterView />;
      case "faq":
        return <FAQAdminView />;
      case "messages":
        return <MessagesView />;
      case "campaigns":
        return <CampaignsView />;
      case "roles":
        return <RolesView />;
      case "data":
        return <DataBackupView />;
      case "settings":
        return <SettingsView />;
      case "users":
        return <UsersView />;
      case "applications":
        return <ApplicationsView />;
      case "opportunities":
        return <OpportunitiesView />;
      case "analytics":
        return <AnalyticsView weeklyData={weeklyData} monthlyDonations={monthlyDonations} />;
      case "testimonials":
        return <TestimonialsView />;
      case "thematic":
        return <ThematicAreasView />;
      case "partners":
        return <PartnersView />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-80 text-gray-400">
            <Settings size={48} className="mb-4 opacity-30" />
            <p className="font-semibold">Module not found</p>
            <p className="text-sm mt-1 mb-4">The requested section was not recognized</p>
            <Link to="/admin/dashboard" className="px-4 py-2 bg-[#0B5D3F] text-white text-sm font-semibold rounded-xl hover:bg-[#0a5237] transition-all">
              Return to Dashboard
            </Link>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-[#F6FBF8] overflow-hidden">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.25 }}
            className="w-70 bg-[#0a1f14] flex flex-col shrink-0 overflow-y-auto z-30 fixed lg:relative h-full"
            style={{ width: "280px" }}
          >
            <div className="p-6 border-b border-white/8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#4CAF50]/20 rounded-xl flex items-center justify-center">
                  <Leaf size={20} className="text-[#4CAF50]" />
                </div>
                <div>
                  <div className="text-white font-black text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>ESN Admin</div>
                  <div className="text-white/40 text-xs">Control Center</div>
                </div>
              </div>
            </div>

            <div className="p-4 mx-4 mt-4 bg-white/8 rounded-2xl border border-white/10 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4CAF50] to-[#0B5D3F] flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-semibold truncate">{user.name}</div>
                  <div className="text-[#4CAF50] text-xs">{user.role}</div>
                </div>
                <ChevronDown size={14} className="text-white/40" />
              </div>
            </div>

            <nav className="flex-1 px-3 pb-4">
              {sidebarItems.map((item) => {
                const isActive = activeSection === item.id;
                const targetUrl = item.id === "dashboard" ? "/admin/dashboard" : `/admin/dashboard/${item.id}`;
                return (
                  <Link
                    key={item.id}
                    to={targetUrl}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 mb-1 group ${
                      isActive
                        ? "bg-[#4CAF50] text-white shadow-md shadow-green-900/30"
                        : "text-white/60 hover:bg-white/8 hover:text-white"
                    }`}
                  >
                    <item.icon size={17} />
                    <span>{item.label}</span>
                    {(item.id === "applications" ? pendingAppsCount > 0 : item.badge) && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {item.id === "applications" ? pendingAppsCount : item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-white/8">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-sm font-semibold"
              >
                <LogOut size={17} />
                Sign Out
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-600"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <h4 className="text-gray-900 font-bold capitalize" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {sidebarItems.find(s => s.id === activeSection)?.label || "Dashboard"}
              </h4>
              <p className="text-xs text-gray-400">Environmental Shapers Network</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-[#F6FBF8] border border-gray-200 rounded-xl px-4 py-2.5 w-56">
              <Search size={15} className="text-gray-400" />
              <input type="text" placeholder="Quick search..." className="bg-transparent text-sm outline-none text-gray-600 w-full" />
            </div>

            <button className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors">
              <Bell size={18} className="text-gray-600" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4CAF50] to-[#0B5D3F] flex items-center justify-center text-white font-bold text-sm cursor-pointer">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

function DashboardView({ kpiCards, weeklyData, monthlyDonations, recentDonations, recentActivity }: any) {
  const kpiLinks: Record<string, string> = {
    "Total Donations": "/admin/dashboard/donations",
    "Active Members": "/admin/dashboard/users",
    "Active Projects": "/admin/dashboard/projects",
    "Monthly Visitors": "/admin/dashboard/analytics",
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-gradient-to-r from-[#0B5D3F] to-[#173B63] rounded-2xl p-7 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-20 w-40 h-40 rounded-full bg-white" />
          <div className="absolute bottom-0 right-0 w-24 h-24 rounded-full bg-[#4CAF50]" />
        </div>
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[#4CAF50] text-sm font-semibold mb-1">Welcome back</p>
              <h3 className="text-white mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>ESN Admin Dashboard</h3>
              <p className="text-white/65 text-sm">Monday, July 27, 2026 · All systems operational</p>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-white/15 border border-white/25 rounded-xl px-4 py-2 text-sm font-semibold">
              <CheckCircle2 size={15} className="text-[#4CAF50]" />
              Platform Status: Live
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-5">
            {[
              ["23", "Pending Reviews", "/admin/dashboard/applications"],
              ["7", "New Members Today", "/admin/dashboard/users"],
              ["$42,800", "Today's Donations", "/admin/dashboard/donations"]
            ].map(([v, l, path]) => (
              <Link key={l} to={path} className="group hover:opacity-90 transition-opacity">
                <div className="text-xl font-black text-[#4CAF50] group-hover:scale-105 transition-transform origin-left">{v}</div>
                <div className="text-xs text-white/50 group-hover:text-white/80">{l}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {kpiCards.map((kpi: any, i: number) => {
          const toPath = kpiLinks[kpi.label] || "/admin/dashboard";
          return (
            <Link key={kpi.label} to={toPath} className="block">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:shadow-gray-100 hover:border-[#4CAF50]/30 transition-all cursor-pointer h-full"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: kpi.color + "15" }}>
                    <kpi.icon size={20} style={{ color: kpi.color }} />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${kpi.up ? "bg-[#4CAF50]/10 text-[#4CAF50]" : "bg-red-50 text-red-500"}`}>
                    {kpi.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    {kpi.change}
                  </div>
                </div>
                <div className="text-2xl font-black text-gray-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{kpi.value}</div>
                <div className="text-xs text-gray-400">{kpi.label}</div>
              </motion.div>
            </Link>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h4 className="font-bold text-gray-900">Weekly Traffic</h4>
              <p className="text-xs text-gray-400">Visitors & Actions this week</p>
            </div>
            <Link to="/admin/dashboard/analytics" className="text-gray-300 hover:text-gray-500">
              <RefreshCw size={16} />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="dashVisitorsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0B5D3F" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0B5D3F" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="dashActionsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="visitors" stroke="#0B5D3F" strokeWidth={2} fill="url(#dashVisitorsGrad)" name="Visitors" />
              <Area type="monotone" dataKey="actions" stroke="#4CAF50" strokeWidth={2} fill="url(#dashActionsGrad)" name="Actions" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h4 className="font-bold text-gray-900">Monthly Donations</h4>
              <p className="text-xs text-gray-400">Jan–Jun 2026 (USD)</p>
            </div>
            <Link to="/admin/dashboard/donations" className="text-gray-300 hover:text-gray-500">
              <Download size={16} />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyDonations}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, "Donations"]} />
              <Bar dataKey="amount" fill="#4CAF50" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between p-6 border-b border-gray-50">
            <h4 className="font-bold text-gray-900">Recent Donations</h4>
            <Link to="/admin/dashboard/donations" className="text-xs text-[#0B5D3F] font-semibold hover:underline">View All</Link>
          </div>
          <div className="p-4">
            {recentDonations.map((d: any, i: number) => (
              <div key={i} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
                <div className="w-9 h-9 rounded-xl bg-[#0B5D3F]/10 flex items-center justify-center text-xs font-bold text-[#0B5D3F] shrink-0">
                  {d.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-800 truncate">{d.name}</div>
                  <div className="text-xs text-gray-400 truncate">{d.project}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-[#0B5D3F]">${d.amount}</div>
                  <div className="text-xs text-gray-400">{d.time}</div>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${d.status === "completed" ? "bg-[#4CAF50]/10 text-[#4CAF50]" : "bg-yellow-50 text-yellow-600"}`}>
                  {d.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-6 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-gray-900">Live System Activity</h4>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
            <Link to="/admin/dashboard/roles" className="text-xs text-[#0B5D3F] font-semibold hover:underline">Full Audit Trail →</Link>
          </div>
          <div className="p-4 divide-y divide-gray-50">
            {(recentActivity || []).slice(0, 5).map((a: any, i: number) => (
              <div key={a.id || i} className="flex items-start gap-3 py-3">
                <div className="w-9 h-9 rounded-xl bg-[#0B5D3F]/10 text-[#0B5D3F] flex items-center justify-center shrink-0 mt-0.5">
                  <Activity size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-gray-800">{a.action}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-semibold">{a.category}</span>
                  </div>
                  <div className="text-xs text-gray-500 truncate mt-0.5">{a.details}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5 font-medium">By: <strong className="text-gray-700">{a.userName}</strong> ({a.userRole})</div>
                </div>
                <div className="text-[11px] text-gray-400 shrink-0 font-medium">{a.timestamp}</div>
              </div>
            ))}
            {(!recentActivity || recentActivity.length === 0) && (
              <div className="py-8 text-center text-xs text-gray-400">No activity recorded yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CMSView({ content, onDelete, onToggle, onShowAdd, showAdd, newContent, setNewContent, onAdd, onCancelAdd, onEdit, editingContent, setEditingContent, onSaveEdit, deleteConfirmId, onConfirmDelete, onCancelDelete }: any) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-900 font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Content Management</h3>
          <p className="text-sm text-gray-400">{content.length} items · Manage all website content</p>
        </div>
        <button onClick={onShowAdd} className="flex items-center gap-2 bg-[#0B5D3F] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#0a5237] transition-all">
          <Plus size={16} /> New Content
        </button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-2xl p-6 border border-[#4CAF50]/30 overflow-hidden"
          >
            <h4 className="font-bold text-gray-900 mb-5">Add New Content</h4>
            <div className="grid sm:grid-cols-3 gap-4 mb-4">
              <div className="sm:col-span-1">
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Type</label>
                <select value={newContent.type || "News"} onChange={(e) => setNewContent({ ...newContent, type: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none">
                  {["News", "Event", "Report", "Campaign", "Update", "Blog"].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="sm:col-span-1">
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Status</label>
                <select value={newContent.status || "Draft"} onChange={(e) => setNewContent({ ...newContent, status: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none">
                  <option>Draft</option>
                  <option>Published</option>
                </select>
              </div>
              <div className="sm:col-span-1">
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Category</label>
                <input type="text" value={newContent.category || ""} onChange={(e) => setNewContent({ ...newContent, category: e.target.value })} placeholder="e.g. Projects, Policy" className="w-full px-3 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors" />
              </div>
              <div className="sm:col-span-3">
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Title *</label>
                <input type="text" value={newContent.title || ""} onChange={(e) => setNewContent({ ...newContent, title: e.target.value })} placeholder="Content title..." className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors" />
              </div>
              <div className="sm:col-span-3">
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Excerpt</label>
                <textarea value={newContent.excerpt || ""} onChange={(e) => setNewContent({ ...newContent, excerpt: e.target.value })} placeholder="Short description..." className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors resize-none h-20" />
              </div>
              <div className="sm:col-span-3">
                <ImageUploadField
                  label="Article / News Cover Image"
                  value={newContent.image || ""}
                  onChange={(url) => setNewContent({ ...newContent, image: url })}
                  folder="cms"
                  helpText="Upload a featured image for this article"
                />
              </div>
              <div className="sm:col-span-3 flex items-center pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={newContent.featured || false} onChange={(e) => setNewContent({ ...newContent, featured: e.target.checked })} className="w-4 h-4 rounded text-[#0B5D3F] focus:ring-[#0B5D3F]" />
                  <span className="text-sm font-bold text-gray-700">Mark as Featured Article</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { onAdd(); setNewContent({ title: "", type: "News", status: "Draft", image: "", excerpt: "", category: "", featured: false }); }} className="bg-[#0B5D3F] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0a5237] transition-all">Save Content</button>
              <button onClick={onCancelAdd} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-all">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingContent && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-2xl p-6 border border-[#173B63]/30 overflow-hidden"
          >
            <h4 className="font-bold text-gray-900 mb-5">Edit Content</h4>
            <div className="grid sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Type</label>
                <select value={editingContent.type || "News"} onChange={(e) => setEditingContent({ ...editingContent, type: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none">
                  {["News", "Event", "Report", "Campaign", "Update", "Blog"].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Status</label>
                <select value={editingContent.status || "Draft"} onChange={(e) => setEditingContent({ ...editingContent, status: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none">
                  <option>Draft</option>
                  <option>Published</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Category</label>
                <input type="text" value={editingContent.category || ""} onChange={(e) => setEditingContent({ ...editingContent, category: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none" />
              </div>
              <div className="sm:col-span-3">
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Title *</label>
                <input type="text" value={editingContent.title || ""} onChange={(e) => setEditingContent({ ...editingContent, title: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#173B63] transition-colors" />
              </div>
              <div className="sm:col-span-3">
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Excerpt</label>
                <textarea value={editingContent.excerpt || ""} onChange={(e) => setEditingContent({ ...editingContent, excerpt: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#173B63] transition-colors resize-none h-20" />
              </div>
              <div className="sm:col-span-3">
                <ImageUploadField
                  label="Article / News Cover Image"
                  value={editingContent.image || ""}
                  onChange={(url) => setEditingContent({ ...editingContent, image: url })}
                  folder="cms"
                  helpText="Upload or change the featured image"
                />
              </div>
              <div className="sm:col-span-3 flex items-center pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editingContent.featured || false} onChange={(e) => setEditingContent({ ...editingContent, featured: e.target.checked })} className="w-4 h-4 rounded text-[#0B5D3F] focus:ring-[#0B5D3F]" />
                  <span className="text-sm font-bold text-gray-700">Mark as Featured Article</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={onSaveEdit} className="bg-[#173B63] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#152f4f] transition-all">Save Changes</button>
              <button onClick={() => setEditingContent(null)} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-all">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteConfirmId !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <AlertCircle size={28} className="text-red-500" />
              </div>
              <h4 className="font-black text-gray-900 mb-2">Delete Content?</h4>
              <p className="text-sm text-gray-500 mb-5">This article will be permanently removed from the CMS.</p>
              <div className="flex gap-3">
                <button onClick={onConfirmDelete} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-all">Yes, Delete</button>
                <button onClick={onCancelDelete} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 p-5 border-b border-gray-50">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search content..." className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#F6FBF8] border border-gray-200 text-xs focus:outline-none" />
          </div>
          <button className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50">
            <Filter size={13} /> Filter
          </button>
          <button className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50">
            <Download size={13} /> Export
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F6FBF8] text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="text-left px-5 py-3">Title</th>
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Author</th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Views</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {content.map((item: any) => (
                <tr key={item.id} className="border-t border-gray-50 hover:bg-[#F6FBF8]/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="text-sm font-semibold text-gray-800 max-w-xs truncate">{item.title}</div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-xs font-bold bg-[#0B5D3F]/10 text-[#0B5D3F] px-2.5 py-1 rounded-full">{item.type}</span>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => onToggle(item.id)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-full transition-all ${item.status === "Published" ? "bg-[#4CAF50]/15 text-[#4CAF50] hover:bg-[#4CAF50]/25" : "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"}`}
                    >
                      {item.status}
                    </button>
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-500">{item.author}</td>
                  <td className="px-4 py-4 text-xs text-gray-500">{item.date}</td>
                  <td className="px-4 py-4 text-xs font-semibold text-gray-700">{item.views.toLocaleString()}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => onEdit(item)} className="p-1.5 rounded-lg hover:bg-[#0B5D3F]/10 text-gray-400 hover:text-[#0B5D3F] transition-all" title="Edit">
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => onDelete(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Projects Admin View ──────────────────────────────────────────────────────
function ProjectsAdminView() {
  const projects = [
    { name: "Amazon Reforestation Hub", country: "Brazil", status: "Active", budget: "$240,000", progress: 72 },
    { name: "Sundarbans Mangrove Restore", country: "Bangladesh", status: "Active", budget: "$180,000", progress: 85 },
    { name: "Solar Villages Initiative", country: "Africa", status: "Active", budget: "$320,000", progress: 45 },
    { name: "Pacific Coral Guardian", country: "Pacific", status: "Completed", budget: "$150,000", progress: 100 },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-900 font-bold">Projects Manager</h3>
          <p className="text-sm text-gray-400">{projects.length} shown of 470+ total projects</p>
        </div>
        <button className="flex items-center gap-2 bg-[#0B5D3F] text-white px-5 py-2.5 rounded-xl font-semibold text-sm">
          <Plus size={16} /> Add Project
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {projects.map((p, i) => (
          <div key={i} className="flex items-center gap-5 px-6 py-5 border-b border-gray-50 last:border-0 hover:bg-[#F6FBF8]/50">
            <div className="w-10 h-10 bg-[#0B5D3F]/10 rounded-xl flex items-center justify-center shrink-0">
              <TreePine size={18} className="text-[#0B5D3F]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-800 text-sm">{p.name}</div>
              <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                <MapPin size={11} />{p.country} · Budget: {p.budget}
              </div>
            </div>
            <div className="w-28 hidden md:block">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-gray-500">Progress</span>
                <span className="font-bold text-[#0B5D3F]">{p.progress}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#4CAF50] rounded-full" style={{ width: `${p.progress}%` }} />
              </div>
            </div>
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${p.status === "Active" ? "bg-[#4CAF50]/10 text-[#4CAF50]" : "bg-gray-100 text-gray-500"}`}>{p.status}</span>
            <div className="flex gap-2">
              <button className="p-1.5 rounded-lg hover:bg-[#0B5D3F]/10 text-gray-400 hover:text-[#0B5D3F]"><Edit3 size={14} /></button>
              <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Donations Admin View ─────────────────────────────────────────────────────
function DonationsAdminView({ donations }: { donations: any[] }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-gray-900 font-bold">Donations Manager</h3>
        <p className="text-sm text-gray-400">All donation transactions and donor management</p>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {[["$2.4M", "Total Raised", "#0B5D3F"], ["$42,800", "Today", "#4CAF50"], ["1,847", "Total Donors", "#173B63"]].map(([v, l, c]) => (
          <div key={l} className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
            <div className="text-2xl font-black mb-1" style={{ color: c, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{v}</div>
            <div className="text-xs text-gray-400">{l}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-50">
          <h4 className="font-bold text-gray-900">Recent Transactions</h4>
        </div>
        {donations.map((d: any, i: number) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-gray-50 last:border-0">
            <div className="w-9 h-9 rounded-xl bg-[#0B5D3F]/10 flex items-center justify-center text-xs font-bold text-[#0B5D3F]">{d.name.charAt(0)}</div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-gray-800">{d.name}</div>
              <div className="text-xs text-gray-400">{d.project}</div>
            </div>
            <div className="text-sm font-bold text-[#0B5D3F]">${d.amount}</div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${d.status === "completed" ? "bg-[#4CAF50]/10 text-[#4CAF50]" : "bg-yellow-50 text-yellow-600"}`}>{d.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Users Admin View ─────────────────────────────────────────────────────────
function UsersAdminView() {
  const users = [
    { name: "Rizwan Ahmed", email: "rizwan@esnglobal.org", role: "Super Admin", country: "Bangladesh", status: "Active" },
    { name: "Priya Sharma", email: "priya@esnglobal.org", role: "Researcher", country: "India", status: "Active" },
    { name: "Carlos Rodriguez", email: "carlos@esnglobal.org", role: "Regional Manager", country: "Colombia", status: "Active" },
    { name: "Amara Osei", email: "amara@esnglobal.org", role: "Volunteer Manager", country: "Ghana", status: "Active" },
    { name: "Sarah Chen", email: "sarah@example.com", role: "Donor", country: "Singapore", status: "Active" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-900 font-bold">Members & Users</h3>
          <p className="text-sm text-gray-400">48,291 total members worldwide</p>
        </div>
        <button className="flex items-center gap-2 bg-[#0B5D3F] text-white px-5 py-2.5 rounded-xl font-semibold text-sm">
          <Plus size={16} /> Add User
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F6FBF8] text-xs font-bold text-gray-500 uppercase">
              <th className="text-left px-5 py-3">Name</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Role</th>
              <th className="text-left px-4 py-3">Country</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-right px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={i} className="border-t border-gray-50 hover:bg-[#F6FBF8]/50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#4CAF50] to-[#0B5D3F] flex items-center justify-center text-white text-xs font-bold">{u.name.charAt(0)}</div>
                    <span className="text-sm font-semibold text-gray-800">{u.name}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-xs text-gray-500">{u.email}</td>
                <td className="px-4 py-4">
                  <span className="text-xs font-bold bg-[#173B63]/10 text-[#173B63] px-2.5 py-1 rounded-full">{u.role}</span>
                </td>
                <td className="px-4 py-4 text-xs text-gray-500">{u.country}</td>
                <td className="px-4 py-4">
                  <span className="text-xs font-bold bg-[#4CAF50]/10 text-[#4CAF50] px-2.5 py-1 rounded-full">{u.status}</span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button className="p-1.5 rounded-lg hover:bg-[#0B5D3F]/10 text-gray-400 hover:text-[#0B5D3F]"><Edit3 size={14} /></button>
                    <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AnalyticsView({ weeklyData, monthlyDonations }: any) {
  const trafficSources = [
    { name: "Organic Search", value: 45 },
    { name: "Direct", value: 25 },
    { name: "Social Media", value: 20 },
    { name: "Referral", value: 10 },
  ];
  const COLORS = ["#0B5D3F", "#173B63", "#4CAF50", "#D6A95A"];

  const topCountries = [
    { country: "United States", users: "45,210", progress: 85 },
    { country: "United Kingdom", users: "28,400", progress: 65 },
    { country: "India", users: "24,100", progress: 55 },
    { country: "Australia", users: "18,900", progress: 45 },
    { country: "Canada", users: "15,200", progress: 35 },
  ];

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-gray-900 font-bold text-xl">Analytics & Reporting</h3>
          <p className="text-sm text-gray-500 mt-1">Comprehensive platform performance and impact metrics</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            <Filter size={16} /> Filter: Last 30 Days
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0B5D3F] text-white rounded-xl text-sm font-semibold hover:bg-[#0a5237] transition-colors shadow-sm shadow-green-900/20">
            <Download size={16} /> Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Total Pageviews", value: "842K", change: "+24%", up: true },
          { label: "Unique Visitors", value: "186K", change: "+31%", up: true },
          { label: "Avg. Session Duration", value: "4m 12s", change: "+12%", up: true },
          { label: "Bounce Rate", value: "42.8%", change: "-4%", up: true },
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 hover:shadow-lg hover:shadow-gray-100 transition-all duration-300">
            <div className="text-sm font-semibold text-gray-500 mb-3">{kpi.label}</div>
            <div className="flex items-end gap-3 mb-2">
              <div className="text-3xl font-black text-gray-900 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{kpi.value}</div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg mb-1 ${kpi.up ? "bg-[#4CAF50]/15 text-[#0B5D3F]" : "bg-red-50 text-red-500"}`}>
                {kpi.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {kpi.change}
              </div>
            </div>
            <div className="text-xs text-gray-400 mt-2 font-medium">Compared to previous 30 days</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
            <div>
              <h4 className="font-bold text-gray-900 text-lg">Traffic & Conversion Trends</h4>
              <p className="text-xs text-gray-400 mt-1">Daily visitors and specific actions taken.</p>
            </div>
            <select className="text-sm font-semibold bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors">
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#173B63" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#173B63" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888', fontWeight: 600 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888', fontWeight: 600 }} dx={-10} />
              <Tooltip
                contentStyle={{ borderRadius: '16px', border: '1px solid #f0f0f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', fontWeight: 600 }}
                itemStyle={{ fontWeight: 700 }}
              />
              <Area type="monotone" dataKey="visitors" stroke="#173B63" strokeWidth={3} fillOpacity={1} fill="url(#colorVisitors)" name="Visitors" />
              <Area type="monotone" dataKey="actions" stroke="#4CAF50" strokeWidth={3} fillOpacity={1} fill="url(#colorConversions)" name="Conversions" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
            <div>
              <h4 className="font-bold text-gray-900 text-lg">Donation Revenue Over Time</h4>
              <p className="text-xs text-gray-400 mt-1">Monthly donation inflows (USD)</p>
            </div>
            <select className="text-sm font-semibold bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors">
              <option>2026</option>
              <option>2025</option>
              <option>All Time</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyDonations} barSize={40} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888', fontWeight: 600 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888', fontWeight: 600 }} dx={-10} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip 
                cursor={{ fill: '#f6fbf8' }}
                contentStyle={{ borderRadius: '16px', border: '1px solid #f0f0f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', fontWeight: 600 }}
                formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]}
                itemStyle={{ color: '#0B5D3F', fontWeight: 700 }}
              />
              <Bar dataKey="amount" fill="#0B5D3F" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 hover:shadow-md transition-shadow">
          <h4 className="font-bold text-gray-900 text-lg mb-8">Impact by Category</h4>
          <div className="h-56 relative mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Forests', impact: 85 },
                { name: 'Ocean', impact: 65 },
                { name: 'Climate', impact: 92 },
                { name: 'Wildlife', impact: 45 },
              ]} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888', fontWeight: 600 }} />
                <Tooltip cursor={{ fill: '#f6fbf8' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontWeight: 600 }} />
                <Bar dataKey="impact" fill="#4CAF50" radius={[0, 8, 8, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">Relative impact score across thematic areas</p>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 hover:shadow-md transition-shadow">
          <h4 className="font-bold text-gray-900 text-lg mb-8">Traffic Sources</h4>
          <div className="h-56 relative mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trafficSources}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {trafficSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontWeight: 600 }} 
                  itemStyle={{ fontWeight: 700 }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-gray-900">186K</span>
              <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-1">Total Views</span>
            </div>
          </div>
          <div className="space-y-4">
            {trafficSources.map((source, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-default">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: COLORS[idx] }} />
                  <span className="text-gray-700 font-semibold">{source.name}</span>
                </div>
                <span className="font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">{source.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Countries */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
          <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
            <div>
              <h4 className="font-bold text-gray-900 text-lg">Audience Geography</h4>
              <p className="text-xs text-gray-400 mt-1">User distribution by country</p>
            </div>
            <button className="text-sm font-bold text-[#0B5D3F] hover:text-[#0a5237] hover:underline bg-[#0B5D3F]/5 px-4 py-2 rounded-xl transition-colors">
              Full Map
            </button>
          </div>
          <div className="flex-1 flex flex-col justify-between space-y-6">
            {topCountries.map((item, idx) => (
              <div key={idx} className="group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-300 font-black text-sm w-4 group-hover:text-[#4CAF50] transition-colors">{idx + 1}.</span>
                    <span className="font-bold text-gray-800 text-sm">{item.country}</span>
                  </div>
                  <span className="text-sm font-black text-gray-900">{item.users} <span className="text-gray-400 font-semibold text-xs ml-1">users</span></span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden ml-7 relative">
                  <div 
                    className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[#4CAF50] to-[#0B5D3F] rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${item.progress}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
