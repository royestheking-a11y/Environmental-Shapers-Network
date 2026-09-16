import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Globe2, Plus, Search, Edit3, Trash2, CheckCircle2, Award, Users,
  MapPin, Shield, Star, ExternalLink, Eye, Compass, Heart
} from "lucide-react";
import { useFirestoreData, saveFirestoreData } from "../../../../lib/useFirestore";
import { ImageUploadField } from "../../../components/ui/ImageUploadField";

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

export interface RepPillar {
  id: number;
  iconName: string;
  title: string;
  desc: string;
  color: string;
  bg: string;
}

export const defaultGlobalRepsSettings: GlobalRepsSettings = {
  badge: "Global Leadership Network",
  title: "Lead Environmental Action in",
  highlightedTitle: "Your Country",
  subtitle: "Environmental Shapers Network appoints dedicated Country & Regional Representatives across 80+ nations. As an official ESN Representative, you will lead national initiatives, coordinate youth volunteers, and represent your region on global environmental stages.",
  image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900",
  floatingBadgeTitle: "Official Representation",
  floatingBadgeSub: "UN & COP Credentialed Network",
  stats: [
    { label: "Country Reps", val: "80+" },
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
  const [activeTab, setActiveTab] = useState<"hero-stats" | "pillars">("hero-stats");
  const [settings, setSettings] = useFirestoreData<GlobalRepsSettings>(
    "esn_global_representatives_settings",
    defaultGlobalRepsSettings
  );
  const [pillars, setPillars] = useFirestoreData<RepPillar[]>(
    "esn_global_representatives_pillars",
    defaultRepPillars
  );

  const [saveSuccess, setSaveSuccess] = useState(false);
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

  const saveSettingsToFirestore = async (newSettings: GlobalRepsSettings) => {
    setSettings(newSettings);
    await saveFirestoreData("esn_global_representatives_settings", newSettings);
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
            Manage Global Country Representatives page hero, volunteer stats, banner images, and leadership pillars.
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
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
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

      {/* TAB 1: HERO BANNER & STATS */}
      {activeTab === "hero-stats" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col gap-6">
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
