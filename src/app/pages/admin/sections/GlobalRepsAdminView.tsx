import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Globe2, Plus, Search, Edit3, Trash2, CheckCircle2, Award, Users,
  MapPin, Shield, Star, ExternalLink, Eye, Compass, Heart, Zap, X, AlertTriangle
} from "lucide-react";
import { useFirestoreData, saveFirestoreData, fetchFirestoreData } from "../../../../lib/useFirestore";
import { ImageUploadField } from "../../../components/ui/ImageUploadField";
import { logAdminActivity } from "../../../../lib/activityLogger";
import { getInitialStats, StatItem } from "./StatsAdminView";
import { getInitialHeroSlides, HeroSlide } from "./HeroAdminView";

export interface GlobalRepsSettings {
  badge: string;
  title: string;
  highlightedTitle: string;
  subtitle: string;
  image: string;
  floatingBadgeTitle: string;
  floatingBadgeSub: string;
  stats: Array<{ val: string; label: string }>;
  roleTitle: string;
  roleSub: string;
}

function parseNumericValue(valStr: string): number {
  if (!valStr) return 0;
  const clean = valStr.toUpperCase().replace(/[^0-9.KMB]/g, "");
  let multiplier = 1;
  let numPart = clean;
  if (clean.endsWith("M")) {
    multiplier = 1000000;
    numPart = clean.slice(0, -1);
  } else if (clean.endsWith("K")) {
    multiplier = 1000;
    numPart = clean.slice(0, -1);
  } else if (clean.endsWith("B")) {
    multiplier = 1000000000;
    numPart = clean.slice(0, -1);
  }
  const parsed = parseFloat(numPart);
  return isNaN(parsed) ? 0 : Math.round(parsed * multiplier);
}

export interface RepPillar {
  id: number;
  iconName: string;
  title: string;
  desc: string;
  color: string;
  bg: string;
}

export interface CountryRepItem {
  id: number | string;
  country: string;
  flag?: string;
  repName?: string;
  role?: string;
  region?: string;
  email?: string;
  status?: "Active" | "Appointed" | "In Review";
  appointedYear?: string;
}

const COUNTRY_FLAGS: Record<string, string> = {
  bangladesh: "🇧🇩", canada: "🇨🇦", kenya: "🇰🇪", brazil: "🇧🇷",
  uk: "🇬🇧", "united kingdom": "🇬🇧", germany: "🇩🇪", australia: "🇦🇺",
  indonesia: "🇮🇩", colombia: "🇨🇴", ghana: "🇬🇭", india: "🇮🇳",
  fiji: "🇫🇯", usa: "🇺🇸", "united states": "🇺🇸", nepal: "🇳🇵",
  japan: "🇯🇵", france: "🇫🇷", "south africa": "🇿🇦", egypt: "🇪🇬",
  mexico: "🇲🇽", nigeria: "🇳🇬", philippines: "🇵🇭", spain: "🇪🇸",
  italy: "🇮🇹", maldives: "🇲🇻", vietnam: "🇻🇳", thailand: "🇹🇭"
};

export function getFlagForCountry(countryName: string): string {
  if (!countryName) return "🌐";
  const clean = countryName.trim().toLowerCase();
  return COUNTRY_FLAGS[clean] || "🌐";
}

