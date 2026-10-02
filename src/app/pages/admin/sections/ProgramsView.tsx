import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  TreePine, Waves, Sun, ShieldAlert, Bug, GraduationCap, Microscope, UsersRound,
  Plus, Search, Edit3, Trash2, X, AlertTriangle, Download, CheckCircle2, Leaf
} from "lucide-react";
import * as Icons from "lucide-react";
import { ImageUploadField } from "../../../components/ui/ImageUploadField";

export interface ProgramStat {
  value: string;
  label: string;
}

export interface ProgramInitiative {
  id?: string | number;
  title: string;
  tag: string;
  desc: string;
  impactInsight?: string;
}

export interface ProgramData {
  id: number;
  slug: string;
  title: string;
  tagline?: string;
  category: string;
  iconName: string;
  color: string;
  desc: string;
  highlights: string[];
  reach: string;
  image: string;
  stats?: ProgramStat[];
  initiatives?: ProgramInitiative[];
  ctaTitle?: string;
  ctaDesc?: string;
}

import { useFirestoreData, saveFirestoreData } from "../../../../lib/useFirestore";

export const DEFAULT_PROGRAM_STATS: Record<string, ProgramStat[]> = {
  "forest-restoration": [
    { value: "2.4M", label: "Trees Planted" },
    { value: "12", label: "Countries Active" },
    { value: "85,000", label: "Hectares Restored" },
    { value: "94%", label: "Survival Rate" }
  ],
  "ocean-action": [
    { value: "45,000", label: "Tons Plastic Removed" },
    { value: "35+", label: "Marine Protected Areas" },
    { value: "120", label: "Coastal Communities" },
    { value: "500K", label: "Hectares of Coral" }
  ],
  "clean-energy": [
    { value: "120,000+", label: "Households Powered" },
    { value: "450+", label: "Micro-grids Deployed" },
    { value: "250K", label: "Tons CO₂ Avoided/yr" },
    { value: "15", label: "Countries" }
  ],
  "climate-adaptation": [
    { value: "1.5M+", label: "People Supported" },
    { value: "320+", label: "Community Plans" },
    { value: "$12M", label: "Adaptation Grants" },
    { value: "45", label: "Vulnerable Nations" }
  ],
  "biodiversity": [
    { value: "2,000+", label: "Species Protected" },
    { value: "5M", label: "Hectares Protected" },
    { value: "3,500", label: "Community Rangers" },
    { value: "90%", label: "Poaching Reduction" }
  ],
  "education": [
    { value: "5M+", label: "Students Reached" },
    { value: "15,000", label: "Schools Enrolled" },
    { value: "50,000", label: "Teachers Trained" },
    { value: "80", label: "Countries" }
  ],
  "research": [
    { value: "180+", label: "Peer-Reviewed Papers" },
    { value: "45", label: "Policy Briefs" },
    { value: "12", label: "Research Stations" },
    { value: "250+", label: "Scientists Networked" }
  ],
  "youth": [
    { value: "48,000+", label: "Youth Leaders" },
    { value: "120+", label: "Campuses Active" },
    { value: "$2.5M", label: "Youth Grants" },
    { value: "65", label: "Countries" }
  ]
};

