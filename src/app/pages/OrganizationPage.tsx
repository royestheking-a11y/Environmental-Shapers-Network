import { useState } from "react";
import { useLocation, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronRight, Users, Shield, FileText, Award, Star, Download, ExternalLink,
  CheckCircle2, ArrowRight, Globe2, Linkedin, Mail, MapPin, Sparkles, ArrowUpRight, X, TrendingUp
} from "lucide-react";
import { useFirestoreData } from "../../lib/useFirestore";
import { ImageWithFallback } from "../components/ui/ImageWithFallback";
import { initialTeamMembers, AboutTeamMember } from "./admin/sections/AboutPageAdminView";
import { defaultAuditReports, defaultReportsSettings } from "./admin/sections/ReportsAdminView";

function PageHero({ title, sub, image }: { title: string; sub: string; image: string }) {
  return (
    <section className="relative py-28 bg-gradient-to-br from-[#0B5D3F] via-[#0E4733] to-[#173B63] overflow-hidden text-white">
      <div className="absolute inset-0">
        <img src={image} alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B5D3F]/90 to-[#173B63]/90" />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-white mb-4 text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {title}
          </h1>
          <p className="text-white/80 text-base sm:text-lg max-w-xl leading-relaxed">{sub}</p>
        </motion.div>
      </div>
    </section>
  );
}

const boardMembers = [
  { name: "Prof. Anika Stern", role: "Board Chair", org: "University of Copenhagen", country: "Denmark" },
  { name: "H.E. Kofi Mensah", role: "Vice Chair", org: "Former UN Environment Programme", country: "Ghana" },
  { name: "Dr. Laleh Ahmadi", role: "Board Member", org: "Tehran University of Environment", country: "Iran" },
  { name: "Sir Robert Wallace", role: "Board Member", org: "Wallace Conservation Trust", country: "UK" },
  { name: "Dr. Yuki Tanaka", role: "Board Member", org: "IGES Japan", country: "Japan" },
  { name: "Ms. Isabel Cruz", role: "Board Member", org: "Amazon Watch", country: "Brazil" },
];

const initialReports = [
  { year: "2025", title: "Annual Impact Report 2025", pages: 84, size: "12.4 MB", highlights: ["2.1M trees planted", "150K MT CO₂ reduced", "$18M mobilized"] },
  { year: "2024", title: "Annual Impact Report 2024", pages: 76, size: "10.8 MB", highlights: ["1.6M trees planted", "124K MT CO₂ reduced", "$14M mobilized"] },
  { year: "2023", title: "Annual Impact Report 2023", pages: 68, size: "9.2 MB", highlights: ["1.1M trees planted", "98K MT CO₂ reduced", "$11M mobilized"] },
  { year: "2022", title: "Annual Impact Report 2022", pages: 60, size: "8.1 MB", highlights: ["680K trees planted", "72K MT CO₂ reduced", "$8M mobilized"] },
];

