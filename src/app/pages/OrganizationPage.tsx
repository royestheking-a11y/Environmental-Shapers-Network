import { useLocation, Link } from "react-router";
import { motion } from "motion/react";
import { ChevronRight, Users, Shield, FileText, Award, Star, Download, ExternalLink, CheckCircle2, ArrowRight, Globe2, Linkedin, Mail } from "lucide-react";

function PageHero({ title, sub, image }: { title: string; sub: string; image: string }) {
  return (
    <section className="relative h-72 flex items-end overflow-hidden">
      <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a0e]/90 via-[#0a1a0e]/50 to-transparent" />
      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-10 w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-white mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800 }}>{title}</h1>
          <p className="text-white/70 max-w-xl">{sub}</p>
        </motion.div>
      </div>
    </section>
  );
}

const teamMembers = [
  { name: "Dr. Rizwan Ahmed", role: "Executive Director", region: "Global", bio: "20+ years in environmental policy and international development. Former UNEP senior advisor.", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200" },
  { name: "Dr. Priya Nair", role: "Director of Programs", region: "Asia-Pacific", bio: "Led flagship restoration programs across 18 countries. PhD in Environmental Science from IIT.", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200" },
  { name: "Carlos Mendoza", role: "Director of Campaigns", region: "Latin America", bio: "Co-founded 3 environmental NGOs. Spearheaded ESN's Amazon Reforestation initiative.", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200" },
  { name: "Amara Osei-Bonsu", role: "Director of Partnerships", region: "Africa", bio: "Built ESN's corporate partnership program from 12 to 80+ global partners.", img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200" },
  { name: "Dr. Sarah Chen", role: "Head of Research", region: "Global", bio: "Published 45+ peer-reviewed papers on climate resilience and nature-based solutions.", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200" },
  { name: "Fatima Al-Hassan", role: "Director of Finance", region: "MENA", bio: "CFA with 15 years experience in development finance and climate fund management.", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200" },
  { name: "James Whitfield", role: "Head of Communications", region: "Europe", bio: "Former BBC journalist turned environmental communicator with global media reach.", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200" },
  { name: "Mei Lin Zhang", role: "Youth Programs Director", region: "East Asia", bio: "Founded the ESN YEL Fellowship. Youth climate negotiator at COP26, 27, 28.", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200" },
];

const boardMembers = [
  { name: "Prof. Anika Stern", role: "Board Chair", org: "University of Copenhagen", country: "Denmark" },
  { name: "H.E. Kofi Mensah", role: "Vice Chair", org: "Former UN Environment Programme", country: "Ghana" },
  { name: "Dr. Laleh Ahmadi", role: "Board Member", org: "Tehran University of Environment", country: "Iran" },
  { name: "Sir Robert Wallace", role: "Board Member", org: "Wallace Conservation Trust", country: "UK" },
  { name: "Dr. Yuki Tanaka", role: "Board Member", org: "IGES Japan", country: "Japan" },
  { name: "Ms. Isabel Cruz", role: "Board Member", org: "Amazon Watch", country: "Brazil" },
];

const reports = [
  { year: "2025", title: "Annual Impact Report 2025", pages: 84, size: "12.4 MB", highlights: ["2.1M trees planted", "150K MT CO₂ reduced", "$18M mobilized"] },
  { year: "2024", title: "Annual Impact Report 2024", pages: 76, size: "10.8 MB", highlights: ["1.6M trees planted", "124K MT CO₂ reduced", "$14M mobilized"] },
  { year: "2023", title: "Annual Impact Report 2023", pages: 68, size: "9.2 MB", highlights: ["1.1M trees planted", "98K MT CO₂ reduced", "$11M mobilized"] },
  { year: "2022", title: "Annual Impact Report 2022", pages: 60, size: "8.1 MB", highlights: ["680K trees planted", "72K MT CO₂ reduced", "$8M mobilized"] },
];

const awards = [
  { year: "2026", title: "UNEP Champions of the Earth", org: "United Nations Environment Programme", category: "Science & Innovation", img: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
  { year: "2025", title: "Global Green Award", org: "International Union for Conservation of Nature", category: "Best NGO", img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
  { year: "2025", title: "Earth Defenders Prize", org: "Goldman Environmental Prize Foundation", category: "Environmental Defense", img: "https://images.unsplash.com/photo-1552664730-d307ca884978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
  { year: "2024", title: "Climate Action Leadership Award", org: "World Resources Institute", category: "Leadership", img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
  { year: "2024", title: "Innovation for the Planet", org: "World Economic Forum", category: "Technology & Innovation", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
  { year: "2023", title: "Ocean Guardian Award", org: "Ocean Conservancy", category: "Marine Conservation", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
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
  return (
    <div className="bg-[#F6FBF8] min-h-screen">
      <PageHero title="Our Team" sub="Meet the passionate people driving environmental change across the globe." image="https://images.unsplash.com/photo-1522071820081-009f0129c71c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400" />
      <div className="max-w-6xl mx-auto px-6 py-16">
        <Breadcrumb current="Our Team" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
          {[["120+", "Staff & Consultants"], ["80+", "Country Representatives"], ["300+", "Scientific Advisors"], ["48K+", "Volunteer Network"]].map(([v, l]) => (
            <div key={l} className="bg-white rounded-2xl p-5 text-center border border-gray-100">
              <div className="text-2xl font-black text-[#0B5D3F]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{v}</div>
              <div className="text-xs text-gray-500 mt-1">{l}</div>
            </div>
          ))}
        </div>
        <div className="text-[#4CAF50] text-sm font-bold uppercase tracking-wider mb-2">Leadership</div>
        <h2 className="text-gray-900 mb-10" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.5rem, 2.5vw, 2rem)", fontWeight: 800 }}>Global Leadership Team</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {teamMembers.map((m, i) => (
            <motion.div key={m.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all group flex flex-col h-full">
              <div className="p-6 flex-1 flex flex-col">
                <div className="font-bold text-gray-900 mb-1 text-lg">{m.name}</div>
                <div className="text-sm text-[#4CAF50] font-semibold mb-2">{m.role}</div>
                <div className="text-xs text-gray-400 mb-4 flex items-center gap-1"><Globe2 size={11} /> {m.region}</div>
                <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-1">{m.bio}</p>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-50 hover:bg-[#0B5D3F] hover:text-white transition-colors cursor-pointer flex items-center justify-center border border-gray-100 text-gray-400"><Linkedin size={14} /></div>
                  <div className="w-8 h-8 rounded-full bg-gray-50 hover:bg-[#0B5D3F] hover:text-white transition-colors cursor-pointer flex items-center justify-center border border-gray-100 text-gray-400"><Mail size={14} /></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-16 bg-gradient-to-r from-[#0B5D3F] to-[#173B63] rounded-3xl p-10 text-white text-center">
          <Users size={36} className="text-[#4CAF50] mx-auto mb-4" />
          <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "1.8rem", fontWeight: 800 }} className="mb-3">Join Our Team</h3>
          <p className="text-white/70 mb-6 max-w-md mx-auto">We're looking for passionate people to help shape the future of environmental action.</p>
          <Link to="/careers" className="inline-flex items-center gap-2 bg-[#4CAF50] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#43a047] transition-all">View Open Positions <ArrowRight size={15} /></Link>
        </div>
      </div>
    </div>
  );
}

function BoardPage() {
  const principles = ["Independence & Impartiality", "Accountability & Transparency", "Strategic Oversight", "Fiduciary Responsibility", "Stakeholder Representation", "Long-term Sustainability"];
  return (
    <div className="bg-[#F6FBF8] min-h-screen">
      <PageHero title="Board & Governance" sub="Our governance structure ensures accountability, transparency, and strategic excellence." image="https://images.unsplash.com/photo-1553484771-047a44eee27b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400" />
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
        <div className="text-[#4CAF50] text-sm font-bold uppercase tracking-wider mb-2">Leadership</div>
        <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.4rem, 2vw, 1.8rem)", fontWeight: 800 }} className="text-gray-900 mb-8">Board of Directors</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 mb-12">
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
  return (
    <div className="bg-[#F6FBF8] min-h-screen">
      <PageHero title="Annual Reports" sub="Transparent reporting on our environmental impact, finances, and organizational performance." image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400" />
      <div className="max-w-6xl mx-auto px-6 py-16">
        <Breadcrumb current="Annual Reports" />
        <div className="grid md:grid-cols-3 gap-5 mb-12">
          {[["100%", "Independently Audited"], ["4-Star", "Charity Navigator Rating"], ["A+", "Transparency Grade"]].map(([v, l]) => (
            <div key={l} className="bg-white rounded-2xl p-6 text-center border border-gray-100">
              <div className="text-3xl font-black text-[#0B5D3F] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{v}</div>
              <div className="text-sm text-gray-500">{l}</div>
            </div>
          ))}
        </div>
        <div className="text-[#4CAF50] text-sm font-bold uppercase tracking-wider mb-2">Reports</div>
        <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.4rem, 2vw, 1.8rem)", fontWeight: 800 }} className="text-gray-900 mb-8">Download Our Reports</h2>
        <div className="flex flex-col gap-5">
          {reports.map((r, i) => (
            <motion.div key={r.year} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#4CAF50]/30 hover:shadow-md transition-all flex flex-col sm:flex-row gap-5 items-start sm:items-center">
              <div className="w-14 h-14 rounded-2xl bg-[#0B5D3F] flex items-center justify-center text-white font-black text-sm shrink-0" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{r.year}</div>
              <div className="flex-1">
                <div className="font-bold text-gray-900 mb-2">{r.title}</div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {r.highlights.map((h) => <span key={h} className="text-xs bg-[#4CAF50]/10 text-[#0B5D3F] px-2.5 py-1 rounded-full font-medium">{h}</span>)}
                </div>
                <div className="text-xs text-gray-400">{r.pages} pages · {r.size}</div>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 bg-[#0B5D3F] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0a5237] transition-all">
                  <Download size={14} /> Download PDF
                </button>
                <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all">
                  <ExternalLink size={14} /> View Online
                </button>
              </div>
            </motion.div>
          ))}
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
          {[["24", "International Awards"], ["12", "Global Certifications"], ["190+", "Countries Recognized In"], ["2015", "Founded"]].map(([v, l]) => (
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