export const DEFAULT_PROGRAM_INITIATIVES: Record<string, ProgramInitiative[]> = {
  "forest-restoration": [
    { title: "Amazon Revival", tag: "Flagship", desc: "Working with indigenous communities to restore 500,000 hectares of degraded rainforest using native species and sustainable agroforestry.", impactInsight: "500K ha restored" },
    { title: "Great Green Wall Support", tag: "Partnership", desc: "Partnering with African nations to plant drought-resistant trees across the Sahel, combating desertification and creating green jobs.", impactInsight: "1.2M trees planted" },
    { title: "Mangrove Shield", tag: "Coastal", desc: "Restoring critical mangrove ecosystems in Southeast Asia to protect coastlines from storm surges and sequester blue carbon.", impactInsight: "85 km coastline protected" },
    { title: "Urban Canopy Initiative", tag: "Urban", desc: "Bringing green spaces back to heavily polluted urban centers by planting millions of trees in partnership with city governments.", impactInsight: "20+ mega cities" }
  ],
  "ocean-action": [
    { title: "Coral Rescue Network", tag: "Restoration", desc: "Deploying innovative coral gardening techniques and 3D printed reefs to restore 100+ degraded reef systems globally.", impactInsight: "100+ reef systems" },
    { title: "Plastic-Free Seas", tag: "Action", desc: "Mobilizing thousands of volunteers and specialized vessels to intercept river plastic before it reaches the ocean.", impactInsight: "45K tons plastic removed" },
    { title: "Blue Carbon Habitats", tag: "Conservation", desc: "Protecting and restoring seagrass meadows that absorb carbon up to 35 times faster than tropical rainforests.", impactInsight: "35 MPAs active" },
    { title: "Sustainable Coasts", tag: "Community", desc: "Empowering local fishing communities with the tools and knowledge to manage their marine resources sustainably.", impactInsight: "120 communities supported" }
  ],
  "clean-energy": [
    { title: "Solar Mini-Grids", tag: "Off-Grid", desc: "Deploying decentralized microgrids to power rural clinics, schools, and homes with 100% clean solar energy.", impactInsight: "450+ microgrids deployed" },
    { title: "Clean Cooking Transition", tag: "Health", desc: "Replacing open-fire wood stoves with modern clean cookstoves, reducing household air pollution and deforestation.", impactInsight: "120K families supported" },
    { title: "Community Energy Cooperatives", tag: "Ownership", desc: "Establishing locally-governed solar cooperatives that generate revenue and clean energy for villages.", impactInsight: "85 cooperatives established" },
    { title: "Renewable Energy Skills Hub", tag: "Education", desc: "Training youth and women technicians to install, maintain, and manage clean energy installations.", impactInsight: "3,500 technicians trained" }
  ],
  "climate-adaptation": [
    { title: "Community Early Warning Systems", tag: "Resilience", desc: "Setting up decentralized weather monitoring and alert networks in flood and cyclone prone river basins.", impactInsight: "320 communities protected" },
    { title: "Floating Agriculture & Hydroponics", tag: "Innovation", desc: "Implementing adaptive farming techniques for low-lying coastal deltas facing waterlogging and salinity.", impactInsight: "15K farmers equipped" },
    { title: "Resilient Habitat Infrastructure", tag: "Housing", desc: "Building climate-proof community centers and elevated water filtration stations.", impactInsight: "45 vulnerable zones upgraded" },
    { title: "Local Adaptation Action Plans", tag: "Policy", desc: "Empowering grassroots councils to formulate, budget, and execute adaptation measures with international grants.", impactInsight: "$12M grants deployed" }
  ],
  "biodiversity": [
    { title: "Community Ranger Network", tag: "Protection", desc: "Equipping and training local indigenous rangers with smart tracking tech to prevent poaching and habitat destruction.", impactInsight: "3,500 rangers active" },
    { title: "Wildlife Migration Corridors", tag: "Conservation", desc: "Securing and reforesting ecological corridors connecting fragmented national parks and wildlife sanctuaries.", impactInsight: "5M hectares protected" },
    { title: "Endangered Species Tracking", tag: "Science", desc: "Deploying camera traps, acoustic monitors, and bio-sensors to monitor threatened flora and fauna.", impactInsight: "85 species monitored" },
    { title: "Living Landscapes Advocacy", tag: "Policy", desc: "Advocating for legal rights of nature and indigenous stewardship recognition at UN CBD summits.", impactInsight: "24 global treaties influenced" }
  ],
  "education": [
    { title: "Green Schools Initiative", tag: "Schools", desc: "Equipping schools worldwide with solar power, eco-gardens, waste sorting hubs, and environmental science modules.", impactInsight: "15,000 schools enrolled" },
    { title: "Teacher Climate Academies", tag: "Training", desc: "Providing professional development and curriculum materials to primary and secondary educators globally.", impactInsight: "50,000 teachers trained" },
    { title: "Digital Eco-Curriculum Hub", tag: "Open Access", desc: "Open digital environmental learning tools in 20+ languages for millions of curious young minds.", impactInsight: "5M+ students reached" },
    { title: "University Campus Sustainability League", tag: "Youth", desc: "Inter-university challenges and carbon footprint reduction audits driven by student coalitions.", impactInsight: "250 campuses active" }
  ],
  "research": [
    { title: "Global Ecological Monitoring Stations", tag: "Field Science", desc: "Collecting continuous soil, water quality, canopy cover, and atmospheric data across vulnerable ecosystems.", impactInsight: "12 research stations" },
    { title: "Policy Briefs & White Papers", tag: "Policy", desc: "Translating empirical field data into actionable recommendations for international climate delegates and ministries.", impactInsight: "45 policy briefs published" },
    { title: "Open-Science Data Commons", tag: "Data", desc: "Publishing open datasets for global researchers, university students, and environmental journalists.", impactInsight: "180+ papers available" },
    { title: "South-South Scientific Exchange", tag: "Collaboration", desc: "Sponsoring joint research fellowships between scientists from developing nations on delta adaptation.", impactInsight: "250+ scientists networked" }
  ],
  "youth": [
    { title: "Young Environmental Leaders (YEL) Fellowship", tag: "Flagship", desc: "12-month intensive program equipping promising leaders with seed funds, mentorship, and project tools.", impactInsight: "2,500 fellows graduated" },
    { title: "Youth COP Delegation Support", tag: "Global Voice", desc: "Accrediting and preparing youth leaders to participate actively in UN climate negotiation panels.", impactInsight: "60 nations represented" },
    { title: "ESN Youth Innovation Fund", tag: "Micro-grants", desc: "Micro-grants of $500–$5,000 directly to grassroots youth projects combating pollution and restoring nature.", impactInsight: "$2.5M in micro-grants" },
    { title: "Digital Leadership Academy", tag: "Skills", desc: "Online masterclasses in project design, environmental communication, coalition building, and legal advocacy.", impactInsight: "48,000+ members" }
  ]
};

