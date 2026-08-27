import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";
import {
  Camera, Download, Mail, ArrowRight, Radio, Newspaper, Video, Mic,
  Calendar, Globe2, FileText, X, ExternalLink, Filter, Sparkles, MapPin, Eye
} from "lucide-react";
import { useFirestoreData } from "../../lib/useFirestore";
import { MediaItem } from "./admin/sections/MediaLibraryView";

const pressReleases = [
  { id: 1, title: "ESN Reaches 2.4 Million Trees Planted Milestone", date: "Jul 15, 2026", category: "Milestone", desc: "Global network completes major restoration benchmark across 12 countries in the Global South." },
  { id: 2, title: "ESN Launches $5M Youth Environmental Fellowship Fund", date: "Jun 28, 2026", category: "Announcement", desc: "Empowering 500 next-generation climate leaders with seed grants and scientific mentorship." },
  { id: 3, title: "New Partnership with UNEP to Scale Marine Conservation", date: "Jun 10, 2026", category: "Partnership", desc: "Collaborative framework signed to protect 20,000 hectares of critical coastal marine habitats." },
  { id: 4, title: "ESN Recognized at the 2026 Global Environment Awards", date: "May 22, 2026", category: "Award", desc: "Honored for outstanding grassroots innovation in community-led climate adaptation." },
  { id: 5, title: "Annual Report 2025 Released: Record Impact Across 80+ Countries", date: "Apr 30, 2026", category: "Report", desc: "Audited data detailing carbon offsets, reforestation metrics, and youth mobilizations." },
  { id: 6, title: "ESN Expands Operations to 5 New Countries in Sub-Saharan Africa", date: "Apr 12, 2026", category: "Expansion", desc: "Establishing national secretariats in Kenya, Ghana, Rwanda, Tanzania, and Uganda." },
];

const mediaGallery = [
  {
    id: 1,
    category: "Summits",
    type: "photo",
    title: "Commonwealth Secretariat at COP27",
    location: "Sharm El-Sheikh, Egypt",
    image: "/Commonwealth Secretariat at COP27.jpeg",
    credit: "ESN International Delegation",
    desc: "ESN delegates presenting grassroots youth climate policy recommendations at the Commonwealth Pavilion during COP27."
  },
  {
    id: 2,
    category: "Summits",
    type: "photo",
    title: "Coastal Communities on the Global Stage",
    location: "CEPCA 2024 · Ottawa, Canada",
    image: "/Representing Bangladesh's Coastal Communities on the Global Stage.jpeg",
    credit: "ESN / CEPCA Media",
    desc: "Representing vulnerable coastal populations and sharing localized disaster adaptation frameworks at the Canadian Environmental Summit."
  },
  {
    id: 3,
    category: "Summits",
    type: "photo",
    title: "Climate Adaptation & Resilience Address",
    location: "Ottawa, Canada",
    image: "/Speaking on Climate Adaptation and Resilience in South Asia- CEPCA 2024, Ottawa, Canada.jpeg",
    credit: "ESN Global Secretariat",
    desc: "Keynote address on scaling community-led flood and cyclone defenses across South Asian river basins."
  },
  {
    id: 4,
    category: "Leadership",
    type: "photo",
    title: "Climate Reality Leadership Corps Training",
    location: "Global Climate Fellowship",
    image: "/Climate Reality Leadership Corps Training | Representing Bangladesh.jpeg",
    credit: "Climate Reality / ESN",
    desc: "Intensive training on international climate negotiations, carbon accounting, and science communication."
  },
  {
    id: 5,
    category: "Field",
    type: "photo",
    title: "Sundarbans Coastal Mangrove Reforestation",
    location: "Khulna, Bangladesh",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    credit: "ESN / Field Operations",
    desc: "Community seed planting and tidal channel clearing with local female forest ranger cooperatives."
  },
  {
    id: 6,
    category: "Youth",
    type: "photo",
    title: "Youth Climate Leadership Summit",
    location: "Nairobi, Kenya",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    credit: "ESN Africa Hub",
    desc: "Over 350 university campus leads strategizing cross-border climate litigation and tree nursery hubs."
  },
  {
    id: 7,
    category: "Field",
    type: "photo",
    title: "Coral Reef Monitoring & Ocean Restoration",
    location: "Coral Triangle, Pacific",
    image: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    credit: "ESN Marine Division",
    desc: "Scientific mapping of heat-resilient coral micro-fragments planted along degraded barrier reefs."
  },
  {
    id: 8,
    category: "Field",
    type: "photo",
    title: "Community Solar Micro-Grid Deployment",
    location: "East Africa",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    credit: "ESN Clean Energy Unit",
    desc: "Providing decentralized solar electricity to rural agro-processing cooperatives and healthcare clinics."
  },
];

