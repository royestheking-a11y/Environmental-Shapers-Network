import { useParams, Link } from "react-router";
import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { 
  ArrowRight, 
  TreePine, 
  Leaf, 
  Wind, 
  Droplets, 
  Sun, 
  Mountain, 
  MapPin, 
  CheckCircle2, 
  Users, 
  Globe2, 
  TrendingUp, 
  ChevronRight, 
  Target, 
  Tent, 
  Wheat, 
  ShieldAlert, 
  Building2, 
  Waves,
  Search,
  Sparkles,
  Thermometer,
  Zap
} from "lucide-react";

export interface ThematicData {
  slug: string;
  label: string;
  tagline: string;
  description: string;
  icon: any;
  color: string;
  heroImage: string;
  tag: string;
  stats: { value: string; label: string }[];
  highlights: string[];
  projects: { name: string; country: string; status: string; progress: number; image: string }[];
  sdgs: number[];
  approach: { title: string; desc: string }[];
}

export const areaData: Record<string, ThematicData> = {
  "sdgs": {
    slug: "sdgs",
    label: "Sustainable Development Goals",
    tagline: "Mainstreaming the 2030 Agenda for Sustainable Development",
    description: "The 17 Sustainable Development Goals (SDGs) form the blueprint for our environmental action. We ensure every intervention contributes measurably to these global targets at local, national, and global levels, leaving no one behind.",
    icon: Target,
    tag: "All SDGs",
    color: "#0B5D3F",
    heroImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1400",
    stats: [
      { value: "17", label: "SDGs Integrated" },
      { value: "140+", label: "Target Alignments" },
      { value: "52", label: "Countries Active" },
      { value: "6.2M+", label: "Lives Positively Impacted" },
    ],
    highlights: [
      "Cross-cutting SDG impact assessment frameworks for all ESN programs",
      "Capacity building for local governments on SDG localization and reporting",
      "Policy advocacy to integrate 2030 agenda targets into national legislation",
      "Multi-stakeholder partnerships (SDG 17) driving cross-sector climate financing",
    ],
    projects: [
      { name: "SDG Localization Accelerator", country: "Global South", status: "Active", progress: 80, image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { name: "Community SDG Scorecards", country: "Africa & Asia", status: "Active", progress: 65, image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { name: "Eco-Cities 2030 Network", country: "Latin America", status: "Active", progress: 75, image: "https://images.unsplash.com/photo-1498429089284-41f8cf3ffd39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
    ],
    sdgs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
    approach: [
      { title: "Holistic Mainstreaming", desc: "We map all interventions across the 169 SDG indicators to guarantee synergistic social, economic, and ecological outcomes." },
      { title: "Leave No One Behind", desc: "Prioritizing the most vulnerable frontline communities in project design, governance, and resource allocation." },
      { title: "Transparent Impact Verification", desc: "Open data platforms and transparent verification protocols tracking verified SDG deliverables in real time." },
    ],
  },
  "climate-change": {
    slug: "climate-change",
    label: "Climate Change",
    tagline: "Addressing Root Causes & Driving Multilateral Climate Action",
    description: "Addressing the root causes and impacts of climate change through mitigation, adaptation, loss and damage frameworks, and multilateral climate diplomacy aligned with the Paris Agreement goals.",
    icon: Thermometer,
    tag: "SDG 13",
    color: "#173B63",
    heroImage: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1400",
    stats: [
      { value: "180K MT", label: "CO₂ Reduced Annually" },
      { value: "95+", label: "Climate Projects" },
      { value: "48", label: "Countries Active" },
      { value: "$24M+", label: "Climate Finance Mobilized" },
    ],
    highlights: [
      "Science-based emissions reduction pathways aligned with 1.5°C Paris targets",
      "Community climate resilience and adaptation initiatives in vulnerable riverine and coastal deltas",
      "High-level climate diplomacy and policy advocacy at UNFCCC COP and regional summits",
      "Loss and Damage implementation roadmaps for frontline Global South communities",
    ],
    projects: [
      { name: "Net Zero Delta Initiative", country: "Bangladesh", status: "Active", progress: 68, image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { name: "Global Climate Resilience Atlas", country: "Global", status: "Active", progress: 85, image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { name: "Urban Cool Canopy Coalition", country: "South Asia", status: "Active", progress: 54, image: "https://images.unsplash.com/photo-1498429089284-41f8cf3ffd39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
    ],
    sdgs: [13, 11, 7, 17],
    approach: [
      { title: "Science-Based Targets", desc: "All projects align with the Paris Agreement 1.5°C pathway using IPCC-validated methodology." },
      { title: "Policy Integration", desc: "We partner with national governments to embed climate action into long-term development planning and statutory legislation." },
      { title: "Community-Led Adaptation", desc: "Empowering grassroots leaders with early warning, resilient infrastructure, and adaptive agricultural techniques." },
    ],
  },
  "displacement-migration": {
    slug: "displacement-migration",
    label: "Displacement & Migration",
    tagline: "Protecting Rights & Durable Solutions for Climate-Displaced Peoples",
    description: "Protecting climate-displaced populations through rights-based policy frameworks, humanitarian response, and long-term durable solutions that address the intersections of climate, conflict, and migration.",
    icon: Tent,
    tag: "SDG 10 · 16",
    color: "#D97706",
    heroImage: "https://images.unsplash.com/photo-1544465544-1b71aee9dfa3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1400",
    stats: [
      { value: "620K+", label: "People Supported" },
      { value: "22", label: "Policy Frameworks" },
      { value: "35+", label: "Vulnerable Corridors" },
      { value: "100%", label: "Rights-Based Compliance" },
    ],
    highlights: [
      "Providing immediate humanitarian relief and legal protection to climate-displaced families",
      "Advocating for international legal status and recognition for climate refugees",
      "Strengthening host community infrastructure to foster integration and social cohesion",
      "Planned participatory relocation frameworks for eroding coastlines and sinking islands",
    ],
    projects: [
      { name: "Coastal Resettlement Network", country: "Pacific & South Asia", status: "Active", progress: 60, image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { name: "Climate Migrant Livelihood Hub", country: "East Africa", status: "Active", progress: 78, image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { name: "Displacement Policy Lab", country: "Global", status: "Active", progress: 90, image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
    ],
    sdgs: [10, 16, 13, 1],
    approach: [
      { title: "Human Rights Centered", desc: "Ensuring human dignity, legal representation, and land tenure security are foundational to all interventions." },
      { title: "Durable Integration", desc: "Focusing on sustainable economic integration, skill certification, and community housing." },
      { title: "Preemptive Adaptation", desc: "Investing heavily in origin community resilience to mitigate forced displacement before disasters occur." },
    ],
  },
  "livelihoods": {
    slug: "livelihoods",
    label: "Livelihoods",
    tagline: "Building Green, Climate-Resilient Livelihoods",
    description: "Building green, climate-resilient livelihoods for smallholder farmers, coastal communities, and forest-dependent peoples through agroecology, sustainable fisheries, and diversified income strategies.",
    icon: Wheat,
    tag: "SDG 1 · 8",
    color: "#059669",
    heroImage: "https://images.unsplash.com/photo-1589923188900-85dae523342b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1400",
    stats: [
      { value: "1.8M", label: "Green Livelihoods Created" },
      { value: "350K+", label: "Farmers & Fishers Trained" },
      { value: "45%", label: "Average Income Increase" },
      { value: "65", label: "Fair-Trade Value Chains" },
    ],
    highlights: [
      "Regenerative agriculture and climate-smart crop diversification training",
      "Community seed banks and organic indigenous farming cooperatives",
      "Micro-finance, carbon revenue sharing, and nature-positive entrepreneurship grants",
      "Sustainable non-timber forest products and coastal artisanal fishing value chains",
    ],
    projects: [
      { name: "Agroecology Academy", country: "Latin America & Asia", status: "Active", progress: 85, image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { name: "Women-Led Green Microfinance", country: "South Asia", status: "Active", progress: 74, image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { name: "Mangrove Honey & Fishery Co-op", country: "Sundarbans, BD", status: "Active", progress: 92, image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
    ],
    sdgs: [1, 8, 2, 12],
    approach: [
      { title: "Economic Independence", desc: "Coupling ecological preservation with thriving household economies to align incentives naturally." },
      { title: "Value-Chain Capture", desc: "Empowering producers to process, certify, and market products directly to ethical global buyers." },
      { title: "Accessible Green Finance", desc: "Deploying revolving micro-funds and guarantee mechanisms tailored specifically to smallholders." },
    ],
  },
  "biodiversity": {
    slug: "biodiversity",
    label: "Biodiversity",
    tagline: "Halting & Reversing Nature Loss by 2030",
    description: "Halting and reversing biodiversity loss through ecosystem protection, species recovery, indigenous community co-management, and implementation of the Kunming-Montreal Global Biodiversity Framework.",
    icon: TreePine,
    tag: "SDG 15",
    color: "#0B5D3F",
    heroImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1400",
    stats: [
      { value: "320+", label: "Key Species Monitored" },
      { value: "1.5M ha", label: "Habitat Protected" },
      { value: "85+", label: "Partner Indigenous Tribes" },
      { value: "30x30", label: "Global Target Alignment" },
    ],
    highlights: [
      "Species recovery plans for critically endangered flora and fauna",
      "Biological corridor connectivity across fragmented forest landscapes",
      "Indigenous-led biodiversity co-management and traditional ecological guardianship",
      "Citizen science biodiversity censuses using AI-assisted camera trap networks",
    ],
    projects: [
      { name: "Bengal Tiger Sanctuary Shield", country: "Bangladesh", status: "Active", progress: 90, image: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { name: "Amazon Rainforest Wildlife Corridor", country: "Brazil & Colombia", status: "Active", progress: 65, image: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { name: "Pollinator Highway Network", country: "Europe", status: "Active", progress: 82, image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
    ],
    sdgs: [15, 14, 13, 1],
    approach: [
      { title: "30x30 Target Implementation", desc: "Supporting nations to designate and enforce protected areas with full indigenous land rights." },
      { title: "Keystone Species Restoration", desc: "Reintroducing top predators and seed dispersers to restore natural trophic cascades." },
      { title: "Community Rangers", desc: "Training and employing local youth as salaried frontline wildlife wardens and researchers." },
    ],
  },
  "green-energy": {
    slug: "green-energy",
    label: "Green Energy",
    tagline: "Accelerating a Just, Universal Clean Energy Transition",
    description: "Accelerating the just energy transition by scaling renewable energy access, phasing out fossil fuel subsidies, and ensuring clean energy benefits reach the most marginalised communities first.",
    icon: Zap,
    tag: "SDG 7",
    color: "#D97706",
    heroImage: "https://images.unsplash.com/photo-1509391366360-2e959784a276?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1400",
    stats: [
      { value: "240K+", label: "Homes Powered Cleanly" },
      { value: "115 MW", label: "Renewable Capacity Installed" },
      { value: "90+", label: "Microgrid Installations" },
      { value: "85K MT", label: "CO₂ Avoided Annually" },
    ],
    highlights: [
      "Decentralized solar microgrids for off-grid rural and island communities",
      "Agricultural waste-to-biogas digesters eliminating household fuel poverty",
      "High-efficiency clean cookstove distribution protecting maternal health",
      "Policy advocacy to redirect fossil fuel subsidies into community clean energy funds",
    ],
    projects: [
      { name: "Solar Delta Villages", country: "Bangladesh", status: "Active", progress: 84, image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { name: "Sahel Clean Cooking Initiative", country: "West Africa", status: "Active", progress: 62, image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { name: "Himalayan Micro-Hydro Grid", country: "Nepal", status: "Active", progress: 75, image: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
    ],
    sdgs: [7, 13, 11, 1],
    approach: [
      { title: "Energy Democracy", desc: "Transferring system ownership and operational governance entirely to community cooperatives." },
      { title: "Context-Engineered Systems", desc: "Deploying the most durable technology for local conditions—solar, wind, biogas, or micro-hydro." },
      { title: "Gender Priority", desc: "Prioritizing women technicians and women-led energy committees to maximize household benefits." },
    ],
  },
  "drr": {
    slug: "drr",
    label: "Disaster Risk Reduction",
    tagline: "Strengthening Community & National Resilience",
    description: "Strengthening community and national resilience through early warning systems, disaster preparedness frameworks, and nature-based DRR solutions aligned with the Sendai Framework 2015–2030.",
    icon: ShieldAlert,
    tag: "SDG 11 · 13",
    color: "#0284C7",
    heroImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1400",
    stats: [
      { value: "1,200+", label: "Early Warning Stations" },
      { value: "6.8M+", label: "Residents Protected" },
      { value: "180+", label: "Community DRR Committees" },
      { value: "42%", label: "Economic Loss Reduction" },
    ],
    highlights: [
      "Last-mile multi-hazard early warning systems using SMS, sirens, and community volunteers",
      "Nature-based coastal storm surge defenses including mangrove bio-shields and oyster reefs",
      "Cyclone and flood shelter infrastructure with integrated clean water and solar power",
      "Youth emergency response brigades trained in rapid search, rescue, and first aid",
    ],
    projects: [
      { name: "Cyclone Bio-Shield Project", country: "Bay of Bengal", status: "Active", progress: 88, image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { name: "Flash Flood Early Warning Network", country: "South Asia", status: "Active", progress: 91, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { name: "Urban Seismic & Flood Preparedness", country: "Latin America", status: "Active", progress: 55, image: "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
    ],
    sdgs: [11, 13, 9, 3],
    approach: [
      { title: "Anticipatory Action", desc: "Triggering automatic pre-allocated emergency funds and evacuation protocols before impact." },
      { title: "Nature-Based Infrastructure", desc: "Using natural ecosystem defenses that strengthen over time rather than brittle concrete sea walls." },
      { title: "Inclusive Preparedness", desc: "Ensuring disaster protocols fully accommodate the elderly, persons with disabilities, and children." },
    ],
  },
  "urban-resilience": {
    slug: "urban-resilience",
    label: "Urban Resilience",
    tagline: "Transforming Cities into Liveable, Climate-Resilient Hubs",
    description: "Transforming cities into climate-resilient, liveable spaces with green infrastructure, urban forests, low-carbon mobility, and integrated water and waste management aligned with the New Urban Agenda.",
    icon: Building2,
    tag: "SDG 11",
    color: "#0B5D3F",
    heroImage: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1400",
    stats: [
      { value: "58", label: "Partner Cities" },
      { value: "25M+", label: "Urban Residents Reached" },
      { value: "650K+", label: "Urban Trees Planted" },
      { value: "140+", label: "Green Corridors Created" },
    ],
    highlights: [
      "Urban heat island reduction via rooftop gardens, green walls, and urban canopy expansion",
      "Sponge city pilots: Sustainable urban drainage systems (SUDS) and rainwater retention ponds",
      "Zero-waste circular economy hubs for decentralized composting and plastic recycling",
      "Advocating for pedestrian-first, non-motorized transport corridors and clean public transit",
    ],
    projects: [
      { name: "Cool Cities Mega Canopy", country: "South Asia & SE Asia", status: "Active", progress: 78, image: "https://images.unsplash.com/photo-1498429089284-41f8cf3ffd39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { name: "Sponge City Delta Pilot", country: "Dhaka, Bangladesh", status: "Active", progress: 93, image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { name: "Urban Circular Zero-Waste Hubs", country: "Africa & Europe", status: "Active", progress: 60, image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
    ],
    sdgs: [11, 13, 9, 12],
    approach: [
      { title: "Green-Blue Urban Planning", desc: "Integrating natural water channels, bioswales, and urban forests into city masterplans." },
      { title: "Spatial Equity", desc: "Ensuring low-income informal settlements receive first priority for urban greening and drainage investments." },
      { title: "Circular Metabolism", desc: "Transforming urban waste streams into organic fertilizer, construction materials, and renewable energy." },
    ],
  },
  "blue-economy": {
    slug: "blue-economy",
    label: "Blue Economy",
    tagline: "Protecting Ocean Ecosystems & Advancing Blue Carbon",
    description: "Developing sustainable ocean economies that protect marine biodiversity, support coastal livelihoods, advance blue carbon solutions, and ensure equitable access to ocean resources for all.",
    icon: Waves,
    tag: "SDG 14",
    color: "#0284C7",
    heroImage: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1400",
    stats: [
      { value: "1.2M kg", label: "Marine Plastic Recovered" },
      { value: "140+", label: "Marine Protected Sites" },
      { value: "65K ha", label: "Blue Carbon Ecosystems" },
      { value: "32", label: "Coastal Partner Nations" },
    ],
    highlights: [
      "River-to-ocean plastic interceptors and coastal circular recycling networks",
      "Coral reef thermal-resilience cultivation and artificial reef nurseries",
      "Mangrove and seagrass meadow restoration for verified blue carbon credit generation",
      "Support for sustainable artisanal small-scale fishers and combating illegal trawling",
    ],
    projects: [
      { name: "Bay of Bengal Ocean Guardian", country: "Bangladesh & India", status: "Active", progress: 86, image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { name: "Coral Reef Resilience Lab", country: "Pacific Islands", status: "Active", progress: 72, image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { name: "Blue Carbon Mangrove Hub", country: "Southeast Asia", status: "Active", progress: 80, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
    ],
    sdgs: [14, 13, 1, 17],
    approach: [
      { title: "Blue Carbon Acceleration", desc: "Certifying high-integrity carbon credits through mangrove, salt marsh, and seagrass restoration." },
      { title: "Marine Protected Areas (MPAs)", desc: "Enforcing science-backed no-take zones co-managed by traditional fishing communities." },
      { title: "Source-to-Sea Solutions", desc: "Halting inland agricultural runoff and plastic leakage before it reaches delicate estuaries." },
    ],
  }
};

// Aliases for compatibility
areaData["disaster-risk-reduction"] = areaData["drr"];
areaData["forests"] = areaData["biodiversity"];
areaData["nature"] = areaData["biodiversity"];

function StatCard({ value, label, i }: { value: string; label: string; i: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: i * 0.1, duration: 0.5 }}
      className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-lg shadow-gray-200/40 text-center hover:shadow-xl transition-all"
    >
      <div className="text-3xl sm:text-4xl font-black text-[#0B5D3F] mb-1 font-serif">{value}</div>
      <div className="text-xs sm:text-sm text-gray-500 font-medium">{label}</div>
    </motion.div>
  );
}

export default function ThematicAreaPage() {
  const { area } = useParams<{ area?: string }>();
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");

  const allAreas = Object.values(areaData).filter((v, i, a) => a.findIndex(t => t.slug === v.slug) === i);

  // If no area parameter is provided or if it's the directory page
  if (!area || !areaData[area]) {
    const filtered = allAreas.filter(a => {
      const matchSearch = a.label.toLowerCase().includes(search.toLowerCase()) || 
                          a.description.toLowerCase().includes(search.toLowerCase()) ||
                          a.tag.toLowerCase().includes(search.toLowerCase());
      const matchTag = selectedTag === "all" || a.tag.includes(selectedTag);
      return matchSearch && matchTag;
    });

    return (
      <div className="bg-[#F8FCF9] min-h-screen pt-28 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Directory Hero */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#0A3D2A]/10 shadow-sm mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#0A3D2A]" />
              <span className="text-[#0A3D2A] text-xs font-bold uppercase tracking-[0.2em]">
                Strategic Focus Areas
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-serif font-black text-[#0A3D2A] mb-6 leading-tight">
              Themes Driving Systemic Environmental Change
            </h1>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed font-normal">
              Explore our nine core thematic pillars cutting across research, community action, innovation, and global policy.
            </p>

            {/* Search Bar */}
            <div className="mt-8 relative max-w-md mx-auto">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search thematic areas, SDGs, or topics..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-gray-200 focus:outline-none focus:border-[#0A3D2A] text-sm shadow-sm"
              />
            </div>
          </div>

          {/* 9 Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link key={item.slug} to={`/thematic-areas/${item.slug}`} className="block h-full group">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    className="bg-white border border-gray-200/90 rounded-[28px] p-7 sm:p-8 shadow-lg shadow-gray-200/40 group-hover:shadow-2xl group-hover:shadow-[#0A3D2A]/15 group-hover:border-[#0A3D2A]/40 transition-all duration-300 flex flex-col justify-between h-full group-hover:-translate-y-1"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-[#F4F9F5] border border-[#0A3D2A]/10 flex items-center justify-center group-hover:bg-[#0A3D2A] group-hover:scale-105 transition-all duration-300">
                          <Icon className="w-7 h-7 text-[#0A3D2A] group-hover:text-white transition-colors" strokeWidth={1.75} />
                        </div>
                        <span className="text-xs font-bold tracking-wider bg-emerald-50 text-[#0A3D2A] px-3.5 py-1.5 rounded-full border border-emerald-200">
                          {item.tag}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold font-serif text-[#0A3D2A] mb-3 group-hover:text-[#0B5D3F] transition-colors">
                        {item.label}
                      </h2>
                      <p className="text-gray-600 text-sm leading-relaxed mb-6 font-normal">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#0A3D2A]">
                      <span>View Framework & Projects</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const data = areaData[area];
  const Icon = data.icon;

  return (
    <div className="bg-[#F8FCF9] min-h-screen">
      {/* ─── Hero Section ─── */}
      <section className="relative h-[72vh] min-h-[520px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={data.heroImage} alt={data.label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061E14]/95 via-[#061E14]/60 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#061E14]/80 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm mb-6 font-medium">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={13} />
            <Link to="/thematic-areas" className="hover:text-white transition-colors">Thematic Areas</Link>
            <ChevronRight size={13} />
            <span className="text-emerald-400 font-bold">{data.label}</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white">
                <Icon size={24} />
              </div>
              <span className="text-emerald-300 text-xs sm:text-sm font-bold uppercase tracking-widest bg-emerald-950/60 px-3.5 py-1.5 rounded-full border border-emerald-500/30">
                {data.tag}
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black text-white mb-4 leading-[1.15] tracking-tight">
              {data.label}
            </h1>
            <p className="text-white/85 text-base sm:text-xl font-light leading-relaxed max-w-3xl">
              {data.tagline}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Main Content ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex flex-col gap-16 sm:gap-20">
        
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {data.stats.map((s, i) => (
            <StatCard key={s.label} {...s} i={i} />
          ))}
        </div>

        {/* Overview & Highlights Grid */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 text-[#0B5D3F] text-xs font-bold uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Strategic Overview</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-6 leading-tight">
              Our Interventions in {data.label}
            </h2>
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-8 font-normal">
              {data.description}
            </p>

            <div className="pt-6 border-t border-gray-200">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                Target Sustainable Development Goals:
              </div>
              <div className="flex flex-wrap gap-2">
                {data.sdgs.map((n) => (
                  <div 
                    key={n} 
                    className="flex items-center gap-1.5 bg-[#0B5D3F]/10 text-[#0B5D3F] text-xs font-bold px-3.5 py-1.5 rounded-full border border-[#0B5D3F]/20"
                  >
                    <span>SDG {n}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 bg-white rounded-3xl p-7 sm:p-8 border border-gray-200/90 shadow-xl shadow-gray-200/40"
          >
            <h3 className="text-lg font-bold font-serif text-gray-900 mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#0B5D3F]" />
              <span>Core Program Milestones</span>
            </h3>
            <div className="space-y-4">
              {data.highlights.map((h, idx) => (
                <div key={idx} className="flex items-start gap-3.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-[#0B5D3F] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    {idx + 1}
                  </div>
                  <span className="text-sm text-gray-700 leading-relaxed font-medium">{h}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ─── Methodology & Approach ─── */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-[#0B5D3F] text-xs font-bold uppercase tracking-widest mb-2">Methodology</div>
            <h2 className="text-3xl font-serif font-bold text-gray-900">
              Our Research-to-Impact Approach
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {data.approach.map((a, i) => (
              <motion.div
                key={a.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl p-7 sm:p-8 border border-gray-200/90 shadow-lg shadow-gray-200/30 hover:shadow-xl hover:border-[#0B5D3F]/40 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-6 text-[#0B5D3F]">
                  <Icon size={22} />
                </div>
                <h3 className="text-xl font-bold font-serif text-gray-900 mb-3">{a.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-normal">{a.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ─── Active Featured Projects ─── */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="text-[#0B5D3F] text-xs font-bold uppercase tracking-widest mb-1">On the Ground</div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
                Active Projects in {data.label}
              </h2>
            </div>
            <Link 
              to="/projects" 
              className="inline-flex items-center gap-2 text-sm font-bold text-[#0B5D3F] hover:underline"
            >
              <span>View All Global Projects</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {data.projects.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-lg shadow-gray-200/40 hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={p.image} 
                    alt={p.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-[#0B5D3F] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      {p.status}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2 font-medium">
                    <MapPin size={13} className="text-[#0B5D3F]" /> {p.country}
                  </div>
                  <h3 className="text-lg font-bold font-serif text-gray-900 mb-4 line-clamp-1">{p.name}</h3>
                  <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-bold text-[#0B5D3F]">{p.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#0B5D3F] rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${p.progress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ─── High-Conversion CTA Banner ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl p-8 sm:p-14 text-white text-center relative overflow-hidden shadow-2xl"
          style={{
            background: "linear-gradient(135deg, #0A3323 0%, #062318 60%, #03150E 100%)"
          }}
        >
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Icon size={24} className="text-[#52C794]" />
              <span className="text-[#52C794] font-bold text-xs uppercase tracking-widest">{data.label}</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-serif font-black text-white mb-4 leading-tight">
              Support & Scale Our {data.label} Initiatives
            </h3>
            <p className="text-white/80 text-sm sm:text-base mb-8 leading-relaxed font-light">
              Partner with Environmental Shapers Network to fund breakthrough pilots, deploy technology, or co-design policy frameworks.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                to="/donate" 
                className="inline-flex items-center gap-2 bg-[#52C794] text-[#0A261B] px-8 py-4 rounded-full font-bold text-sm hover:bg-[#66e2ad] shadow-lg shadow-[#52C794]/30 hover:scale-105 transition-all"
              >
                <Users size={16} /> Donate to This Theme
              </Link>
              <Link 
                to="/contact" 
                className="inline-flex items-center gap-2 bg-white/15 border border-white/30 text-white px-8 py-4 rounded-full font-semibold text-sm hover:bg-white/25 transition-all"
              >
                <span>Partner with Us</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
