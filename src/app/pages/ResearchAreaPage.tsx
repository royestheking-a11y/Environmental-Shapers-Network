import { useParams, Link } from "react-router";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { ArrowRight, Leaf, Waves, Sun, Database, Users, Building, ChevronRight, Globe2, BookOpen, Download, FileText } from "lucide-react";

const researchData: Record<string, {
  slug: string;
  label: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  color: string;
  heroImage: string;
  stats: { value: string; label: string }[];
  methodology: { title: string; desc: string }[];
  publications: { title: string; type: string; year: string; url: string }[];
}> = {
  "ecosystem-health": {
    slug: "ecosystem-health",
    label: "Ecosystem Health & Monitoring",
    tagline: "Tracking the Vital Signs of Our Planet",
    description: "Our Ecosystem Health & Monitoring lab conducts long-term ecological tracking across 40+ biomes. By combining satellite imagery, LiDAR, and AI-powered analytics with ground-truthed field data, we map deforestation, track soil degradation, and monitor ecosystem recovery in real-time.",
    icon: Leaf,
    color: "#4CAF50",
    heroImage: "https://images.unsplash.com/photo-1511497584788-876760111969?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1400",
    stats: [
      { value: "40+", label: "Biomes Monitored" },
      { value: "250 TB", label: "Satellite Data Analysed" },
      { value: "1.2M", label: "Data Points Collected" },
      { value: "12", label: "Open Datasets" },
    ],
    methodology: [
      { title: "Remote Sensing", desc: "Using high-resolution satellite imagery to detect minute changes in forest cover and land use." },
      { title: "AI Analytics", desc: "Training machine learning models to automatically classify vegetation types and detect illegal logging." },
      { title: "Ground Truthing", desc: "Deploying field ecologists to verify satellite data and collect granular biodiversity metrics." },
    ],
    publications: [
      { title: "State of Global Forests 2026", type: "Annual Report", year: "2026", url: "#" },
      { title: "AI in Ecological Monitoring", type: "Methodology", year: "2025", url: "#" },
      { title: "Amazon Tipping Point Analysis", type: "Research Paper", year: "2026", url: "#" },
    ],
  },
  "ocean-blue-carbon": {
    slug: "ocean-blue-carbon",
    label: "Ocean & Blue Carbon Science",
    tagline: "Unlocking the Climate Potential of Our Oceans",
    description: "The ocean is the world's largest carbon sink. Our blue carbon science program focuses on quantifying the carbon sequestration potential of mangroves, seagrasses, and salt marshes, while developing robust accounting frameworks that enable these ecosystems to participate in international climate finance.",
    icon: Waves,
    color: "#1565C0",
    heroImage: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1400",
    stats: [
      { value: "85", label: "Coastal Sites Studied" },
      { value: "3.5M MT", label: "Carbon Sequestered (Est)" },
      { value: "4", label: "Verified Methodologies" },
      { value: "18", label: "Partner Universities" },
    ],
    methodology: [
      { title: "Core Sampling", desc: "Extracting sediment cores to measure historical carbon accumulation in coastal soils." },
      { title: "Biomass Estimation", desc: "Using drone photogrammetry and field surveys to calculate above-ground carbon." },
      { title: "Carbon Accounting", desc: "Developing VCS and Gold Standard verified methodologies for blue carbon projects." },
    ],
    publications: [
      { title: "Blue Carbon Finance Gap", type: "Policy Brief", year: "2026", url: "#" },
      { title: "Seagrass Restoration Guide", type: "Technical Manual", year: "2025", url: "#" },
      { title: "Ocean Acidification Impacts", type: "Research Paper", year: "2025", url: "#" },
    ],
  },
  "clean-energy-transition": {
    slug: "clean-energy-transition",
    label: "Clean Energy Transition Research",
    tagline: "Modelling a Just and Equitable Energy Future",
    description: "Transitioning away from fossil fuels requires more than just technology; it requires systemic socioeconomic shifts. We model just energy transition pathways for developing economies, assessing policy gaps, employment impacts, and community-level energy access solutions in the Global South.",
    icon: Sun,
    color: "#E65100",
    heroImage: "https://images.unsplash.com/photo-1509391366360-2e959784a276?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1400",
    stats: [
      { value: "25", label: "National Energy Models" },
      { value: "120K", label: "Households Surveyed" },
      { value: "15", label: "Policy Frameworks" },
      { value: "$2B+", label: "Investment Directed" },
    ],
    methodology: [
      { title: "Energy System Modelling", desc: "Using LEAP and OSeMOSYS to map out optimal national decarbonization pathways." },
      { title: "Socioeconomic Analysis", desc: "Evaluating the impact of the energy transition on jobs, gender equity, and poverty." },
      { title: "Policy Gap Analysis", desc: "Identifying regulatory barriers that prevent the scaling of renewable energy investments." },
    ],
    publications: [
      { title: "Just Transition in Sub-Saharan Africa", type: "Report", year: "2026", url: "#" },
      { title: "Decentralized Energy Economics", type: "Research Paper", year: "2025", url: "#" },
      { title: "Phasing Out Fossil Subsidies", type: "Policy Brief", year: "2026", url: "#" },
    ],
  },
  "climate-data-lab": {
    slug: "climate-data-lab",
    label: "Climate Data & Innovation Lab",
    tagline: "Democratizing Climate Intelligence",
    description: "Data is a powerful weapon in the fight against climate change, but only if it's accessible. Our lab harnesses open data platforms, citizen science, and machine learning to track environmental change in real-time, making climate intelligence universally actionable for policymakers and local communities.",
    icon: Database,
    color: "#607D8B",
    heroImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1400",
    stats: [
      { value: "500K+", label: "Citizen Scientists" },
      { value: "5B+", label: "API Requests Served" },
      { value: "24/7", label: "Real-Time Tracking" },
      { value: "100%", label: "Open Source" },
    ],
    methodology: [
      { title: "Citizen Science", desc: "Crowdsourcing environmental data through mobile applications and community sensors." },
      { title: "Data Integration", desc: "Aggregating fragmented environmental datasets into unified, queryable architectures." },
      { title: "Predictive Modelling", desc: "Using machine learning to forecast environmental hazards like floods and wildfires." },
    ],
    publications: [
      { title: "The Power of Citizen Science", type: "Research Paper", year: "2026", url: "#" },
      { title: "Open Climate Data Standard", type: "Methodology", year: "2025", url: "#" },
      { title: "AI for Early Warning Systems", type: "Technical Report", year: "2026", url: "#" },
    ],
  },
  "social-environmental-justice": {
    slug: "social-environmental-justice",
    label: "Social & Environmental Justice",
    tagline: "Research at the Intersection of Equity and Ecology",
    description: "Environmental degradation does not impact everyone equally. We study the intersections of climate vulnerability, gender inequality, and indigenous rights — generating the empirical evidence needed to drive rights-based environmental governance reforms and ensure climate justice.",
    icon: Users,
    color: "#9C27B0",
    heroImage: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1400",
    stats: [
      { value: "60+", label: "Case Studies" },
      { value: "12", label: "Rights Frameworks" },
      { value: "35", label: "Indigenous Partners" },
      { value: "15,000", label: "Interviews Conducted" },
    ],
    methodology: [
      { title: "Participatory Action Research", desc: "Conducting research *with* communities rather than *on* them, ensuring their voices shape the findings." },
      { title: "Intersectionality Analysis", desc: "Analyzing how climate impacts overlap with race, gender, class, and colonial history." },
      { title: "Legal & Policy Review", desc: "Evaluating national and international laws for their effectiveness in protecting environmental defenders." },
    ],
    publications: [
      { title: "Gender and Climate Vulnerability", type: "Report", year: "2026", url: "#" },
      { title: "Indigenous Land Rights as Conservation", type: "Policy Brief", year: "2025", url: "#" },
      { title: "Protecting Environmental Defenders", type: "Research Paper", year: "2026", url: "#" },
    ],
  },
  "urban-climate-resilience": {
    slug: "urban-climate-resilience",
    label: "Urban Climate Resilience Studies",
    tagline: "Designing the Sustainable Cities of Tomorrow",
    description: "As urbanization accelerates, cities become the frontline of climate impacts. We analyze climate risks in rapidly urbanizing hubs, develop green infrastructure blueprints, and evaluate urban nature-based solutions to build resilience against extreme heat, flooding, and air pollution.",
    icon: Building,
    color: "#0B5D3F",
    heroImage: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1400",
    stats: [
      { value: "50", label: "Cities Analysed" },
      { value: "200+", label: "Urban Heat Maps" },
      { value: "8", label: "Urban Policy Guides" },
      { value: "30M+", label: "Citizens Represented" },
    ],
    methodology: [
      { title: "Thermal Mapping", desc: "Using satellite thermal infrared sensors to identify and map urban heat islands." },
      { title: "Hydrological Modelling", desc: "Simulating urban flood scenarios to identify vulnerable infrastructure and populations." },
      { title: "NbS Evaluation", desc: "Quantifying the cooling and water-retention benefits of urban forests and green roofs." },
    ],
    publications: [
      { title: "Global Urban Heat Index", type: "Data Report", year: "2026", url: "#" },
      { title: "Sponge City Implementation Guide", type: "Technical Manual", year: "2025", url: "#" },
      { title: "Air Quality & Green Corridors", type: "Research Paper", year: "2026", url: "#" },
    ],
  }
};

