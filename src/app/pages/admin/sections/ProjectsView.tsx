import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  TreePine, Plus, Search, MapPin, Globe2, Users, TrendingUp,
  Edit3, Trash2, X, AlertTriangle, Download, CheckCircle2,
  Clock, PauseCircle, Filter
} from "lucide-react";
import { ImageUploadField } from "../../../components/ui/ImageUploadField";

type ProjectStatus = "Active" | "Planning" | "Completed" | "On Hold";

export interface ProjectApproach {
  title: string;
  desc: string;
}

export interface Project {
  id: number;
  name: string;
  country: string;
  region: string;
  status: ProjectStatus;
  budget: number;
  progress: number;
  category: string;
  description: string;
  lead: string;
  startDate: string;
  img: string;
  theme: string;
  impact: string;
  volunteers: number;
  color: string;
  // Extended fields for Point 7 & Point 1 (Interconnection & Impact Dashboard Insights):
  tagline?: string;
  challenge?: string;
  sdgs?: string;
  programSlug?: string;
  initiativeTitle?: string;
  impactTrees?: number;
  impactCO2?: number;
  impactCommunities?: number;
  impactBeneficiaries?: number;
  approach?: ProjectApproach[];
}

import { useFirestoreData, saveFirestoreData } from "../../../../lib/useFirestore";
import { logAdminActivity } from "../../../../lib/activityLogger";
import { DEFAULT_PROGRAM_INITIATIVES } from "./ProgramsView";

export const PROGRAM_OPTIONS = [
  { slug: "forest-restoration", label: "Forest Restoration" },
  { slug: "ocean-action", label: "Ocean & Coastal Action" },
  { slug: "clean-energy", label: "Climate-Smart Energy Access" },
  { slug: "climate-adaptation", label: "Climate Adaptation & Resilience" },
  { slug: "biodiversity", label: "Biodiversity & Wildlife" },
  { slug: "education", label: "Environmental Education" },
  { slug: "research", label: "Environmental Research" },
  { slug: "youth", label: "Youth Development" },
];