export function getInitialCountryReps(): CountryRepItem[] {
  return [
    { id: 1, country: "Bangladesh", repName: "Rizwan Ahmed", role: "National Lead Delegate", region: "South Asia", flag: "🇧🇩", status: "Active", appointedYear: "2024" },
    { id: 2, country: "Canada", repName: "Elena Trudeau", role: "Country Representative", region: "North America", flag: "🇨🇦", status: "Active", appointedYear: "2024" },
    { id: 3, country: "Kenya", repName: "David Ochieng", role: "East Africa Coordinator", region: "East Africa", flag: "🇰🇪", status: "Active", appointedYear: "2023" },
    { id: 4, country: "Brazil", repName: "Maria Santos", role: "Amazon Basin Delegate", region: "South America", flag: "🇧🇷", status: "Active", appointedYear: "2023" },
    { id: 5, country: "United Kingdom", repName: "Oliver Davies", role: "European Liaison", region: "Europe", flag: "🇬🇧", status: "Active", appointedYear: "2024" },
    { id: 6, country: "Germany", repName: "Hannah Müller", role: "Country Representative", region: "Europe", flag: "🇩🇪", status: "Active", appointedYear: "2024" },
    { id: 7, country: "Australia", repName: "Liam Chen", role: "Oceania Delegate", region: "Oceania", flag: "🇦🇺", status: "Active", appointedYear: "2024" },
    { id: 8, country: "Indonesia", repName: "Siti Aminah", role: "Southeast Asia Lead", region: "Southeast Asia", flag: "🇮🇩", status: "Active", appointedYear: "2023" },
    { id: 9, country: "Colombia", repName: "Sofia Hernandez", role: "Youth & Climate Negotiator", region: "South America", flag: "🇨🇴", status: "Active", appointedYear: "2024" },
    { id: 10, country: "Ghana", repName: "Kwame Mensah", role: "West Africa Coordinator", region: "West Africa", flag: "🇬🇭", status: "Active", appointedYear: "2024" },
    { id: 11, country: "India", repName: "Priya Sharma", role: "Country Representative", region: "South Asia", flag: "🇮🇳", status: "Active", appointedYear: "2024" },
    { id: 12, country: "Fiji", repName: "Kalesi Vuetaki", role: "Pacific Islands Envoy", region: "Pacific", flag: "🇫🇯", status: "Active", appointedYear: "2024" }
  ];
}

export const defaultGlobalRepsSettings: GlobalRepsSettings = {
  badge: "Global Leadership Network",
  title: "Lead Environmental Action in",
  highlightedTitle: "Your Country",
  subtitle: "Environmental Shapers Network appoints dedicated Country & Regional Representatives across nations worldwide. As an official ESN Representative, you will lead national initiatives, coordinate youth volunteers, and represent your region on global environmental stages.",
  image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900",
  floatingBadgeTitle: "Official Representation",
  floatingBadgeSub: "UN & COP Credentialed Network",
  stats: [
    { label: "Country Reps", val: "12" },
    { label: "Active Nations", val: "190+" },
    { label: "Regional Hubs", val: "12" },
    { label: "Volunteers", val: "48K+" }
  ],
  roleTitle: "Role Responsibilities & Privileges",
  roleSub: "What you will accomplish and experience as an authorized Country Representative."
};

export const defaultRepPillars: RepPillar[] = [
  {
    id: 1,
    iconName: "Globe2",
    title: "National Leadership",
    desc: "Be the official voice of ESN in your country, leading national conservation campaigns and community drives.",
    color: "text-[#0B5D3F]",
    bg: "bg-[#E8F5E9]"
  },
  {
    id: 2,
    iconName: "Users",
    title: "Youth Mobilization",
    desc: "Coordinate and mentor local youth volunteers, campus chapters, and grassroots activists across your districts.",
    color: "text-[#173B63]",
    bg: "bg-[#E3F2FD]"
  },
  {
    id: 3,
    iconName: "Award",
    title: "Global Representation",
    desc: "Receive opportunities for accredited attendance at international climate summits like UNFCCC COP, UNEP, and regional forums.",
    color: "text-[#D6A95A]",
    bg: "bg-[#FFF8E1]"
  },
  {
    id: 4,
    iconName: "Shield",
    title: "Policy & Advocacy",
    desc: "Liaise with local government environmental ministries, academic institutions, and media to amplify ESN research.",
    color: "text-[#4CAF50]",
    bg: "bg-[#F1F8E9]"
  }
];

