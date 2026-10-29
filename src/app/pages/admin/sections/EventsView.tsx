import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar, Plus, Search, MapPin, Users, Clock, Edit3,
  Trash2, Eye, Video, Globe2, CheckCircle2, AlertCircle,
  ChevronRight, QrCode, Download, X, Leaf, AlertTriangle,
  Sliders, Sparkles, ExternalLink, Save, RefreshCw, BarChart3,
  Layers, ArrowRight
} from "lucide-react";
import { ImageUploadField } from "../../../components/ui/ImageUploadField";

type EventStatus = "upcoming" | "ongoing" | "completed" | "cancelled" | "postponed";

export interface ESNEvent {
  id: number;
  title: string;
  type: string;
  date: string;
  time: string;
  location: string;
  mode: "In-Person" | "Virtual" | "Hybrid";
  capacity: number;
  registered: number;
  status: EventStatus;
  description: string;
  speaker: string;
  image?: string;
  // Interconnection with Projects and Campaigns
  projectId?: number;
  projectName?: string;
  campaignId?: number;
  campaignName?: string;
  // Interconnection & Impact Dashboard Insights (Point 1):
  programSlug?: string;
  initiativeTitle?: string;
  impactTrees?: number;
  impactCommunities?: number;
  impactBeneficiaries?: number;
}

export interface EventsPageSettings {
  label: string;
  badge: string;
  tagline: string;
  aboutBadge?: string;
  aboutHeading: string;
  description: string;
  heroImage: string;
  stats: { value: string; label: string }[];
  sectionBadge?: string;
  sectionHeading?: string;
  ctaTitle?: string;
  ctaDescription?: string;
  ctaButtonText?: string;
  ctaButtonLink?: string;
}

export const DEFAULT_EVENTS_PAGE_SETTINGS: EventsPageSettings = {
  label: "Events & Campaigns",
  badge: "ESN Programs",
  tagline: "Mobilizing Action Through Powerful Collective Moments",
  aboutBadge: "About",
  aboutHeading: "Building the Movement Together",
  description: "ESN hosts and supports a year-round calendar of events, campaigns, and mobilization opportunities that bring together communities, organizations, governments, and individuals to take action for the environment.",
  heroImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1400",
  stats: [
    { value: "120+", label: "Events Per Year" },
    { value: "2.8M+", label: "Campaign Participants" },
    { value: "190+", label: "Countries Reached" },
    { value: "48", label: "Major Summits" },
  ],
  sectionBadge: "Global Network",
  sectionHeading: "Events & Mobilizations",
  ctaTitle: "Register for an Event",
  ctaDescription: "Host, sponsor, or attend ESN events worldwide. Contact us to learn about partnership and participation opportunities.",
  ctaButtonText: "Contact Our Events Team",
  ctaButtonLink: "/contact?subject=Event%20Registration",
};

import { useFirestoreData, saveFirestoreData } from "../../../../lib/useFirestore";
import { logAdminActivity } from "../../../../lib/activityLogger";
import { DEFAULT_PROGRAM_INITIATIVES } from "./ProgramsView";
import { PROGRAM_OPTIONS, getInitialProjects, Project } from "./ProjectsView";
import { getInitialCampaigns, Campaign } from "./CampaignsView";

export function getInitialEvents(): ESNEvent[] {
  return [
    {
      id: 1, title: "Global Youth Climate Summit 2026", type: "Summit", date: "Aug 15, 2026", time: "09:00 AM", location: "Dhaka, Bangladesh",
      mode: "Hybrid", capacity: 500, registered: 423, status: "upcoming", description: "Annual gathering of youth climate leaders from 80+ countries.",
      speaker: "Dr. Priya Sharma", programSlug: "youth", initiativeTitle: "Youth COP Delegation Support",
      projectId: 3, projectName: "Sahel Green Belt Initiative", campaignId: 3, campaignName: "Youth Climate Action",
      impactTrees: 10000, impactCommunities: 80, impactBeneficiaries: 25000
    },
    {
      id: 2, title: "Forest Restoration Volunteer Day", type: "Field", date: "Aug 8, 2026", time: "07:00 AM", location: "Sundarbans, Bangladesh",
      mode: "In-Person", capacity: 200, registered: 187, status: "upcoming", description: "Community mangrove planting event at the Sundarbans delta.",
      speaker: "Rizwan Ahmed", programSlug: "forest-restoration", initiativeTitle: "Mangrove Shield",
      impactTrees: 25000, impactCommunities: 14, impactBeneficiaries: 1800
    },
    {
      id: 3, title: "Climate Policy Webinar Series #12", type: "Webinar", date: "Jul 30, 2026", time: "03:00 PM", location: "Online",
      mode: "Virtual", capacity: 2000, registered: 1847, status: "ongoing", description: "Deep-dive into UNFCCC COP31 outcomes and what they mean for NGOs.",
      speaker: "Carlos Rodriguez", programSlug: "research", initiativeTitle: "Policy Briefs & White Papers",
      impactTrees: 0, impactCommunities: 50, impactBeneficiaries: 1847
    },
    {
      id: 4, title: "ESN Annual Gala & Awards Night", type: "Gala", date: "Sep 20, 2026", time: "06:00 PM", location: "Geneva, Switzerland",
      mode: "In-Person", capacity: 150, registered: 112, status: "upcoming", description: "Celebrating environmental champions and impact milestones.",
      speaker: "Board of Directors", programSlug: "youth", initiativeTitle: "ESN Youth Innovation Fund",
      impactTrees: 0, impactCommunities: 25, impactBeneficiaries: 500
    },
    {
      id: 5, title: "Biodiversity Hackathon 2026", type: "Hackathon", date: "Jul 5, 2026", time: "10:00 AM", location: "Online",
      mode: "Virtual", capacity: 800, registered: 800, status: "completed", description: "48-hour innovation sprint for biodiversity conservation tech.",
      speaker: "Multiple Judges", programSlug: "biodiversity", initiativeTitle: "Endangered Species Tracking",
      impactTrees: 0, impactCommunities: 10, impactBeneficiaries: 800
    },
    {
      id: 6, title: "Water Security Field Training", type: "Training", date: "Jun 20, 2026", time: "08:00 AM", location: "Nairobi, Kenya",
      mode: "In-Person", capacity: 80, registered: 78, status: "completed", description: "Hands-on training for watershed management practitioners.",
      speaker: "Amara Osei", programSlug: "climate-adaptation", initiativeTitle: "Community Early Warning Systems",
      impactTrees: 5000, impactCommunities: 12, impactBeneficiaries: 350
    },
  ];
}