export function getInitialProjects(): Project[] {
  return [
    {
      id: 1, name: "Amazon Reforestation Hub", country: "Brazil", region: "South America", status: "Active", budget: 240000, progress: 72,
      category: "Forest Restoration", programSlug: "forest-restoration", initiativeTitle: "Amazon Revival",
      tagline: "Restoring the lungs of the planet, one native tree at a time.",
      description: "Large-scale community reforestation covering 50,000 hectares in the Brazilian Amazon in partnership with indigenous guardians.",
      challenge: "Over 17% of the Brazilian Amazon has been cleared in the past five decades, causing biodiversity loss and releasing gigatons of stored carbon.",
      lead: "Carlos Rodriguez", startDate: "Jan 1, 2026", img: "/meeting time.jpeg", theme: "SDG 15",
      impact: "350K trees planted", volunteers: 1200, color: "#0B5D3F", sdgs: "SDG 13, SDG 15, SDG 1, SDG 8",
      impactTrees: 350000, impactCO2: 21875, impactCommunities: 48, impactBeneficiaries: 12000,
      approach: [
        { title: "Community-Led Planting", desc: "Indigenous groups lead planting and nursery operations, ensuring long-term stewardship." },
        { title: "Native Species Diversity", desc: "Over 200 native species planted per hectare to maximize resilience." },
        { title: "Satellite & Drone Monitoring", desc: "Real-time monitoring ensuring sapling survival rates above 88%." }
      ]
    },
    {
      id: 2, name: "Sundarbans Mangrove Restore", country: "Bangladesh", region: "South Asia", status: "Active", budget: 180000, progress: 85,
      category: "Coastal Ecosystems", programSlug: "ocean-action", initiativeTitle: "Mangrove Shield",
      tagline: "Protecting South Asia's coastal shield from storm surges and sea-level rise.",
      description: "Mangrove restoration and biodiversity protection in the Sundarbans delta to protect 4 million coastal residents.",
      challenge: "Rising sea levels and intense cyclones like Amphan and Remal have damaged 25% of coastal mangrove buffer zones.",
      lead: "Rizwan Ahmed", startDate: "Mar 1, 2025", img: "/represent bangladesh.jpeg", theme: "SDG 14",
      impact: "120 km² restored", volunteers: 800, color: "#4CAF50", sdgs: "SDG 13, SDG 14, SDG 15",
      impactTrees: 280000, impactCO2: 17500, impactCommunities: 65, impactBeneficiaries: 4000000,
      approach: [
        { title: "Tidal Hydrology Restoration", desc: "Restoring natural tidal channels for natural mangrove seed dispersal." },
        { title: "Community Forest Guards", desc: "350 trained local guards protecting restored reserves." },
        { title: "Blue Carbon Certification", desc: "Establishing certified carbon baselines for sustainable local revenue." }
      ]
    },
    {
      id: 3, name: "Solar Villages Initiative", country: "Kenya", region: "East Africa", status: "Active", budget: 320000, progress: 45,
      category: "Renewable Energy", programSlug: "clean-energy", initiativeTitle: "Solar Mini-Grids",
      tagline: "Powering remote off-grid clinics, schools, and homes with community clean energy.",
      description: "Bringing solar micro-grids to 200 off-grid villages across sub-Saharan Africa, replacing fossil fuel dependence.",
      challenge: "Over 60% of rural families lack access to electricity, relying on polluting kerosene lamps and diesel generators.",
      lead: "Amara Osei", startDate: "Jun 1, 2026", img: "/Speaking on Climate Adaptation and Resilience in South Asia- CEPCA 2024, Ottawa, Canada.jpeg", theme: "SDG 7",
      impact: "200 villages powered", volunteers: 450, color: "#D6A95A", sdgs: "SDG 7, SDG 13, SDG 3",
      impactTrees: 0, impactCO2: 14500, impactCommunities: 200, impactBeneficiaries: 120000,
      approach: [
        { title: "Decentralized Micro-grids", desc: "Solar photovoltaic systems with smart metering for reliable power." },
        { title: "Women Technician Training", desc: "Training local women to install, maintain, and manage solar hardware." },
        { title: "Clean Cooking Integration", desc: "Deploying energy-efficient electric cookstoves alongside power access." }
      ]
    },
    {
      id: 4, name: "Pacific Coral Guardian", country: "Fiji", region: "Pacific", status: "Completed", budget: 150000, progress: 100,
      category: "Marine Conservation", programSlug: "ocean-action", initiativeTitle: "Coral Rescue Network",
      tagline: "Racing against warming oceans to save the Pacific's living reefs.",
      description: "Coral reef restoration and marine biodiversity monitoring across 45 sensitive Pacific island sites.",
      challenge: "Marine heatwaves and ocean acidification have bleached over 50% of shallow Pacific coral habitats.",
      lead: "Priya Sharma", startDate: "Jan 1, 2024", img: "/canada conference.jpeg", theme: "SDG 14",
      impact: "45 coral reefs restored", volunteers: 320, color: "#173B63", sdgs: "SDG 14, SDG 13, SDG 17",
      impactTrees: 0, impactCO2: 8200, impactCommunities: 28, impactBeneficiaries: 45000,
      approach: [
        { title: "Heat-Resilient Coral Nurseries", desc: "Growing thermally tolerant coral fragments in deep water nurseries." },
        { title: "Citizen Diver Monitoring", desc: "Training 320 volunteer divers to record reef recovery and bleaching." },
        { title: "Marine Protected Areas", desc: "Securing 8 community-governed marine protected zones." }
      ]
    },
    {
      id: 5, name: "Himalayan Watershed Revival", country: "Nepal", region: "South Asia", status: "Planning", budget: 90000, progress: 12,
      category: "Water Security", programSlug: "climate-adaptation", initiativeTitle: "Community Early Warning Systems",
      tagline: "Safeguarding the freshwater sources of 150,000 Himalayan families.",
      description: "Restoring watershed ecosystems to improve freshwater availability and reduce landslide hazards in high-altitude valleys.",
      challenge: "Glacial retreat and degraded catchment forests have dried up 70% of natural spring water sources.",
      lead: "Priya Sharma", startDate: "Sep 1, 2026", img: "https://images.unsplash.com/photo-1656740978556-ae767a923f5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600", theme: "SDG 6",
      impact: "150K families supported", volunteers: 2100, color: "#0B5D3F", sdgs: "SDG 6, SDG 13, SDG 15",
      impactTrees: 120000, impactCO2: 7500, impactCommunities: 72, impactBeneficiaries: 150000,
      approach: [
        { title: "Catchment Tree Planting", desc: "Planting alpine broadleaf trees to retain moisture and stabilize hillsides." },
        { title: "Spring-box Water Harvesting", desc: "Constructing natural filtration and storage tanks for dry seasons." },
        { title: "Glacial Flood Early Warning", desc: "Automated stream gauges alerting downstream villages to sudden surges." }
      ]
    },
    {
      id: 6, name: "Sahel Dryland Greening", country: "Niger", region: "West Africa", status: "On Hold", budget: 60000, progress: 30,
      category: "Agroforestry", programSlug: "forest-restoration", initiativeTitle: "Great Green Wall Support",
      tagline: "Farmer-led natural regeneration holding back the Sahara Desert.",
      description: "Farmer-managed natural regeneration to combat desertification and restore arable soil in the Sahel.",
      challenge: "Drought and desertification advance southward at 2 km annually, destroying fertile croplands.",
      lead: "Amara Osei", startDate: "Apr 1, 2025", img: "https://images.unsplash.com/photo-1656740978404-874f95b253b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600", theme: "SDG 15",
      impact: "30K trees protected", volunteers: 200, color: "#D6A95A", sdgs: "SDG 15, SDG 2, SDG 13",
      impactTrees: 30000, impactCO2: 1875, impactCommunities: 22, impactBeneficiaries: 18000,
      approach: [
        { title: "Farmer-Managed Regeneration", desc: "Pruning and nurturing existing underground root systems into full trees." },
        { title: "Water-Catchment Half Moons", desc: "Earthen contour dikes holding scarce rainwater in the soil." },
        { title: "Inter-cropping Resilience", desc: "Growing drought-tolerant legumes under acacia shade canopies." }
      ]
    },
  ];
}

