import { motion } from "motion/react";
import { Link } from "react-router";
import { Camera, Download, Mail, ArrowRight, Radio, Newspaper, Video, Mic, Calendar, Globe2, FileText } from "lucide-react";

const pressReleases = [
  { id: 1, title: "ESN Reaches 2.4 Million Trees Planted Milestone", date: "Jul 15, 2026", category: "Milestone" },
  { id: 2, title: "ESN Launches $5M Youth Environmental Fellowship Fund", date: "Jun 28, 2026", category: "Announcement" },
  { id: 3, title: "New Partnership with UNEP to Scale Marine Conservation", date: "Jun 10, 2026", category: "Partnership" },
  { id: 4, title: "ESN Recognized at the 2026 Global Environment Awards", date: "May 22, 2026", category: "Award" },
  { id: 5, title: "Annual Report 2025 Released: Record Impact Across 80+ Countries", date: "Apr 30, 2026", category: "Report" },
  { id: 6, title: "ESN Expands Operations to 5 New Countries in Sub-Saharan Africa", date: "Apr 12, 2026", category: "Expansion" },
];

const mediaGallery = [
  { id: 1, type: "photo", title: "Forest Restoration — Bangladesh", image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600", credit: "ESN / Rahul Khan" },
  { id: 2, type: "photo", title: "Youth Summit 2025 — Nairobi", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600", credit: "ESN / Amara Diallo" },
  { id: 3, type: "video", title: "ESN 2025 Impact Film", image: "https://images.unsplash.com/photo-1448375240586-882707db888b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600", credit: "ESN Media" },
  { id: 4, type: "photo", title: "Coral Reef Monitoring — Pacific", image: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600", credit: "ESN / Maria Santos" },
  { id: 5, type: "photo", title: "Solar Installation — Ethiopia", image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600", credit: "ESN / Tekeste Haile" },
  { id: 6, type: "video", title: "Climate Leaders Speak — COP30 Coverage", image: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600", credit: "ESN Media" },
];

const spokespeople = [
  { name: "Dr. Amara Diallo", title: "Executive Director", expertise: "Climate policy, biodiversity, international NGO governance", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
  { name: "Priya Nair", title: "Chief Programs Officer", expertise: "Forest restoration, nature-based solutions, South/Southeast Asia", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
  { name: "Marcus Osei", title: "Head of Communications", expertise: "Media relations, campaign communications, Africa programs", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
];

const catColors: Record<string, string> = { Milestone: "#0B5D3F", Announcement: "#4CAF50", Partnership: "#173B63", Award: "#D6A95A", Report: "#5B8DB8", Expansion: "#00838F" };

export default function MediaCenter() {
  return (
    <div className="bg-[#F6FBF8] min-h-screen">
      {/* Hero */}
      <section className="relative py-24 bg-gradient-to-br from-[#0B5D3F] to-[#173B63] overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, #4CAF50, transparent 50%)" }} />
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white text-sm font-bold px-5 py-2 rounded-full mb-6 uppercase tracking-wider">
              <Camera size={14} />
              Media Center
            </div>
            <h1 className="text-white mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 900 }}>
              ESN in the Media
            </h1>
            <p className="text-white/70 text-lg max-w-xl mb-8">Press releases, media assets, expert spokespeople, and everything journalists need to cover ESN's work.</p>
            <Link to="/contact" className="inline-flex items-center gap-2 bg-[#4CAF50] text-white px-7 py-3.5 rounded-full font-semibold hover:bg-[#43a047] transition-all hover:scale-105">
              Media Inquiries <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Quick Access */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {[
            { icon: Newspaper, label: "Press Releases", count: "24 in 2026" },
            { icon: Camera, label: "Photo Library", count: "1,200+ Photos" },
            { icon: Video, label: "Video Library", count: "80+ Videos" },
            { icon: Radio, label: "Podcast Episodes", count: "36 Episodes" },
          ].map((item, i) => (
            <motion.div key={item.label} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl p-5 text-center border border-gray-100 hover:border-[#4CAF50]/30 hover:shadow-md transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-[#0B5D3F]/10 flex items-center justify-center mx-auto mb-3">
                <item.icon size={18} className="text-[#0B5D3F]" />
              </div>
              <div className="font-bold text-sm text-gray-800">{item.label}</div>
              <div className="text-xs text-gray-400 mt-1">{item.count}</div>
            </motion.div>
          ))}
        </div>

        {/* Press Releases */}
        <div className="text-[#4CAF50] text-sm font-bold uppercase tracking-wider mb-3">Newsroom</div>
        <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.4rem, 2vw, 1.8rem)", fontWeight: 800 }} className="text-gray-900 mb-6">Latest Press Releases</h2>
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden mb-14">
          {pressReleases.map((pr, i) => (
            <motion.div key={pr.id} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              className={`flex items-center gap-4 p-5 cursor-pointer ${i < pressReleases.length - 1 ? "border-b border-gray-50" : ""} hover:bg-[#F6FBF8] transition-colors group`}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: (catColors[pr.category] || "#0B5D3F") + "15" }}>
                <FileText size={16} style={{ color: catColors[pr.category] || "#0B5D3F" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-gray-900">{pr.title}</div>
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                  <span className="font-bold" style={{ color: catColors[pr.category] || "#0B5D3F" }}>{pr.category}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Calendar size={10} /> {pr.date}</span>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="flex items-center gap-1.5 text-xs font-semibold text-[#0B5D3F] bg-[#0B5D3F]/8 px-3 py-1.5 rounded-lg hover:bg-[#0B5D3F]/15 transition-colors">
                  <Download size={12} /> PDF
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Media Gallery */}
        <div className="text-[#4CAF50] text-sm font-bold uppercase tracking-wider mb-3">Photo & Video</div>
        <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.4rem, 2vw, 1.8rem)", fontWeight: 800 }} className="text-gray-900 mb-6">Media Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-14">
          {mediaGallery.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="relative rounded-2xl overflow-hidden aspect-video group cursor-pointer">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <div className="text-white text-xs font-bold mb-0.5">{item.title}</div>
                <div className="text-white/60 text-xs">{item.credit}</div>
              </div>
              {item.type === "video" && (
                <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full p-1.5">
                  <Video size={14} className="text-white" />
                </div>
              )}
              <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-white/30 transition-colors">
                  <Download size={11} /> Use
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Spokespeople */}
        <div className="text-[#4CAF50] text-sm font-bold uppercase tracking-wider mb-3">Experts</div>
        <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.4rem, 2vw, 1.8rem)", fontWeight: 800 }} className="text-gray-900 mb-6">ESN Spokespeople</h2>
        <div className="grid md:grid-cols-3 gap-5 mb-14">
          {spokespeople.map((sp, i) => (
            <motion.div key={sp.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#4CAF50]/30 hover:shadow-lg transition-all">
              <img src={sp.image} alt={sp.name} className="w-16 h-16 rounded-2xl object-cover mb-4" />
              <div className="font-bold text-gray-900 mb-0.5">{sp.name}</div>
              <div className="text-xs text-[#4CAF50] font-semibold mb-3">{sp.title}</div>
              <div className="text-xs text-gray-500 leading-relaxed mb-4">{sp.expertise}</div>
              <Link to="/contact" className="flex items-center gap-2 text-xs font-bold text-[#0B5D3F] hover:text-[#4CAF50] transition-colors">
                <Mail size={12} /> Request Interview
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Brand Kit */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="text-[#4CAF50] text-sm font-bold uppercase tracking-wider mb-2">Brand Resources</div>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "1.4rem" }} className="text-gray-900 mb-3">ESN Brand Kit</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-5">Logos, brand guidelines, color palettes, and approved usage templates for media and partners.</p>
              <button className="flex items-center gap-2 bg-[#0B5D3F] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#0a5237] transition-all">
                <Download size={15} /> Download Brand Kit
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[["#0B5D3F", "Forest Green"], ["#4CAF50", "Leaf Green"], ["#173B63", "Deep Blue"], ["#D6A95A", "Gold"]].map(([hex, name]) => (
                <div key={name} className="rounded-xl overflow-hidden border border-gray-100">
                  <div className="h-12" style={{ backgroundColor: hex }} />
                  <div className="p-2 text-center"><div className="text-xs font-bold text-gray-700">{name}</div><div className="text-xs text-gray-400">{hex}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
