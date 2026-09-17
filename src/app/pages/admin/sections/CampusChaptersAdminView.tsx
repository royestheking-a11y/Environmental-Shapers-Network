import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  GraduationCap, Plus, Search, Edit3, Trash2, CheckCircle2,
  MapPin, Users, Calendar, Mail, ExternalLink, Globe2, AlertCircle, TreePine, FolderKanban
} from "lucide-react";
import { useFirestoreData, saveFirestoreData } from "../../../../lib/useFirestore";
import { ImageUploadField } from "../../../components/ui/ImageUploadField";
import { logAdminActivity } from "../../../../lib/activityLogger";

export interface CampusChapter {
  id: number;
  name: string;
  country: string;
  city: string;
  members: number;
  projects: number;
  established: string;
  lead: string;
  email: string;
  treesPlanted: string;
  meeting: string;
  image: string;
  description: string;
  keyProjects: string[];
}

export interface CampusChaptersSettings {
  badge: string;
  title: string;
  sub: string;
  image: string;
  stats: Array<{ val: string; label: string }>;
}

export const defaultCampusChaptersSettings: CampusChaptersSettings = {
  badge: "Global Campus Network",
  title: "Campus Chapters",
  sub: "ESN chapters bring environmental action to universities worldwide.",
  image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400",
  stats: [
    { val: "200+", label: "Campus Chapters" },
    { val: "50+", label: "Countries" },
    { val: "28K+", label: "Student Members" },
    { val: "600+", label: "Campus Projects" },
  ],
};

export const defaultCampusChapters: CampusChapter[] = [
  {
    id: 1,
    name: "University of Dhaka Chapter",
    country: "Bangladesh",
    city: "Dhaka",
    members: 240,
    projects: 12,
    established: "2016",
    lead: "Tanvir Ahmed (Chapter President)",
    email: "dhaka.chapter@esnglobal.org",
    treesPlanted: "32,000+",
    meeting: "Wednesdays at 4:00 PM · Curzon Hall Green Yard",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    description: "Founded in 2016, the DU Chapter is ESN's pioneer campus network in South Asia, leading weekly urban cleanups, nursery development, and climate policy symposiums.",
    keyProjects: [
      "Buriganga River Waste Interceptor",
      "Sundarbans Youth Field Delegation",
      "University Plastic-Free Campaign",
      "Eco-Seedling Distribution Drive",
    ],
  },
  {
    id: 2,
    name: "IIT Delhi Chapter",
    country: "India",
    city: "New Delhi",
    members: 185,
    projects: 9,
    established: "2017",
    lead: "Aarav Sharma (Chapter Lead)",
    email: "iitd.chapter@esnglobal.org",
    treesPlanted: "18,500+",
    meeting: "Thursdays at 5:30 PM · Student Activity Centre",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    description: "Engineers and researchers deploying IoT air quality monitoring sensors, decentralized solar charging stations, and campus e-waste recycling hubs.",
    keyProjects: [
      "Smart Campus Air Monitor Mesh",
      "Hostel Solar Energy Challenge",
      "Yamuna Floodplain Afforestation",
      "E-Waste Circularity Drive",
    ],
  },
  {
    id: 3,
    name: "University of Nairobi Chapter",
    country: "Kenya",
    city: "Nairobi",
    members: 160,
    projects: 11,
    established: "2018",
    lead: "Wanjiku Mwangi (Regional Coordinator)",
    email: "uon.chapter@esnglobal.org",
    treesPlanted: "45,000+",
    meeting: "Saturdays at 10:00 AM · Taifa Hall Green Lawn",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    description: "Leading extensive agroforestry and indigenous seed saving projects in the Great Rift Valley in partnership with rural community schools.",
    keyProjects: [
      "Karura Forest Buffer Plantation",
      "Indigenous Tree Seedling Bank",
      "Green Schools Climate Fellowship",
      "Drought Adaptation Workshops",
    ],
  },
  {
    id: 4,
    name: "São Paulo State University",
    country: "Brazil",
    city: "São Paulo",
    members: 210,
    projects: 14,
    established: "2017",
    lead: "Lucas Oliveira (Chapter President)",
    email: "unesp.chapter@esnglobal.org",
    treesPlanted: "28,000+",
    meeting: "Tuesdays at 6:00 PM · Biology Department Lounge",
    image: "https://images.unsplash.com/photo-1498429089284-41f8cf3ffd39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    description: "Focuses on Atlantic Forest restoration, river basin water testing, and training indigenous youth in drone-based ecological mapping.",
    keyProjects: [
      "Atlantic Rainforest Corridors",
      "Urban River Bio-Filters",
      "Indigenous Youth Drone Lab",
      "Campus Zero-Waste Transition",
    ],
  },
  {
    id: 5,
    name: "University of Copenhagen",
    country: "Denmark",
    city: "Copenhagen",
    members: 130,
    projects: 7,
    established: "2019",
    lead: "Astrid Lind (Lead Organizer)",
    email: "ku.chapter@esnglobal.org",
    treesPlanted: "12,000+",
    meeting: "Mondays at 4:30 PM · Science Campus Hub",
    image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    description: "Nordic student coalition specializing in circular economy modeling, climate finance policy briefs, and Arctic ecosystem awareness.",
    keyProjects: [
      "Nordic Campus Carbon Audit",
      "Baltic Coastal Microplastic Survey",
      "Youth COP Delegation Policy Brief",
      "Circular Canteen Policy",
    ],
  },
  {
    id: 6,
    name: "National University of Singapore",
    country: "Singapore",
    city: "Singapore",
    members: 145,
    projects: 8,
    established: "2019",
    lead: "Cheryl Tan (Chapter Lead)",
    email: "nus.chapter@esnglobal.org",
    treesPlanted: "15,000+",
    meeting: "Fridays at 5:00 PM · UTown Eco-Auditorium",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    description: "Pioneering urban mangrove monitoring, coral nursery research, and green technology hackathons across Southeast Asian campuses.",
    keyProjects: [
      "Pulau Ubin Mangrove Restoration",
      "Southern Islands Coral Nursery",
      "ASEAN Eco-Innovation Hackathon",
      "Campus Biodiversity Census",
    ],
  },
];