const spokespeople = [
  { name: "Dr. Amara Diallo", title: "Executive Director", expertise: "Climate policy, biodiversity, international NGO governance, UN negotiations", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
  { name: "Priya Nair", title: "Chief Programs Officer", expertise: "Forest restoration, nature-based solutions, South/Southeast Asia ecosystems", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
  { name: "Marcus Osei", title: "Head of Global Communications", expertise: "Media relations, investigative environmental reporting, COP delegations", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
];

const catColors: Record<string, string> = { Milestone: "#0B5D3F", Announcement: "#4CAF50", Partnership: "#173B63", Award: "#D6A95A", Report: "#5B8DB8", Expansion: "#00838F" };

export default function MediaCenter() {
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [dbMedia] = useFirestoreData<MediaItem[]>("esn_media", []);

  const categories = ["All", "Summits", "Field", "Youth", "Leadership"];

  const combinedMedia = useMemo(() => {
    const extraImages = (dbMedia || [])
      .filter(m => m.type === "image" && m.url)
      .map(m => ({
        id: 1000 + m.id,
        category: m.tags?.some(t => t.toLowerCase().includes("youth")) ? "Youth" :
                  m.tags?.some(t => t.toLowerCase().includes("summit") || t.toLowerCase().includes("cop")) ? "Summits" :
                  m.tags?.some(t => t.toLowerCase().includes("team") || t.toLowerCase().includes("lead")) ? "Leadership" : "Field",
        type: "photo",
        title: m.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
        location: "Global Operations",
        image: m.url,
        credit: `ESN Media / ${m.uploadedBy || "Staff"}`,
        desc: m.tags?.length ? `Media tags: ${m.tags.join(", ")}` : "Official high-resolution media imagery."
      }));

    return [...extraImages, ...mediaGallery];
  }, [dbMedia]);

  const filteredMedia = activeCategory === "All"
    ? combinedMedia
    : combinedMedia.filter((m) => m.category === activeCategory);

  return (
    <div className="bg-[#F6FBF8] min-h-screen">
      {/* Hero */}
      <section className="relative py-28 bg-gradient-to-br from-[#0B5D3F] via-[#0E4733] to-[#173B63] overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-wider">
              <Camera size={14} className="text-[#4CAF50]" />
              Official Press & Media Center
            </div>
            <h1 className="text-white mb-4 text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Press Imagery & Newsroom
            </h1>
            <p className="text-white/80 text-base sm:text-lg max-w-2xl leading-relaxed mb-8">
              High-resolution press photography, official conference delegations, news releases, and expert spokespeople for international journalists and media partners.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact" className="inline-flex items-center gap-2 bg-[#4CAF50] text-white px-7 py-3.5 rounded-full font-bold text-sm hover:bg-[#43a047] transition-all hover:scale-105 shadow-lg shadow-[#4CAF50]/30">
                Media Inquiries & Interviews <ArrowRight size={15} />
              </Link>
              <a href="#press-releases" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-7 py-3.5 rounded-full font-bold text-sm transition-all">
                View Press Releases <Newspaper size={15} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        {/* Quick Access Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { icon: Camera, label: "Press Photos", count: "1,200+ High-Res Images", color: "text-[#0B5D3F]", bg: "bg-[#0B5D3F]/10" },
            { icon: Newspaper, label: "Press Releases", count: "24 Published 2026", color: "text-[#4CAF50]", bg: "bg-[#4CAF50]/10" },
            { icon: Globe2, label: "COP & Summits", count: "18 Global Delegations", color: "text-[#173B63]", bg: "bg-[#173B63]/10" },
            { icon: Radio, label: "Spokespeople", count: "12 Certified Experts", color: "text-[#D6A95A]", bg: "bg-[#D6A95A]/10" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl p-5 text-center border border-gray-100 shadow-sm hover:shadow-md transition-all"
            >
              <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center mx-auto mb-3`}>
                <item.icon size={22} className={item.color} />
              </div>
              <div className="font-bold text-sm text-gray-900">{item.label}</div>
              <div className="text-xs text-gray-400 mt-1">{item.count}</div>
            </motion.div>
          ))}
        </div>

        {/* SECTION 1: PHOTO & PRESS GALLERY (SHOWN FIRST) */}
        <div className="mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-[#4CAF50] text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles size={13} /> High-Resolution Press Media
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0A3D2A]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Official Photo & Summit Gallery
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Click any image to view in full resolution, read field context, or download for publication.
              </p>
            </div>

            {/* Category Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={15} className="text-gray-400 mr-1 hidden sm:block" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    activeCategory === cat
                      ? "bg-[#0B5D3F] text-white shadow-md shadow-[#0B5D3F]/20"
                      : "bg-white text-gray-600 hover:bg-[#0B5D3F]/10 hover:text-[#0B5D3F] border border-gray-200"
                  }`}
                >
                  {cat === "All" ? "All Photos" : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredMedia.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedImage(item)}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-gray-100 transition-all duration-400 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-[#0B5D3F]">
                    {item.category}
                  </div>

                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center">
                      <Eye size={14} />
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="text-xs text-white/80 font-medium flex items-center gap-1 mb-1">
                      <MapPin size={11} className="text-[#4CAF50]" /> {item.location}
                    </div>
                    <h3 className="font-bold text-sm line-clamp-1 leading-snug" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {item.title}
                    </h3>
                  </div>
                </div>

                <div className="p-4 bg-white border-t border-gray-50 flex items-center justify-between text-xs">
                  <span className="text-gray-400 text-[11px] truncate max-w-[170px]">{item.credit}</span>
                  <span className="text-[#0B5D3F] font-bold inline-flex items-center gap-1 group-hover:underline">
                    View <ArrowRight size={11} />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedImage && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 relative overflow-hidden"
              >
                <div className="relative bg-black h-80 sm:h-96 flex items-center justify-center overflow-hidden">
                  <img
                    src={selectedImage.image}
                    alt={selectedImage.title}
                    className="w-full h-full object-contain"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                    <div>
                      <span className="inline-block bg-[#0B5D3F]/10 text-[#0B5D3F] text-xs font-bold px-3 py-1 rounded-full mb-2">
                        {selectedImage.category}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {selectedImage.title}
                      </h3>
                      <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                        <span className="flex items-center gap-1"><MapPin size={12} className="text-[#4CAF50]" /> {selectedImage.location}</span>
                        <span>·</span>
                        <span>Credit: {selectedImage.credit}</span>
                      </div>
                    </div>

                    <a
                      href={selectedImage.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="inline-flex items-center justify-center gap-2 bg-[#0B5D3F] hover:bg-[#094c34] text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md shrink-0"
                    >
                      <Download size={15} /> Download Full Image
                    </a>
                  </div>

                  <div className="pt-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Context & Caption</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {selectedImage.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* SECTION 2: PRESS RELEASES */}
        <div id="press-releases" className="mb-20 pt-6">
          <div className="text-[#4CAF50] text-sm font-bold uppercase tracking-wider mb-2">Official Communications</div>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.4rem, 2vw, 1.8rem)", fontWeight: 800 }} className="text-gray-900 mb-6">
            Latest Press Releases & Statements
          </h2>
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            {pressReleases.map((pr, i) => (
              <motion.div
                key={pr.id}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 ${i < pressReleases.length - 1 ? "border-b border-gray-50" : ""} hover:bg-[#F6FBF8] transition-colors group`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: (catColors[pr.category] || "#0B5D3F") + "15" }}>
                    <FileText size={18} style={{ color: catColors[pr.category] || "#0B5D3F" }} />
                  </div>
                  <div>
                    <div className="font-bold text-base text-gray-900 group-hover:text-[#0B5D3F] transition-colors">{pr.title}</div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{pr.desc}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-2">
                      <span className="font-bold px-2 py-0.5 rounded text-[11px]" style={{ backgroundColor: (catColors[pr.category] || "#0B5D3F") + "15", color: catColors[pr.category] || "#0B5D3F" }}>
                        {pr.category}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1"><Calendar size={11} /> {pr.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                  <Link
                    to="/contact"
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#0B5D3F] bg-[#0B5D3F]/8 px-4 py-2 rounded-xl hover:bg-[#0B5D3F] hover:text-white transition-all"
                  >
                    <Mail size={12} /> Press Contact
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* SECTION 3: SPOKESPEOPLE */}
        <div className="mb-20">
          <div className="text-[#4CAF50] text-sm font-bold uppercase tracking-wider mb-2">Expert Commentators</div>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.4rem, 2vw, 1.8rem)", fontWeight: 800 }} className="text-gray-900 mb-6">
            ESN Certified Spokespeople
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {spokespeople.map((sp, i) => (
              <motion.div
                key={sp.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl p-6 border border-gray-100 hover:border-[#4CAF50]/30 hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <img src={sp.image} alt={sp.name} className="w-18 h-18 rounded-2xl object-cover mb-4 border-2 border-white shadow-md" />
                  <div className="font-bold text-gray-900 text-lg mb-0.5">{sp.name}</div>
                  <div className="text-xs text-[#4CAF50] font-bold mb-3">{sp.title}</div>
                  <div className="text-xs text-gray-600 leading-relaxed mb-6">{sp.expertise}</div>
                </div>
                <Link
                  to="/contact"
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#F6FBF8] text-[#0B5D3F] text-xs font-bold hover:bg-[#0B5D3F] hover:text-white transition-all border border-[#0B5D3F]/20"
                >
                  <Mail size={13} /> Request Interview
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* SECTION 4: BRAND KIT */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-md">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="text-[#4CAF50] text-xs font-bold uppercase tracking-wider mb-2">Media Assets</div>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "1.6rem" }} className="text-gray-900 mb-3">
                ESN Global Brand Kit
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Download verified high-resolution logo packages (PNG, SVG, White & Color variants), typography guidelines, official color palettes, and press boilerplate.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="/logo.png"
                  download
                  className="inline-flex items-center gap-2 bg-[#0B5D3F] text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#0a5237] transition-all shadow-md"
                >
                  <Download size={14} /> Download Logo Pack
                </a>
                <a
                  href="/logo-white.png"
                  download
                  className="inline-flex items-center gap-2 bg-[#173B63] text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#122e4d] transition-all shadow-md"
                >
                  <Download size={14} /> Download White Logo
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                ["#0B5D3F", "Forest Green", "Primary Brand"],
                ["#4CAF50", "Leaf Green", "Vibrant Accent"],
                ["#173B63", "Deep Ocean", "Secondary Brand"],
                ["#D6A95A", "Solar Gold", "Impact Gold"]
              ].map(([hex, name, label]) => (
                <div key={name} className="rounded-2xl overflow-hidden border border-gray-100 bg-[#F6FBF8] p-3">
                  <div className="h-12 rounded-xl mb-2 shadow-inner" style={{ backgroundColor: hex }} />
                  <div className="text-xs font-bold text-gray-900">{name}</div>
                  <div className="text-[10px] text-gray-400 font-mono">{hex} · {label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