export default function GlobalRepsAdminView() {
  const [activeTab, setActiveTab] = useState<"countries" | "hero-stats" | "pillars">("countries");
  const [settings, setSettings] = useFirestoreData<GlobalRepsSettings>(
    "esn_global_representatives_settings",
    defaultGlobalRepsSettings
  );
  const [pillars, setPillars] = useFirestoreData<RepPillar[]>(
    "esn_global_representatives_pillars",
    defaultRepPillars
  );
  const [countryReps, setCountryReps] = useFirestoreData<CountryRepItem[]>(
    "esn_country_representatives",
    getInitialCountryReps()
  );

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [searchCountry, setSearchCountry] = useState("");
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [editingCountryId, setEditingCountryId] = useState<number | string | null>(null);
  const [countryForm, setCountryForm] = useState<Partial<CountryRepItem>>({
    country: "",
    repName: "",
    role: "Country Representative",
    region: "Global",
    flag: "🌐",
    status: "Active",
    appointedYear: "2024"
  });
  const [deleteCountryConfirmId, setDeleteCountryConfirmId] = useState<number | string | null>(null);

  const [editingPillarId, setEditingPillarId] = useState<number | null>(null);
  const [pillarForm, setPillarForm] = useState<Partial<RepPillar>>({
    title: "",
    desc: "",
    iconName: "Globe2",
    color: "text-[#0B5D3F]",
    bg: "bg-[#E8F5E9]"
  });
  const [showPillarModal, setShowPillarModal] = useState(false);

  const currentSettings = settings || defaultGlobalRepsSettings;
  const currentPillars = pillars || defaultRepPillars;
  const currentCountryReps = countryReps || getInitialCountryReps();

  const syncAllGlobalCounters = async (countryCount: number) => {
    // 1. Sync reps settings stats
    const updatedStats = (currentSettings.stats || defaultGlobalRepsSettings.stats).map((st) => {
      if (st.label.toLowerCase().includes("rep") || st.label.toLowerCase().includes("countr")) {
        return { ...st, val: `${countryCount}` };
      }
      return st;
    });

    const updatedSettings: GlobalRepsSettings = {
      ...currentSettings,
      subtitle: currentSettings.subtitle.replace(/\b\d+\+?\s*nations\b/gi, `${countryCount} nations`),
      stats: updatedStats
    };
    setSettings(updatedSettings);
    await saveFirestoreData("esn_global_representatives_settings", updatedSettings);



    // 3. Sync Homepage Hero Slides
    try {
      const existingSlides = await fetchFirestoreData<HeroSlide[]>("esn_hero_admin", getInitialHeroSlides());
      if (existingSlides && existingSlides.length > 0) {
        let slidesModified = false;
        const syncedSlides = existingSlides.map((slide) => {
          if (slide.sub && /\b\d+\+?\s*countries\b/i.test(slide.sub)) {
            slidesModified = true;
            return {
              ...slide,
              sub: slide.sub.replace(/\b\d+\+?\s*countries\b/gi, `${countryCount} countries`),
            };
          }
          return slide;
        });
        if (slidesModified) {
          await saveFirestoreData("esn_hero_admin", syncedSlides);
        }
      }
    } catch (e) {
      console.error("Hero sync error:", e);
    }
  };

  const saveCountryRepsToFirestore = async (newList: CountryRepItem[]) => {
    setCountryReps(newList);
    await saveFirestoreData("esn_country_representatives", newList);
    await syncAllGlobalCounters(newList.length);

    await logAdminActivity(
      "Updated Country Representatives",
      "CMS",
      `Saved ${newList.length} country representatives and auto-synced Impact & Hero counters to ${newList.length}.`,
      "success"
    );

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleOpenAddCountry = () => {
    setEditingCountryId(null);
    setCountryForm({
      country: "",
      repName: "",
      role: "Country Representative",
      region: "Global",
      flag: "🌐",
      status: "Active",
      appointedYear: new Date().getFullYear().toString()
    });
    setShowCountryModal(true);
  };

  const handleStartEditCountry = (c: CountryRepItem) => {
    setEditingCountryId(c.id);
    setCountryForm({ ...c });
    setShowCountryModal(true);
  };

  const handleCountryNameChange = (name: string) => {
    const suggestedFlag = getFlagForCountry(name);
    setCountryForm(prev => ({
      ...prev,
      country: name,
      flag: (prev.flag && prev.flag !== "🌐") ? prev.flag : suggestedFlag
    }));
  };

  const handleSaveCountry = () => {
    if (!countryForm.country?.trim()) {
      alert("Please enter a country name.");
      return;
    }
    const flag = countryForm.flag && countryForm.flag !== "🌐"
      ? countryForm.flag
      : getFlagForCountry(countryForm.country);

    if (editingCountryId !== null) {
      const updated = currentCountryReps.map((item) =>
        item.id === editingCountryId
          ? ({ ...item, ...countryForm, flag } as CountryRepItem)
          : item
      );
      saveCountryRepsToFirestore(updated);
    } else {
      const newItem: CountryRepItem = {
        id: Date.now(),
        country: countryForm.country.trim(),
        repName: countryForm.repName?.trim() || "Official Delegate",
        role: countryForm.role?.trim() || "Country Representative",
        region: countryForm.region?.trim() || "Global",
        flag,
        status: countryForm.status || "Active",
        appointedYear: countryForm.appointedYear || new Date().getFullYear().toString(),
        email: countryForm.email || ""
      };
      saveCountryRepsToFirestore([...currentCountryReps, newItem]);
    }
    setShowCountryModal(false);
  };

  const handleDeleteCountry = (id: number | string) => {
    const updated = currentCountryReps.filter((c) => c.id !== id);
    saveCountryRepsToFirestore(updated);
    setDeleteCountryConfirmId(null);
  };

  const saveSettingsToFirestore = async (newSettings: GlobalRepsSettings) => {
    setSettings(newSettings);
    await saveFirestoreData("esn_global_representatives_settings", newSettings);

    try {
      const repsStat = (newSettings.stats || []).find((s) => s.label.toLowerCase().includes("rep"));
      const nationsStat = (newSettings.stats || []).find((s) =>
        s.label.toLowerCase().includes("nation") || s.label.toLowerCase().includes("countr")
      );

      const repsNum = repsStat ? parseNumericValue(repsStat.val) : currentCountryReps.length;
      const nationsNum = nationsStat ? parseNumericValue(nationsStat.val) : 190;

      const existingStats = await fetchFirestoreData<StatItem[]>("esn_stats_admin", getInitialStats());
      if (existingStats && existingStats.length > 0) {
        let statsModified = false;
        const syncedStats = existingStats.map((st) => {
          if (
            st.label.toLowerCase().includes("countries reached") ||
            (st.label.toLowerCase().includes("countries") && !st.label.toLowerCase().includes("partner"))
          ) {
            statsModified = true;
            return { ...st, value: nationsNum || st.value };
          }
          if (st.label.toLowerCase().includes("partner countries") || st.label.toLowerCase().includes("reps")) {
            statsModified = true;
            return { ...st, value: repsNum || st.value };
          }
          return st;
        });

        if (statsModified) {
          await saveFirestoreData("esn_stats_admin", syncedStats);
        }
      }

      await logAdminActivity(
        "Updated Global Representatives Settings",
        "CMS",
        `Saved Global Representatives settings (${repsStat?.val || currentCountryReps.length} reps, ${nationsStat?.val || "190+"} nations).`,
        "success"
      );
    } catch (e) {
      console.error("Auto-sync error:", e);
    }

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const savePillarsToFirestore = async (newPillars: RepPillar[]) => {
    setPillars(newPillars);
    await saveFirestoreData("esn_global_representatives_pillars", newPillars);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleOpenAddPillar = () => {
    setEditingPillarId(null);
    setPillarForm({
      title: "",
      desc: "",
      iconName: "Globe2",
      color: "text-[#0B5D3F]",
      bg: "bg-[#E8F5E9]"
    });
    setShowPillarModal(true);
  };

  const handleStartEditPillar = (p: RepPillar) => {
    setEditingPillarId(p.id);
    setPillarForm({ ...p });
    setShowPillarModal(true);
  };

  const handleSavePillar = () => {
    if (!pillarForm.title?.trim()) {
      alert("Please enter a pillar title.");
      return;
    }

    if (editingPillarId !== null) {
      const updated = currentPillars.map((p) =>
        p.id === editingPillarId ? ({ ...p, ...pillarForm } as RepPillar) : p
      );
      savePillarsToFirestore(updated);
    } else {
      const newId = currentPillars.length > 0 ? Math.max(...currentPillars.map((p) => p.id)) + 1 : 1;
      const newP: RepPillar = {
        id: newId,
        title: pillarForm.title || "",
        desc: pillarForm.desc || "",
        iconName: pillarForm.iconName || "Globe2",
        color: pillarForm.color || "text-[#0B5D3F]",
        bg: pillarForm.bg || "bg-[#E8F5E9]"
      };
      savePillarsToFirestore([...currentPillars, newP]);
    }
    setShowPillarModal(false);
  };

  const handleDeletePillar = (id: number) => {
    if (confirm("Are you sure you want to delete this responsibility pillar?")) {
      const updated = currentPillars.filter((p) => p.id !== id);
      savePillarsToFirestore(updated);
    }
  };

  const filteredCountries = currentCountryReps.filter((c) => {
    if (!searchCountry) return true;
    const q = searchCountry.toLowerCase();
    return (
      c.country.toLowerCase().includes(q) ||
      (c.repName || "").toLowerCase().includes(q) ||
      (c.region || "").toLowerCase().includes(q)
    );
  });

  const countryToDelete = currentCountryReps.find(c => c.id === deleteCountryConfirmId);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-gray-900 font-black text-xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Global Representatives Management
            </h3>
            {saveSuccess && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0B5D3F] bg-[#E6F3EB] px-2.5 py-1 rounded-full animate-pulse">
                <CheckCircle2 size={13} /> Saved Live
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage appointed countries, representative delegates, hero statistics, and leadership pillars.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/global-representatives"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 transition-all shadow-sm"
          >
            <Eye size={14} /> Preview Live Page <ExternalLink size={12} className="text-gray-400" />
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 flex-wrap">
        <button
          onClick={() => setActiveTab("countries")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === "countries"
              ? "bg-[#0B5D3F] text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Globe2 size={13} /> Country Directory ({currentCountryReps.length})
        </button>
        <button
          onClick={() => setActiveTab("hero-stats")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "hero-stats"
              ? "bg-[#0B5D3F] text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Hero Banner & Statistics (4 Counters)
        </button>
        <button
          onClick={() => setActiveTab("pillars")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "pillars"
              ? "bg-[#0B5D3F] text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Role Responsibilities & Privileges ({currentPillars.length})
        </button>
      </div>

      {/* TAB 1: COUNTRIES DIRECTORY */}
      {activeTab === "countries" && (
        <div className="flex flex-col gap-6">
          {/* Dynamic Sync Banner */}
          <div className="bg-gradient-to-r from-[#0B5D3F]/10 via-[#173B63]/10 to-[#4CAF50]/10 border border-[#4CAF50]/30 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xs">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#0B5D3F] text-white flex items-center justify-center shrink-0 shadow-md">
                <Globe2 size={28} className="text-[#81C784]" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xl font-black text-[#0B5D3F]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {currentCountryReps.length} Global Country Representatives
                  </span>
                  <span className="bg-[#4CAF50] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Dynamic Sync Active
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed max-w-2xl">
                  Adding or removing countries automatically updates the Impact page card (<strong>"{currentCountryReps.length} Global Representatives"</strong>), Impact KPI Counter, and the Public Directory in real-time.
                </p>
              </div>
            </div>

            <button
              onClick={handleOpenAddCountry}
              className="inline-flex items-center justify-center gap-2 bg-[#0B5D3F] text-white px-5 py-3 rounded-2xl font-bold text-xs hover:bg-[#0a5237] transition-all shadow-md shadow-[#0B5D3F]/20 shrink-0"
            >
              <Plus size={16} /> Add Country Representative
            </button>
          </div>

          {/* Search bar & count */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative max-w-sm w-full">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search country, delegate, region..."
                value={searchCountry}
                onChange={(e) => setSearchCountry(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-medium focus:outline-none focus:border-[#4CAF50]"
              />
            </div>
            <div className="text-xs font-semibold text-gray-500">
              Showing {filteredCountries.length} of {currentCountryReps.length} appointed countries
            </div>
          </div>

          {/* Countries Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCountries.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{c.flag || getFlagForCountry(c.country)}</span>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{c.country}</h4>
                        <span className="text-[10px] text-gray-400 font-medium">{c.region || "Global"}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#0B5D3F] border border-emerald-100">
                      {c.status || "Active"}
                    </span>
                  </div>

                  <div className="bg-[#F6FBF8] rounded-xl p-3 border border-gray-100/80 mb-4">
                    <div className="text-xs font-bold text-gray-800">{c.repName || "Official Representative"}</div>
                    <div className="text-[11px] text-gray-500">{c.role || "Country Representative"}</div>
                    {c.appointedYear && (
                      <div className="text-[10px] text-gray-400 mt-1">Appointed: {c.appointedYear}</div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                  <span className="text-[10px] text-gray-400">ID #{String(c.id).slice(-4)}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleStartEditCountry(c)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#0B5D3F] transition-colors"
                      title="Edit Country"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteCountryConfirmId(c.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete Country"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredCountries.length === 0 && (
              <div className="col-span-full py-16 text-center text-gray-400 bg-white rounded-3xl border border-gray-100">
                <Globe2 size={36} className="mx-auto mb-2 opacity-30 text-[#0B5D3F]" />
                <p className="text-sm font-semibold">No countries found matching your search</p>
              </div>
            )}
          </div>

          {/* Delete Country Modal */}
          <AnimatePresence>
            {deleteCountryConfirmId !== null && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
                  <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle size={28} className="text-red-500" />
                  </div>
                  <h4 className="font-black text-gray-900 mb-1">Remove Country?</h4>
                  <p className="text-xs text-gray-500 mb-1">This will remove:</p>
                  <p className="text-sm font-bold text-gray-800 mb-4">{countryToDelete?.flag} {countryToDelete?.country}</p>
                  <p className="text-xs text-amber-600 bg-amber-50 p-2.5 rounded-xl mb-6">
                    Total country count will update from {currentCountryReps.length} to {currentCountryReps.length - 1} across the entire website.
                  </p>
                  <div className="flex gap-3">
                    <button onClick={() => handleDeleteCountry(deleteCountryConfirmId)} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold text-xs hover:bg-red-600 transition-all">Yes, Remove</button>
                    <button onClick={() => setDeleteCountryConfirmId(null)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold text-xs hover:bg-gray-50 transition-all">Cancel</button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Add / Edit Country Modal */}
          <AnimatePresence>
            {showCountryModal && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
                <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl my-8" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="font-black text-gray-900 text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {editingCountryId ? "Edit Country Representative" : "Add Country Representative"}
                    </h4>
                    <button onClick={() => setShowCountryModal(false)} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                      <X size={16} />
                    </button>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2">
                        <label className="text-xs font-bold text-gray-700 mb-1.5 block">Country Name *</label>
                        <input
                          type="text"
                          value={countryForm.country || ""}
                          onChange={(e) => handleCountryNameChange(e.target.value)}
                          placeholder="e.g. Canada, Germany, Nepal"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm font-semibold focus:outline-none focus:border-[#4CAF50]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 mb-1.5 block">Flag Symbol</label>
                        <input
                          type="text"
                          value={countryForm.flag || ""}
                          onChange={(e) => setCountryForm({ ...countryForm, flag: e.target.value })}
                          placeholder="🇨🇦"
                          className="w-full px-3 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-center text-lg focus:outline-none focus:border-[#4CAF50]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-gray-700 mb-1.5 block">Delegate Name</label>
                        <input
                          type="text"
                          value={countryForm.repName || ""}
                          onChange={(e) => setCountryForm({ ...countryForm, repName: e.target.value })}
                          placeholder="e.g. Elena Trudeau"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 mb-1.5 block">Region</label>
                        <input
                          type="text"
                          value={countryForm.region || ""}
                          onChange={(e) => setCountryForm({ ...countryForm, region: e.target.value })}
                          placeholder="e.g. North America, Europe"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-gray-700 mb-1.5 block">Role / Designation</label>
                        <input
                          type="text"
                          value={countryForm.role || ""}
                          onChange={(e) => setCountryForm({ ...countryForm, role: e.target.value })}
                          placeholder="e.g. Country Representative"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 mb-1.5 block">Appointed Year</label>
                        <input
                          type="text"
                          value={countryForm.appointedYear || ""}
                          onChange={(e) => setCountryForm({ ...countryForm, appointedYear: e.target.value })}
                          placeholder="e.g. 2024"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 mb-1.5 block">Status</label>
                      <select
                        value={countryForm.status || "Active"}
                        onChange={(e) => setCountryForm({ ...countryForm, status: e.target.value as any })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]"
                      >
                        <option value="Active">Active (Official Delegate)</option>
                        <option value="Appointed">Appointed (Pending Term Start)</option>
                        <option value="In Review">In Review</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <button
                      onClick={handleSaveCountry}
                      className="flex-1 bg-[#0B5D3F] text-white py-3 rounded-xl font-bold text-xs hover:bg-[#0a5237] transition-all shadow-md shadow-[#0B5D3F]/20"
                    >
                      {editingCountryId ? "Save Changes" : "Add Country Representative"}
                    </button>
                    <button
                      onClick={() => setShowCountryModal(false)}
                      className="px-6 py-3 rounded-xl text-gray-500 hover:bg-gray-100 font-semibold text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* TAB 2: HERO BANNER & STATS */}
      {activeTab === "hero-stats" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col gap-6">
          {/* Interconnected System Notice */}
          <div className="bg-gradient-to-r from-[#0B5D3F]/10 via-[#173B63]/10 to-[#4CAF50]/10 border border-[#4CAF50]/30 rounded-2xl p-4 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-[#0B5D3F] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <Zap size={18} className="text-[#81C784]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#0B5D3F] uppercase tracking-wider">
                  Interconnected with Homepage
                </span>
                <span className="bg-[#4CAF50] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  Auto-Sync Active
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Updates to <strong>Country Reps</strong>, <strong>Active Nations</strong>, and the <strong>Featured Photo</strong> here are automatically synchronized with the <strong>Homepage Hero Section</strong> live badge, collage, and <strong>Impact Counters</strong>.
              </p>
            </div>
          </div>

          <div className="border-b border-gray-100 pb-4">
            <h4 className="font-bold text-gray-900 text-base">Hero Section Settings</h4>
            <p className="text-xs text-gray-400">Configure the top badge, heading, subtitle, and primary photo</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-gray-700 mb-1.5 block">Top Badge Label</label>
              <input
                type="text"
                value={currentSettings.badge}
                onChange={(e) =>
                  setSettings({ ...currentSettings, badge: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#4CAF50]"
                placeholder="GLOBAL LEADERSHIP NETWORK"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 mb-1.5 block">Hero Heading (First Half)</label>
              <input
                type="text"
                value={currentSettings.title}
                onChange={(e) =>
                  setSettings({ ...currentSettings, title: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm font-bold focus:outline-none focus:border-[#4CAF50]"
                placeholder="Lead Environmental Action in"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 mb-1.5 block">Highlighted Heading Word</label>
              <input
                type="text"
                value={currentSettings.highlightedTitle}
                onChange={(e) =>
                  setSettings({ ...currentSettings, highlightedTitle: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm font-bold text-[#0B5D3F] focus:outline-none focus:border-[#4CAF50]"
                placeholder="Your Country"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 mb-1.5 block">Floating Badge Text (Over photo)</label>
              <input
                type="text"
                value={currentSettings.floatingBadgeTitle}
                onChange={(e) =>
                  setSettings({ ...currentSettings, floatingBadgeTitle: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm font-semibold focus:outline-none focus:border-[#4CAF50]"
                placeholder="Official Representation"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-700 mb-1.5 block">Hero Description / Subtitle</label>
              <textarea
                rows={3}
                value={currentSettings.subtitle}
                onChange={(e) =>
                  setSettings({ ...currentSettings, subtitle: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#4CAF50]"
                placeholder="Environmental Shapers Network appoints dedicated Country..."
              />
            </div>

            <div className="md:col-span-2">
              <ImageUploadField
                label="Global Representatives Hero Featured Photo"
                value={currentSettings.image}
                onChange={(url) => setSettings({ ...currentSettings, image: url })}
                folder="global_reps"
                aspectRatio="wide"
                helpText="Upload a high quality photo representing the global youth/representatives team"
              />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <div className="mb-4">
              <h4 className="font-bold text-gray-900 text-base">4 Key Metric Counters</h4>
              <p className="text-xs text-gray-400">These 4 counter badges appear directly below the hero description</p>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {currentSettings.stats.map((st, idx) => (
                <div key={idx} className="bg-[#F6FBF8] p-4 rounded-2xl border border-gray-200">
                  <div className="text-xs font-bold text-gray-500 mb-2">Counter #{idx + 1}</div>
                  <div className="mb-2">
                    <label className="text-[11px] font-bold text-gray-600 block mb-1">Value (e.g. 80+, 48K+)</label>
                    <input
                      type="text"
                      value={st.val}
                      onChange={(e) => {
                        const newStats = [...currentSettings.stats];
                        newStats[idx] = { ...newStats[idx], val: e.target.value };
                        setSettings({ ...currentSettings, stats: newStats });
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm font-black text-[#0B5D3F] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 block mb-1">Label</label>
                    <input
                      type="text"
                      value={st.label}
                      onChange={(e) => {
                        const newStats = [...currentSettings.stats];
                        newStats[idx] = { ...newStats[idx], label: e.target.value };
                        setSettings({ ...currentSettings, stats: newStats });
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs font-medium outline-none text-gray-700"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => saveSettingsToFirestore(currentSettings)}
              className="px-6 py-3 rounded-xl bg-[#0B5D3F] text-white font-bold text-sm hover:bg-[#0a5237] transition-all shadow-md shadow-[#0B5D3F]/20 flex items-center gap-2"
            >
              <CheckCircle2 size={16} /> Save Representatives Settings
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: PILLARS */}
      {activeTab === "pillars" && (
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Manage the 4 core pillars outlining responsibilities and privileges for Country Representatives.
            </p>
            <button
              onClick={handleOpenAddPillar}
              className="flex items-center gap-2 bg-[#0B5D3F] text-white px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-[#0a5237] transition-all shadow-md shadow-[#0B5D3F]/20"
            >
              <Plus size={15} /> Add Pillar
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {currentPillars.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${p.bg} flex items-center justify-center font-bold text-lg ${p.color}`}>
                      <Globe2 size={22} />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleStartEditPillar(p)}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeletePillar(p.id)}
                        className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <h4 className="font-bold text-gray-900 text-base mb-2">{p.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PILLAR MODAL */}
      <AnimatePresence>
        {showPillarModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-gray-100 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                <h3 className="font-bold text-gray-900 text-lg">
                  {editingPillarId ? "Edit Responsibility Pillar" : "Add Responsibility Pillar"}
                </h3>
                <button
                  onClick={() => setShowPillarModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold"
                >
                  &times;
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1.5 block">Pillar Title *</label>
                  <input
                    type="text"
                    value={pillarForm.title || ""}
                    onChange={(e) => setPillarForm({ ...pillarForm, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm font-semibold focus:outline-none focus:border-[#4CAF50]"
                    placeholder="e.g. National Leadership"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1.5 block">Description *</label>
                  <textarea
                    rows={3}
                    value={pillarForm.desc || ""}
                    onChange={(e) => setPillarForm({ ...pillarForm, desc: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#4CAF50]"
                    placeholder="Describe what the country representative accomplishes..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 mt-6">
                <button
                  onClick={() => setShowPillarModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePillar}
                  className="px-6 py-2.5 rounded-xl bg-[#0B5D3F] text-white font-bold text-xs hover:bg-[#0a5237]"
                >
                  Save Pillar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