const statusConfig: Record<EventStatus, { label: string; color: string; bg: string }> = {
  upcoming: { label: "Upcoming", color: "#173B63", bg: "#173B63" },
  ongoing: { label: "Live Now", color: "#4CAF50", bg: "#4CAF50" },
  postponed: { label: "Postponed", color: "#F59E0B", bg: "#F59E0B" },
  completed: { label: "Completed", color: "#6b7280", bg: "#6b7280" },
  cancelled: { label: "Cancelled", color: "#ef4444", bg: "#ef4444" },
};

const modeIcon = { "In-Person": MapPin, "Virtual": Video, "Hybrid": Globe2 };

const blankEvent: Omit<ESNEvent, "id"> = {
  title: "", type: "Webinar", date: "", time: "", location: "", mode: "Virtual",
  capacity: 100, registered: 0, status: "upcoming", description: "", speaker: "", image: "",
  projectName: "", campaignName: "",
  programSlug: "youth", initiativeTitle: "Youth COP Delegation Support",
  impactTrees: 0, impactCommunities: 0, impactBeneficiaries: 0,
};

function exportRegistrations(ev: ESNEvent) {
  const rows = [
    ["#", "Name", "Email", "Status", "Registered Date"],
    ...Array.from({ length: Math.min(ev.registered, 8) }, (_, i) => [
      String(i + 1),
      `Registrant ${i + 1}`,
      `registrant${i + 1}@example.com`,
      "Confirmed",
      ev.date,
    ]),
  ];
  const csv = rows.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `registrations_${ev.title.replace(/\s+/g, "_").toLowerCase()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function QRGrid({ size = 120 }: { size?: number }) {
  const cells = 10;
  const seed = Math.floor(size / 10);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${cells} ${cells}`} style={{ imageRendering: "pixelated" }}>
      {Array.from({ length: cells }, (_, row) =>
        Array.from({ length: cells }, (_, col) => {
          const edge = row === 0 || row === cells - 1 || col === 0 || col === cells - 1;
          const corner = (row < 3 && col < 3) || (row < 3 && col > cells - 4) || (row > cells - 4 && col < 3);
          const filled = corner || edge || ((row * 3 + col * 7 + seed) % 4 < 2);
          return filled ? <rect key={`${row}-${col}`} x={col} y={row} width={1} height={1} fill="#000" /> : null;
        })
      )}
    </svg>
  );
}