export default function CampusChaptersAdminView() {
  const [activeTab, setActiveTab] = useState<"chapters" | "hero-stats">("chapters");
  const [settings, setSettings] = useFirestoreData<CampusChaptersSettings>(
    "esn_campus_chapters_settings",
    defaultCampusChaptersSettings
  );
  const [chapters, setChapters] = useFirestoreData<CampusChapter[]>(
    "esn_campus_chapters_list",
    defaultCampusChapters
  );

  const [search, setSearch] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editingChapterId, setEditingChapterId] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const [chapterForm, setChapterForm] = useState<Partial<CampusChapter>>({
    name: "",
    country: "",
    city: "",
    members: 100,
    projects: 5,
    established: "2024",
    lead: "",
    email: "",
    treesPlanted: "5,000+",
    meeting: "",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    description: "",
    keyProjects: [],
  });
  const [keyProjectsInput, setKeyProjectsInput] = useState("");

  const currentSettings = settings || defaultCampusChaptersSettings;
  const currentChapters = chapters || defaultCampusChapters;

  const handleSaveSettings = async () => {
    await saveFirestoreData("esn_campus_chapters_settings", currentSettings);
    await logAdminActivity(
      "Updated Campus Chapters Settings",
      "CMS",
      "Updated Campus Chapters hero banner and metric counters.",
      "info"
    );
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const startAddChapter = () => {
    setEditingChapterId(null);
    setChapterForm({
      name: "",
      country: "",
      city: "",
      members: 100,
      projects: 5,
      established: new Date().getFullYear().toString(),
      lead: "",
      email: "",
      treesPlanted: "5,000+",
      meeting: "",
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      description: "",
      keyProjects: ["Campus Tree Plantation", "Zero Waste Campaign", "Student Climate Forum"],
    });
    setKeyProjectsInput("Campus Tree Plantation\nZero Waste Campaign\nStudent Climate Forum");
    setShowAddModal(true);
  };

  const startEditChapter = (c: CampusChapter) => {
    setEditingChapterId(c.id);
    setChapterForm({ ...c });
    setKeyProjectsInput((c.keyProjects || []).join("\n"));
    setShowAddModal(true);
  };

  const handleSaveChapter = async () => {
    if (!chapterForm.name || !chapterForm.country) return;

    const parsedKeyProjects = keyProjectsInput
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean);

    const chapterData: CampusChapter = {
      id: editingChapterId !== null ? editingChapterId : Date.now(),
      name: chapterForm.name || "",
      country: chapterForm.country || "",
      city: chapterForm.city || "",
      members: Number(chapterForm.members) || 0,
      projects: Number(chapterForm.projects) || 0,
      established: chapterForm.established || new Date().getFullYear().toString(),
      lead: chapterForm.lead || "",
      email: chapterForm.email || "",
      treesPlanted: chapterForm.treesPlanted || "0",
      meeting: chapterForm.meeting || "",
      image:
        chapterForm.image ||
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      description: chapterForm.description || "",
      keyProjects: parsedKeyProjects.length > 0 ? parsedKeyProjects : ["Campus Sustainability Initiative"],
    };

    let updatedList: CampusChapter[];
    if (editingChapterId !== null) {
      updatedList = currentChapters.map((c) => (c.id === editingChapterId ? chapterData : c));
      await logAdminActivity(
        "Updated Campus Chapter",
        "CMS",
        `Updated chapter details for "${chapterData.name}".`,
        "info"
      );
    } else {
      updatedList = [chapterData, ...currentChapters];
      await logAdminActivity(
        "Created Campus Chapter",
        "CMS",
        `Added new campus chapter: "${chapterData.name}".`,
        "success"
      );
    }

    setChapters(updatedList);
    await saveFirestoreData("esn_campus_chapters_list", updatedList);
    setShowAddModal(false);
  };

  const confirmDelete = async () => {
    if (deleteConfirmId === null) return;
    const doomed = currentChapters.find((c) => c.id === deleteConfirmId);
    const updated = currentChapters.filter((c) => c.id !== deleteConfirmId);
    setChapters(updated);
    await saveFirestoreData("esn_campus_chapters_list", updated);
    await logAdminActivity(
      "Deleted Campus Chapter",
      "CMS",
      `Deleted chapter: "${doomed?.name || deleteConfirmId}".`,
      "warning"
    );
    setDeleteConfirmId(null);
  };

  const filteredChapters = currentChapters.filter((c) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.lead.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-[#E8F5E9] text-[#0B5D3F] rounded-xl">
              <GraduationCap size={20} />
            </span>
            <h3
              className="text-gray-900 font-black text-xl"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Campus Chapters Management
            </h3>
          </div>
          <p className="text-sm text-gray-400">
            Manage university chapters, student leaders, hero banner, and key campus metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/campus-chapters"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:text-[#0B5D3F] hover:bg-gray-50 transition-all"
          >
            <ExternalLink size={14} /> View Live Page
          </a>
          <button
            onClick={startAddChapter}
            className="flex items-center gap-2 bg-[#0B5D3F] text-white px-5 py-2.5 rounded-xl font-semibold text-xs hover:bg-[#0a5237] transition-all shadow-sm"
          >
            <Plus size={16} /> Add Campus Chapter
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab("chapters")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === "chapters"
              ? "bg-[#0B5D3F] text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <GraduationCap size={15} /> University Chapters ({currentChapters.length})
        </button>
        <button
          onClick={() => setActiveTab("hero-stats")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === "hero-stats"
              ? "bg-[#0B5D3F] text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <FolderKanban size={15} /> Hero Banner & 4 Metric Counters
        </button>
      </div>

      {/* TAB 1: Chapters Directory */}
      {activeTab === "chapters" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="relative max-w-sm w-full">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by university, country, city, lead..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs focus:outline-none focus:border-[#4CAF50]"
              />
            </div>
            <div className="text-xs text-gray-400">
              Showing {filteredChapters.length} of {currentChapters.length} chapters
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredChapters.map((ch) => (
              <div
                key={ch.id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:border-[#4CAF50]/30 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-40 overflow-hidden bg-gray-100">
                    <img src={ch.image} alt={ch.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-black text-[#0B5D3F]">
                      Est. {ch.established}
                    </div>
                    <div className="absolute bottom-2.5 left-3 right-3 text-white text-xs font-semibold flex items-center gap-1">
                      <MapPin size={12} className="text-[#4CAF50]" /> {ch.city}, {ch.country}
                    </div>
                  </div>

                  <div className="p-5">
                    <h4
                      className="font-bold text-gray-900 text-base mb-1"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      {ch.name}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">
                      {ch.description}
                    </p>

                    <div className="bg-[#F6FBF8] p-3 rounded-xl border border-gray-100 text-xs space-y-1 mb-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Student Members:</span>
                        <span className="font-black text-[#0B5D3F]">{ch.members}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Active Projects:</span>
                        <span className="font-black text-[#4CAF50]">{ch.projects}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Trees Planted:</span>
                        <span className="font-black text-[#D6A95A]">{ch.treesPlanted}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-gray-600">
                      <span className="font-semibold text-gray-800">Lead:</span> {ch.lead || "Not specified"}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex gap-2 border-t border-gray-50 mt-2">
                  <button
                    onClick={() => startEditChapter(ch)}
                    className="flex-1 py-2 rounded-xl bg-white border border-gray-200 hover:border-[#0B5D3F] text-gray-700 hover:text-[#0B5D3F] text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Edit3 size={13} /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(ch.id)}
                    className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"
                    title="Delete Chapter"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredChapters.length === 0 && (
            <div className="py-16 text-center text-gray-400 text-xs font-semibold bg-white rounded-2xl border border-gray-100">
              No campus chapters found matching "{search}".
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Hero & 4 Metric Counters */}
      {activeTab === "hero-stats" && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h4 className="font-bold text-gray-900 text-base">Campus Chapters Hero Banner</h4>
              <p className="text-xs text-gray-400">
                Configure the title, description, and hero banner image displayed at the top of the /campus-chapters page.
              </p>
            </div>
            {saveSuccess && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-full">
                <CheckCircle2 size={14} /> Saved Successfully!
              </span>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 mb-1.5 block">Hero Tag / Badge</label>
              <input
                type="text"
                value={currentSettings.badge || "Global Campus Network"}
                onChange={(e) =>
                  setSettings({ ...currentSettings, badge: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-xs font-bold text-[#0B5D3F] focus:outline-none focus:border-[#4CAF50]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 mb-1.5 block">Page Title</label>
              <input
                type="text"
                value={currentSettings.title || "Campus Chapters"}
                onChange={(e) =>
                  setSettings({ ...currentSettings, title: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#4CAF50]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-700 mb-1.5 block">Hero Subtitle</label>
              <textarea
                rows={2}
                value={currentSettings.sub || ""}
                onChange={(e) =>
                  setSettings({ ...currentSettings, sub: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-xs font-medium text-gray-700 focus:outline-none focus:border-[#4CAF50]"
              />
            </div>
            <div className="md:col-span-2">
              <ImageUploadField
                label="Hero Banner Image"
                value={currentSettings.image}
                onChange={(url) => setSettings({ ...currentSettings, image: url })}
                folder="campus_chapters"
                aspectRatio="wide"
                helpText="High-resolution university or campus event photo for the top hero header."
              />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h4 className="font-bold text-gray-900 text-base mb-1">4 Campus Key Metric Cards</h4>
            <p className="text-xs text-gray-400 mb-4">
              These 4 counter cards appear directly below the hero banner on the Campus Chapters page.
            </p>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {(currentSettings.stats || defaultCampusChaptersSettings.stats).map((st, idx) => (
                <div key={idx} className="bg-[#F6FBF8] p-4 rounded-2xl border border-gray-200">
                  <div className="text-[11px] font-bold text-gray-400 mb-2">Stat #{idx + 1}</div>
                  <div className="mb-2">
                    <label className="text-[10px] font-bold text-gray-600 block mb-1">Value (e.g. 200+, 28K+)</label>
                    <input
                      type="text"
                      value={st.val}
                      onChange={(e) => {
                        const newStats = [...(currentSettings.stats || defaultCampusChaptersSettings.stats)];
                        newStats[idx] = { ...newStats[idx], val: e.target.value };
                        setSettings({ ...currentSettings, stats: newStats });
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm font-black text-[#0B5D3F] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-600 block mb-1">Label</label>
                    <input
                      type="text"
                      value={st.label}
                      onChange={(e) => {
                        const newStats = [...(currentSettings.stats || defaultCampusChaptersSettings.stats)];
                        newStats[idx] = { ...newStats[idx], label: e.target.value };
                        setSettings({ ...currentSettings, stats: newStats });
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs font-semibold text-gray-700 outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              onClick={handleSaveSettings}
              className="bg-[#0B5D3F] hover:bg-[#094c34] text-white px-8 py-3 rounded-xl text-xs font-bold transition-all shadow-md"
            >
              Save Campus Hero & Stats
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit Chapter Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">
                    {editingChapterId !== null ? "Edit Campus Chapter" : "Add New Campus Chapter"}
                  </h4>
                  <p className="text-xs text-gray-400">Fill in the university and chapter coordinator details.</p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-700 mb-1.5 block">University / Chapter Name *</label>
                  <input
                    type="text"
                    value={chapterForm.name || ""}
                    onChange={(e) => setChapterForm({ ...chapterForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#4CAF50]"
                    placeholder="e.g. University of Dhaka Chapter"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1.5 block">Country *</label>
                  <input
                    type="text"
                    value={chapterForm.country || ""}
                    onChange={(e) => setChapterForm({ ...chapterForm, country: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:border-[#4CAF50]"
                    placeholder="e.g. Bangladesh"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1.5 block">City *</label>
                  <input
                    type="text"
                    value={chapterForm.city || ""}
                    onChange={(e) => setChapterForm({ ...chapterForm, city: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:border-[#4CAF50]"
                    placeholder="e.g. Dhaka"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1.5 block">Established Year</label>
                  <input
                    type="text"
                    value={chapterForm.established || ""}
                    onChange={(e) => setChapterForm({ ...chapterForm, established: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:border-[#4CAF50]"
                    placeholder="e.g. 2016"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1.5 block">Student Members Count</label>
                  <input
                    type="number"
                    value={chapterForm.members || 0}
                    onChange={(e) => setChapterForm({ ...chapterForm, members: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-xs font-bold text-[#0B5D3F] focus:outline-none focus:border-[#4CAF50]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1.5 block">Active Projects Count</label>
                  <input
                    type="number"
                    value={chapterForm.projects || 0}
                    onChange={(e) => setChapterForm({ ...chapterForm, projects: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-xs font-bold text-[#4CAF50] focus:outline-none focus:border-[#4CAF50]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1.5 block">Trees Planted (e.g. 32,000+)</label>
                  <input
                    type="text"
                    value={chapterForm.treesPlanted || ""}
                    onChange={(e) => setChapterForm({ ...chapterForm, treesPlanted: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-xs font-bold text-[#D6A95A] focus:outline-none focus:border-[#4CAF50]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-700 mb-1.5 block">Chapter Lead / President Name & Role</label>
                  <input
                    type="text"
                    value={chapterForm.lead || ""}
                    onChange={(e) => setChapterForm({ ...chapterForm, lead: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:border-[#4CAF50]"
                    placeholder="e.g. Tanvir Ahmed (Chapter President)"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1.5 block">Contact Email</label>
                  <input
                    type="email"
                    value={chapterForm.email || ""}
                    onChange={(e) => setChapterForm({ ...chapterForm, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:border-[#4CAF50]"
                    placeholder="e.g. dhaka.chapter@esnglobal.org"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1.5 block">Weekly Meeting Schedule & Venue</label>
                  <input
                    type="text"
                    value={chapterForm.meeting || ""}
                    onChange={(e) => setChapterForm({ ...chapterForm, meeting: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:border-[#4CAF50]"
                    placeholder="e.g. Wednesdays at 4:00 PM · Curzon Hall Green Yard"
                  />
                </div>

                <div className="sm:col-span-2">
                  <ImageUploadField
                    label="Chapter / University Photo"
                    value={chapterForm.image || ""}
                    onChange={(url) => setChapterForm({ ...chapterForm, image: url })}
                    folder="campus_chapters"
                    aspectRatio="wide"
                    helpText="Upload a representative photo of university students or campus."
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-700 mb-1.5 block">Description / About Chapter</label>
                  <textarea
                    rows={3}
                    value={chapterForm.description || ""}
                    onChange={(e) => setChapterForm({ ...chapterForm, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:border-[#4CAF50]"
                    placeholder="Brief background and mission of this university chapter..."
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-700 mb-1.5 block">
                    Key Campus Initiatives (One per line)
                  </label>
                  <textarea
                    rows={4}
                    value={keyProjectsInput}
                    onChange={(e) => setKeyProjectsInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:border-[#4CAF50]"
                    placeholder="Buriganga River Waste Interceptor&#10;Sundarbans Youth Field Delegation&#10;University Plastic-Free Campaign"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    Separate each key initiative or project onto a new line.
                  </span>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveChapter}
                  className="bg-[#0B5D3F] hover:bg-[#094c34] text-white px-7 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  {editingChapterId !== null ? "Update Chapter" : "Save Chapter"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId !== null && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl border border-gray-100"
            >
              <AlertCircle size={36} className="text-red-500 mx-auto mb-3" />
              <h4 className="font-bold text-gray-900 text-lg mb-1">Delete Campus Chapter?</h4>
              <p className="text-xs text-gray-500 mb-6">
                Are you sure you want to remove this university chapter from the public directory?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
