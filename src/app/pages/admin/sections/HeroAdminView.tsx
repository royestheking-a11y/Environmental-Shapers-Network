import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Search, Edit3, Trash2, AlertCircle, Image as ImageIcon, Globe2, Zap, ArrowRight } from "lucide-react";
import { ImageUploadField } from "../../../components/ui/ImageUploadField";
import { useFirestoreData, saveFirestoreData } from "../../../../lib/useFirestore";
import { logAdminActivity } from "../../../../lib/activityLogger";
import { defaultGlobalRepsSettings, GlobalRepsSettings } from "./GlobalRepsAdminView";

export interface HeroSlide {
  id: number;
  tag: string;
  heading: string;
  sub: string;
  image?: string;
}

export const DEFAULT_HERO_IMAGES: Record<number, string> = {
  1: "/Commonwealth Secretariat at COP27.jpeg",
  2: "/Speaking on Climate Adaptation and Resilience in South Asia- CEPCA 2024, Ottawa, Canada.jpeg",
  3: "/Climate Reality Leadership Corps Training | Representing Bangladesh.jpeg",
};

export function getInitialHeroSlides(): HeroSlide[] {
  return [
    {
      id: 1,
      tag: "Global Environmental Action",
      heading: "Taking Small Strides to\nPreserve Our Planet",
      sub: "Ecology, as a field of science, investigates the interconnections between living organisms and their surroundings, encompassing both the physical and chemical aspects.",
      image: "/Commonwealth Secretariat at COP27.jpeg",
    },
    {
      id: 2,
      tag: "Nature-Based Solutions",
      heading: "Together We Restore,\nProtect & Innovate",
      sub: "From reforestation to marine conservation, ESN leads science-driven environmental action across 80+ countries, shaping a sustainable future for generations to come.",
      image: "/Speaking on Climate Adaptation and Resilience in South Asia- CEPCA 2024, Ottawa, Canada.jpeg",
    },
    {
      id: 3,
      tag: "Youth Climate Leadership",
      heading: "Shaping the Leaders\nof Tomorrow Today",
      sub: "Our youth programs empower the next generation of environmental advocates with the knowledge, tools, and networks to drive meaningful change globally.",
      image: "/Climate Reality Leadership Corps Training | Representing Bangladesh.jpeg",
    },
  ];
}