export function getInitialPrograms(): ProgramData[] {
  return [
    {
      id: 1, slug: "forest-restoration", title: "Forest Restoration", category: "Ecosystems", iconName: "TreePine", color: "#4CAF50",
      desc: "Coordinating the planting and long-term stewardship of 100 million trees across degraded landscapes in Asia, Africa, and Latin America through science-led reforestation and digital ecosystem monitoring.",
      highlights: ["2.4M Trees Planted", "Community Nurseries", "Land Tenure Support"],
      reach: "80+ Countries Active",
      image: "/canada journey.jpeg",
      stats: DEFAULT_PROGRAM_STATS["forest-restoration"],
      initiatives: DEFAULT_PROGRAM_INITIATIVES["forest-restoration"]
    },
    {
      id: 2, slug: "ocean-action", title: "Ocean & Coastal Action", category: "Ecosystems", iconName: "Waves", color: "#2196F3",
      desc: "Protecting marine ecosystems, combating deep-ocean plastic pollution, restoring coral reefs, and establishing community-governed Marine Protected Areas across 35+ coastal nations.",
      highlights: ["Reef Monitoring Network", "Coastal Clean-ups", "Marine Protected Areas"],
      reach: "32 Marine Projects",
      image: "/Representing Bangladesh's Coastal Communities on the Global Stage.jpeg",
      stats: DEFAULT_PROGRAM_STATS["ocean-action"],
      initiatives: DEFAULT_PROGRAM_INITIATIVES["ocean-action"]
    },
    {
      id: 3, slug: "clean-energy", title: "Climate-Smart Energy Access", category: "Energy", iconName: "Sun", color: "#FFC107",
      desc: "Accelerating access to affordable solar, wind, and micro-hydro energy for 10 million off-grid households in the Global South — replacing fossil fuel dependence with community-owned clean power.",
      highlights: ["Solar Mini-grids", "Cookstove Programs", "Energy Policy"],
      reach: "120K+ Households",
      image: "/canada conference.jpeg",
      stats: DEFAULT_PROGRAM_STATS["clean-energy"],
      initiatives: DEFAULT_PROGRAM_INITIATIVES["clean-energy"]
    },
    {
      id: 4, slug: "climate-adaptation", title: "Climate Adaptation & Resilience", category: "Community", iconName: "ShieldAlert", color: "#F44336",
      desc: "Building adaptive capacity in the world's most climate-vulnerable communities — from Pacific islands to African drylands — through nature-based infrastructure and early warning systems.",
      highlights: ["Community Plans", "Resilience Grants", "Capacity Building"],
      reach: "12K+ Communities",
      image: "/Speaking on Climate Adaptation and Resilience in South Asia- CEPCA 2024, Ottawa, Canada.jpeg",
      stats: DEFAULT_PROGRAM_STATS["climate-adaptation"],
      initiatives: DEFAULT_PROGRAM_INITIATIVES["climate-adaptation"]
    },
    {
      id: 5, slug: "biodiversity", title: "Biodiversity & Wildlife", category: "Ecosystems", iconName: "Bug", color: "#9C27B0",
      desc: "Protecting endangered species and critical ecosystems through community ranger programs, AI-powered habitat monitoring, and evidence-based conservation policy advocacy at UN biodiversity forums.",
      highlights: ["Species Monitoring", "Corridor Projects", "Anti-Poaching"],
      reach: "85 Species Monitored",
      image: "/Commonwealth Secretariat at COP27.jpeg",
      stats: DEFAULT_PROGRAM_STATS["biodiversity"],
      initiatives: DEFAULT_PROGRAM_INITIATIVES["biodiversity"]
    },
    {
      id: 6, slug: "education", title: "Environmental Education", category: "Knowledge", iconName: "GraduationCap", color: "#00BCD4",
      desc: "Delivering climate literacy, environmental science, and sustainability curricula to 5 million students annually through school networks, teacher training, and open digital learning tools.",
      highlights: ["Green Schools Initiative", "Teacher Training", "Digital Curriculum"],
      reach: "5M+ Students Annually",
      image: "/meeting time.jpeg",
      stats: DEFAULT_PROGRAM_STATS["education"],
      initiatives: DEFAULT_PROGRAM_INITIATIVES["education"]
    },
    {
      id: 7, slug: "research", title: "Environmental Research", category: "Knowledge", iconName: "Microscope", color: "#607D8B",
      desc: "Conducting peer-reviewed, policy-relevant research across ecosystems, climate systems, and sustainability transitions — producing actionable insights that shape global environmental policy.",
      highlights: ["180+ Publications", "Policy Dialogues", "Open Data"],
      reach: "180+ Publications",
      image: "/represent bangladesh.jpeg",
      stats: DEFAULT_PROGRAM_STATS["research"],
      initiatives: DEFAULT_PROGRAM_INITIATIVES["research"]
    },
    {
      id: 8, slug: "youth", title: "Youth Development", category: "People", iconName: "UsersRound", color: "#FF9800",
      desc: "Nurturing the next generation of environmental champions through fellowships, leadership academies, mentorship networks, and meaningful seats at international climate negotiation tables.",
      highlights: ["YEL Fellowship Program", "Leadership Academies", "Youth Innovation Fund"],
      reach: "48K+ Youth Engaged",
      image: "/Climate Reality Leadership Corps Training | Representing Bangladesh.jpeg",
      stats: DEFAULT_PROGRAM_STATS["youth"],
      initiatives: DEFAULT_PROGRAM_INITIATIVES["youth"]
    }
  ];
}