const statusConfig: Record<ProjectStatus, { color: string; bg: string; icon: React.ComponentType<any> }> = {
  Active: { color: "#4CAF50", bg: "#4CAF50", icon: CheckCircle2 },
  Planning: { color: "#173B63", bg: "#173B63", icon: Clock },
  Completed: { color: "#6b7280", bg: "#6b7280", icon: CheckCircle2 },
  "On Hold": { color: "#D6A95A", bg: "#D6A95A", icon: PauseCircle },
};

const blankProject: Omit<Project, "id"> = {
  name: "", country: "", region: "", status: "Planning",
  budget: 0, progress: 0, category: "Forest Restoration",
  description: "", lead: "", startDate: "",
  img: "", theme: "", impact: "", volunteers: 0, color: "#0B5D3F",
  tagline: "", challenge: "", sdgs: "SDG 13, SDG 15",
  programSlug: "forest-restoration", initiativeTitle: "Amazon Revival",
  impactTrees: 0, impactCO2: 0, impactCommunities: 0, impactBeneficiaries: 0,
  approach: [
    { title: "Community Stewardship", desc: "Local teams and grassroots leadership direct on-the-ground action." },
    { title: "Science-Based Monitoring", desc: "Verifiable metrics tracking survival and carbon outcomes." },
    { title: "Sustainable Livelihoods", desc: "Creating green employment and economic resilience for families." }
  ]
};