export default function HeroAdminView() {
  const [slides, setSlides, loading] = useFirestoreData<HeroSlide[]>("esn_hero_admin", getInitialHeroSlides());
  const [repsSettings] = useFirestoreData<GlobalRepsSettings>(
    "esn_global_representatives_settings",
    defaultGlobalRepsSettings
  );
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<HeroSlide>>({
    tag: "",
    heading: "",
    sub: "",
    image: "/Commonwealth Secretariat at COP27.jpeg",
  });

  const activeReps = repsSettings || defaultGlobalRepsSettings;
  const repsStat = (activeReps.stats || defaultGlobalRepsSettings.stats).find((s: any) =>
    s.label?.toLowerCase().includes("rep")
  ) || { val: "80+", label: "Country Reps" };
  const nationsStat = (activeReps.stats || defaultGlobalRepsSettings.stats).find((s: any) =>
    s.label?.toLowerCase().includes("nation") || s.label?.toLowerCase().includes("countr")
  ) || { val: "190+", label: "Active Nations" };
  const repsCount = repsStat.val || "80+";
  const nationsCount = nationsStat.val || "190+";

  // Auto-migrate any existing slides in database/cache that lack image property
  useEffect(() => {
    if (slides && slides.length > 0) {
      let needsUpdate = false;
      const updated = slides.map((s, idx) => {
        if (s.image === undefined || s.image === null) {
          needsUpdate = true;
          return {
            ...s,
            image: DEFAULT_HERO_IMAGES[s.id] || DEFAULT_HERO_IMAGES[(idx % 3) + 1] || "/Commonwealth Secretariat at COP27.jpeg",
          };
        }
        return s;
      });
      if (needsUpdate) {
        setSlides(updated);
        saveFirestoreData("esn_hero_admin", updated);
      }
    }
  }, [slides]);

  const saveSlides = async (newData: HeroSlide[]) => {
    setSlides(newData);
    await saveFirestoreData("esn_hero_admin", newData);
  };

  const handleSave = async () => {
    if (!formData.heading || !formData.sub) return;
    const fallbackImg = DEFAULT_HERO_IMAGES[editingId || 1] || "/Commonwealth Secretariat at COP27.jpeg";
    const cleanSlide: HeroSlide = {
      id: editingId !== null ? editingId : (slides.length > 0 ? Math.max(...slides.map(s => s.id)) + 1 : 1),
      tag: formData.tag || "Environmental Action",
      heading: formData.heading,
      sub: formData.sub,
      image: formData.image !== undefined ? formData.image : fallbackImg,
    };

    if (editingId !== null) {
      const updated = slides.map(s => s.id === editingId ? cleanSlide : s);
      await saveSlides(updated);
      await logAdminActivity("Updated Hero Slide", "CMS", `Updated hero carousel slide: "${cleanSlide.tag}".`, "info");
      setEditingId(null);
    } else {
      const updated = [...slides, cleanSlide];
      await saveSlides(updated);
      await logAdminActivity("Created Hero Slide", "CMS", `Added new hero slide: "${cleanSlide.tag}".`, "success");
    }
    setShowAdd(false);
    setFormData({ tag: "", heading: "", sub: "", image: "" });
  };

  const startEdit = (s: HeroSlide) => {
    const fallbackImg = DEFAULT_HERO_IMAGES[s.id] || "/Commonwealth Secretariat at COP27.jpeg";
    setFormData({
      ...s,
      image: s.image !== undefined && s.image !== "" ? s.image : fallbackImg,
    });
    setEditingId(s.id);
    setShowAdd(true);
  };

  const startAdd = () => {
    setEditingId(null);
    setFormData({
      tag: "",
      heading: "",
      sub: "",
      image: "/Commonwealth Secretariat at COP27.jpeg",
    });
    setShowAdd(true);
  };

  const confirmDelete = async () => {
    if (deleteConfirmId !== null) {
      const doomed = slides.find(s => s.id === deleteConfirmId);
      const updated = slides.filter(s => s.id !== deleteConfirmId);
      await saveSlides(updated);
      await logAdminActivity("Deleted Hero Slide", "CMS", `Deleted hero slide: "${doomed?.tag || deleteConfirmId}".`, "warning");
      setDeleteConfirmId(null);
    }
  };

  const filtered = (slides || []).filter(s => {
    if (!s) return false;
    const heading = String(s.heading || "").toLowerCase();
    const tag = String(s.tag || "").toLowerCase();
    const q = String(search || "").toLowerCase().trim();
    return !q || heading.includes(q) || tag.includes(q);
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Interconnected Global Reps Status Banner */}
      <div className="bg-gradient-to-r from-[#0B5D3F]/10 via-[#173B63]/10 to-[#4CAF50]/10 border border-[#4CAF50]/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B5D3F] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Globe2 size={20} className="text-[#81C784]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0B5D3F] uppercase tracking-wider">
                Interconnected Global Representatives
              </span>
              <span className="bg-[#4CAF50] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                Live on Homepage
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-0.5">
              Currently displaying <strong>{repsCount} Global Representatives</strong> across <strong>{nationsCount} Nations</strong> on the Hero badge & collage.
            </p>
          </div>
        </div>
        <a
          href="/admin/representatives"
          className="px-4 py-2 rounded-xl bg-white border border-[#4CAF50]/40 text-[#0B5D3F] text-xs font-bold hover:bg-[#0B5D3F] hover:text-white transition-all flex items-center gap-1.5 shrink-0"
        >
          <Zap size={13} /> Edit Global Reps <ArrowRight size={13} />
        </a>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-900 font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Hero Section Slides</h3>
          <p className="text-sm text-gray-400">Manage the carousel background images, headings, and tags displayed on the homepage hero.</p>
        </div>
        <button onClick={startAdd} className="flex items-center gap-2 bg-[#0B5D3F] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#0a5237] transition-all">
          <Plus size={16} /> Add Slide
        </button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-white rounded-2xl p-6 border border-[#4CAF50]/30 overflow-hidden shadow-sm">
            <h4 className="font-bold text-gray-900 mb-5">{editingId ? "Edit Slide" : "Add Slide"}</h4>
            <div className="grid gap-4 mb-4">
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Tag / Label</label>
                <input type="text" value={formData.tag || ""} onChange={e => setFormData({ ...formData, tag: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" placeholder="e.g. Global Environmental Action" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Heading (Use \n for line breaks) *</label>
                <textarea rows={2} value={formData.heading || ""} onChange={e => setFormData({ ...formData, heading: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Subheading *</label>
                <textarea rows={3} value={formData.sub || ""} onChange={e => setFormData({ ...formData, sub: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
              </div>
              <div>
                <ImageUploadField
                  label="Slide Background Image"
                  value={formData.image || ""}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  folder="hero"
                  aspectRatio="wide"
                  helpText="Upload a high-resolution hero background photo or paste a URL. Use the Remove button if you wish to clear it."
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleSave} className="bg-[#0B5D3F] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0a5237] transition-all">Save Slide</button>
              <button onClick={() => setShowAdd(false)} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-all">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteConfirmId !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-3xl p-8 max-w-sm w-full text-center">
              <AlertCircle size={32} className="text-red-500 mx-auto mb-4" />
              <h4 className="font-bold text-gray-900 mb-2">Delete Slide?</h4>
              <p className="text-xs text-gray-500">This will remove the slide from the homepage hero carousel.</p>
              <div className="flex gap-3 mt-6">
                <button onClick={confirmDelete} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600">Yes, Delete</button>
                <button onClick={() => setDeleteConfirmId(null)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-2 shadow-sm">
        <div className="relative max-w-sm mb-6">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search slides..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none" />
        </div>
        
        <div className="flex flex-col gap-4">
          {filtered.map(s => (
            <div key={s.id} className="border border-gray-100 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-[#0B5D3F]/20 hover:shadow-sm transition-all bg-[#F6FBF8]/30">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1 min-w-0">
                {s.image ? (
                  <div className="w-32 h-20 rounded-xl overflow-hidden shrink-0 border border-gray-200 bg-gray-100 relative shadow-sm">
                    <img src={s.image} alt={s.tag} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-32 h-20 rounded-xl border border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-gray-400 shrink-0">
                    <ImageIcon size={20} />
                    <span className="text-[10px] mt-1 font-semibold">No Image</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-[#4CAF50] mb-1">{s.tag}</div>
                  <h4 className="font-bold text-gray-900 text-base mb-1 whitespace-pre-wrap leading-tight">{s.heading}</h4>
                  <p className="text-xs text-gray-500 line-clamp-2">{s.sub}</p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0 self-end md:self-center">
                <button
                  onClick={() => startEdit(s)}
                  className="px-3 py-2 bg-white border border-gray-200 hover:border-[#0B5D3F]/30 hover:bg-[#0B5D3F]/5 text-gray-700 hover:text-[#0B5D3F] rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Edit3 size={14} /> Edit Slide
                </button>
                <button
                  onClick={() => setDeleteConfirmId(s.id)}
                  className="p-2 text-gray-400 hover:bg-red-50 rounded-xl hover:text-red-500 transition-all"
                  title="Delete Slide"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="py-12 text-center text-gray-400 text-xs font-semibold">
              No hero slides match your search query.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