function StatCard({ value, label, i }: { value: string; label: string; i: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: i * 0.1, duration: 0.5 }}
      className="bg-white rounded-2xl p-6 border border-gray-100 text-center hover:shadow-lg transition-shadow"
    >
      <div className="text-3xl font-black mb-1" style={{ color: "#0B5D3F", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </motion.div>
  );
}

import { useFirestoreData } from "../../lib/useFirestore";

export default function ResearchAreaPage() {
  const { area } = useParams<{ area: string }>();
  const [adminAreas] = useFirestoreData<any[]>("esn_research_admin", []);
  
  const staticData = area ? researchData[area] : null;
  const adminMatch = adminAreas.find((a: any) => a.slug === area || a.id === area);

  const data = adminMatch ? {
    slug: adminMatch.slug || area,
    label: adminMatch.title || staticData?.label || "Research Area",
    tagline: adminMatch.desc || staticData?.tagline || "",
    description: adminMatch.fullDesc || staticData?.description || adminMatch.desc,
    icon: staticData?.icon || Leaf,
    color: adminMatch.color || staticData?.color || "#0B5D3F",
    heroImage: adminMatch.image || staticData?.heroImage || "https://images.unsplash.com/photo-1511497584788-876760111969?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1400",
    stats: staticData?.stats || [
      { value: adminMatch.stats || "40+", label: "Field Projects" },
      { value: "100%", label: "Peer-Reviewed" },
      { value: "18+", label: "Academic Partners" },
      { value: "Open", label: "Open Access Data" },
    ],
    methodology: staticData?.methodology || [
      { title: "Empirical Field Research", desc: "Deploying scientific field instrumentation and environmental sensors across affected bioregions." },
      { title: "AI & Satellite Analytics", desc: "Processing multi-spectral Earth observation data with predictive ecological algorithms." },
      { title: "Policy Translation", desc: "Synthesizing empirical findings into actionable legislative briefs for governments and climate summits." }
    ],
    publications: staticData?.publications || [
      { title: "ESN Global Environmental Assessment 2026", type: "Annual Review", year: "2026", url: "#" },
      { title: "Policy Frameworks for Ecosystem Protection", type: "Policy Brief", year: "2025", url: "#" }
    ]
  } : staticData;

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F6FBF8] pt-24">
        <Globe2 size={64} className="text-gray-200 mb-6" />
        <h2 className="text-2xl font-bold text-gray-500 mb-4">Research Area Not Found</h2>
        <Link to="/" className="text-[#0B5D3F] font-semibold flex items-center gap-2 hover:underline">
          <ChevronRight size={16} /> Back to Home
        </Link>
      </div>
    );
  }

  const Icon = data.icon;

  return (
    <div className="bg-[#F6FBF8]">
      {/* Hero */}
      <section className="relative h-[65vh] min-h-[450px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={data.heroImage} alt={data.label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a0e]/90 via-[#0a1a0e]/50 to-transparent" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 pb-16 w-full">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-5">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={13} />
            <span className="text-white/40">Research</span>
            <ChevronRight size={13} />
            <span className="text-white">{data.label}</span>
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                <Icon size={24} className="text-white" />
              </div>
              <span className="text-white/80 text-sm font-semibold uppercase tracking-wider">Research Area</span>
            </div>
            <h1 className="text-white mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 800 }}>
              {data.label}
            </h1>
            <p className="text-white/80 max-w-2xl" style={{ fontSize: "clamp(1rem, 1.2vw, 1.15rem)" }}>
              {data.tagline}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col gap-16">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {data.stats.map((s, i) => <StatCard key={s.label} {...s} i={i} />)}
        </div>

        {/* Overview */}
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-[#4CAF50] text-sm font-bold uppercase tracking-wider mb-3">The Science</div>
          <h2 className="text-gray-900 mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.5rem, 2.5vw, 2rem)", fontWeight: 800 }}>
            Understanding {data.label}
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg">{data.description}</p>
        </div>

        {/* Methodology */}
        <div>
          <div className="text-center mb-10">
            <h2 className="text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.5rem, 2.5vw, 2rem)", fontWeight: 800 }}>
              Our Methodology
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {data.methodology.map((m, i) => (
              <motion.div
                key={m.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-all text-center"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-[#0B5D3F]/5 flex items-center justify-center mb-5">
                  <Icon size={20} className="text-[#0B5D3F]" />
                </div>
                <div className="font-bold text-gray-900 mb-3 text-lg">{m.title}</div>
                <p className="text-sm text-gray-500 leading-relaxed">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Publications */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="text-[#4CAF50] text-sm font-bold uppercase tracking-wider mb-1">Knowledge Hub</div>
              <h2 className="text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.4rem, 2vw, 1.8rem)", fontWeight: 800 }}>
                Recent Publications
              </h2>
            </div>
            <Link to="/insights" className="flex items-center gap-1.5 text-[#0B5D3F] font-semibold text-sm hover:underline">
              View All <ArrowRight size={15} />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {data.publications.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#4CAF50]/30 hover:shadow-md transition-all flex flex-col h-full group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-[#4CAF50] group-hover:bg-[#4CAF50]/10 transition-colors">
                    <FileText size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0B5D3F] uppercase tracking-wider">{p.type}</div>
                    <div className="text-xs text-gray-400">{p.year}</div>
                  </div>
                </div>
                <div className="font-bold text-gray-900 mb-4 group-hover:text-[#0B5D3F] transition-colors">{p.title}</div>
                <div className="mt-auto">
                  <Link to={p.url} className="inline-flex items-center gap-2 text-sm font-semibold text-[#4CAF50] group-hover:text-[#388E3C] transition-colors">
                    <Download size={14} /> Download PDF
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#0B5D3F] to-[#0A3D2A] rounded-3xl p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div>
            <h3 className="text-2xl font-bold mb-2">Access Full Research Database</h3>
            <p className="text-white/70">Browse our complete library of peer-reviewed papers, policy briefs, and datasets.</p>
          </div>
          <Link to="/insights" className="shrink-0 flex items-center gap-2 bg-white text-[#0B5D3F] px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors">
            <BookOpen size={18} /> Go to Insights
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
