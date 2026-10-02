import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  TreePine, Plus, Search, MapPin, Globe2, Users, TrendingUp,
  Edit3, Trash2, X, AlertTriangle, Download, CheckCircle2,
  Clock, PauseCircle, Filter, Calendar, Image as ImageIcon
} from "lucide-react";
import { ImageUploadField } from "../../../components/ui/ImageUploadField";

type ProjectStatus = "Active" | "Planning" | "Completed" | "On Hold";

export interface ProjectApproach {
  title: string;
  desc: string;
}

export interface ProjectTimelineItem {
  year: string;
  event: string;
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
  // Extended fields for Project Details & Interconnections:
  year?: number;
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
  partners?: string[];
  galleryImgs?: string[];
  timeline?: ProjectTimelineItem[];
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
      year: 2022,
      tagline: "Restoring the lungs of the planet, one native tree at a time.",
      description: "Large-scale community reforestation covering 50,000 hectares in the Brazilian Amazon in partnership with indigenous guardians.",
      challenge: "Over 17% of the Brazilian Amazon has been cleared in the past five decades, causing biodiversity loss and releasing gigatons of stored carbon.",
      lead: "Carlos Rodriguez", startDate: "Jan 1, 2026", img: "/meeting time.jpeg", theme: "SDG 15",
      impact: "350K trees planted", volunteers: 1200, color: "#0B5D3F", sdgs: "SDG 13, SDG 15, SDG 1, SDG 8",
      impactTrees: 350000, impactCO2: 21875, impactCommunities: 48, impactBeneficiaries: 12000,
      partners: ["WWF Brazil", "Amazon Conservation Association", "Brazilian Ministry of Environment"],
      galleryImgs: [
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1426604966848-d7adac402bff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
      ],
      timeline: [
        { year: "2022", event: "Project launch, community consultations, baseline surveys" },
        { year: "2023", event: "First 120,000 trees planted across 3 sites; community nurseries established" },
        { year: "2024", event: "Expanded to 8 sites; 350,000 trees planted; satellite monitoring launched" },
        { year: "2025", event: "Target: 500,000 trees; agroforestry pilot in 12 villages" },
        { year: "2027", event: "Final target: 1 million trees across 50,000 ha" }
      ],
      approach: [
        { title: "Community-Led Planting", desc: "Indigenous groups lead planting and nursery operations, ensuring long-term stewardship." },
        { title: "Native Species Diversity", desc: "Over 200 native species planted per hectare to maximize resilience." },
        { title: "Satellite & Drone Monitoring", desc: "Real-time monitoring ensuring sapling survival rates above 88%." }
      ]
    },
    {
      id: 2, name: "Sundarbans Mangrove Restore", country: "Bangladesh", region: "South Asia", status: "Active", budget: 180000, progress: 85,
      category: "Coastal Ecosystems", programSlug: "ocean-action", initiativeTitle: "Mangrove Shield",
      year: 2021,
      tagline: "Protecting South Asia's coastal shield from storm surges and sea-level rise.",
      description: "Mangrove restoration and biodiversity protection in the Sundarbans delta to protect 4 million coastal residents.",
      challenge: "Rising sea levels and intense cyclones like Amphan and Remal have damaged 25% of coastal mangrove buffer zones.",
      lead: "Rizwan Ahmed", startDate: "Mar 1, 2025", img: "/represent bangladesh.jpeg", theme: "SDG 14",
      impact: "120 km² restored", volunteers: 800, color: "#4CAF50", sdgs: "SDG 13, SDG 14, SDG 15",
      impactTrees: 280000, impactCO2: 17500, impactCommunities: 65, impactBeneficiaries: 4000000,
      partners: ["Bangladesh Forest Department", "WWF India", "IUCN Asia"],
      galleryImgs: [
        "https://images.unsplash.com/photo-1484291470158-b8f8d608850d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1533130061792-64b345e4a833?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1440342359743-84fcb8c21f21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
      ],
      timeline: [
        { year: "2021", event: "Project launch following Cyclone Yaas; emergency mangrove assessment" },
        { year: "2022", event: "50 km² of priority zones identified; 350 forest guards trained" },
        { year: "2023", event: "80 km² restored; blue carbon methodology validated" },
        { year: "2024", event: "120 km² milestone reached; VCS certification process begun" },
        { year: "2026", event: "Target: 200 km² restored; first carbon credits issued" }
      ],
      approach: [
        { title: "Tidal Hydrology Restoration", desc: "Restoring natural tidal channels for natural mangrove seed dispersal." },
        { title: "Community Forest Guards", desc: "350 trained local guards protecting restored reserves." },
        { title: "Blue Carbon Certification", desc: "Establishing certified carbon baselines for sustainable local revenue." }
      ]
    },
    {
      id: 3, name: "Solar Villages Initiative", country: "Kenya", region: "East Africa", status: "Active", budget: 320000, progress: 45,
      category: "Renewable Energy", programSlug: "clean-energy", initiativeTitle: "Solar Mini-Grids",
      year: 2023,
      tagline: "Powering remote off-grid clinics, schools, and homes with community clean energy.",
      description: "Bringing solar micro-grids to 200 off-grid villages across sub-Saharan Africa, replacing fossil fuel dependence.",
      challenge: "Over 60% of rural families lack access to electricity, relying on polluting kerosene lamps and diesel generators.",
      lead: "Amara Osei", startDate: "Jun 1, 2026", img: "/Speaking on Climate Adaptation and Resilience in South Asia- CEPCA 2024, Ottawa, Canada.jpeg", theme: "SDG 7",
      impact: "200 villages powered", volunteers: 450, color: "#D6A95A", sdgs: "SDG 7, SDG 13, SDG 3",
      impactTrees: 0, impactCO2: 14500, impactCommunities: 200, impactBeneficiaries: 120000,
      partners: ["GOGLA", "USAID Power Africa", "African Development Bank"],
      galleryImgs: [
        "https://images.unsplash.com/photo-1617369120004-4fc70312c5e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1466611653911-95081537e5b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
      ],
      timeline: [
        { year: "2023", event: "Project launch; site surveys in 200 communities; procurement of equipment" },
        { year: "2024", event: "100 villages electrified; 300 technicians trained; first grid connections" },
        { year: "2025", event: "200 villages completed; 120K households connected; productive use hubs operational" },
        { year: "2026", event: "Impact evaluation; replication funding secured for Phase 2" }
      ],
      approach: [
        { title: "Decentralized Micro-grids", desc: "Solar photovoltaic systems with smart metering for reliable power." },
        { title: "Women Technician Training", desc: "Training local women to install, maintain, and manage solar hardware." },
        { title: "Clean Cooking Integration", desc: "Deploying energy-efficient electric cookstoves alongside power access." }
      ]
    },
    {
      id: 4, name: "Pacific Coral Guardian", country: "Fiji", region: "Pacific", status: "Completed", budget: 150000, progress: 100,
      category: "Marine Conservation", programSlug: "ocean-action", initiativeTitle: "Coral Rescue Network",
      year: 2020,
      tagline: "Racing against warming oceans to save the Pacific's living reefs.",
      description: "Coral reef restoration and marine biodiversity monitoring across 45 sensitive Pacific island sites.",
      challenge: "Marine heatwaves and ocean acidification have bleached over 50% of shallow Pacific coral habitats.",
      lead: "Priya Sharma", startDate: "Jan 1, 2024", img: "/canada conference.jpeg", theme: "SDG 14",
      impact: "45 coral reefs restored", volunteers: 320, color: "#173B63", sdgs: "SDG 14, SDG 13, SDG 17",
      impactTrees: 0, impactCO2: 8200, impactCommunities: 28, impactBeneficiaries: 45000,
      partners: ["Coral Triangle Initiative", "NOAA Pacific", "Pew Charitable Trusts"],
      galleryImgs: [
        "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1534766438357-2b270dbd1b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1518399104032-af17f3a3e008?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
      ],
      timeline: [
        { year: "2020", event: "Project launched; baseline reef surveys completed across 45 sites" },
        { year: "2021", event: "12 coral nurseries established; 320 volunteers trained" },
        { year: "2022", event: "8 MPAs designated; 15,000 coral fragments outplanted" },
        { year: "2023", event: "Project successfully completed; monitoring network handed to local NGOs" }
      ],
      approach: [
        { title: "Heat-Resilient Coral Nurseries", desc: "Growing thermally tolerant coral fragments in deep water nurseries." },
        { title: "Citizen Diver Monitoring", desc: "Training 320 volunteer divers to record reef recovery and bleaching." },
        { title: "Marine Protected Areas", desc: "Securing 8 community-governed marine protected zones." }
      ]
    },
    {
      id: 5, name: "Himalayan Watershed Revival", country: "Nepal", region: "South Asia", status: "Planning", budget: 90000, progress: 12,
      category: "Water Security", programSlug: "climate-adaptation", initiativeTitle: "Community Early Warning Systems",
      year: 2021,
      tagline: "Safeguarding the freshwater sources of 150,000 Himalayan families.",
      description: "Restoring watershed ecosystems to improve freshwater availability and reduce landslide hazards in high-altitude valleys.",
      challenge: "Glacial retreat and degraded catchment forests have dried up 70% of natural spring water sources.",
      lead: "Priya Sharma", startDate: "Sep 1, 2026", img: "https://images.unsplash.com/photo-1656740978556-ae767a923f5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600", theme: "SDG 6",
      impact: "150K families supported", volunteers: 2100, color: "#0B5D3F", sdgs: "SDG 6, SDG 13, SDG 15",
      impactTrees: 120000, impactCO2: 7500, impactCommunities: 72, impactBeneficiaries: 150000,
      partners: ["ICIMOD", "WWF Himalayan Programme", "Asian Development Bank"],
      galleryImgs: [
        "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1575468130798-81bdb8b58ce0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
      ],
      timeline: [
        { year: "2021", event: "Baseline water security assessments in 500 villages across 3 countries" },
        { year: "2022", event: "1,200 water systems constructed; 2M trees planted in priority catchments" },
        { year: "2023", event: "150K families connected; community water committees legally registered" },
        { year: "2025", event: "5M trees milestone; GLOF systems at all 18 risk sites" }
      ],
      approach: [
        { title: "Catchment Tree Planting", desc: "Planting alpine broadleaf trees to retain moisture and stabilize hillsides." },
        { title: "Spring-box Water Harvesting", desc: "Constructing natural filtration and storage tanks for dry seasons." },
        { title: "Glacial Flood Early Warning", desc: "Automated stream gauges alerting downstream villages to sudden surges." }
      ]
    },
    {
      id: 6, name: "Sahel Dryland Greening", country: "Niger", region: "West Africa", status: "On Hold", budget: 60000, progress: 30,
      category: "Agroforestry", programSlug: "forest-restoration", initiativeTitle: "Great Green Wall Support",
      year: 2022,
      tagline: "Farmer-led natural regeneration holding back the Sahara Desert.",
      description: "Farmer-managed natural regeneration to combat desertification and restore arable soil in the Sahel.",
      challenge: "Drought and desertification advance southward at 2 km annually, destroying fertile croplands.",
      lead: "Amara Osei", startDate: "Apr 1, 2025", img: "https://images.unsplash.com/photo-1656740978404-874f95b253b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600", theme: "SDG 15",
      impact: "30K trees protected", volunteers: 200, color: "#D6A95A", sdgs: "SDG 15, SDG 2, SDG 13",
      impactTrees: 30000, impactCO2: 1875, impactCommunities: 22, impactBeneficiaries: 18000,
      partners: ["Great Green Wall Initiative", "UNCCD", "African Union Commission"],
      galleryImgs: [
        "https://images.unsplash.com/photo-1656740978404-874f95b253b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1509391366360-2e959784a276?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1511497584788-876760111969?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
      ],
      timeline: [
        { year: "2022", event: "Community baseline land assessment and village mobilization" },
        { year: "2023", event: "Farmer-managed natural regeneration across 20 villages" },
        { year: "2024", event: "Water catchment contour dikes completed; 30K saplings protected" },
        { year: "2026", event: "Scaling regeneration corridors to 100 neighboring settlements" }
      ],
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
  img: "", theme: "SDG 15", impact: "", volunteers: 0, color: "#0B5D3F",
  year: new Date().getFullYear(),
  tagline: "", challenge: "", sdgs: "SDG 13, SDG 15",
  programSlug: "forest-restoration", initiativeTitle: "Amazon Revival",
  impactTrees: 0, impactCO2: 0, impactCommunities: 0, impactBeneficiaries: 0,
  partners: ["ESN International", "Local Community Network"],
  galleryImgs: [],
  timeline: [
    { year: `${new Date().getFullYear()}`, event: "Project initiation and community baseline assessments" },
    { year: `${new Date().getFullYear() + 1}`, event: "Field rollout and stakeholder mobilization" },
    { year: `${new Date().getFullYear() + 2}`, event: "Continuous verification, monitoring, and scaling" }
  ],
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

  const [newPartnerInput, setNewPartnerInput] = useState("");
  const [newGalleryInput, setNewGalleryInput] = useState("");

  const save = async (list: Project[]) => {
    setProjects(list);
    await saveFirestoreData("esn_projects_admin", list);
  };

  // Auto-migration: ensure existing projects in Firestore/cache have full rich detail fields
  useEffect(() => {
    if (!loading && projects && projects.length > 0) {
      const initial = getInitialProjects();
      let changed = false;
      const migrated = projects.map(p => {
        const match = initial.find(init => init.id === p.id || init.name.toLowerCase() === p.name.toLowerCase());
        const hasGallery = Array.isArray(p.galleryImgs) && p.galleryImgs.length > 0;
        const hasTimeline = Array.isArray(p.timeline) && p.timeline.length > 0;
        const hasPartners = Array.isArray(p.partners) && p.partners.length > 0;
        const hasApproach = Array.isArray(p.approach) && p.approach.length > 0 && p.approach.some(a => a.title?.trim());
        const hasYear = p.year !== undefined;
        const hasVolunteers = p.volunteers !== undefined;

        if (!hasGallery || !hasTimeline || !hasPartners || !hasYear || !hasVolunteers || !hasApproach) {
          changed = true;
          return {
            ...p,
            year: p.year ?? match?.year ?? 2024,
            volunteers: p.volunteers ?? match?.volunteers ?? 500,
            impact: p.impact || match?.impact || "",
            theme: p.theme || match?.theme || "SDG 15",
            approach: hasApproach ? p.approach : (match?.approach || [
              { title: "Community Stewardship", desc: "Local teams and grassroots leadership direct on-the-ground action." },
              { title: "Science-Based Monitoring", desc: "Verifiable metrics tracking survival and carbon outcomes." },
              { title: "Sustainable Livelihoods", desc: "Creating green employment and economic resilience for families." }
            ]),
            partners: hasPartners ? p.partners : (match?.partners || ["ESN International", "Local Community Network"]),
            galleryImgs: hasGallery ? p.galleryImgs : (match?.galleryImgs || (p.img ? [p.img] : [])),
            timeline: hasTimeline ? p.timeline : (match?.timeline || [
              { year: "2024", event: "Project initiation and local community baseline assessments" },
              { year: "2025", event: "Full scale rollout, stakeholder partnerships, and field implementation" },
              { year: "2026", event: "Continuous monitoring, impact verification, and global reporting" }
            ]),
          };
        }
        return p;
      });
      if (changed) {
        save(migrated);
      }
    }
  }, [loading]);

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
      year: p.year ?? 2024,
      volunteers: p.volunteers ?? 0,
      impact: p.impact || "",
      theme: p.theme || "SDG 15",
      tagline: p.tagline || "",
      challenge: p.challenge || "",
      sdgs: p.sdgs || "SDG 13, SDG 15",
      programSlug: p.programSlug || "forest-restoration",
      initiativeTitle: p.initiativeTitle || "",
      impactTrees: p.impactTrees || 0,
      impactCO2: p.impactCO2 || 0,
      impactCommunities: p.impactCommunities || 0,
      impactBeneficiaries: p.impactBeneficiaries || 0,
      partners: Array.isArray(p.partners) ? [...p.partners] : [],
      galleryImgs: Array.isArray(p.galleryImgs) ? [...p.galleryImgs] : (p.img ? [p.img] : []),
      timeline: Array.isArray(p.timeline) ? p.timeline.map(t => ({ ...t })) : [
        { year: "2024", event: "Project initiation and community baseline assessments" },
        { year: "2025", event: "Field rollout and active deployment" },
        { year: "2026", event: "Verification, monitoring, and scaling" }
      ],
      approach: p.approach && p.approach.length > 0 ? p.approach.map(a => ({ ...a })) : [
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
    while (list.length <= index) {
      list.push({ title: "", desc: "" });
    }
    list[index] = { ...list[index], [field]: val };
    setForm({ ...form, approach: list });
  };

  const handleAddApproachPillar = () => {
    const list = [...(form.approach || [])];
    list.push({ title: "", desc: "" });
    setForm({ ...form, approach: list });
  };

  const handleRemoveApproachPillar = (indexToRemove: number) => {
    const list = (form.approach || []).filter((_, idx) => idx !== indexToRemove);
    setForm({ ...form, approach: list });
  };

  const handleAddPartner = () => {
    const trimmed = newPartnerInput.trim();
    if (!trimmed) return;
    const current = form.partners || [];
    if (!current.includes(trimmed)) {
      setForm({ ...form, partners: [...current, trimmed] });
    }
    setNewPartnerInput("");
  };

  const handleRemovePartner = (indexToRemove: number) => {
    setForm({
      ...form,
      partners: (form.partners || []).filter((_, idx) => idx !== indexToRemove)
    });
  };

  const handleAddGalleryImg = (url: string) => {
    const trimmed = url.trim();
    if (!trimmed) return;
    const current = form.galleryImgs || [];
    setForm({ ...form, galleryImgs: [...current, trimmed] });
    setNewGalleryInput("");
  };

  const handleRemoveGalleryImg = (indexToRemove: number) => {
    setForm({
      ...form,
      galleryImgs: (form.galleryImgs || []).filter((_, idx) => idx !== indexToRemove)
    });
  };

  const handleAddTimelineMilestone = () => {
    const current = form.timeline || [];
    const nextYear = current.length > 0 ? String(Number(current[current.length - 1].year || new Date().getFullYear()) + 1) : String(new Date().getFullYear());
    setForm({
      ...form,
      timeline: [...current, { year: nextYear, event: "" }]
    });
  };

  const handleRemoveTimelineMilestone = (indexToRemove: number) => {
    setForm({
      ...form,
      timeline: (form.timeline || []).filter((_, idx) => idx !== indexToRemove)
    });
  };

  const handleTimelineMilestoneChange = (index: number, field: "year" | "event", val: string) => {
    const list = [...(form.timeline || [])];
    list[index] = { ...list[index], [field]: val };
    setForm({ ...form, timeline: list });
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl my-8" onClick={(e) => e.stopPropagation()}>
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
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Year Started (Displays 'Since YYYY')</label>
                  <input type="number" value={form.year || 2024} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} placeholder="e.g. 2022" className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Active Volunteers Count</label>
                  <input type="number" min={0} value={form.volunteers || 0} onChange={(e) => setForm({ ...form, volunteers: Number(e.target.value) })} placeholder="e.g. 1200" className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Theme / SDG Pill (Header & Sidebar)</label>
                  <input type="text" value={form.theme || ""} onChange={(e) => setForm({ ...form, theme: e.target.value })} placeholder="e.g. SDG 15" className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Direct Impact Headline (Stat Bar)</label>
                  <input type="text" value={form.impact || ""} onChange={(e) => setForm({ ...form, impact: e.target.value })} placeholder="e.g. 350K trees planted" className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors" />
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

                {/* Approach: How We Work (Strategic Pillars) */}
                <div className="sm:col-span-2 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                        <CheckCircle2 size={14} className="text-[#0B5D3F]" /> Approach: How We Work (Strategic Pillars)
                      </label>
                      <p className="text-[11px] text-gray-500">Configures the 'Approach: How We Work' section on the public Project Details page</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddApproachPillar}
                      className="text-xs font-bold text-[#0B5D3F] hover:text-[#4CAF50] flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
                    >
                      <Plus size={13} /> Add Pillar
                    </button>
                  </div>
                  <div className="space-y-3">
                    {(form.approach && form.approach.length > 0 ? form.approach : [
                      { title: "Community Stewardship", desc: "Local teams and grassroots leadership direct on-the-ground action." },
                      { title: "Science-Based Monitoring", desc: "Verifiable metrics tracking survival and carbon outcomes." },
                      { title: "Sustainable Livelihoods", desc: "Creating green employment and economic resilience for families." }
                    ]).map((appItem, idx) => (
                      <div key={idx} className="p-3 bg-[#F6FBF8] rounded-xl border border-gray-200/80">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-bold text-[#0B5D3F] uppercase tracking-wider">
                            Pillar #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveApproachPillar(idx)}
                            className="text-gray-400 hover:text-red-600 transition-colors p-1"
                            title="Remove Pillar"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
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
                    ))}
                  </div>
                </div>

                {/* Project Photos Gallery (Displayed in Project Details Gallery) */}
                <div className="sm:col-span-2 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                        <ImageIcon size={14} className="text-[#0B5D3F]" /> Project Photos Gallery
                      </label>
                      <p className="text-[11px] text-gray-500">Photos displayed in the Project Photos 3-grid section on the public Project Details page</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {(form.galleryImgs || []).length} photos
                    </span>
                  </div>

                  {/* Current Gallery Grid Preview */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                    {(form.galleryImgs || []).map((imgUrl, idx) => (
                      <div key={idx} className="relative group rounded-xl overflow-hidden aspect-video border border-gray-200 bg-gray-50">
                        <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImg(idx)}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center opacity-90 hover:opacity-100 hover:scale-110 transition-all shadow"
                          title="Remove photo"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    {(form.galleryImgs || []).length === 0 && (
                      <div className="col-span-2 sm:col-span-3 py-6 text-center text-xs text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        No gallery photos yet. Add URLs or uploads below to show in the Project Photos section.
                      </div>
                    )}
                  </div>

                  {/* Add new photo - URL input + direct upload */}
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newGalleryInput}
                        onChange={(e) => setNewGalleryInput(e.target.value)}
                        placeholder="Paste image URL (e.g. https://images.unsplash.com/... or /meeting time.jpeg)"
                        className="flex-1 px-3 py-2.5 rounded-xl bg-white border-2 border-gray-200 text-xs text-gray-800 focus:outline-none focus:border-[#4CAF50] transition-colors"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (newGalleryInput.trim()) {
                              handleAddGalleryImg(newGalleryInput);
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const urlToAdd = newGalleryInput.trim();
                          if (!urlToAdd) return;
                          const currentGallery = form.galleryImgs || [];
                          setForm((prev: any) => ({ ...prev, galleryImgs: [...currentGallery, urlToAdd] }));
                          setNewGalleryInput("");
                        }}
                        className="px-4 py-2.5 bg-[#0B5D3F] text-white text-xs font-bold rounded-xl hover:bg-[#0a5237] transition-all flex items-center gap-1.5 shrink-0 shadow-sm"
                      >
                        <Plus size={14} /> Add Photo
                      </button>
                    </div>
                    <div className="pt-1">
                      <ImageUploadField
                        label=""
                        value=""
                        onChange={(url) => {
                          if (url) {
                            const currentGallery = form.galleryImgs || [];
                            setForm((prev: any) => ({ ...prev, galleryImgs: [...currentGallery, url] }));
                          }
                        }}
                        folder="projects"
                        helpText="Or upload a photo directly (PNG, JPG, WebP) — it will be added to the gallery above"
                        aspectRatio="video"
                      />
                    </div>
                  </div>
                </div>

                {/* Project Timeline & Milestones (Displayed in Project Details Timeline) */}
                <div className="sm:col-span-2 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                        <Calendar size={14} className="text-[#0B5D3F]" /> Project Timeline & Milestones
                      </label>
                      <p className="text-[11px] text-gray-500">Yearly progression roadmap displayed in the Project Timeline section</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddTimelineMilestone}
                      className="text-xs font-bold text-[#0B5D3F] hover:text-[#4CAF50] flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
                    >
                      <Plus size={13} /> Add Milestone
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {(form.timeline || []).map((t, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2.5 bg-[#F6FBF8] rounded-xl border border-gray-200/80">
                        <input
                          type="text"
                          value={t.year}
                          onChange={(e) => handleTimelineMilestoneChange(idx, "year", e.target.value)}
                          placeholder="Year (e.g. 2024)"
                          className="w-24 px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-bold text-[#0B5D3F] focus:outline-none"
                        />
                        <input
                          type="text"
                          value={t.event}
                          onChange={(e) => handleTimelineMilestoneChange(idx, "event", e.target.value)}
                          placeholder="Milestone description or achievement..."
                          className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs text-gray-700 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveTimelineMilestone(idx)}
                          className="w-8 h-8 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-all shrink-0"
                          title="Remove milestone"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    {(form.timeline || []).length === 0 && (
                      <div className="py-4 text-center text-xs text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        No milestones added. Click 'Add Milestone' to build the project roadmap.
                      </div>
                    )}
                  </div>
                </div>

                {/* Partner Organizations (Displayed in Project Details Sidebar) */}
                <div className="sm:col-span-2 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                        <CheckCircle2 size={14} className="text-[#0B5D3F]" /> Partner Organizations
                      </label>
                      <p className="text-[11px] text-gray-500">Supporting coalition partners and NGOs displayed on the Project Details sidebar</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {(form.partners || []).length} partners
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {(form.partners || []).map((partner, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 text-[#0B5D3F] border border-emerald-200 px-3 py-1.5 rounded-xl shadow-xs"
                      >
                        <CheckCircle2 size={12} className="text-[#4CAF50]" />
                        <span>{partner}</span>
                        <button
                          type="button"
                          onClick={() => handleRemovePartner(idx)}
                          className="text-emerald-700 hover:text-red-600 ml-1 rounded-full p-0.5 hover:bg-emerald-100 transition-colors"
                          title="Remove partner"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    {(form.partners || []).length === 0 && (
                      <span className="text-xs text-gray-400 italic">No partner organizations added yet.</span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newPartnerInput}
                      onChange={(e) => setNewPartnerInput(e.target.value)}
                      placeholder="e.g. WWF Brazil, Rainforest Alliance, UNCCD..."
                      className="flex-1 px-3 py-2 rounded-xl bg-[#F6FBF8] border border-gray-200 text-xs text-gray-800 focus:outline-none focus:border-[#4CAF50]"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddPartner();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddPartner}
                      className="px-4 py-2 bg-[#0B5D3F] text-white text-xs font-bold rounded-xl hover:bg-[#0a5237] transition-all flex items-center gap-1 shrink-0"
                    >
                      <Plus size={14} /> Add Partner
                    </button>
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
