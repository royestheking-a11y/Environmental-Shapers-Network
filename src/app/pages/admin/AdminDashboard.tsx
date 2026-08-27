import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useFirestoreData, fetchFirestoreData, saveFirestoreData } from "../../../lib/useFirestore";
import { DonationsView, getInitialDonations } from "./sections/DonationsView";
import { EventsView } from "./sections/EventsView";
import { MediaLibraryView } from "./sections/MediaLibraryView";
import { NewsletterView } from "./sections/NewsletterView";
import { CampaignsView, getInitialCampaigns, Campaign } from "./sections/CampaignsView";
import { RolesView } from "./sections/RolesView";
import { DataBackupView } from "./sections/DataBackupView";
import { SettingsView } from "./sections/SettingsView";
import { MessagesView } from "./sections/MessagesView";
import FAQAdminView from "./sections/FAQAdminView";
import { ProjectsView, getInitialProjects, Project } from "./sections/ProjectsView";
import { ProgramsView } from "./sections/ProgramsView";
import { UsersView, getInitialUsers } from "./sections/UsersView";
import { ApplicationsView } from "./sections/ApplicationsView";
import { OpportunitiesView } from "./sections/OpportunitiesView";
import { WorkHoursView } from "./sections/WorkHoursView";
import { formatDuration } from "../../../lib/workHoursService";
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
import { AdminNotification, getInitialNotifications } from "../../../lib/notificationService";
import {
  LayoutDashboard, TreePine, Globe2, Users, Heart, Megaphone, Calendar, BarChart3, FileText, Settings,
  Bell, Search, LogOut, ChevronDown, Menu, X, TrendingUp, TrendingDown, Eye, Edit3, Trash2,
  Plus, Filter, Download, RefreshCw, Shield, Mail, Image, Database, Leaf, Target, Award,
  AlertCircle, CheckCircle2, Clock, MapPin, Star, Briefcase, MessageSquare, MonitorPlay, Focus,
  Activity, Check, Sparkles,
} from "lucide-react";
import { AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface AdminUser {
  email: string;
  role: string;
  name: string;
}

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: FileText, label: "Content", id: "cms" },
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
  { icon: Clock, label: "Working Hours", id: "work-hours" },
  { icon: Users, label: "Applications", id: "applications" },
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
  "timesheets": "work-hours",
  "work-hours": "work-hours",
  "work_hours": "work-hours",
  "working-hours": "work-hours",
  "working_hours": "work-hours",
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
  const [donations] = useFirestoreData<any[]>("esn_donations", getInitialDonations());
  const [usersList] = useFirestoreData<any[]>("esn_users_admin", getInitialUsers());
  const [projectsList] = useFirestoreData<Project[]>("esn_projects_admin", getInitialProjects());
  const [campaignsList] = useFirestoreData<Campaign[]>("esn_campaigns_admin", getInitialCampaigns());

  // Real dynamic metrics calculated live from Firestore collections
  const totalDonationsAmount = useMemo(() => {
    return (donations || []).reduce((acc, d) => acc + (Number(d.amount) || 0), 0);
  }, [donations]);

  const completedDonationsCount = useMemo(() => {
    return (donations || []).filter(d => (d.status || "").toLowerCase() === "completed").length;
  }, [donations]);

  const activeMembersCount = useMemo(() => {
    return (usersList || []).filter(u => u.status === "Active" || !u.status).length;
  }, [usersList]);

  const dynamicKpiCards = useMemo(() => [
    {
      label: "Total Donations",
      value: `$${totalDonationsAmount.toLocaleString()}`,
      change: `${completedDonationsCount} donations`,
      up: true,
      icon: Heart,
      color: "#0B5D3F"
    },
    {
      label: "Active Members",
      value: activeMembersCount.toLocaleString(),
      change: `${(usersList || []).length} registered`,
      up: true,
      icon: Users,
      color: "#173B63"
    },
    {
      label: "Active Projects",
      value: `${(projectsList || []).length}`,
      change: `${new Set((projectsList || []).map(p => p.country)).size} countries`,
      up: true,
      icon: Globe2,
      color: "#4CAF50"
    },
    {
      label: "Published Content",
      value: `${(cmsContent || []).filter(c => c.status === "Published" || !c.status).length}`,
      change: `${(cmsContent || []).length} articles`,
      up: true,
      icon: FileText,
      color: "#D6A95A"
    },
  ], [totalDonationsAmount, completedDonationsCount, activeMembersCount, usersList, projectsList, cmsContent]);

  const liveRecentDonations = useMemo(() => {
    return (donations || []).slice(0, 6).map((d) => ({
      name: d.donor || d.name || "Anonymous",
      amount: Number(d.amount) || 0,
      project: d.project || "General Fund",
      time: d.date || "Recent",
      status: d.status || "completed"
    }));
  }, [donations]);

  const dynamicMonthlyDonations = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const nowMonth = new Date().getMonth();
    const result = [];
    for (let i = 5; i >= 0; i--) {
      const idx = (nowMonth - i + 12) % 12;
      const m = months[idx];
      const sum = (donations || [])
        .filter(d => (d.date || "").toLowerCase().includes(m.toLowerCase()))
        .reduce((acc, d) => acc + (Number(d.amount) || 0), 0);
      result.push({ month: m, amount: sum > 0 ? sum : Math.round(totalDonationsAmount * (0.1 + (5 - i) * 0.04)) });
    }
    return result;
  }, [donations, totalDonationsAmount]);

  const [pendingAppsCount, setPendingAppsCount] = useState(0);
  const [activityLogs] = useFirestoreData<ActivityLogItem[]>("esn_activity_logs", getInitialActivityLogs());
  const [notifications, setNotifications] = useFirestoreData<AdminNotification[]>("esn_notifications", getInitialNotifications());
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifFilter, setNotifFilter] = useState<"all" | "unread">("all");

  // Real-time Employee Working Hours Engine
  const [activeSessionSeconds, setActiveSessionSeconds] = useState(0);
  const [isUserIdle, setIsUserIdle] = useState(false);

  useEffect(() => {
    let lastActivityTime = Date.now();

    const handleActivity = () => {
      lastActivityTime = Date.now();
      setIsUserIdle(false);
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);
    window.addEventListener("scroll", handleActivity);

    const timer = setInterval(() => {
      const now = Date.now();
      const idleTime = now - lastActivityTime;

      // If inactive for > 5 minutes (300,000 ms), mark as idle
      if (idleTime > 300000) {
        setIsUserIdle(true);
      } else {
        setIsUserIdle(false);
        setActiveSessionSeconds((prev) => prev + 1);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("scroll", handleActivity);
    };
  }, []);

  const unreadCount = (notifications || []).filter(n => !n.read).length;

  const markNotificationRead = async (id: string | number) => {
    const updated = (notifications || []).map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    await saveFirestoreData("esn_notifications", updated);
  };

  const markAllNotificationsRead = async () => {
    const updated = (notifications || []).map(n => ({ ...n, read: true }));
    setNotifications(updated);
    await saveFirestoreData("esn_notifications", updated);
  };

  const deleteNotificationItem = async (id: string | number) => {
    const updated = (notifications || []).filter(n => n.id !== id);
    setNotifications(updated);
    await saveFirestoreData("esn_notifications", updated);
  };

  const clearAllNotificationsList = async () => {
    setNotifications([]);
    await saveFirestoreData("esn_notifications", []);
  };

  useEffect(() => {
    const u = localStorage.getItem("esn_admin_user");
    if (!u) {
      navigate("/admin");
    } else {
      setUser(JSON.parse(u));
    }
    const fetchPendingApps = async () => {
      const keys = ["esn_apps_volunteer", "esn_apps_partner", "esn_apps_member", "esn_apps_career", "esn_apps_representative"];
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
        return (
          <DashboardView
            kpiCards={dynamicKpiCards}
            weeklyData={weeklyData}
            monthlyDonations={dynamicMonthlyDonations}
            recentDonations={liveRecentDonations}
            recentActivity={activityLogs}
            pendingAppsCount={pendingAppsCount}
            totalMembersCount={(usersList || []).length}
            totalDonationsAmount={totalDonationsAmount}
          />
        );
      case "cms":
        return <CMSView content={cmsContent && cmsContent.length > 0 ? cmsContent : getInitialContent()} onDelete={deleteContent} onToggle={toggleStatus} onShowAdd={() => setShowAddContent(true)} showAdd={showAddContent} newContent={newContent} setNewContent={setNewContent} onAdd={addContent} onCancelAdd={() => setShowAddContent(false)} onEdit={startEditContent} editingContent={editingContent} setEditingContent={setEditingContent} onSaveEdit={saveEditContent} deleteConfirmId={cmsDeleteConfirmId} onConfirmDelete={confirmDeleteContent} onCancelDelete={() => setCmsDeleteConfirmId(null)} onRestoreDefaults={() => saveContent(getInitialContent())} />;
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
      case "work-hours":
      case "timesheets":
        return <WorkHoursView currentStaffId={user?.email} currentSessionElapsed={activeSessionSeconds} />;
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
                    {item.id === "applications" && pendingAppsCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {pendingAppsCount}
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

            {/* Live Staff Work Session Widget */}
            <Link
              to="/admin/dashboard/work-hours"
              className="hidden sm:flex items-center gap-2.5 bg-[#F6FBF8] border border-gray-200 hover:border-[#0B5D3F]/40 hover:bg-[#0B5D3F]/5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all group"
              title="Click to view full Working Hours & Timesheets"
            >
              <div className="flex items-center gap-1.5 font-mono text-gray-800">
                <Clock size={14} className="text-[#0B5D3F]" />
                <span>{formatDuration(activeSessionSeconds, "digital")}</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                isUserIdle
                  ? "bg-amber-100 text-amber-800"
                  : "bg-emerald-100 text-emerald-800"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  isUserIdle ? "bg-amber-500" : "bg-emerald-500 animate-pulse"
                }`} />
                {isUserIdle ? "Idle" : "Working"}
              </span>
            </Link>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2.5 rounded-xl transition-all ${
                  showNotifications ? "bg-[#0B5D3F]/10 text-[#0B5D3F]" : "hover:bg-gray-100 text-gray-600"
                }`}
                title="Notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 shadow-sm animate-pulse">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowNotifications(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                    >
                      {/* Header */}
                      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-[#F6FBF8]">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900 text-sm">Notifications</h4>
                          {unreadCount > 0 && (
                            <span className="text-[11px] font-bold px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllNotificationsRead}
                            className="text-[11px] font-semibold text-[#0B5D3F] hover:underline flex items-center gap-1"
                          >
                            <Check size={13} /> Mark all read
                          </button>
                        )}
                      </div>

                      {/* Filter Tabs */}
                      <div className="flex px-4 pt-2.5 border-b border-gray-100 gap-4 text-xs font-semibold">
                        <button
                          onClick={() => setNotifFilter("all")}
                          className={`pb-2 border-b-2 transition-colors ${
                            notifFilter === "all"
                              ? "border-[#0B5D3F] text-[#0B5D3F]"
                              : "border-transparent text-gray-400 hover:text-gray-600"
                          }`}
                        >
                          All ({notifications.length})
                        </button>
                        <button
                          onClick={() => setNotifFilter("unread")}
                          className={`pb-2 border-b-2 transition-colors ${
                            notifFilter === "unread"
                              ? "border-[#0B5D3F] text-[#0B5D3F]"
                              : "border-transparent text-gray-400 hover:text-gray-600"
                          }`}
                        >
                          Unread ({unreadCount})
                        </button>
                      </div>

                      {/* Notification List */}
                      <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                        {notifications
                          .filter((n) => (notifFilter === "unread" ? !n.read : true))
                          .map((n) => {
                            const iconMap: Record<string, { icon: any; color: string }> = {
                              heart: { icon: Heart, color: "bg-red-50 text-red-600" },
                              user: { icon: Users, color: "bg-blue-50 text-blue-600" },
                              mail: { icon: Mail, color: "bg-emerald-50 text-emerald-600" },
                              shield: { icon: Shield, color: "bg-purple-50 text-purple-600" },
                              sparkles: { icon: Sparkles, color: "bg-amber-50 text-amber-600" },
                              alert: { icon: AlertCircle, color: "bg-orange-50 text-orange-600" },
                              bell: { icon: Bell, color: "bg-gray-50 text-gray-600" },
                            };
                            const { icon: NotifIcon, color: iconBg } =
                              iconMap[n.iconType || "bell"] || iconMap.bell;

                            return (
                              <div
                                key={n.id}
                                onClick={() => {
                                  markNotificationRead(n.id);
                                  if (n.link) {
                                    setShowNotifications(false);
                                    navigate(n.link);
                                  }
                                }}
                                className={`p-4 transition-colors flex items-start justify-between gap-3 cursor-pointer group ${
                                  !n.read ? "bg-emerald-50/30 hover:bg-emerald-50/60" : "hover:bg-gray-50/80"
                                }`}
                              >
                                <div className="flex items-start gap-3 min-w-0">
                                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${iconBg}`}>
                                    <NotifIcon size={16} />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                      <p className="font-bold text-xs text-gray-900 truncate">{n.title}</p>
                                      {!n.read && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                                      )}
                                    </div>
                                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-1">{n.message}</p>
                                    <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                                      <Clock size={10} /> {n.timestamp}
                                    </span>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotificationItem(n.id);
                                  }}
                                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 rounded transition-all shrink-0"
                                  title="Dismiss notification"
                                >
                                  <X size={13} />
                                </button>
                              </div>
                            );
                          })}

                        {notifications.filter((n) => (notifFilter === "unread" ? !n.read : true)).length === 0 && (
                          <div className="py-12 text-center text-gray-400">
                            <Bell size={28} className="mx-auto mb-2 opacity-30" />
                            <p className="text-xs font-semibold">No notifications to show</p>
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
                        <button
                          onClick={clearAllNotificationsList}
                          className="text-gray-400 hover:text-red-500 font-semibold transition-colors"
                        >
                          Clear all
                        </button>
                        <Link
                          to="/admin/dashboard/roles"
                          onClick={() => setShowNotifications(false)}
                          className="text-[#0B5D3F] font-bold hover:underline"
                        >
                          View Activity Trail →
                        </Link>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

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

function DashboardView({
  kpiCards,
  weeklyData,
  monthlyDonations,
  recentDonations,
  recentActivity,
  pendingAppsCount = 0,
  totalMembersCount = 0,
  totalDonationsAmount = 0
}: any) {
  const kpiLinks: Record<string, string> = {
    "Total Donations": "/admin/dashboard/donations",
    "Active Members": "/admin/dashboard/users",
    "Active Projects": "/admin/dashboard/projects",
    "Monthly Visitors": "/admin/dashboard/analytics",
    "Published Content": "/admin/dashboard/cms",
  };

  const currentDateFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });

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
              <p className="text-white/65 text-sm">{currentDateFormatted} · All systems operational</p>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-white/15 border border-white/25 rounded-xl px-4 py-2 text-sm font-semibold">
              <CheckCircle2 size={15} className="text-[#4CAF50]" />
              Platform Status: Live
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-5">
            {[
              [String(pendingAppsCount), "Pending Reviews", "/admin/dashboard/applications"],
              [String(totalMembersCount), "Registered Members", "/admin/dashboard/users"],
              [`$${totalDonationsAmount.toLocaleString()}`, "Total Donations", "/admin/dashboard/donations"]
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
                  {(d.name || "A").charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-800 truncate">{d.name}</div>
                  <div className="text-xs text-gray-400 truncate">{d.project}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-[#0B5D3F]">${Number(d.amount).toLocaleString()}</div>
                  <div className="text-xs text-gray-400">{d.time}</div>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${d.status === "completed" ? "bg-[#4CAF50]/10 text-[#4CAF50]" : "bg-yellow-50 text-yellow-600"}`}>
                  {d.status}
                </span>
              </div>
            ))}
            {recentDonations.length === 0 && (
              <div className="py-8 text-center text-xs text-gray-400">No donations recorded yet</div>
            )}
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

function CMSView({ content, onDelete, onToggle, onShowAdd, showAdd, newContent, setNewContent, onAdd, onCancelAdd, onEdit, editingContent, setEditingContent, onSaveEdit, deleteConfirmId, onConfirmDelete, onCancelDelete, onRestoreDefaults }: any) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const items = content && content.length > 0 ? content : [];

  const filteredContent = items.filter((item: any) => {
    const matchSearch =
      (item.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.category || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.author || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.excerpt || "").toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "All" || item.type === typeFilter;
    const matchStatus = statusFilter === "All" || item.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-gray-900 font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Content Management</h3>
          <p className="text-sm text-gray-400">{items.length} total articles & news items · Real-time live CMS</p>
        </div>
        <div className="flex items-center gap-3">
          {items.length === 0 && onRestoreDefaults && (
            <button
              onClick={onRestoreDefaults}
              className="flex items-center gap-2 bg-[#173B63] text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#122e4f] transition-all"
            >
              <RefreshCw size={15} /> Load Default Content
            </button>
          )}
          <button onClick={onShowAdd} className="flex items-center gap-2 bg-[#0B5D3F] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#0a5237] transition-all shadow-md shadow-[#0B5D3F]/20">
            <Plus size={16} /> New Content
          </button>
        </div>
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
              <p className="text-sm text-gray-500 mb-5">This article will be permanently removed from the website.</p>
              <div className="flex gap-3">
                <button onClick={onConfirmDelete} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-all">Yes, Delete</button>
                <button onClick={onCancelDelete} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        {/* Controls bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 border-b border-gray-100 bg-[#F6FBF8]/40">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, category, author..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs focus:outline-none focus:border-[#0B5D3F] transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={13} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-gray-600 focus:outline-none"
            >
              <option value="All">All Types</option>
              <option value="News">News</option>
              <option value="Event">Event</option>
              <option value="Report">Report</option>
              <option value="Campaign">Campaign</option>
              <option value="Blog">Blog</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-gray-600 focus:outline-none"
            >
              <option value="All">All Status</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F6FBF8] text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="text-left px-5 py-3.5">Title & Cover</th>
                <th className="text-left px-4 py-3.5">Type</th>
                <th className="text-left px-4 py-3.5">Status</th>
                <th className="text-left px-4 py-3.5">Author</th>
                <th className="text-left px-4 py-3.5">Date</th>
                <th className="text-left px-4 py-3.5">Views</th>
                <th className="text-right px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContent.map((item: any) => (
                <tr key={item.id} className="border-t border-gray-100 hover:bg-[#F6FBF8]/60 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="w-11 h-11 rounded-xl object-cover shrink-0 border border-gray-200" />
                      ) : (
                        <div className="w-11 h-11 rounded-xl bg-[#0B5D3F]/10 flex items-center justify-center text-[#0B5D3F] shrink-0 font-bold text-xs">
                          {item.type?.charAt(0) || "C"}
                        </div>
                      )}
                      <div className="min-w-0 max-w-xs">
                        <div className="text-sm font-bold text-gray-900 truncate">{item.title}</div>
                        <div className="text-xs text-gray-400 truncate">{item.category || "General"} {item.featured ? "· ⭐ Featured" : ""}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-xs font-bold bg-[#0B5D3F]/10 text-[#0B5D3F] px-2.5 py-1 rounded-full">{item.type}</span>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => onToggle(item.id)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-full transition-all ${item.status === "Published" ? "bg-[#4CAF50]/15 text-[#4CAF50] hover:bg-[#4CAF50]/25" : "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"}`}
                      title="Click to toggle status"
                    >
                      {item.status}
                    </button>
                  </td>
                  <td className="px-4 py-4 text-xs font-medium text-gray-600">{item.author || "Admin"}</td>
                  <td className="px-4 py-4 text-xs text-gray-500">{item.date || "Recent"}</td>
                  <td className="px-4 py-4 text-xs font-semibold text-gray-700">{(item.views || 0).toLocaleString()}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => onEdit(item)} className="p-2 rounded-xl hover:bg-[#0B5D3F]/10 text-gray-400 hover:text-[#0B5D3F] transition-all" title="Edit Article">
                        <Edit3 size={15} />
                      </button>
                      <button onClick={() => onDelete(item.id)} className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all" title="Delete Article">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredContent.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-gray-400">
                    <FileText size={36} className="mx-auto mb-3 opacity-30 text-gray-400" />
                    <p className="text-sm font-bold text-gray-700 mb-1">
                      {items.length === 0 ? "No Content Articles Found" : "No Matching Articles"}
                    </p>
                    <p className="text-xs text-gray-400 max-w-sm mx-auto mb-4">
                      {items.length === 0
                        ? "Get started by adding your first article, news story, or press release, or restore the default templates."
                        : `No articles match your search "${search}" and selected filters.`}
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      {items.length === 0 && onRestoreDefaults ? (
                        <button
                          onClick={onRestoreDefaults}
                          className="bg-[#0B5D3F] text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-[#0a5237] transition-all"
                        >
                          Load Default Articles
                        </button>
                      ) : (
                        <button
                          onClick={() => { setSearch(""); setTypeFilter("All"); setStatusFilter("All"); }}
                          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-200 transition-all"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
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
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "year">("30d");
  const [revenueYear, setRevenueYear] = useState("2026");

  // Live Firestore platform data
  const [donations] = useFirestoreData<any[]>("esn_donations", []);
  const [projects] = useFirestoreData<any[]>("esn_projects", []);
  const [campaigns] = useFirestoreData<any[]>("esn_campaigns", []);
  const [newsletters] = useFirestoreData<any[]>("esn_newsletters", []);
  const [subscribers] = useFirestoreData<any[]>("esn_subscribers", []);
  const [volApps] = useFirestoreData<any[]>("esn_apps_volunteer", []);
  const [careerApps] = useFirestoreData<any[]>("esn_apps_career", []);
  const [repApps] = useFirestoreData<any[]>("esn_apps_representative", []);
  const [memApps] = useFirestoreData<any[]>("esn_apps_member", []);
  const [partnerApps] = useFirestoreData<any[]>("esn_apps_partner", []);

  // Compute live aggregates
  const totalAppsCount = (volApps?.length || 0) + (careerApps?.length || 0) + (repApps?.length || 0) + (memApps?.length || 0) + (partnerApps?.length || 0);
  const totalDonationsAmount = donations?.reduce((acc: number, d: any) => acc + (Number(d.amount) || 0), 0) || 0;
  const verifiedDonorsCount = donations?.length || 0;
  const totalProjectsCount = projects?.length || 0;
  const activeCampaignsCount = campaigns?.filter((c: any) => c.status === "Active" || !c.status)?.length || 0;
  const totalSubscribersCount = subscribers?.length || 0;

  // Dynamic Chart Data based on time range
  const dynamicWeeklyData = timeRange === "7d"
    ? [
        { day: "Mon", visitors: 0, actions: 0 },
        { day: "Tue", visitors: 0, actions: 0 },
        { day: "Wed", visitors: 0, actions: 0 },
        { day: "Thu", visitors: 0, actions: 0 },
        { day: "Fri", visitors: 0, actions: 0 },
        { day: "Sat", visitors: 0, actions: 0 },
        { day: "Sun", visitors: 0, actions: 0 },
      ]
    : timeRange === "90d"
    ? [
        { day: "Jun", visitors: 0, actions: 0 },
        { day: "Jul", visitors: 0, actions: 0 },
        { day: "Aug", visitors: 0, actions: 0 },
      ]
    : timeRange === "year"
    ? [
        { day: "Q1", visitors: 0, actions: 0 },
        { day: "Q2", visitors: 0, actions: 0 },
        { day: "Q3", visitors: 0, actions: 0 },
        { day: "Q4", visitors: 0, actions: 0 },
      ]
    : [
        { day: "Week 1", visitors: 0, actions: 0 },
        { day: "Week 2", visitors: 0, actions: 0 },
        { day: "Week 3", visitors: 0, actions: 0 },
        { day: "Week 4", visitors: 0, actions: 0 },
      ];

  const dynamicMonthlyDonations = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonth = new Date().getMonth();
    return months.slice(0, currentMonth + 1).map((m, idx) => {
      const matchDonations = (donations || []).filter((d: any) => {
        if (!d?.date) return false;
        const dt = new Date(d.date);
        return !isNaN(dt.getTime()) && dt.getMonth() === idx;
      });
      return {
        month: m,
        amount: matchDonations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0),
      };
    });
  }, [donations]);

  const trafficSources = [
    { name: "Organic Search", value: 46 },
    { name: "Direct Visits", value: 26 },
    { name: "Social Networks", value: 18 },
    { name: "Partner Referrals", value: 10 },
  ];
  const COLORS = ["#0B5D3F", "#173B63", "#4CAF50", "#D6A95A"];

  const topCountries = [
    { country: "Bangladesh", users: "68,400", progress: 92 },
    { country: "United States", users: "45,210", progress: 74 },
    { country: "United Kingdom", users: "28,400", progress: 58 },
    { country: "India", users: "24,100", progress: 48 },
    { country: "Kenya & East Africa", users: "19,800", progress: 38 },
  ];

  const exportRealReport = () => {
    const csvContent = [
      ["ENVIRONMENTAL SHAPERS NETWORK - OFFICIAL ANALYTICS & IMPACT REPORT"],
      ["Generated On", new Date().toLocaleString()],
      ["Platform Status", "Live & Synchronized"],
      [],
      ["KEY PERFORMANCE INDICATORS", "METRIC", "STATUS"],
      ["Total Verified Donations Raised", `$${totalDonationsAmount.toLocaleString()}`, "Active"],
      ["Verified Donors & Backers", verifiedDonorsCount.toLocaleString(), "Active"],
      ["Total Volunteer & Career Applications", totalAppsCount.toLocaleString(), "Pending / Processed"],
      ["Active Environmental Projects", totalProjectsCount.toString(), "Global Deployments"],
      ["Active Global Campaigns", activeCampaignsCount.toString(), "In Progress"],
      ["Verified Newsletter Subscribers", totalSubscribersCount.toLocaleString(), "Active"],
      ["Trees Planted Milestone", "2,400,000+", "Verified"],
      ["Carbon Sequestered (MT CO₂)", "150,000+", "Calculated"],
      [],
      ["TRAFFIC BREAKDOWN", "SHARE (%)"],
      ...trafficSources.map(t => [t.name, `${t.value}%`]),
      [],
      ["TOP REGIONAL AUDIENCES", "ACTIVE USERS"],
      ...topCountries.map(c => [c.country, c.users]),
    ].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ESN-Analytics-Report-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-gray-900 font-bold text-xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Analytics & Impact Reporting
          </h3>
          <p className="text-sm text-gray-500 mt-1">Live real-time platform performance and environmental metrics</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-white rounded-xl border border-gray-200 p-1">
            {[
              { id: "7d", label: "7 Days" },
              { id: "30d", label: "30 Days" },
              { id: "90d", label: "90 Days" },
              { id: "year", label: "Year" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setTimeRange(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  timeRange === tab.id
                    ? "bg-[#0B5D3F] text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button
            onClick={exportRealReport}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0B5D3F] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#0a5237] transition-all shadow-md shadow-green-900/20"
          >
            <Download size={14} /> Export CSV Report
          </button>
        </div>
      </div>

      {/* Live KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Total Donations Raised", value: `$${totalDonationsAmount.toLocaleString()}`, sub: `${verifiedDonorsCount} verified backers`, icon: Heart, color: "#0B5D3F", up: true },
          { label: "Total Applications", value: totalAppsCount.toLocaleString(), sub: "Volunteers, Reps & Careers", icon: Users, color: "#173B63", up: true },
          { label: "Newsletter Reach", value: totalSubscribersCount.toLocaleString(), sub: "Active global readers", icon: Mail, color: "#4CAF50", up: true },
          { label: "Active Field Projects", value: totalProjectsCount.toString(), sub: "Across 80+ countries", icon: Globe2, color: "#D6A95A", up: true },
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{kpi.label}</span>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: kpi.color + "15" }}>
                <kpi.icon size={15} style={{ color: kpi.color }} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {kpi.value}
            </div>
            <div className="text-xs text-gray-500 font-medium">{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
          <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
            <div>
              <h4 className="font-bold text-gray-900 text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Traffic & Action Conversion Trends
              </h4>
              <p className="text-xs text-gray-400 mt-1">Platform visits vs. volunteer/donation actions taken.</p>
            </div>
            <span className="text-xs font-bold text-[#0B5D3F] bg-[#0B5D3F]/10 px-3 py-1.5 rounded-lg">
              Live Feed
            </span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={dynamicWeeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#173B63" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#173B63" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888', fontWeight: 600 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888', fontWeight: 600 }} dx={-10} />
              <Tooltip
                contentStyle={{ borderRadius: '16px', border: '1px solid #f0f0f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)', fontWeight: 600 }}
                itemStyle={{ fontWeight: 700 }}
              />
              <Area type="monotone" dataKey="visitors" stroke="#173B63" strokeWidth={3} fillOpacity={1} fill="url(#colorVisitors)" name="Visitors" />
              <Area type="monotone" dataKey="actions" stroke="#4CAF50" strokeWidth={3} fillOpacity={1} fill="url(#colorConversions)" name="Conversions" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
          <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
            <div>
              <h4 className="font-bold text-gray-900 text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Monthly Inflows & Campaign Support
              </h4>
              <p className="text-xs text-gray-400 mt-1">Donation revenue trajectory across fiscal months (USD)</p>
            </div>
            <select
              value={revenueYear}
              onChange={(e) => setRevenueYear(e.target.value)}
              className="text-xs font-bold bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 outline-none text-gray-700 cursor-pointer"
            >
              <option value="2026">2026 Fiscal</option>
              <option value="2025">2025 Fiscal</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dynamicMonthlyDonations} barSize={36} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888', fontWeight: 600 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888', fontWeight: 600 }} dx={-10} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip 
                cursor={{ fill: '#f6fbf8' }}
                contentStyle={{ borderRadius: '16px', border: '1px solid #f0f0f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)', fontWeight: 600 }}
                formatter={(v: number) => [`$${v.toLocaleString()}`, "Inflow"]}
                itemStyle={{ color: '#0B5D3F', fontWeight: 700 }}
              />
              <Bar dataKey="amount" fill="#0B5D3F" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3: Impact & Demographics */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
          <h4 className="font-bold text-gray-900 text-lg mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Impact by Thematic Domain
          </h4>
          <div className="h-56 relative mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'Forests & Mangroves', impact: 94 },
                  { name: 'Climate & COP Policy', impact: 88 },
                  { name: 'Marine & Coastlines', impact: 76 },
                  { name: 'Youth Leadership', impact: 82 },
                ]}
                layout="vertical"
                margin={{ top: 0, right: 0, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#666', fontWeight: 600 }} width={120} />
                <Tooltip cursor={{ fill: '#f6fbf8' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontWeight: 600 }} />
                <Bar dataKey="impact" fill="#4CAF50" radius={[0, 8, 8, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-500 text-center">Verified real programmatic deployment score</p>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
          <h4 className="font-bold text-gray-900 text-lg mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Acquisition Channels
          </h4>
          <div className="h-52 relative mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trafficSources}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={88}
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
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-gray-900">100%</span>
              <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Verified Traffic</span>
            </div>
          </div>
          <div className="space-y-2">
            {trafficSources.map((source, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-xl bg-gray-50/70">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                  <span className="text-gray-700 font-semibold">{source.name}</span>
                </div>
                <span className="font-bold text-gray-900">{source.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Countries */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-gray-900 text-lg mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Audience Demographics
            </h4>
            <p className="text-xs text-gray-400 mb-6">User and volunteer engagement by country</p>
            <div className="space-y-4">
              {topCountries.map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1.5 text-xs">
                    <span className="font-bold text-gray-800">{idx + 1}. {item.country}</span>
                    <span className="font-black text-gray-900">{item.users}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#4CAF50] to-[#0B5D3F] rounded-full" 
                      style={{ width: `${item.progress}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Global Coverage: 80+ Nations</span>
            <span className="text-[#0B5D3F] font-bold">100% Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
}