export function EventsView() {
  const [events, setEvents, loading] = useFirestoreData<ESNEvent[]>("esn_events", getInitialEvents());
  const [projects] = useFirestoreData<Project[]>("esn_projects_admin", getInitialProjects());
  const [campaigns] = useFirestoreData<Campaign[]>("esn_campaigns_admin", getInitialCampaigns());
  const [pageSettings, setPageSettings] = useFirestoreData<EventsPageSettings>("esn_events_page_settings", DEFAULT_EVENTS_PAGE_SETTINGS);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") === "cms" ? "cms" : "events";
  const [activeTab, setActiveTab] = useState<"events" | "cms">(initialTab);
  const [showPageSettingsModal, setShowPageSettingsModal] = useState(false);
  const [settingsForm, setSettingsForm] = useState<EventsPageSettings>(DEFAULT_EVENTS_PAGE_SETTINGS);
  const [pageSettingsSaved, setPageSettingsSaved] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | EventStatus>("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<ESNEvent, "id">>(blankEvent);
  const [editId, setEditId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [detail, setDetail] = useState<ESNEvent | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [showQR, setShowQR] = useState<ESNEvent | null>(null);

  useEffect(() => {
    if (pageSettings) {
      setSettingsForm(pageSettings);
    }
  }, [pageSettings]);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "cms") {
      setActiveTab("cms");
    } else if (tabParam === "events") {
      setActiveTab("events");
    }
  }, [searchParams]);

  const openPageSettings = () => {
    setSettingsForm(pageSettings || DEFAULT_EVENTS_PAGE_SETTINGS);
    setShowPageSettingsModal(true);
    setPageSettingsSaved(false);
  };

  const savePageSettings = async () => {
    setIsSaving(true);
    setPageSettings(settingsForm);
    await saveFirestoreData("esn_events_page_settings", settingsForm);
    logAdminActivity("Updated Events Page CMS", "Events", "Updated Events & Campaigns page banner, heading, description, and stats.", "success");
    setIsSaving(false);
    setPageSettingsSaved(true);
    setTimeout(() => {
      setPageSettingsSaved(false);
    }, 3000);
  };

  const save = async (list: ESNEvent[]) => {
    await setEvents(list);
    await saveFirestoreData("esn_events", list);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.date) return;
    setIsSaving(true);
    try {
      const cleanForm: any = { ...form };
      if (!cleanForm.projectId) delete cleanForm.projectId;
      if (!cleanForm.campaignId) delete cleanForm.campaignId;

      if (editId !== null) {
        const updatedList = events.map((e) => e.id === editId ? { ...cleanForm, id: editId } : e);
        await save(updatedList);
        await logAdminActivity("Updated Event", "Events", `Saved updates to event "${form.title}" (${form.status || "upcoming"}).`, "info");
      } else {
        const newEvent: ESNEvent = { ...cleanForm, id: Date.now() };
        const updatedList = [newEvent, ...events];
        await save(updatedList);
        await logAdminActivity("Created Event", "Events", `Created event "${form.title}" (${form.status || "upcoming"}).`, "success");
      }
      setShowForm(false);
      setEditId(null);
      setForm(blankEvent);
    } catch (err) {
      console.error("Failed to save event:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const startEdit = (ev: ESNEvent) => {
    const { id, ...rest } = ev;
    setForm({
      ...blankEvent,
      ...rest,
    });
    setEditId(id);
    setShowForm(true);
  };

  const currentProgramInitiatives = DEFAULT_PROGRAM_INITIATIVES[form.programSlug || "youth"] || [];

  const confirmDelete = (id: number) => setDeleteConfirmId(id);
  const doDelete = () => {
    if (deleteConfirmId === null) return;
    const doomed = events.find((e) => e.id === deleteConfirmId);
    save(events.filter((e) => e.id !== deleteConfirmId));
    logAdminActivity("Deleted Event", "Events", `Deleted event "${doomed?.title || deleteConfirmId}".`, "warning");
    setDeleteConfirmId(null);
    setDetail(null);
  };

  const filtered = (events || []).filter((e) => {
    if (!e) return false;
    const title = String(e.title || "").toLowerCase();
    const loc = String(e.location || "").toLowerCase();
    const q = String(search || "").toLowerCase().trim();
    const matchSearch = !q || title.includes(q) || loc.includes(q);
    const matchStatus = filterStatus === "All" || e.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = {
    upcoming: events.filter(e => e.status === "upcoming").length,
    ongoing: events.filter(e => e.status === "ongoing").length,
    completed: events.filter(e => e.status === "completed").length,
  };

  const eventToDelete = events.find(e => e.id === deleteConfirmId);

  return (
    <div className="flex flex-col gap-7">
      {/* Top View Mode Navigation Tabs */}
      <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
        <button
          onClick={() => {
            setActiveTab("events");
            setSearchParams({});
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === "events"
              ? "bg-[#0B5D3F] text-white shadow-sm"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          <Calendar size={16} /> Events Manager ({events.length})
        </button>
        <button
          onClick={() => {
            setActiveTab("cms");
            setSearchParams({ tab: "cms" });
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === "cms"
              ? "bg-[#0B5D3F] text-white shadow-sm"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          <Sliders size={16} /> Events & Campaigns Page & Stats (CMS)
          <span className="text-[10px] bg-emerald-500/20 text-emerald-800 px-2 py-0.5 rounded-full font-extrabold uppercase">
            Edit Digits & Content
          </span>
        </button>
      </div>

      {activeTab === "cms" ? (
        /* ══════════════════════════════════════════════════════
           EVENTS & CAMPAIGNS PAGE CMS & STATS EDITOR
           ══════════════════════════════════════════════════════ */
        <div className="flex flex-col gap-6">
          {/* Header Bar */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0B5D3F]/10 text-[#0B5D3F] flex items-center justify-center shrink-0">
                <Sparkles size={24} />
              </div>
              <div>
                <h3 className="font-black text-gray-900 text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Events & Campaigns Page Settings & Metric Stats
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Live CMS editor for <span className="font-bold text-[#0B5D3F]">/events</span>. Modify the 4 highlight stats digits (e.g. 120+, 2.8M+, 190+, 48), about story, hero banner, and call-to-action.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              <Link
                to="/events"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-all"
              >
                <Eye size={14} /> View Live Page <ExternalLink size={12} />
              </Link>
              <button
                type="button"
                onClick={() => setSettingsForm(DEFAULT_EVENTS_PAGE_SETTINGS)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold transition-all"
              >
                <RefreshCw size={13} /> Defaults
              </button>
              <button
                type="button"
                onClick={savePageSettings}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0B5D3F] hover:bg-[#0a5237] text-white text-xs font-bold shadow-md transition-all hover:scale-[1.02]"
              >
                <Save size={14} /> {isSaving ? "Saving..." : "Save All Changes"}
              </button>
            </div>
          </div>

          {pageSettingsSaved && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2.5 shadow-sm"
            >
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              <span>Events & Campaigns page settings updated successfully! Live page (/events) is synchronized in real-time.</span>
            </motion.div>
          )}

          {/* Section 1: 4 Highlight Metric Stats (The Digits & Labels) */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#0B5D3F] text-white flex items-center justify-center shrink-0">
                  <BarChart3 size={18} />
                </div>
                <div>
                  <h4 className="font-black text-gray-900 text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Top Highlight Metric Stats (Digits & Labels)
                  </h4>
                  <p className="text-xs text-gray-500">
                    These prominent digits appear right beneath the hero banner on the public Events & Campaigns page.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const newStats = [...(settingsForm.stats || [])];
                    newStats.push({ value: "100+", label: "New Metric" });
                    setSettingsForm({ ...settingsForm, stats: newStats });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#0B5D3F] text-xs font-bold transition-colors"
                >
                  <Plus size={13} /> Add Stat Card
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSettingsForm({
                      ...settingsForm,
                      stats: [
                        { value: "120+", label: "Events Per Year" },
                        { value: "2.8M+", label: "Campaign Participants" },
                        { value: "190+", label: "Countries Reached" },
                        { value: "48", label: "Major Summits" },
                      ]
                    });
                  }}
                  className="text-xs font-semibold text-gray-500 hover:text-gray-800 underline px-2"
                >
                  Reset 4 Standard Digits
                </button>
              </div>
            </div>

            {/* Visual Live Preview of the Cards */}
            <div>
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Live Visual Preview (Editable Below)</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#F6FBF8] p-4 rounded-2xl border border-gray-200/80 mb-2">
                {(settingsForm.stats || []).map((s, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-4 border border-gray-100 text-center shadow-xs">
                    <div className="text-2xl font-black text-[#0B5D3F] mb-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {s.value || "—"}
                    </div>
                    <div className="text-xs text-gray-500 font-medium">{s.label || "Untitled"}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stat Cards Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(settingsForm.stats || []).map((s, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-[#F9FBFA] hover:bg-white rounded-2xl border border-gray-200/90 hover:border-[#4CAF50] transition-all shadow-xs flex flex-col gap-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-[#0B5D3F] uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-[#0B5D3F] text-white flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      Stat Counter #{idx + 1}
                    </span>
                    {(settingsForm.stats || []).length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newStats = [...settingsForm.stats].filter((_, i) => i !== idx);
                          setSettingsForm({ ...settingsForm, stats: newStats });
                        }}
                        className="text-gray-400 hover:text-red-600 p-1 rounded-lg transition-colors"
                        title="Remove stat"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">
                      Display Digit / Value *
                    </label>
                    <input
                      type="text"
                      value={s.value}
                      onChange={(e) => {
                        const newStats = [...settingsForm.stats];
                        newStats[idx] = { ...newStats[idx], value: e.target.value };
                        setSettingsForm({ ...settingsForm, stats: newStats });
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-lg font-black text-[#0B5D3F] bg-white focus:outline-none focus:border-[#4CAF50] transition-colors"
                      placeholder="e.g. 120+, 2.8M+, 190+, 48"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">
                      Label / Description *
                    </label>
                    <input
                      type="text"
                      value={s.label}
                      onChange={(e) => {
                        const newStats = [...settingsForm.stats];
                        newStats[idx] = { ...newStats[idx], label: e.target.value };
                        setSettingsForm({ ...settingsForm, stats: newStats });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:border-[#4CAF50] transition-colors"
                      placeholder="e.g. Events Per Year"
                    />
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="pt-2 border-t border-gray-200/60 flex flex-wrap gap-1">
                    <span className="text-[10px] text-gray-400 font-medium block w-full mb-0.5">Quick Suggestions:</span>
                    {[
                      { val: "120+", lbl: "Events Per Year" },
                      { val: "2.8M+", lbl: "Campaign Participants" },
                      { val: "190+", lbl: "Countries Reached" },
                      { val: "48", lbl: "Major Summits" },
                      { val: "500K+", lbl: "Volunteers" },
                      { val: "100%", lbl: "Impact Verified" },
                    ].map((pre) => (
                      <button
                        key={pre.lbl}
                        type="button"
                        onClick={() => {
                          const newStats = [...settingsForm.stats];
                          newStats[idx] = { value: pre.val, label: pre.lbl };
                          setSettingsForm({ ...settingsForm, stats: newStats });
                        }}
                        className="text-[10px] font-medium bg-white hover:bg-emerald-50 text-gray-600 hover:text-[#0B5D3F] px-2 py-0.5 rounded-md border border-gray-200 transition-colors"
                      >
                        {pre.val}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: About Section Content */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
              <div className="w-9 h-9 rounded-xl bg-[#4CAF50]/15 text-[#4CAF50] flex items-center justify-center shrink-0">
                <Leaf size={18} />
              </div>
              <div>
                <h4 className="font-black text-gray-900 text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  About Section (Story & Movement Mission)
                </h4>
                <p className="text-xs text-gray-500">
                  Appears directly below the 4 stat cards on the Events & Campaigns page.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">About Badge (e.g. ABOUT)</label>
                <input
                  type="text"
                  value={settingsForm.aboutBadge || "About"}
                  onChange={(e) => setSettingsForm({ ...settingsForm, aboutBadge: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#4CAF50] focus:outline-none focus:border-[#4CAF50]"
                  placeholder="e.g. ABOUT"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-gray-700 block mb-1">About Heading</label>
                <input
                  type="text"
                  value={settingsForm.aboutHeading}
                  onChange={(e) => setSettingsForm({ ...settingsForm, aboutHeading: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#4CAF50]"
                  placeholder="e.g. Building the Movement Together"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">About Description Narrative</label>
              <textarea
                rows={4}
                value={settingsForm.description}
                onChange={(e) => setSettingsForm({ ...settingsForm, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-[#4CAF50] leading-relaxed"
                placeholder="ESN hosts and supports a year-round calendar of events, campaigns, and mobilization opportunities..."
              />
            </div>
          </div>

          {/* Section 3: Hero Header Banner & Breadcrumb */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
              <div className="w-9 h-9 rounded-xl bg-[#173B63]/10 text-[#173B63] flex items-center justify-center shrink-0">
                <Layers size={18} />
              </div>
              <div>
                <h4 className="font-black text-gray-900 text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Hero Header & Banner Image
                </h4>
                <p className="text-xs text-gray-500">
                  Top hero banner, breadcrumb badge, and overarching tagline.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Hero Badge (Breadcrumb)</label>
                <input
                  type="text"
                  value={settingsForm.badge}
                  onChange={(e) => setSettingsForm({ ...settingsForm, badge: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold focus:outline-none focus:border-[#4CAF50]"
                  placeholder="e.g. ESN Programs"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Page Title / Main Heading</label>
                <input
                  type="text"
                  value={settingsForm.label}
                  onChange={(e) => setSettingsForm({ ...settingsForm, label: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#4CAF50]"
                  placeholder="e.g. Events & Campaigns"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Hero Subheading / Tagline</label>
              <input
                type="text"
                value={settingsForm.tagline}
                onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]"
                placeholder="e.g. Mobilizing Action Through Powerful Collective Moments"
              />
            </div>

            <div>
              <ImageUploadField
                label="Hero Banner Image"
                value={settingsForm.heroImage}
                onChange={(url) => setSettingsForm({ ...settingsForm, heroImage: url })}
                folder="events"
                aspectRatio="video"
                helpText="High-resolution banner photo for the top of the Events & Campaigns page (/events)"
              />
            </div>
          </div>

          {/* Section 4: Events List Header & Section CTA */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                <Globe2 size={18} />
              </div>
              <div>
                <h4 className="font-black text-gray-900 text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Events Listing Section Header & Contact Link
                </h4>
                <p className="text-xs text-gray-500">
                  Header above the filterable events calendar list.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Section Subtitle / Badge</label>
                <input
                  type="text"
                  value={settingsForm.sectionBadge || "Global Network"}
                  onChange={(e) => setSettingsForm({ ...settingsForm, sectionBadge: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]"
                  placeholder="e.g. Global Network"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Section Heading</label>
                <input
                  type="text"
                  value={settingsForm.sectionHeading || "Events & Mobilizations"}
                  onChange={(e) => setSettingsForm({ ...settingsForm, sectionHeading: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold focus:outline-none focus:border-[#4CAF50]"
                  placeholder="e.g. Events & Mobilizations"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Contact Button Label</label>
                <input
                  type="text"
                  value={settingsForm.ctaButtonText || "Contact Our Events Team"}
                  onChange={(e) => setSettingsForm({ ...settingsForm, ctaButtonText: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]"
                  placeholder="e.g. Contact Our Events Team"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Contact Button Link URL</label>
                <input
                  type="text"
                  value={settingsForm.ctaButtonLink || "/contact?subject=Event%20Registration"}
                  onChange={(e) => setSettingsForm({ ...settingsForm, ctaButtonLink: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]"
                  placeholder="e.g. /contact?subject=Event%20Registration"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Bottom Call-To-Action Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
              <div className="w-9 h-9 rounded-xl bg-[#0B5D3F] text-white flex items-center justify-center shrink-0">
                <Calendar size={18} />
              </div>
              <div>
                <h4 className="font-black text-gray-900 text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Bottom Call-To-Action Banner
                </h4>
                <p className="text-xs text-gray-500">
                  Registration box at the bottom of the Events & Campaigns page.
                </p>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">CTA Card Title</label>
              <input
                type="text"
                value={settingsForm.ctaTitle || "Register for an Event"}
                onChange={(e) => setSettingsForm({ ...settingsForm, ctaTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold focus:outline-none focus:border-[#4CAF50]"
                placeholder="e.g. Register for an Event"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">CTA Description</label>
              <textarea
                rows={2}
                value={settingsForm.ctaDescription || "Host, sponsor, or attend ESN events worldwide. Contact us to learn about partnership and participation opportunities."}
                onChange={(e) => setSettingsForm({ ...settingsForm, ctaDescription: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]"
                placeholder="Host, sponsor, or attend ESN events worldwide..."
              />
            </div>
          </div>

          {/* Sticky Bottom Actions Bar */}
          <div className="sticky bottom-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-gray-200 shadow-xl flex items-center justify-between gap-4 z-20">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-gray-600 hidden sm:inline">
                All changes synchronize directly with the public /events page
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/events"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl text-gray-600 hover:text-gray-900 text-xs font-bold hover:bg-gray-100 transition-colors"
              >
                Preview Live
              </Link>
              <button
                type="button"
                onClick={savePageSettings}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-7 py-2.5 rounded-xl bg-[#0B5D3F] hover:bg-[#0a5237] text-white text-xs font-black shadow-md transition-all hover:scale-105"
              >
                <Save size={15} /> {isSaving ? "Saving..." : "Save All Changes"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ══════════════════════════════════════════════════════
           EVENTS MANAGER (ALL EVENTS TABLE & CARDS)
           ══════════════════════════════════════════════════════ */
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Events Manager</h3>
              <p className="text-sm text-gray-400 mt-0.5">{events.length} events total · {counts.upcoming} upcoming · {counts.ongoing} live</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setActiveTab("cms");
                  setSearchParams({ tab: "cms" });
                }}
                className="flex items-center gap-2 bg-emerald-50 text-[#0B5D3F] border border-emerald-300 hover:border-[#0B5D3F] px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-100 transition-all shadow-sm"
              >
                <Sliders size={15} /> Edit Page Digits & CMS
              </button>
              <button
                onClick={() => { setForm(blankEvent); setEditId(null); setShowForm(true); }}
                className="flex items-center gap-2 bg-[#0B5D3F] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#0a5237] transition-all shadow-sm"
              >
                <Plus size={16} /> Create Event
              </button>
            </div>
          </div>

          {/* Quick Notice to Edit Page Digits */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0B5D3F] text-white flex items-center justify-center shrink-0">
                <Sparkles size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Events & Campaigns Page Settings & Metric Stats (120+, 2.8M+, 190+, 48)</h4>
                <p className="text-xs text-gray-500">Edit the 4 top impact stat cards, about story narrative, and hero banner for the public page.</p>
              </div>
            </div>
            <button
              onClick={() => {
                setActiveTab("cms");
                setSearchParams({ tab: "cms" });
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0B5D3F] hover:bg-[#0a5237] text-white rounded-xl text-xs font-bold transition-all shrink-0 w-fit"
            >
              <Edit3 size={13} /> Edit Page & Stats CMS
            </button>
          </div>

          {/* Stat pills */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Events", value: events.length, icon: Calendar, color: "#0B5D3F" },
              { label: "Upcoming", value: counts.upcoming, icon: Clock, color: "#173B63" },
              { label: "Live Now", value: counts.ongoing, icon: CheckCircle2, color: "#4CAF50" },
              { label: "Total Registered", value: events.reduce((s, e) => s + e.registered, 0).toLocaleString(), icon: Users, color: "#D6A95A" },
            ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: s.color + "15" }}>
              <s.icon size={20} style={{ color: s.color }} />
            </div>
            <div>
              <div className="text-xl font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.value}</div>
              <div className="text-xs text-gray-400">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{editId ? "Edit Event" : "Create New Event"}</h4>
                <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                  <X size={16} />
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: "Event Title *", key: "title", type: "text", placeholder: "Summit title..." },
                  { label: "Speaker / Host", key: "speaker", type: "text", placeholder: "Speaker name" },
                  { label: "Date *", key: "date", type: "text", placeholder: "Aug 15, 2026" },
                  { label: "Time", key: "time", type: "text", placeholder: "09:00 AM" },
                  { label: "Location", key: "location", type: "text", placeholder: "City, Country or Online" },
                  { label: "Capacity", key: "capacity", type: "number", placeholder: "100" },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="text-xs font-bold text-gray-600 mb-1.5 block">{f.label}</label>
                    <input
                      type={f.type}
                      value={(form as any)[f.key]}
                      onChange={(e) => setForm({ ...form, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value })}
                      placeholder={f.placeholder}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none">
                    {["Summit", "Webinar", "Field", "Gala", "Hackathon", "Training", "Workshop", "Conference"].map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Mode</label>
                  <select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value as any })} className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none">
                    {["Virtual", "In-Person", "Hybrid"].map((m) => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as EventStatus })} className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none capitalize">
                    {["upcoming", "ongoing", "postponed", "completed", "cancelled"].map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <ImageUploadField
                    label="Event Cover Image / Banner"
                    value={form.image}
                    onChange={(url) => setForm({ ...form, image: url })}
                    folder="events"
                    helpText="Upload an event flyer or cover image"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none resize-none" placeholder="Brief event description..." />
                </div>

                {/* Project & Campaign Linking */}
                <div className="sm:col-span-2 p-4 bg-[#F8FAFC] border border-blue-200/80 rounded-2xl">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full bg-[#173B63]" />
                    <label className="text-xs font-bold text-[#173B63] uppercase tracking-wider">
                      Link to Project & Campaign
                    </label>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">Connected Project</label>
                      <select
                        value={form.projectId ? String(form.projectId) : ""}
                        onChange={(e) => {
                          const pid = e.target.value ? Number(e.target.value) : undefined;
                          const matched = (projects || []).find(p => p.id === pid);
                          setForm({ ...form, projectId: pid, projectName: matched ? matched.name : "" });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-blue-300 text-xs font-semibold text-gray-800 focus:outline-none"
                      >
                        <option value="">None (Standalone Event)</option>
                        {(projects || []).map((p) => (
                          <option key={p.id} value={p.id}>#{p.id} - {p.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">Connected Campaign</label>
                      <select
                        value={form.campaignId ? String(form.campaignId) : ""}
                        onChange={(e) => {
                          const cid = e.target.value ? Number(e.target.value) : undefined;
                          const matched = (campaigns || []).find(c => c.id === cid);
                          setForm({ ...form, campaignId: cid, campaignName: matched ? matched.title : "" });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-blue-300 text-xs font-semibold text-gray-800 focus:outline-none"
                      >
                        <option value="">None (Standalone Event)</option>
                        {(campaigns || []).map((c) => (
                          <option key={c.id} value={c.id}>#{c.id} - {c.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Program & Initiative Interconnection (Point 1) */}
                <div className="sm:col-span-2 p-4 bg-[#F0FDF4] border border-emerald-200/80 rounded-2xl">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full bg-[#0B5D3F]" />
                    <label className="text-xs font-bold text-[#0B5D3F] uppercase tracking-wider">
                      Program & Initiative Interconnection
                    </label>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">Parent Core Program *</label>
                      <select
                        value={form.programSlug || "youth"}
                        onChange={(e) => {
                          const slug = e.target.value;
                          const inits = DEFAULT_PROGRAM_INITIATIVES[slug] || [];
                          setForm({
                            ...form,
                            programSlug: slug,
                            initiativeTitle: inits[0]?.title || ""
                          });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-emerald-300 text-xs font-semibold text-gray-800 focus:outline-none"
                      >
                        {PROGRAM_OPTIONS.map((po) => (
                          <option key={po.slug} value={po.slug}>{po.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">Linked Program Initiative</label>
                      <input
                        type="text"
                        list="event-init-options"
                        value={form.initiativeTitle || ""}
                        onChange={(e) => setForm({ ...form, initiativeTitle: e.target.value })}
                        placeholder="Select or enter initiative track..."
                        className="w-full px-3 py-2 rounded-xl bg-white border border-emerald-300 text-xs font-medium text-gray-800 focus:outline-none"
                      />
                      <datalist id="event-init-options">
                        {currentProgramInitiatives.map((init) => (
                          <option key={init.title} value={init.title} />
                        ))}
                      </datalist>
                    </div>
                  </div>
                </div>

                {/* Impact Dashboard Insights (Point 1: Live Aggregation Numbers) */}
                <div className="sm:col-span-2 p-4 bg-[#F8FAFC] border border-slate-200 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Impact Dashboard Insights (Live Aggregation Numbers)
                    </label>
                    <span className="text-[10px] font-medium text-slate-500">Auto-sums into final Impact Dashboard</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Trees Planted</label>
                      <input
                        type="number"
                        min={0}
                        value={form.impactTrees || 0}
                        onChange={(e) => setForm({ ...form, impactTrees: Number(e.target.value) })}
                        placeholder="0"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-[#0B5D3F] focus:outline-none focus:border-[#4CAF50]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Communities</label>
                      <input
                        type="number"
                        min={0}
                        value={form.impactCommunities || 0}
                        onChange={(e) => setForm({ ...form, impactCommunities: Number(e.target.value) })}
                        placeholder="0"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-[#173B63] focus:outline-none focus:border-[#4CAF50]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Beneficiaries</label>
                      <input
                        type="number"
                        min={0}
                        value={form.impactBeneficiaries || 0}
                        onChange={(e) => setForm({ ...form, impactBeneficiaries: Number(e.target.value) })}
                        placeholder="0"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-[#D6A95A] focus:outline-none focus:border-[#4CAF50]"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className="flex-1 bg-[#0B5D3F] text-white py-3 rounded-xl font-semibold hover:bg-[#0a5237] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSaving ? "Saving to Cloud..." : editId ? "Save Changes" : "Create Event"}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  disabled={isSaving}
                  className="px-6 py-3 rounded-xl text-gray-500 hover:bg-gray-100 transition-all font-semibold"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteConfirmId !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <AlertTriangle size={28} className="text-red-500" />
              </div>
              <h4 className="font-black text-gray-900 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Delete Event?</h4>
              <p className="text-sm text-gray-500 mb-1">This will permanently delete:</p>
              <p className="text-sm font-bold text-gray-800 mb-6">"{eventToDelete?.title}"</p>
              <div className="flex gap-3">
                <button onClick={doDelete} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-all">Yes, Delete</button>
                <button onClick={() => setDeleteConfirmId(null)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Modal */}
      <AnimatePresence>
        {showQR && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowQR(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h4 className="font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>QR Attendance Code</h4>
                <button onClick={() => setShowQR(null)} className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200"><X size={15} /></button>
              </div>
              <div className="flex justify-center mb-4 p-6 bg-[#F6FBF8] rounded-2xl">
                <QRGrid size={160} />
              </div>
              <p className="text-sm font-semibold text-gray-700 mb-1">{showQR.title}</p>
              <p className="text-xs text-gray-400 mb-5">{showQR.date} · {showQR.location}</p>
              <p className="text-xs text-gray-400 bg-[#F6FBF8] rounded-xl px-4 py-2 font-mono">
                https://esnglobal.org/attend/{showQR.id}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-3 p-5 border-b border-gray-50">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search events..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(["All", "upcoming", "ongoing", "postponed", "completed", "cancelled"] as const).map((s) => (
              <button key={s} onClick={() => setFilterStatus(s)} className={`px-3.5 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${filterStatus === s ? "bg-[#0B5D3F] text-white" : "bg-[#F6FBF8] text-gray-500 hover:bg-[#0B5D3F]/10"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Event Cards */}
        <div className="divide-y divide-gray-50">
          {filtered.map((ev) => {
            const sc = statusConfig[ev.status];
            const ModeIcon = modeIcon[ev.mode];
            const fillPct = Math.round((ev.registered / ev.capacity) * 100);
            return (
              <motion.div key={ev.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-start gap-5 p-5 hover:bg-[#F6FBF8]/50 transition-colors">
                {(() => {
                  const parts = String(ev.date || "").trim().split(/[\s,]+/);
                  const month = parts[0] || "Event";
                  const day = parts[1] || "";
                  const year = parts[2] || "";
                  return (
                    <div className="w-16 shrink-0 text-center bg-[#F6FBF8] rounded-2xl py-3 border border-gray-100">
                      <div className="text-xs font-bold text-gray-400 uppercase">{month}</div>
                      <div className="text-2xl font-black text-[#0B5D3F]">{day || "—"}</div>
                      {year && <div className="text-xs text-gray-400">{year}</div>}
                    </div>
                  );
                })()}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-bold text-white px-2.5 py-1 rounded-full" style={{ backgroundColor: sc.bg }}>{sc.label}</span>
                    <span className="text-xs text-gray-400 bg-[#F6FBF8] px-2.5 py-1 rounded-full border border-gray-100">{ev.type}</span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <ModeIcon size={11} />{ev.mode}
                    </span>
                    {ev.programSlug && (
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {PROGRAM_OPTIONS.find(p => p.slug === ev.programSlug)?.label || ev.programSlug}
                        {ev.initiativeTitle ? ` · ${ev.initiativeTitle}` : ""}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1 truncate" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{ev.title}</h4>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-2 flex-wrap">
                    <span className="flex items-center gap-1"><MapPin size={11} />{ev.location}</span>
                    <span className="flex items-center gap-1"><Clock size={11} />{ev.time}</span>
                    <span className="flex items-center gap-1"><Users size={11} />{ev.registered}/{ev.capacity} registered</span>
                  </div>
                  {(ev.projectName || ev.campaignName) && (
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {ev.projectName && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          Project: {ev.projectName}
                        </span>
                      )}
                      {ev.campaignName && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
                          Campaign: {ev.campaignName}
                        </span>
                      )}
                    </div>
                  )}
                  {((ev.impactTrees || 0) > 0 || (ev.impactCommunities || 0) > 0 || (ev.impactBeneficiaries || 0) > 0) && (
                    <div className="flex items-center gap-3 text-[11px] font-medium text-emerald-700 bg-emerald-50/70 border border-emerald-100 px-2.5 py-1 rounded-lg w-fit mb-2">
                      {(ev.impactTrees || 0) > 0 && <span>🌲 {(ev.impactTrees || 0).toLocaleString()} trees</span>}
                      {(ev.impactCommunities || 0) > 0 && <span>🏘️ {ev.impactCommunities} communities</span>}
                      {(ev.impactBeneficiaries || 0) > 0 && <span>👥 {(ev.impactBeneficiaries || 0).toLocaleString()} beneficiaries</span>}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 max-w-[180px] h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#4CAF50] rounded-full transition-all" style={{ width: `${fillPct}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-gray-500">{fillPct}% full</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => setDetail(ev)} className="p-2 rounded-xl hover:bg-[#0B5D3F]/10 text-gray-300 hover:text-[#0B5D3F] transition-all" title="View Details">
                    <Eye size={15} />
                  </button>
                  <button onClick={() => startEdit(ev)} className="p-2 rounded-xl hover:bg-[#0B5D3F]/10 text-gray-300 hover:text-[#0B5D3F] transition-all" title="Edit">
                    <Edit3 size={15} />
                  </button>
                  <button onClick={() => confirmDelete(ev.id)} className="p-2 rounded-xl hover:bg-red-50 text-gray-300 hover:text-red-500 transition-all" title="Delete">
                    <Trash2 size={15} />
                  </button>
                </div>
              </motion.div>
            );
          })}
          {filtered.length === 0 && (
            <div className="py-16 text-center text-gray-300">
              <Calendar size={40} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">No events match your filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Drawer */}
      <AnimatePresence>
        {detail && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end" onClick={() => setDetail(null)}>
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 28 }} className="h-full w-full max-w-md bg-white shadow-2xl flex flex-col overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h4 className="font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Event Details</h4>
                <button onClick={() => setDetail(null)} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center"><X size={16} /></button>
              </div>
              <div className="p-6 flex-1">
                <div className="bg-gradient-to-br from-[#0B5D3F] to-[#173B63] rounded-2xl p-6 text-white mb-6">
                  <span className="text-xs bg-white/20 px-3 py-1 rounded-full mb-3 inline-block">{detail.type}</span>
                  <h3 className="text-white mb-1 text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{detail.title}</h3>
                  <p className="text-white/60 text-sm">{detail.description}</p>
                </div>
                {detail.programSlug && (
                  <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-0.5">Linked Core Program</div>
                    <div className="text-xs font-semibold text-emerald-950">
                      {PROGRAM_OPTIONS.find(p => p.slug === detail.programSlug)?.label || detail.programSlug}
                      {detail.initiativeTitle ? ` — ${detail.initiativeTitle}` : ""}
                    </div>
                  </div>
                )}
                {((detail.impactTrees || 0) > 0 || (detail.impactCommunities || 0) > 0 || (detail.impactBeneficiaries || 0) > 0) && (
                  <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-2">Live Impact Insights</div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-white rounded-lg border border-slate-100">
                        <div className="text-xs font-black text-[#0B5D3F]">{(detail.impactTrees || 0).toLocaleString()}</div>
                        <div className="text-[9px] text-gray-500 uppercase">Trees</div>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-100">
                        <div className="text-xs font-black text-[#173B63]">{(detail.impactCommunities || 0).toLocaleString()}</div>
                        <div className="text-[9px] text-gray-500 uppercase">Communities</div>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-100">
                        <div className="text-xs font-black text-[#D6A95A]">{(detail.impactBeneficiaries || 0).toLocaleString()}</div>
                        <div className="text-[9px] text-gray-500 uppercase">Beneficiaries</div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    ["Date", detail.date], ["Time", detail.time],
                    ["Mode", detail.mode], ["Location", detail.location],
                    ["Speaker", detail.speaker], ["Capacity", `${detail.registered}/${detail.capacity}`],
                  ].map(([l, v]) => (
                    <div key={l} className="bg-[#F6FBF8] rounded-xl p-3">
                      <div className="text-xs text-gray-400 mb-0.5">{l}</div>
                      <div className="text-sm font-semibold text-gray-800">{v}</div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => { setShowQR(detail); }}
                    className="w-full flex items-center justify-center gap-2 bg-[#0B5D3F] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#0a5237] transition-all"
                  >
                    <QrCode size={16} /> Generate QR Attendance
                  </button>
                  <button
                    onClick={() => exportRegistrations(detail)}
                    className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all"
                  >
                    <Download size={16} /> Export Registrations
                  </button>
                  <button
                    onClick={() => { setDetail(null); confirmDelete(detail.id); }}
                    className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-500 py-3 rounded-xl font-semibold text-sm hover:bg-red-50 transition-all"
                  >
                    <Trash2 size={16} /> Delete Event
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
        </>
      )}

      {/* Page Banner & Content Settings Modal */}
      <AnimatePresence>
        {showPageSettingsModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                <div>
                  <h3 className="font-black text-gray-900 text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Events & Campaigns Page Settings
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">Customize the public page banner, breadcrumb badge, headline, and impact stats</p>
                </div>
                <button onClick={() => setShowPageSettingsModal(false)} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <X size={16} />
                </button>
              </div>

              {pageSettingsSaved && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  Events & Campaigns page settings updated successfully!
                </div>
              )}

              <div className="flex flex-col gap-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Badge Text (e.g. ESN Programs)</label>
                    <input
                      type="text"
                      value={settingsForm.badge}
                      onChange={(e) => setSettingsForm({ ...settingsForm, badge: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]"
                      placeholder="e.g. ESN Programs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Page Title / Heading</label>
                    <input
                      type="text"
                      value={settingsForm.label}
                      onChange={(e) => setSettingsForm({ ...settingsForm, label: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]"
                      placeholder="e.g. Events & Campaigns"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Tagline / Subheading</label>
                  <input
                    type="text"
                    value={settingsForm.tagline}
                    onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]"
                    placeholder="e.g. Mobilizing Action Through Powerful Collective Moments"
                  />
                </div>

                <div>
                  <ImageUploadField
                    label="Hero Banner Image"
                    value={settingsForm.heroImage}
                    onChange={(url) => setSettingsForm({ ...settingsForm, heroImage: url })}
                    folder="events"
                    aspectRatio="video"
                    helpText="High-resolution banner photo for the top of the Events & Campaigns page"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">About Section Heading</label>
                  <input
                    type="text"
                    value={settingsForm.aboutHeading}
                    onChange={(e) => setSettingsForm({ ...settingsForm, aboutHeading: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]"
                    placeholder="e.g. Building the Movement Together"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">About Description</label>
                  <textarea
                    rows={3}
                    value={settingsForm.description}
                    onChange={(e) => setSettingsForm({ ...settingsForm, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]"
                    placeholder="Describe the events and campaigns mission..."
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-2">4 Highlight Stats Counters</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {(settingsForm.stats || []).map((s, idx) => (
                      <div key={idx} className="p-3 bg-[#F6FBF8] rounded-xl border border-gray-200 flex flex-col gap-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Stat #{idx + 1}</span>
                        <input
                          type="text"
                          value={s.value}
                          onChange={(e) => {
                            const newStats = [...settingsForm.stats];
                            newStats[idx] = { ...newStats[idx], value: e.target.value };
                            setSettingsForm({ ...settingsForm, stats: newStats });
                          }}
                          className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-xs font-bold focus:outline-none focus:border-[#4CAF50]"
                          placeholder="e.g. 120+"
                        />
                        <input
                          type="text"
                          value={s.label}
                          onChange={(e) => {
                            const newStats = [...settingsForm.stats];
                            newStats[idx] = { ...newStats[idx], label: e.target.value };
                            setSettingsForm({ ...settingsForm, stats: newStats });
                          }}
                          className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-[11px] focus:outline-none focus:border-[#4CAF50]"
                          placeholder="e.g. Events Per Year"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowPageSettingsModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={savePageSettings}
                    className="px-6 py-2.5 rounded-xl bg-[#0B5D3F] text-white text-xs font-bold hover:bg-[#0a5237] transition-all shadow-md"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