const availableIcons = ["TreePine", "Waves", "Sun", "ShieldAlert", "Bug", "GraduationCap", "Microscope", "UsersRound", "Leaf", "Globe2", "Heart"];
const availableColors = ["#4CAF50", "#2196F3", "#FFC107", "#F44336", "#9C27B0", "#00BCD4", "#607D8B", "#FF9800", "#795548", "#E91E63", "#3F51B5"];

const blankProgram: Omit<ProgramData, "id"> = {
  slug: "", title: "", tagline: "", category: "Ecosystems", iconName: "Leaf", color: "#4CAF50",
  desc: "", highlights: ["", "", ""], reach: "", image: "",
  stats: [
    { value: "", label: "" },
    { value: "", label: "" },
    { value: "", label: "" },
    { value: "", label: "" }
  ],
  initiatives: [],
  ctaTitle: "",
  ctaDesc: ""
};

export function resolveIcon(name: string) {
  const Icon = (Icons as any)[name] || Leaf;
  return Icon;
}

export function ProgramsView() {
  const [programs, setPrograms, loading] = useFirestoreData<ProgramData[]>("esn_programs", getInitialPrograms());
  const [editingId, setEditingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<ProgramData, "id">>(blankProgram);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const save = async (list: ProgramData[]) => {
    setIsSaving(true);
    setPrograms(list);
    try {
      await saveFirestoreData("esn_programs", list);
      await saveFirestoreData("esn_programs_admin", list);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      console.error("Failed to save programs to Firestore:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.title || !form.slug) return;
    let updatedList: ProgramData[];
    if (editId !== null) {
      updatedList = programs.map((p) => 
        (p.id === editId || String(p.id) === String(editId) || p.slug === form.slug)
          ? { ...form, id: editId }
          : p
      );
    } else {
      updatedList = [...programs, { ...form, id: Date.now() }];
    }
    await save(updatedList);
    setShowForm(false);
    setEditId(null);
    setForm(blankProgram);
  };

  const startEdit = (p: ProgramData) => {
    const { id, ...rest } = p;
    const defaultStats = DEFAULT_PROGRAM_STATS[p.slug] || [
      { value: "", label: "" },
      { value: "", label: "" },
      { value: "", label: "" },
      { value: "", label: "" }
    ];
    const existingStats = rest.stats && rest.stats.length > 0 ? rest.stats : defaultStats;
    const fullStats = [...existingStats];
    while (fullStats.length < 4) {
      fullStats.push({ value: "", label: "" });
    }
    const defaultInitiatives = DEFAULT_PROGRAM_INITIATIVES[p.slug] || [];
    const existingInitiatives = rest.initiatives && rest.initiatives.length > 0 ? rest.initiatives : defaultInitiatives;

    setForm({
      ...rest,
      tagline: rest.tagline || "",
      ctaTitle: rest.ctaTitle || "",
      ctaDesc: rest.ctaDesc || "",
      stats: fullStats,
      initiatives: existingInitiatives
    });
    setEditId(id);
    setShowForm(true);
  };

  const doDelete = () => {
    if (deleteConfirmId === null) return;
    save(programs.filter((p) => p.id !== deleteConfirmId));
    setDeleteConfirmId(null);
  };

  const handleHighlightChange = (index: number, value: string) => {
    const newHighlights = [...form.highlights];
    newHighlights[index] = value;
    setForm({ ...form, highlights: newHighlights });
  };

  const handleStatChange = (index: number, field: "value" | "label", val: string) => {
    const newStats = [...(form.stats || [
      { value: "", label: "" },
      { value: "", label: "" },
      { value: "", label: "" },
      { value: "", label: "" }
    ])];
    newStats[index] = { ...newStats[index], [field]: val };
    setForm({ ...form, stats: newStats });
  };

  const handleInitiativeChange = (index: number, field: keyof ProgramInitiative, val: string) => {
    const list = [...(form.initiatives || [])];
    list[index] = { ...list[index], [field]: val };
    setForm({ ...form, initiatives: list });
  };

  const addInitiative = () => {
    const list = [...(form.initiatives || [])];
    list.push({ title: "", tag: "Action", desc: "", impactInsight: "" });
    setForm({ ...form, initiatives: list });
  };

  const removeInitiative = (index: number) => {
    const list = [...(form.initiatives || [])].filter((_, i) => i !== index);
    setForm({ ...form, initiatives: list });
  };

  const filtered = (programs || []).filter((p) => {
    if (!p) return false;
    const title = String(p.title || "").toLowerCase();
    const category = String(p.category || "").toLowerCase();
    const q = String(search || "").toLowerCase().trim();
    return !q || title.includes(q) || category.includes(q);
  });
  const programToDelete = programs.find(p => p.id === deleteConfirmId);

  return (
    <div className="flex flex-col gap-7">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Core Programs</h3>
          <p className="text-sm text-gray-400 mt-0.5">{programs.length} active programs</p>
        </div>
        <button onClick={() => { setForm(blankProgram); setEditId(null); setShowForm(true); }} className="flex items-center gap-2 bg-[#0B5D3F] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#0a5237] transition-all">
          <Plus size={16} /> Add Program
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-3xl p-8 max-w-3xl w-full shadow-2xl my-8 max-h-[88vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{editId ? "Edit Program" : "Add New Program"}</h4>
                <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200"><X size={16} /></button>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Program Title *</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="E.g., Forest Restoration" className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">URL Slug *</label>
                  <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="E.g., forest-restoration" className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Category</label>
                  <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="E.g., Ecosystems" className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Reach (Label)</label>
                  <input type="text" value={form.reach} onChange={(e) => setForm({ ...form, reach: e.target.value })} placeholder="E.g., 80+ Countries Active" className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Tagline / Subtitle</label>
                  <input type="text" value={form.tagline || ""} onChange={(e) => setForm({ ...form, tagline: e.target.value })} placeholder="E.g., Breathing Life Back into Degraded Landscapes" className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
                </div>
                <div className="sm:col-span-2">
                  <ImageUploadField
                    label="Program Banner / Feature Image"
                    value={form.image}
                    onChange={(url) => setForm({ ...form, image: url })}
                    folder="programs"
                    helpText="Upload a featured image for this core program"
                  />
                </div>
                
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Theme Color</label>
                  <div className="flex flex-wrap gap-2">
                    {availableColors.map(c => (
                      <button key={c} onClick={() => setForm({ ...form, color: c })} className={`w-8 h-8 rounded-full border-2 ${form.color === c ? 'border-gray-900 scale-110' : 'border-transparent'}`} style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Icon</label>
                  <div className="flex flex-wrap gap-2">
                    {availableIcons.map(iconName => {
                      const IconComp = resolveIcon(iconName);
                      return (
                        <button key={iconName} onClick={() => setForm({ ...form, iconName })} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${form.iconName === iconName ? 'bg-gray-900 text-white' : 'bg-[#F6FBF8] border border-gray-200 text-gray-600 hover:bg-gray-100'}`}>
                          <IconComp size={18} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Description</label>
                  <textarea value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} rows={3} className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none resize-none" placeholder="Program description..." />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Highlights (3 max)</label>
                  <div className="flex flex-col gap-2">
                    {form.highlights.map((h, i) => (
                      <input key={i} type="text" value={h} onChange={(e) => handleHighlightChange(i, e.target.value)} placeholder={`Highlight ${i + 1}`} className="w-full px-4 py-2 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <label className="text-xs font-bold text-gray-800 block">
                        Key Metric Numbers & Statistics (4 Metric Cards)
                      </label>
                      <p className="text-[11px] text-gray-400">
                        These numbers appear prominently in the top stat cards of the program page (e.g., 2,000+ Species Protected)
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(form.stats || [
                      { value: "", label: "" },
                      { value: "", label: "" },
                      { value: "", label: "" },
                      { value: "", label: "" }
                    ]).slice(0, 4).map((st, idx) => (
                      <div key={idx} className="flex gap-2.5 bg-[#F6FBF8] p-3 rounded-2xl border border-gray-200/80 items-center">
                        <div className="w-5/12">
                          <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Number / Stat</label>
                          <input
                            type="text"
                            value={st.value || ""}
                            onChange={(e) => handleStatChange(idx, "value", e.target.value)}
                            placeholder="e.g. 2,000+"
                            className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-[#0B5D3F] focus:outline-none focus:border-[#4CAF50]"
                          />
                        </div>
                        <div className="w-7/12">
                          <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Metric Title</label>
                          <input
                            type="text"
                            value={st.label || ""}
                            onChange={(e) => handleStatChange(idx, "label", e.target.value)}
                            placeholder="e.g. Species Protected"
                            className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs text-gray-700 font-medium focus:outline-none focus:border-[#4CAF50]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <label className="text-xs font-bold text-gray-800 block">
                        Core Program Initiatives & Action Tracks
                      </label>
                      <p className="text-[11px] text-gray-400">
                        Initiatives displayed under this program on the public website with title, tag, description, and impact insight.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addInitiative}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-[#0B5D3F] hover:bg-emerald-100 border border-emerald-200 transition-colors"
                    >
                      <Plus size={13} /> Add Initiative
                    </button>
                  </div>
                  
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {(form.initiatives || []).length === 0 ? (
                      <div className="text-xs text-gray-400 italic p-4 text-center bg-gray-50 rounded-xl">
                        No initiatives added yet. Click "+ Add Initiative" above to add program action tracks.
                      </div>
                    ) : (
                      (form.initiatives || []).map((init, idx) => (
                        <div key={idx} className="bg-[#F6FBF8] p-3.5 rounded-2xl border border-gray-200/80 relative">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-bold text-gray-500 uppercase">Initiative #{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => removeInitiative(idx)}
                              className="text-gray-400 hover:text-red-500 p-1 rounded-lg transition-colors"
                              title="Remove initiative"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-2.5">
                            <div className="sm:col-span-2">
                              <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Initiative Title</label>
                              <input
                                type="text"
                                value={init.title || ""}
                                onChange={(e) => handleInitiativeChange(idx, "title", e.target.value)}
                                placeholder="e.g. Coral Rescue Network"
                                className="w-full px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#4CAF50]"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Tag / Category</label>
                              <input
                                type="text"
                                value={init.tag || ""}
                                onChange={(e) => handleInitiativeChange(idx, "tag", e.target.value)}
                                placeholder="e.g. Restoration"
                                className="w-full px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs text-gray-700 focus:outline-none focus:border-[#4CAF50]"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            <div className="sm:col-span-2">
                              <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Description</label>
                              <input
                                type="text"
                                value={init.desc || ""}
                                onChange={(e) => handleInitiativeChange(idx, "desc", e.target.value)}
                                placeholder="Brief description of the initiative goals..."
                                className="w-full px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs text-gray-700 focus:outline-none focus:border-[#4CAF50]"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Impact Insight Number</label>
                              <input
                                type="text"
                                value={init.impactInsight || ""}
                                onChange={(e) => handleInitiativeChange(idx, "impactInsight", e.target.value)}
                                placeholder="e.g. 100+ reef systems"
                                className="w-full px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs text-emerald-800 font-semibold focus:outline-none focus:border-[#4CAF50]"
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-8">
                <button
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className="flex-1 bg-[#0B5D3F] text-white py-3 rounded-xl font-semibold hover:bg-[#0a5237] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSaving ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving changes...
                    </>
                  ) : (
                    editId ? "Save Changes" : "Create Program"
                  )}
                </button>
                <button onClick={() => setShowForm(false)} className="px-6 py-3 rounded-xl text-gray-500 hover:bg-gray-100 font-semibold">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteConfirmId !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <AlertTriangle size={28} className="text-red-500" />
              </div>
              <h4 className="font-black text-gray-900 mb-2">Delete Program?</h4>
              <p className="text-sm text-gray-500 mb-1">This will permanently delete:</p>
              <p className="text-sm font-bold text-gray-800 mb-6">"{programToDelete?.title}"</p>
              <div className="flex gap-3">
                <button onClick={doDelete} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-all">Yes, Delete</button>
                <button onClick={() => setDeleteConfirmId(null)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-[#0B5D3F] px-4 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2.5 shadow-sm">
          <CheckCircle2 size={16} className="text-[#0B5D3F] shrink-0" />
          <span>Changes saved successfully! Program details, statistics, and photo have been updated and synced to the website.</span>
        </div>
      )}

      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search programs..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {filtered.map((p) => {
          const Icon = resolveIcon(p.iconName);
          return (
            <motion.div key={p.id} className="flex flex-col sm:flex-row sm:items-center gap-5 px-6 py-5 border-b border-gray-50 last:border-0 hover:bg-[#F6FBF8]/50 transition-colors">
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-gray-100 bg-[#F6FBF8] flex items-center justify-center">
                {p.image ? (
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: p.color + '18', color: p.color }}>
                    <Icon size={22} />
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-5 h-5 rounded-tl-lg flex items-center justify-center shadow-xs" style={{ backgroundColor: p.color, color: "#fff" }}>
                  <Icon size={11} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-bold text-gray-800 text-sm">{p.title}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: p.color + '18', color: p.color }}>
                    {p.category}
                  </span>
                  {p.reach && (
                    <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {p.reach}
                    </span>
                  )}
                </div>
                {p.tagline && (
                  <div className="text-xs font-medium text-emerald-800/80 mb-0.5 line-clamp-1 italic">
                    "{p.tagline}"
                  </div>
                )}
                <div className="text-xs text-gray-400 line-clamp-1">{p.desc}</div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => startEdit(p)} className="p-2 rounded-xl hover:bg-[#0B5D3F]/10 text-gray-300 hover:text-[#0B5D3F] transition-all" title="Edit">
                  <Edit3 size={15} />
                </button>
                <button onClick={() => setDeleteConfirmId(p.id)} className="p-2 rounded-xl hover:bg-red-50 text-gray-300 hover:text-red-500 transition-all" title="Delete">
                  <Trash2 size={15} />
                </button>
              </div>
            </motion.div>
          );
        })}
        {filtered.length === 0 && (
          <div className="py-16 text-center text-gray-300">
            <Leaf size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No programs found</p>
          </div>
        )}
      </div>
    </div>
  );
}
