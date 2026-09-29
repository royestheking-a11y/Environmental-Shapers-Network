import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Search, Edit3, Trash2, AlertCircle, Image as ImageIcon, Globe2, Zap, ArrowRight, Layers, RotateCcw, Sparkles } from "lucide-react";
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

export interface HeroCollageCard {
  id: number;
  title: string;
  image: string;
  position?: "top-right" | "bottom-left" | "center" | "top-left" | "bottom-right" | string;
  rotation?: number;
  order?: number;
}

export function getInitialHeroCollageCards(): HeroCollageCard[] {
  return [
    {
      id: 1,
      title: "Climate Adaptation & Resilience",
      image: "/Speaking on Climate Adaptation and Resilience in South Asia- CEPCA 2024, Ottawa, Canada.jpeg",
      position: "top-right",
      rotation: -4,
      order: 1,
    },
    {
      id: 2,
      title: "Coastal Community Action",
      image: "/Representing Bangladesh's Coastal Communities on the Global Stage.jpeg",
      position: "bottom-left",
      rotation: 4,
      order: 2,
    },
    {
      id: 3,
      title: "Global Collaboration & Summit",
      image: "/meeting time.jpeg",
      position: "center",
      rotation: 0,
      order: 3,
    },
  ];
}

export default function HeroAdminView() {
  const [activeTab, setActiveTab] = useState<"slides" | "collage">("collage");
  const [slides, setSlides, loadingSlides] = useFirestoreData<HeroSlide[]>("esn_hero_admin", getInitialHeroSlides());
  const [collageCards, setCollageCards, loadingCollage] = useFirestoreData<HeroCollageCard[]>(
    "esn_hero_collage",
    getInitialHeroCollageCards()
  );
  const [repsSettings] = useFirestoreData<GlobalRepsSettings>(
    "esn_global_representatives_settings",
    defaultGlobalRepsSettings
  );

  // Slides State
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

  // Collage State
  const [showAddCollage, setShowAddCollage] = useState(false);
  const [editingCollageId, setEditingCollageId] = useState<number | null>(null);
  const [deleteCollageConfirmId, setDeleteCollageConfirmId] = useState<number | null>(null);
  const [collageFormData, setCollageFormData] = useState<Partial<HeroCollageCard>>({
    title: "",
    image: "",
    position: "center",
    rotation: 0,
  });

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

  // Slides Handlers
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

  // Collage Handlers
  const saveCollage = async (newCards: HeroCollageCard[]) => {
    setCollageCards(newCards);
    await saveFirestoreData("esn_hero_collage", newCards);
  };

  const handleSaveCollage = async () => {
    if (!collageFormData.image) {
      alert("Please provide or upload an image for the card.");
      return;
    }

    const defaultRotation = 
      collageFormData.position === "top-right" ? -4 :
      collageFormData.position === "bottom-left" ? 4 :
      collageFormData.position === "center" ? 0 :
      collageFormData.position === "top-left" ? -2 : 2;

    const cleanCard: HeroCollageCard = {
      id: editingCollageId !== null ? editingCollageId : (collageCards.length > 0 ? Math.max(...collageCards.map(c => c.id)) + 1 : 1),
      title: collageFormData.title || "Hero Image Card",
      image: collageFormData.image,
      position: collageFormData.position || "center",
      rotation: collageFormData.rotation !== undefined ? Number(collageFormData.rotation) : defaultRotation,
      order: collageFormData.order || (collageCards.length + 1),
    };

    if (editingCollageId !== null) {
      const updated = collageCards.map(c => c.id === editingCollageId ? cleanCard : c);
      await saveCollage(updated);
      await logAdminActivity("Updated Hero Collage Card", "CMS", `Updated collage card: "${cleanCard.title}".`, "info");
      setEditingCollageId(null);
    } else {
      const updated = [...collageCards, cleanCard];
      await saveCollage(updated);
      await logAdminActivity("Created Hero Collage Card", "CMS", `Added new collage card: "${cleanCard.title}".`, "success");
    }
    setShowAddCollage(false);
    setCollageFormData({ title: "", image: "", position: "center", rotation: 0 });
  };

  const startEditCollage = (card: HeroCollageCard) => {
    setCollageFormData({
      title: card.title,
      image: card.image,
      position: card.position || "center",
      rotation: card.rotation ?? 0,
      order: card.order,
    });
    setEditingCollageId(card.id);
    setShowAddCollage(true);
  };

  const startAddCollage = () => {
    // Recommend next position based on existing cards
    let nextPos = "center";
    if (!collageCards.some(c => c.position === "top-right")) nextPos = "top-right";
    else if (!collageCards.some(c => c.position === "bottom-left")) nextPos = "bottom-left";
    else if (!collageCards.some(c => c.position === "center")) nextPos = "center";
    else nextPos = "top-left";

    const nextRotation = nextPos === "top-right" ? -4 : nextPos === "bottom-left" ? 4 : nextPos === "center" ? 0 : -2;

    setEditingCollageId(null);
    setCollageFormData({
      title: "",
      image: "",
      position: nextPos,
      rotation: nextRotation,
    });
    setShowAddCollage(true);
  };

  const confirmDeleteCollage = async () => {
    if (deleteCollageConfirmId !== null) {
      const doomed = collageCards.find(c => c.id === deleteCollageConfirmId);
      const updated = collageCards.filter(c => c.id !== deleteCollageConfirmId);
      await saveCollage(updated);
      await logAdminActivity("Deleted Hero Collage Card", "CMS", `Deleted collage card: "${doomed?.title || deleteCollageConfirmId}".`, "warning");
      setDeleteCollageConfirmId(null);
    }
  };

  const resetCollageToDefaults = async () => {
    if (window.confirm("Reset hero collage cards to original 3 default images?")) {
      const defaults = getInitialHeroCollageCards();
      await saveCollage(defaults);
      await logAdminActivity("Reset Hero Collage", "CMS", "Reset hero collage cards to defaults.", "info");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Global Reps Live Link Banner */}
      <div className="bg-gradient-to-r from-[#0B5D3F]/10 via-[#173B63]/10 to-[#4CAF50]/10 border border-[#4CAF50]/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B5D3F] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Globe2 size={20} className="text-[#81C784]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0B5D3F] uppercase tracking-wider">
                Hero Section Management
              </span>
              <span className="bg-[#4CAF50] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                Live Dynamic Sync
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-0.5">
              Edit both the homepage background carousel slides and the 3 visual collage cards.
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

      {/* Tabs Switcher */}
      <div className="flex border-b border-gray-200 gap-3">
        <button
          onClick={() => setActiveTab("collage")}
          className={`pb-3 px-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === "collage"
              ? "border-[#0B5D3F] text-[#0B5D3F]"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <ImageIcon size={17} />
          <span>3 Collage Image Cards</span>
          <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
            activeTab === "collage" ? "bg-[#0B5D3F] text-white" : "bg-gray-100 text-gray-600"
          }`}>
            {collageCards?.length || 0}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("slides")}
          className={`pb-3 px-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === "slides"
              ? "border-[#0B5D3F] text-[#0B5D3F]"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <Layers size={17} />
          <span>Carousel Background Slides</span>
          <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
            activeTab === "slides" ? "bg-[#0B5D3F] text-white" : "bg-gray-100 text-gray-600"
          }`}>
            {slides?.length || 0}
          </span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: HERO COLLAGE IMAGE CARDS (3 CARDS)               */}
      {/* ======================================================== */}
      {activeTab === "collage" && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-gray-900 font-bold text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Hero Image Collage Cards (3 Visual Cards)
              </h3>
              <p className="text-sm text-gray-500">
                These cards form the visual photo collage displayed on the right-hand side of the homepage hero. You can edit any card's image, add new cards, or remove cards.
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={resetCollageToDefaults}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:text-[#0B5D3F] hover:bg-gray-50 font-semibold text-xs transition-all shadow-sm cursor-pointer"
                title="Reset to 3 default photos"
              >
                <RotateCcw size={14} /> Reset Defaults
              </button>
              <button
                onClick={startAddCollage}
                className="flex items-center gap-2 bg-[#0B5D3F] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#0a5237] transition-all shadow-sm cursor-pointer"
              >
                <Plus size={16} /> Add Image Card
              </button>
            </div>
          </div>

          {/* Add / Edit Collage Card Form */}
          <AnimatePresence>
            {showAddCollage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white rounded-2xl p-6 border-2 border-[#4CAF50]/40 overflow-hidden shadow-md"
              >
                <div className="flex items-center justify-between mb-5">
                  <h4 className="font-bold text-gray-900 text-base">
                    {editingCollageId ? "Edit Collage Image Card" : "Add New Collage Image Card"}
                  </h4>
                  <span className="text-xs text-gray-400 font-medium">Updates live on Homepage hero</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 mb-1.5 block">Card Title / Caption *</label>
                      <input
                        type="text"
                        value={collageFormData.title || ""}
                        onChange={e => setCollageFormData({ ...collageFormData, title: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]"
                        placeholder="e.g. Climate Adaptation & Resilience"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 mb-1.5 block">Collage Slot Position</label>
                      <select
                        value={collageFormData.position || "center"}
                        onChange={e => {
                          const pos = e.target.value;
                          const rot = pos === "top-right" ? -4 : pos === "bottom-left" ? 4 : pos === "center" ? 0 : pos === "top-left" ? -2 : 2;
                          setCollageFormData({ ...collageFormData, position: pos, rotation: rot });
                        }}
                        className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] font-medium"
                      >
                        <option value="top-right">Top-Right Card (Back Layer, -4° Tilt)</option>
                        <option value="bottom-left">Bottom-Left Card (Back Layer, +4° Tilt)</option>
                        <option value="center">Center Card (Front Layer, 0° Tilt)</option>
                        <option value="top-left">Top-Left Card (Extra Slot, -2° Tilt)</option>
                        <option value="bottom-right">Bottom-Right Card (Extra Slot, +2° Tilt)</option>
                      </select>
                      <p className="text-[11px] text-gray-400 mt-1">
                        Determines where this card sits in the 3-image hero collage arrangement.
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-gray-700">Tilt Rotation Angle ({collageFormData.rotation ?? 0}°)</label>
                        <div className="flex gap-1">
                          {[-4, 0, 4].map(deg => (
                            <button
                              key={deg}
                              type="button"
                              onClick={() => setCollageFormData({ ...collageFormData, rotation: deg })}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                                collageFormData.rotation === deg ? "bg-[#0B5D3F] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              {deg > 0 ? `+${deg}°` : `${deg}°`}
                            </button>
                          ))}
                        </div>
                      </div>
                      <input
                        type="range"
                        min="-20"
                        max="20"
                        value={collageFormData.rotation ?? 0}
                        onChange={e => setCollageFormData({ ...collageFormData, rotation: Number(e.target.value) })}
                        className="w-full accent-[#0B5D3F]"
                      />
                    </div>
                  </div>

                  <div>
                    <ImageUploadField
                      label="Card Image Photo *"
                      value={collageFormData.image || ""}
                      onChange={(url) => setCollageFormData({ ...collageFormData, image: url })}
                      folder="hero-collage"
                      aspectRatio="portrait"
                      helpText="Upload a photo from your device or paste an image URL. High-resolution portrait/square photos look best."
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2 border-t border-gray-100">
                  <button
                    onClick={handleSaveCollage}
                    className="bg-[#0B5D3F] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0a5237] transition-all shadow-sm cursor-pointer"
                  >
                    Save Collage Card
                  </button>
                  <button
                    onClick={() => setShowAddCollage(false)}
                    className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Delete Collage Confirm Modal */}
          <AnimatePresence>
            {deleteCollageConfirmId !== null && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-3xl p-8 max-w-sm w-full text-center">
                  <AlertCircle size={32} className="text-red-500 mx-auto mb-4" />
                  <h4 className="font-bold text-gray-900 mb-2">Delete Collage Card?</h4>
                  <p className="text-xs text-gray-500">
                    This image card will be permanently removed from the right-hand collage on the homepage hero.
                  </p>
                  <div className="flex gap-3 mt-6">
                    <button onClick={confirmDeleteCollage} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 cursor-pointer">
                      Yes, Delete
                    </button>
                    <button onClick={() => setDeleteCollageConfirmId(null)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold cursor-pointer">
                      Cancel
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Collage Cards Visual Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(collageCards || []).map((card, idx) => {
              const posLabel =
                card.position === "top-right" ? "Top-Right Card (Back)" :
                card.position === "bottom-left" ? "Bottom-Left Card (Back)" :
                card.position === "center" ? "Center Card (Foreground)" :
                card.position === "top-left" ? "Top-Left (Extra)" : "Bottom-Right (Extra)";

              const badgeColor =
                card.position === "center" ? "bg-[#0B5D3F] text-white" :
                card.position === "top-right" ? "bg-emerald-600 text-white" :
                card.position === "bottom-left" ? "bg-teal-600 text-white" : "bg-gray-800 text-white";

              return (
                <div
                  key={card.id}
                  className="bg-white rounded-2xl border border-gray-200 hover:border-[#4CAF50]/50 transition-all p-5 flex flex-col justify-between shadow-sm hover:shadow-md group relative overflow-hidden"
                >
                  <div>
                    {/* Top status bar */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${badgeColor}`}>
                        {posLabel}
                      </span>
                      <span className="text-[11px] font-mono font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        Tilt: {card.rotation ?? 0}°
                      </span>
                    </div>

                    {/* Image Preview Box */}
                    <div className="w-full h-56 rounded-2xl bg-gray-100 border border-gray-200 overflow-hidden relative mb-4 flex items-center justify-center shadow-inner">
                      {card.image ? (
                        <div
                          className="w-full h-full transition-transform duration-300 group-hover:scale-105"
                          style={{ transform: `rotate(${card.rotation ?? 0}deg) scale(0.92)` }}
                        >
                          <img
                            src={card.image}
                            alt={card.title}
                            className="w-full h-full object-cover rounded-xl shadow-lg border-2 border-white/80"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <ImageIcon size={28} />
                          <span className="text-xs font-semibold mt-1">No Image Provided</span>
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h4 className="font-bold text-gray-900 text-sm mb-1 leading-snug line-clamp-2">
                      {card.title || "Untitled Card"}
                    </h4>
                    <p className="text-[11px] text-gray-400 font-mono truncate mb-4">
                      {card.image}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => startEditCollage(card)}
                      className="flex-1 py-2 px-3 bg-[#F6FBF8] border border-[#0B5D3F]/20 hover:bg-[#0B5D3F] hover:text-white text-[#0B5D3F] rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Edit3 size={13} /> Edit Card
                    </button>
                    <button
                      onClick={() => setDeleteCollageConfirmId(card.id)}
                      className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all cursor-pointer"
                      title="Delete this image card"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}

            {(!collageCards || collageCards.length === 0) && (
              <div className="col-span-3 py-16 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <ImageIcon size={36} className="mx-auto text-gray-400 mb-2" />
                <h4 className="font-bold text-gray-700 text-sm">No Collage Image Cards</h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-4">
                  Add image cards to compose the 3-image hero collage or restore original defaults.
                </p>
                <button
                  onClick={resetCollageToDefaults}
                  className="px-4 py-2 bg-[#0B5D3F] text-white rounded-xl text-xs font-bold hover:bg-[#0a5237] transition-all cursor-pointer"
                >
                  Restore 3 Default Cards
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: HERO CAROUSEL BACKGROUND SLIDES                  */}
      {/* ======================================================== */}
      {activeTab === "slides" && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-900 font-bold text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Hero Carousel Background Slides
              </h3>
              <p className="text-sm text-gray-500">
                Manage the full-screen background slides, headings, tags, and descriptions of the homepage hero carousel.
              </p>
            </div>
            <button
              onClick={startAdd}
              className="flex items-center gap-2 bg-[#0B5D3F] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#0a5237] transition-all cursor-pointer"
            >
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
                  <button onClick={handleSave} className="bg-[#0B5D3F] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0a5237] transition-all cursor-pointer">Save Slide</button>
                  <button onClick={() => setShowAdd(false)} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-all cursor-pointer">Cancel</button>
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
                    <button onClick={confirmDelete} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 cursor-pointer">Yes, Delete</button>
                    <button onClick={() => setDeleteConfirmId(null)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold cursor-pointer">Cancel</button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
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
                      className="px-3 py-2 bg-white border border-gray-200 hover:border-[#0B5D3F]/30 hover:bg-[#0B5D3F]/5 text-gray-700 hover:text-[#0B5D3F] rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                    >
                      <Edit3 size={14} /> Edit Slide
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(s.id)}
                      className="p-2 text-gray-400 hover:bg-red-50 rounded-xl hover:text-red-500 transition-all cursor-pointer"
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
      )}
    </div>
  );
}