const awards = [
  { year: "2026", title: "UNEP Champions of the Earth", org: "United Nations Environment Programme", category: "Science & Innovation", img: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=600" },
  { year: "2025", title: "Global Green Award", org: "International Union for Conservation of Nature", category: "Best Environmental NGO", img: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=600" },
  { year: "2025", title: "Earth Defenders Prize", org: "Goldman Environmental Prize", category: "Environmental Defense", img: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600" },
  { year: "2024", title: "Climate Action Leadership Award", org: "World Resources Institute", category: "Policy & Leadership", img: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&q=80&w=600" },
  { year: "2024", title: "Innovation for the Planet", org: "World Economic Forum", category: "Technology & Innovation", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600" },
  { year: "2023", title: "Ocean Guardian Award", org: "Ocean Conservancy", category: "Marine Conservation", img: "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&q=80&w=600" },
];

function Breadcrumb({ current }: { current: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
      <Link to="/" className="hover:text-[#0B5D3F] transition-colors">Home</Link>
      <ChevronRight size={14} />
      <Link to="/about" className="hover:text-[#0B5D3F] transition-colors">Organization</Link>
      <ChevronRight size={14} />
      <span className="text-gray-700 font-medium">{current}</span>
    </div>
  );
}

function OurTeamPage() {
  const [teamData] = useFirestoreData<AboutTeamMember[]>("esn_about_team", initialTeamMembers);
  const [selectedMember, setSelectedMember] = useState<AboutTeamMember | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "Executive", "Leadership", "Advisors", "Country Leads", "Bangladesh"];

  const filteredMembers = (teamData || initialTeamMembers).filter((m) => {
    if (activeCategory === "All") return true;
    if (activeCategory === "Bangladesh") return m.country?.toLowerCase().includes("bangladesh") || m.category?.toLowerCase().includes("bd");
    if (activeCategory === "Advisors") return m.category?.toLowerCase().includes("advisor");
    if (activeCategory === "Executive") return m.category?.toLowerCase().includes("exec") || m.category?.toLowerCase().includes("founder");
    if (activeCategory === "Leadership") return m.category?.toLowerCase().includes("lead") || !m.category;
    if (activeCategory === "Country Leads") return m.role?.toLowerCase().includes("director") || m.role?.toLowerCase().includes("lead");
    return true;
  });

  return (
    <div className="bg-[#F6FBF8] min-h-screen">
      <PageHero
        title="Our Global Team"
        sub="Meet the scientists, strategists, and grassroots leaders driving environmental action across 80+ nations."
        image="https://images.unsplash.com/photo-1522071820081-009f0129c71c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400"
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <Breadcrumb current="Our Team" />

        {/* Top metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">
          {[["120+", "Staff & Officers"], ["80+", "Country Secretariats"], ["300+", "Scientific Advisors"], ["48K+", "Youth Network"]].map(([v, l]) => (
            <div key={l} className="bg-white rounded-2xl p-5 text-center border border-gray-100 shadow-sm">
              <div className="text-2xl font-black text-[#0B5D3F]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{v}</div>
              <div className="text-xs text-gray-500 mt-1">{l}</div>
            </div>
          ))}
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <div className="text-[#4CAF50] text-xs font-bold uppercase tracking-wider mb-1">ESN Directory</div>
            <h2 className="text-gray-900 font-extrabold text-2xl sm:text-3xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Global Leadership & Staff
            </h2>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap bg-white p-1.5 rounded-2xl border border-gray-200/80 shadow-sm">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? "bg-[#0B5D3F] text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Team Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredMembers.map((member, i) => (
            <motion.div
              key={member.name + i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedMember(member)}
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-[#0B5D3F]/30 hover:shadow-2xl hover:shadow-[#0B5D3F]/10 hover:-translate-y-1.5 transition-all duration-300 group flex flex-col h-full cursor-pointer"
            >
              {/* Profile Showcase Portrait */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-br from-[#0B5D3F]/10 via-[#F6FBF8] to-[#173B63]/10">
                {member.img ? (
                  <ImageWithFallback
                    src={member.img}
                    alt={member.name}
                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out ${
                      member.imagePosition === "center"
                        ? "object-center"
                        : member.imagePosition === "bottom"
                        ? "object-bottom"
                        : "object-top"
                    }`}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0B5D3F]/15 via-[#F6FBF8] to-[#173B63]/10 p-6">
                    <div className="w-24 h-24 rounded-full bg-white shadow-md border border-[#0B5D3F]/20 flex items-center justify-center text-[#0B5D3F] font-black text-3xl tracking-wider">
                      {member.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                    </div>
                    <span className="mt-3 text-xs font-bold text-[#0B5D3F]/70 tracking-widest uppercase">ESN Leader</span>
                  </div>
                )}

                {/* Gradient Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-95 transition-opacity pointer-events-none" />

                {/* Category badge */}
                <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-[#0B5D3F] text-[11px] font-extrabold px-3 py-1.5 rounded-full shadow-md border border-white/40">
                  <Sparkles size={11} className="text-[#4CAF50]" />
                  <span>{member.category || "Leader"}</span>
                </div>

                {/* Country / Location pill */}
                <div className="absolute bottom-3.5 left-3.5 flex items-center gap-1.5 bg-black/55 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/20 shadow-md">
                  <MapPin size={11} className="text-[#4CAF50]" />
                  <span>{member.country || "Global"}</span>
                </div>
              </div>

              {/* Info Block */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-black text-gray-900 text-xl mb-1 group-hover:text-[#0B5D3F] transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {member.name}
                  </h4>
                  <p className="text-[#0B5D3F] text-sm font-bold mb-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF50]" />
                    {member.role}
                  </p>
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3">
                    {member.bio}
                  </p>

                  {/* Tags */}
                  {member.tags && member.tags.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap mb-4">
                      {member.tags.map((tag) => (
                        <span key={tag} className="text-[11px] font-bold bg-[#0B5D3F]/8 text-[#0B5D3F] px-2.5 py-0.5 rounded-full border border-[#0B5D3F]/12">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Link */}
                <div className="pt-3.5 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#0B5D3F] group-hover:text-[#4CAF50] transition-colors mt-auto">
                  <span>View Full Profile Showcase</span>
                  <div className="w-7 h-7 rounded-full bg-[#0B5D3F]/8 flex items-center justify-center group-hover:bg-[#0B5D3F] group-hover:text-white transition-all">
                    <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Join CTA */}
        <div className="mt-16 bg-gradient-to-r from-[#0B5D3F] to-[#173B63] rounded-3xl p-10 text-white text-center shadow-lg">
          <Users size={36} className="text-[#4CAF50] mx-auto mb-4" />
          <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "1.8rem", fontWeight: 800 }} className="mb-3">Join Our Global Network</h3>
          <p className="text-white/70 mb-6 max-w-md mx-auto">We're looking for passionate advocates, scientists, and organizers to lead environmental change.</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/volunteer" className="inline-flex items-center gap-2 bg-[#4CAF50] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#43a047] transition-all">
              Volunteer With Us <ArrowRight size={15} />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-6 py-3 rounded-full font-semibold hover:bg-white/20 transition-all">
              Contact Secretariats
            </Link>
          </div>
        </div>
      </div>

      {/* Profile Showcase Modal */}
      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl max-h-[92vh] flex flex-col relative border border-gray-100"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition-colors"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>

              <div className="overflow-y-auto">
                {/* Header with cover image */}
                <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-gradient-to-br from-[#0B5D3F] via-[#0E4733] to-[#173B63] overflow-hidden">
                  {selectedMember.img ? (
                    <ImageWithFallback
                      src={selectedMember.img}
                      alt={selectedMember.name}
                      className={`w-full h-full object-cover ${
                        selectedMember.imagePosition === "center"
                          ? "object-center"
                          : selectedMember.imagePosition === "bottom"
                          ? "object-bottom"
                          : "object-top"
                      }`}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white">
                      <div className="w-24 h-24 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center text-4xl font-black">
                        {selectedMember.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

                  <div className="absolute bottom-5 left-6 right-6 text-white">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="bg-[#4CAF50] text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                        {selectedMember.category || "Leadership"}
                      </span>
                      <span className="flex items-center gap-1 bg-black/40 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full border border-white/20">
                        <MapPin size={11} className="text-[#4CAF50]" />
                        {selectedMember.country || "Global"}
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {selectedMember.name}
                    </h3>
                    <p className="text-[#A5D6A7] font-semibold text-sm sm:text-base">{selectedMember.role}</p>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 sm:p-8 space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-[#0B5D3F] uppercase tracking-wider mb-2">Biography & Mission</h4>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                      {selectedMember.bio}
                    </p>
                  </div>

                  {/* Focus Tags */}
                  {selectedMember.tags && selectedMember.tags.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">Key Areas of Focus</h4>
                      <div className="flex gap-2 flex-wrap">
                        {selectedMember.tags.map((tag) => (
                          <span key={tag} className="text-xs font-bold bg-[#F6FBF8] text-[#0B5D3F] px-3 py-1.5 rounded-xl border border-[#0B5D3F]/15">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Connect Links */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                      {selectedMember.linkedin && (
                        <a
                          href={selectedMember.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs transition-colors"
                        >
                          <Linkedin size={14} /> LinkedIn
                        </a>
                      )}
                      {selectedMember.email && (
                        <a
                          href={`mailto:${selectedMember.email}`}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold text-xs transition-colors"
                        >
                          <Mail size={14} /> Email
                        </a>
                      )}
                    </div>
                    <Link
                      to="/contact"
                      onClick={() => setSelectedMember(null)}
                      className="inline-flex items-center gap-1.5 bg-[#0B5D3F] text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-[#0a5237] transition-all shadow-sm"
                    >
                      Connect with Leadership <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BoardPage() {
  const [teamData] = useFirestoreData<AboutTeamMember[]>("esn_about_team", initialTeamMembers);
  const principles = ["Independence & Impartiality", "Accountability & Transparency", "Strategic Oversight", "Fiduciary Responsibility", "Stakeholder Representation", "Long-term Sustainability"];

  // Filter advisory council and founders from dynamic team collection
  const advisors = (teamData || initialTeamMembers).filter(
    (m) => m.category === "Advisor" || m.role.toLowerCase().includes("advisor")
  );

  return (
    <div className="bg-[#F6FBF8] min-h-screen">
      <PageHero title="Board & Governance" sub="Our governance structure ensures accountability, transparency, and strategic excellence across every initiative." image="https://images.unsplash.com/photo-1553484771-047a44eee27b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400" />
      <div className="max-w-6xl mx-auto px-6 py-16">
        <Breadcrumb current="Board & Governance" />
        <div className="grid md:grid-cols-2 gap-10 mb-14">
          <div>
            <div className="text-[#4CAF50] text-sm font-bold uppercase tracking-wider mb-3">Governance</div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.5rem, 2.5vw, 2rem)", fontWeight: 800 }} className="text-gray-900 mb-4">How We Govern</h2>
            <p className="text-gray-600 leading-relaxed mb-5">ESN is governed by an independent Board of Directors that provides strategic direction, financial oversight, and accountability for all programs and operations. The Board ensures ESN fulfills its mission and upholds the highest standards of organizational integrity.</p>
            <p className="text-gray-600 leading-relaxed">Board members serve three-year terms and are drawn from leading institutions in science, policy, finance, and civil society to ensure diverse perspectives in governance.</p>
          </div>
          <div className="bg-white rounded-2xl p-7 border border-gray-100">
            <div className="text-sm font-bold text-gray-800 mb-5">Governance Principles</div>
            <div className="grid grid-cols-2 gap-3">
              {principles.map((p) => (
                <div key={p} className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-[#4CAF50] shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Board of Directors */}
        <div className="text-[#4CAF50] text-sm font-bold uppercase tracking-wider mb-2">Leadership</div>
        <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.4rem, 2vw, 1.8rem)", fontWeight: 800 }} className="text-gray-900 mb-8">Board of Directors</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 mb-14">
          {boardMembers.map((b, i) => (
            <motion.div key={b.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#4CAF50]/30 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#0B5D3F]/10 flex items-center justify-center mb-4">
                <Shield size={20} className="text-[#0B5D3F]" />
              </div>
              <div className="font-bold text-gray-900 mb-0.5">{b.name}</div>
              <div className="text-xs text-[#4CAF50] font-semibold mb-2">{b.role}</div>
              <div className="text-xs text-gray-500">{b.org}</div>
              <div className="text-xs text-gray-400 mt-1 flex items-center gap-1"><Globe2 size={10} /> {b.country}</div>
            </motion.div>
          ))}
        </div>

        {/* Advisory Council from Firestore */}
        {advisors.length > 0 && (
          <div className="mb-14">
            <div className="text-[#0B5D3F] text-sm font-bold uppercase tracking-wider mb-2">Advisory Body</div>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "1.5rem", fontWeight: 800 }} className="text-gray-900 mb-6">Scientific & Policy Advisory Council</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
              {advisors.map((adv, i) => (
                <div key={adv.name + i} className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-all flex items-start gap-4">
                  {adv.img ? (
                    <img src={adv.img} alt={adv.name} className="w-14 h-14 rounded-xl object-cover object-top shrink-0 border border-gray-100" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-[#0B5D3F]/10 text-[#0B5D3F] font-black flex items-center justify-center shrink-0">
                      {adv.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-900 text-sm truncate">{adv.name}</div>
                    <div className="text-xs text-[#4CAF50] font-semibold truncate">{adv.role}</div>
                    <div className="text-xs text-gray-400 mt-1 flex items-center gap-1"><MapPin size={10} /> {adv.country || "Global"}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl p-8 border border-gray-100">
          <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }} className="text-gray-900 mb-4">Board Committees</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {["Audit & Finance Committee", "Program & Impact Committee", "Nominations Committee", "Ethics & Compliance Committee"].map((c) => (
              <div key={c} className="bg-[#F6FBF8] rounded-xl p-4 border border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-[#0B5D3F]/10 flex items-center justify-center mb-3">
                  <Shield size={15} className="text-[#0B5D3F]" />
                </div>
                <div className="text-sm font-semibold text-gray-700">{c}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportsPage() {
  const [reportsData] = useFirestoreData<any[]>("esn_reports_admin", defaultAuditReports);
  const [settingsData] = useFirestoreData<any>("esn_reports_settings", defaultReportsSettings);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const settings = settingsData || defaultReportsSettings;
  const reportsList = reportsData && reportsData.length > 0 ? reportsData : defaultAuditReports;

  const handleDownload = (r: any) => {
    if (r.fileUrl) {
      window.open(r.fileUrl, "_blank", "noopener,noreferrer");
      setDownloadNotice(`Opening PDF: ${r.title}`);
    } else {
      setDownloadNotice(`Downloading Certified PDF: ${r.title}`);
    }
    setTimeout(() => setDownloadNotice(null), 3500);
  };

  const handleView = (r: any) => {
    if (r.viewUrl) {
      if (r.viewUrl.startsWith("http")) {
        window.open(r.viewUrl, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = r.viewUrl;
      }
    } else if (r.fileUrl) {
      window.open(r.fileUrl, "_blank", "noopener,noreferrer");
    } else {
      setDownloadNotice(`Viewing: ${r.title}`);
      setTimeout(() => setDownloadNotice(null), 3500);
    }
  };

  return (
    <div className="bg-[#F6FBF8] min-h-screen">
      {downloadNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B5D3F] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20 animate-bounce">
          <CheckCircle2 size={18} className="text-[#4CAF50]" />
          <span className="text-xs font-bold">{downloadNotice}</span>
        </div>
      )}

      <PageHero
        title={settings.heroTitle || "Annual Reports & Publications"}
        sub={settings.heroSub || "Transparent reporting on our environmental impact, finances, and organizational performance."}
        image={settings.heroImage || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400"}
      />
      <div className="max-w-6xl mx-auto px-6 py-16">
        <Breadcrumb current="Annual Reports" />

        {/* 3 Transparency Rating Badges */}
        <div className="grid md:grid-cols-3 gap-5 mb-12">
          {(settings.trustMetrics || defaultReportsSettings.trustMetrics).map((met: any, idx: number) => (
            <div key={idx} className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm">
              <div className="text-3xl font-black text-[#0B5D3F] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {met.value}
              </div>
              <div className="text-sm text-gray-500 font-medium">{met.label}</div>
            </div>
          ))}
        </div>

        <div className="text-[#4CAF50] text-sm font-bold uppercase tracking-wider mb-2">Reports & Audits</div>
        <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.4rem, 2vw, 1.8rem)", fontWeight: 800 }} className="text-gray-900 mb-8">
          Download Our Reports ({reportsList.length})
        </h2>

        <div className="flex flex-col gap-5 mb-16">
          {reportsList.map((r: any, i: number) => (
            <motion.div
              key={r.id || r.title + i}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#4CAF50]/30 hover:shadow-md transition-all flex flex-col sm:flex-row gap-5 items-start sm:items-center"
            >
              <div
                className="w-14 h-14 rounded-2xl bg-[#0B5D3F] flex items-center justify-center text-white font-black text-sm shrink-0"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {r.year}
              </div>
              <div className="flex-1">
                <div className="font-bold text-gray-900 mb-2 text-base">{r.title}</div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {r.highlights?.map((h: string) => (
                    <span key={h} className="text-xs bg-[#4CAF50]/10 text-[#0B5D3F] px-2.5 py-1 rounded-full font-semibold">
                      {h}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-gray-400">
                  {r.pages} pages · {r.size}
                  {r.fileUrl && <span className="ml-2 text-[#0B5D3F] font-bold">· PDF Available</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload(r)}
                  className="flex items-center gap-1.5 bg-[#0B5D3F] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0a5237] transition-all cursor-pointer shadow-sm"
                >
                  <Download size={14} /> Download PDF
                </button>
                <button
                  onClick={() => handleView(r)}
                  className="flex items-center gap-1.5 border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all cursor-pointer"
                >
                  <ExternalLink size={14} /> View Online
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Cross-Link Integration with Impacts & Youth Development & Global Reps */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-[#0B5D3F] to-[#0A3D2A] p-7 rounded-3xl text-white flex flex-col justify-between shadow-lg">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase">
                <TrendingUp size={12} /> Live Metrics
              </div>
              <h3 className="font-bold text-lg mb-2">Impact Dashboard</h3>
              <p className="text-xs text-white/80 leading-relaxed mb-6">
                Explore real-time carbon sequestration, trees planted, and geospatial project verification charts.
              </p>
            </div>
            <Link to="/impact" className="inline-flex items-center gap-2 text-xs font-bold text-[#4CAF50] hover:text-white transition-colors">
              View Impact Dashboard <ArrowRight size={14} />
            </Link>
          </div>

          <div className="bg-gradient-to-br from-[#173B63] to-[#0E2847] p-7 rounded-3xl text-white flex flex-col justify-between shadow-lg">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase">
                <Users size={12} /> Next Generation
              </div>
              <h3 className="font-bold text-lg mb-2">Youth Engagement</h3>
              <p className="text-xs text-white/80 leading-relaxed mb-6">
                See our global youth leadership initiatives, campus chapters, and leadership training programs.
              </p>
            </div>
            <Link to="/programs/youth" className="inline-flex items-center gap-2 text-xs font-bold text-[#D6A95A] hover:text-white transition-colors">
              Explore Youth Programs <ArrowRight size={14} />
            </Link>
          </div>

          <div className="bg-gradient-to-br from-[#0A3D2A] to-[#173B63] p-7 rounded-3xl text-white flex flex-col justify-between shadow-lg">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase">
                <Globe2 size={12} /> Global Network
              </div>
              <h3 className="font-bold text-lg mb-2">Global Representatives</h3>
              <p className="text-xs text-white/80 leading-relaxed mb-6">
                Connect with our authorized Country & Regional Representatives leading local action across 80+ countries.
              </p>
            </div>
            <Link to="/global-representatives" className="inline-flex items-center gap-2 text-xs font-bold text-[#4CAF50] hover:text-white transition-colors">
              Meet Global Representatives <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function AwardsPage() {
  return (
    <div className="bg-[#F6FBF8] min-h-screen">
      <PageHero title="Awards & Recognition" sub="Global recognition for our impact, innovation, and commitment to environmental excellence." image="https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400" />
      <div className="max-w-6xl mx-auto px-6 py-16">
        <Breadcrumb current="Awards & Recognition" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">
          {[["24", "International Awards"], ["12", "Global Certifications"], ["190+", "Countries Recognized In"], ["2019", "Founded"]].map(([v, l]) => (
            <div key={l} className="bg-white rounded-2xl p-5 text-center border border-gray-100">
              <div className="text-2xl font-black text-[#0B5D3F]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{v}</div>
              <div className="text-xs text-gray-500 mt-1">{l}</div>
            </div>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {awards.map((a, i) => (
            <motion.div key={a.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.09 }}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all group">
              <div className="relative h-40 overflow-hidden">
                <img src={a.img} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 bg-[#D6A95A] text-white text-xs font-bold px-2.5 py-1 rounded-full">{a.year}</div>
              </div>
              <div className="p-5">
                <div className="text-xs font-bold text-[#4CAF50] mb-2 uppercase tracking-wider">{a.category}</div>
                <div className="font-bold text-gray-900 mb-1">{a.title}</div>
                <div className="text-xs text-gray-500 flex items-center gap-1"><Award size={11} /> {a.org}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function OrganizationPage() {
  const { pathname } = useLocation();
  if (pathname === "/our-team") return <OurTeamPage />;
  if (pathname === "/board") return <BoardPage />;
  if (pathname === "/reports") return <ReportsPage />;
  if (pathname === "/awards") return <AwardsPage />;
  return <OurTeamPage />;
}