function downloadCSV(projects: Project[]) {
  const headers = ["Name", "Country", "Region", "Status", "Budget", "Progress", "Category", "Lead", "Start Date"];
  const rows = projects.map((p) =>
    [p.name, p.country, p.region, p.status, `$${p.budget}`, `${p.progress}%`, p.category, p.lead, p.startDate]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `esn_projects_${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function ProjectsView() {
  const [projects, setProjects, loading] = useFirestoreData<Project[]>("esn_projects_admin", getInitialProjects());
  
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | ProjectStatus>("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<Project, "id">>(blankProject);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const save = async (list: Project[]) => {
    setProjects(list);
    await saveFirestoreData("esn_projects_admin", list);
  };

  const handleSubmit = () => {
    if (!form.name || !form.country) return;
    if (editId !== null) {
      save(projects.map((p) => p.id === editId ? { ...form, id: editId } : p));
      logAdminActivity("Updated Project", "Projects", `Saved updates to project "${form.name}" (${form.country}).`, "info");
    } else {
      save([{ ...form, id: Date.now() }, ...projects]);
      logAdminActivity("Created Project", "Projects", `Created new project "${form.name}" in ${form.country}.`, "success");
    }
    setShowForm(false);
    setEditId(null);
    setForm(blankProject);
  };

  const startEdit = (p: Project) => {
    const { id, ...rest } = p;
    setForm({
      ...rest,
      tagline: p.tagline || "",
      challenge: p.challenge || "",
      sdgs: p.sdgs || "SDG 13, SDG 15",
      programSlug: p.programSlug || "forest-restoration",
      initiativeTitle: p.initiativeTitle || "",
      impactTrees: p.impactTrees || 0,
      impactCO2: p.impactCO2 || 0,
      impactCommunities: p.impactCommunities || 0,
      impactBeneficiaries: p.impactBeneficiaries || 0,
      approach: p.approach && p.approach.length > 0 ? p.approach : [
        { title: "Community Stewardship", desc: "Local teams and grassroots leadership direct on-the-ground action." },
        { title: "Science-Based Monitoring", desc: "Verifiable metrics tracking survival and carbon outcomes." },
        { title: "Sustainable Livelihoods", desc: "Creating green employment and economic resilience for families." }
      ]
    });
    setEditId(id);
    setShowForm(true);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
  };

  const handleApproachChange = (index: number, field: "title" | "desc", val: string) => {
    const list = [...(form.approach || [
      { title: "", desc: "" },
      { title: "", desc: "" },
      { title: "", desc: "" }
    ])];
    list[index] = { ...list[index], [field]: val };
    setForm({ ...form, approach: list });
  };

  const currentProgramInitiatives = DEFAULT_PROGRAM_INITIATIVES[form.programSlug || "forest-restoration"] || [];

  const doDelete = () => {
    if (deleteConfirmId === null) return;
    const doomed = projects.find((p) => p.id === deleteConfirmId);
    save(projects.filter((p) => p.id !== deleteConfirmId));
    logAdminActivity("Deleted Project", "Projects", `Deleted project "${doomed?.name || deleteConfirmId}".`, "warning");
    setDeleteConfirmId(null);
  };

  const filtered = (projects || []).filter((p) => {
    if (!p) return false;
    const name = String(p.name || "").toLowerCase();
    const country = String(p.country || "").toLowerCase();
    const category = String(p.category || "").toLowerCase();
    const s = String(search || "").toLowerCase().trim();

    const matchSearch = !s || name.includes(s) || country.includes(s) || category.includes(s);
    const matchStatus = filterStatus === "All" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = {
    total: projects.length,
    active: projects.filter(p => p.status === "Active").length,
    completed: projects.filter(p => p.status === "Completed").length,
    totalBudget: projects.reduce((s, p) => s + p.budget, 0),
  };

  const projectToDelete = projects.find(p => p.id === deleteConfirmId);

  return (
    <div className="flex flex-col gap-7">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Projects Manager</h3>
          <p className="text-sm text-gray-400 mt-0.5">{projects.length} projects · {counts.active} active</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => downloadCSV(projects)} className="flex items-center gap-2 text-sm text-gray-500 border border-gray-200 bg-white px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-all">
            <Download size={14} /> Export CSV
          </button>
          <button onClick={() => { setForm(blankProject); setEditId(null); setShowForm(true); setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50); }} className="flex items-center gap-2 bg-[#0B5D3F] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#0a5237] transition-all">
            <Plus size={16} /> Add Project
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Projects", value: counts.total, icon: Globe2, color: "#0B5D3F" },
          { label: "Active", value: counts.active, icon: TrendingUp, color: "#4CAF50" },
          { label: "Completed", value: counts.completed, icon: CheckCircle2, color: "#173B63" },
          { label: "Total Budget", value: `$${(counts.totalBudget / 1000).toFixed(0)}K`, icon: TreePine, color: "#D6A95A" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 flex items-center gap-3">
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
                <h4 className="font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{editId ? "Edit Project" : "Add New Project"}</h4>
                <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200"><X size={16} /></button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Project Name *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Project name..." className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors" />
                </div>
                {[
                  { label: "Country *", key: "country", placeholder: "Brazil" },
                  { label: "Region", key: "region", placeholder: "South America" },
                  { label: "Project Lead", key: "lead", placeholder: "Lead name" },
                  { label: "Start Date", key: "startDate", placeholder: "Jan 1, 2026" },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="text-xs font-bold text-gray-600 mb-1.5 block">{f.label}</label>
                    <input type="text" value={(form as any)[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder} className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors" />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ProjectStatus })} className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none">
                    {["Active", "Planning", "Completed", "On Hold"].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none">
                    {["Forest Restoration", "Marine Conservation", "Renewable Energy", "Water Security", "Agroforestry", "Coastal Ecosystems", "Biodiversity", "Climate Education"].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Budget ($)</label>
                  <input type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })} className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Progress (0–100)</label>
                  <input type="number" min={0} max={100} value={form.progress} onChange={(e) => setForm({ ...form, progress: Math.min(100, Math.max(0, Number(e.target.value))) })} className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors" />
                </div>
                <div className="sm:col-span-2">
                  <ImageUploadField
                    label="Project Featured Image"
                    value={form.img}
                    onChange={(url) => setForm({ ...form, img: url })}
                    folder="projects"
                    helpText="Upload a featured project banner image or photo"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none resize-none" placeholder="Project description..." />
                </div>

                {/* Program & Initiative Interconnection */}
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
                        value={form.programSlug || "forest-restoration"}
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
                        list="initiative-options"
                        value={form.initiativeTitle || ""}
                        onChange={(e) => setForm({ ...form, initiativeTitle: e.target.value })}
                        placeholder="Select or enter initiative track..."
                        className="w-full px-3 py-2 rounded-xl bg-white border border-emerald-300 text-xs font-medium text-gray-800 focus:outline-none"
                      />
                      <datalist id="initiative-options">
                        {currentProgramInitiatives.map((init) => (
                          <option key={init.title} value={init.title} />
                        ))}
                      </datalist>
                    </div>
                  </div>
                </div>

                {/* Impact Dashboard Insights (Numeric Inputs for aggregation) */}
                <div className="sm:col-span-2 p-4 bg-[#F8FAFC] border border-slate-200 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Impact Dashboard Insights (Live Aggregation Numbers)
                    </label>
                    <span className="text-[10px] font-medium text-slate-500">Auto-sums into final Impact Dashboard</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Trees Planted</label>
                      <input
                        type="number"
                        min={0}
                        value={form.impactTrees || 0}
                        onChange={(e) => setForm({ ...form, impactTrees: Number(e.target.value) })}
                        placeholder="e.g. 350000"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-[#0B5D3F] focus:outline-none focus:border-[#4CAF50]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">CO₂ Reduced (MT)</label>
                      <input
                        type="number"
                        min={0}
                        value={form.impactCO2 || 0}
                        onChange={(e) => setForm({ ...form, impactCO2: Number(e.target.value) })}
                        placeholder="e.g. 21875"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-[#173B63] focus:outline-none focus:border-[#4CAF50]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Communities</label>
                      <input
                        type="number"
                        min={0}
                        value={form.impactCommunities || 0}
                        onChange={(e) => setForm({ ...form, impactCommunities: Number(e.target.value) })}
                        placeholder="e.g. 48"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-emerald-700 focus:outline-none focus:border-[#4CAF50]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Beneficiaries</label>
                      <input
                        type="number"
                        min={0}
                        value={form.impactBeneficiaries || 0}
                        onChange={(e) => setForm({ ...form, impactBeneficiaries: Number(e.target.value) })}
                        placeholder="e.g. 12000"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#4CAF50]"
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Project Tagline</label>
                  <input
                    type="text"
                    value={form.tagline || ""}
                    onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                    placeholder="Short inspiring tagline e.g. Restoring the lungs of the planet..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Target SDGs (Comma-separated)</label>
                  <input
                    type="text"
                    value={form.sdgs || ""}
                    onChange={(e) => setForm({ ...form, sdgs: e.target.value })}
                    placeholder="e.g. SDG 13, SDG 15, SDG 1, SDG 8"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">The Ecological Challenge</label>
                  <textarea
                    value={form.challenge || ""}
                    onChange={(e) => setForm({ ...form, challenge: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none resize-none"
                    placeholder="Details about the environmental challenge this project addresses..."
                  />
                </div>

                {/* 3 Strategic Approach Pillars */}
                <div className="sm:col-span-2 pt-2 border-t border-gray-100">
                  <label className="text-xs font-bold text-gray-800 block mb-2">Project Approach (3 Strategic Pillars)</label>
                  <div className="space-y-3">
                    {[0, 1, 2].map((idx) => {
                      const appItem = (form.approach && form.approach[idx]) || { title: "", desc: "" };
                      return (
                        <div key={idx} className="p-3 bg-[#F6FBF8] rounded-xl border border-gray-200/80">
                          <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1.5">Pillar #{idx + 1}</span>
                          <div className="grid sm:grid-cols-3 gap-2">
                            <div>
                              <input
                                type="text"
                                value={appItem.title || ""}
                                onChange={(e) => handleApproachChange(idx, "title", e.target.value)}
                                placeholder={`Pillar ${idx + 1} Title`}
                                className="w-full px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-bold text-gray-800 focus:outline-none"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <input
                                type="text"
                                value={appItem.desc || ""}
                                onChange={(e) => handleApproachChange(idx, "desc", e.target.value)}
                                placeholder={`Description of Pillar ${idx + 1}...`}
                                className="w-full px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs text-gray-700 focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={handleSubmit} className="flex-1 bg-[#0B5D3F] text-white py-3 rounded-xl font-semibold hover:bg-[#0a5237] transition-all">
                  {editId ? "Save Changes" : "Create Project"}
                </button>
                <button onClick={() => setShowForm(false)} className="px-6 py-3 rounded-xl text-gray-500 hover:bg-gray-100 font-semibold">Cancel</button>
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
              <h4 className="font-black text-gray-900 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Delete Project?</h4>
              <p className="text-sm text-gray-500 mb-1">This will permanently delete:</p>
              <p className="text-sm font-bold text-gray-800 mb-6">"{projectToDelete?.name}"</p>
              <div className="flex gap-3">
                <button onClick={doDelete} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-all">Yes, Delete</button>
                <button onClick={() => setDeleteConfirmId(null)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["All", "Active", "Planning", "Completed", "On Hold"] as const).map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${filterStatus === s ? "bg-[#0B5D3F] text-white" : "bg-white border border-gray-200 text-gray-500 hover:bg-[#0B5D3F]/10"}`}>{s}</button>
          ))}
        </div>
      </div>

      {/* Projects List */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {filtered.map((p) => {
          const sc = statusConfig[p.status];
          return (
            <motion.div key={p.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-5 px-6 py-5 border-b border-gray-50 last:border-0 hover:bg-[#F6FBF8]/50 transition-colors">
              <div className="w-12 h-12 bg-[#0B5D3F]/10 rounded-xl flex items-center justify-center shrink-0">
                <TreePine size={20} className="text-[#0B5D3F]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-bold text-gray-800 truncate">{p.name}</span>
                  <span className="text-xs font-bold text-white px-2 py-0.5 rounded-full shrink-0" style={{ backgroundColor: sc.bg }}>{p.status}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                  <span className="flex items-center gap-1"><MapPin size={11} />{p.country}, {p.region}</span>
                  <span>{p.category}</span>
                  <span>Lead: {p.lead}</span>
                  <span>Budget: ${p.budget.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${p.progress}%`, backgroundColor: sc.color }} />
                  </div>
                  <span className="text-xs font-semibold text-gray-500">{p.progress}%</span>
                </div>
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
            <TreePine size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No projects match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
