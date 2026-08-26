import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronRight, Heart, Users, BookOpen, Handshake, Briefcase, ArrowRight,
  CheckCircle2, MapPin, Globe2, Mail, Building2, Clock, Check,
  Leaf, RefreshCw, Calendar, Star, Sprout, BarChart2, Megaphone,
  Monitor, Pen, GraduationCap, Languages, UserCheck, Trophy,
  Send, FileText, Phone, User, Info, AlertCircle, ExternalLink
} from "lucide-react";

import { fetchFirestoreData, saveFirestoreData, useFirestoreData } from "../../lib/useFirestore";

// ─── Shared helpers ────────────────────────────────────────────────────────────

async function saveApplication(type: string, data: object) {
  try {
    const key = `esn_apps_${type}`;
    const existing = await fetchFirestoreData<any[]>(key, []);
    const app = {
      id: Date.now(),
      ...data,
      type,
      status: "Pending",
      submittedAt: new Date().toISOString(),
    };
    await saveFirestoreData(key, [app, ...existing]);
    return app;
  } catch { return null; }
}

function SuccessCard({ title, sub, onReset }: { title: string; sub: string; onReset: () => void }) {
  return (
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl border border-gray-100 shadow-xl p-10 text-center max-w-md mx-auto mt-8">
      <div className="w-20 h-20 bg-[#4CAF50]/15 rounded-full flex items-center justify-center mx-auto mb-5">
        <CheckCircle2 size={40} className="text-[#4CAF50]" />
      </div>
      <h3 className="font-black text-gray-900 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed mb-6">{sub}</p>
      <div className="bg-[#F6FBF8] rounded-2xl p-4 mb-6 text-left">
        {[["Review Time", "3–5 business days"], ["Notification", "Via email"], ["Status", "Pending review"]].map(([l, v]) => (
          <div key={l} className="flex justify-between text-sm py-1.5 border-b border-gray-100 last:border-0">
            <span className="text-gray-400">{l}</span>
            <span className="font-semibold text-gray-800">{v}</span>
          </div>
        ))}
      </div>
      <button onClick={onReset} className="text-[#0B5D3F] text-sm font-semibold hover:underline">Submit Another Application</button>
    </motion.div>
  );
}

function PageHero({ title, sub, image, icon: Icon }: { title: string; sub: string; image: string; icon: React.ElementType }) {
  return (
    <section className="relative h-72 flex items-end overflow-hidden">
      <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a0e]/92 via-[#0a1a0e]/50 to-transparent" />
      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-10 w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#4CAF50]/25 flex items-center justify-center">
              <Icon size={20} className="text-[#4CAF50]" />
            </div>
            <span className="text-[#4CAF50] text-sm font-bold uppercase tracking-wider">Get Involved</span>
          </div>
          <h1 className="text-white mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800 }}>{title}</h1>
          <p className="text-white/70 max-w-xl">{sub}</p>
        </motion.div>
      </div>
    </section>
  );
}

function Breadcrumb({ current }: { current: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
      <Link to="/" className="hover:text-[#0B5D3F] transition-all">Home</Link>
      <ChevronRight size={14} />
      <span className="text-gray-700 font-medium">{current}</span>
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 text-center border border-gray-100 shadow-sm">
      <div className="font-black text-[#0B5D3F]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "1.5rem" }}>{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
}

// ─── Volunteer Page ────────────────────────────────────────────────────────────

function VolunteerPage() {
  const defaultRoles = [
    { id: 1, title: "Field Volunteer", location: "Bangladesh / Global", commitment: "4–8 hrs/week", skills: "Physical fitness, teamwork" },
    { id: 2, title: "Research Assistant", location: "Remote / Global", commitment: "6–10 hrs/week", skills: "Research, data analysis" },
    { id: 3, title: "Social Media Volunteer", location: "Remote", commitment: "4–6 hrs/week", skills: "Content creation, design" },
  ];
  const [roles, setRoles, loadingRoles] = useFirestoreData<any[]>("esn_volunteer_roles", defaultRoles);

  const [selected, setSelected] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", country: "", resumeLink: "", motivation: "", skills: "", availability: "", role: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      saveApplication("volunteer", { ...form, role: selected || form.role });
      setLoading(false);
      setSubmitted(true);
    }, 1600);
  };

  const apply = (roleTitle: string) => {
    setSelected(roleTitle);
    setForm((f) => ({ ...f, role: roleTitle }));
    setShowForm(true);
    setTimeout(() => document.getElementById("vol-form")?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  if (submitted) return (
    <div className="bg-[#F6FBF8] min-h-screen">
      <PageHero title="Volunteer With ESN" sub="Give your time, skills, and passion to protect the planet." image="https://images.unsplash.com/photo-1593113598332-cd288d649433?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400" icon={Heart} />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <SuccessCard title="Application Received!" sub="Thank you for applying to volunteer with ESN. Our volunteer coordinator will review your application and get back to you within 3–5 business days." onReset={() => { setSubmitted(false); setShowForm(false); setForm({ name: "", email: "", phone: "", country: "", resumeLink: "", motivation: "", skills: "", availability: "", role: "" }); }} />
      </div>
    </div>
  );

  return (
    <div className="bg-[#F6FBF8] min-h-screen">
      <PageHero title="Volunteer With ESN" sub="Give your time, skills, and passion to protect the planet — locally and globally." image="https://images.unsplash.com/photo-1593113598332-cd288d649433?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400" icon={Heart} />
      <div className="max-w-6xl mx-auto px-6 py-16">
        <Breadcrumb current="Volunteer" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">
          {[["48K+", "Active Volunteers"], ["190+", "Countries"], ["800+", "Projects Supported"], ["92%", "Volunteer Satisfaction"]].map(([v, l]) => <StatCard key={l} value={v} label={l} />)}
        </div>

        <div className="grid md:grid-cols-2 gap-10 mb-12">
          <div>
            <div className="text-[#4CAF50] text-sm font-bold uppercase tracking-wider mb-2">Why Volunteer</div>
            <h2 className="text-gray-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.4rem, 2vw, 1.8rem)", fontWeight: 800 }}>Make a Real Difference</h2>
            <p className="text-gray-600 leading-relaxed mb-5">ESN volunteers are at the heart of everything we do — from planting trees in Bangladesh to monitoring coral reefs in the Pacific. Your skills and time directly translate into environmental impact.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="text-sm font-bold text-gray-800 mb-4">Volunteer Benefits</div>
            {["Certificate of participation & service hours", "Access to ESN training library (200+ courses)", "Professional network across 80+ countries", "References for academic & career applications", "Invitation to annual ESN Volunteer Summit"].map((b) => (
              <div key={b} className="flex items-start gap-2 mb-3"><CheckCircle2 size={14} className="text-[#4CAF50] shrink-0 mt-0.5" /><span className="text-sm text-gray-600">{b}</span></div>
            ))}
          </div>
        </div>

        <div className="text-[#4CAF50] text-sm font-bold uppercase tracking-wider mb-2">Open Roles</div>
        <h2 className="text-gray-900 mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.4rem, 2vw, 1.8rem)", fontWeight: 800 }}>Current Volunteer Opportunities</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 mb-10">
          {roles.map((r, i) => (
            <motion.div key={r.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className={`bg-white rounded-2xl p-6 border-2 transition-all cursor-pointer ${selected === r.title && showForm ? "border-[#4CAF50] shadow-lg" : "border-gray-100 hover:border-[#4CAF50]/40 hover:shadow-md"}`}>
              <div className="w-11 h-11 bg-[#0B5D3F]/10 rounded-xl flex items-center justify-center mb-3">
                <Heart size={20} className="text-[#0B5D3F]" />
              </div>
              <div className="font-bold text-gray-900 mb-2">{r.title}</div>
              <div className="text-xs text-gray-500 flex items-center gap-1 mb-1"><MapPin size={10} /> {r.location}</div>
              <div className="text-xs text-gray-500 flex items-center gap-1 mb-3"><Clock size={10} /> {r.commitment}</div>
              <div className="text-xs bg-[#0B5D3F]/8 text-[#0B5D3F] px-3 py-1.5 rounded-full inline-block mb-4">{r.skills}</div>
              <button onClick={() => apply(r.title)} className="w-full flex items-center justify-center gap-2 bg-[#0B5D3F] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0a5237] transition-all">
                Apply for this Role <ArrowRight size={13} />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Application Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div id="vol-form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Volunteer Application</h3>
                  {selected && <p className="text-sm text-[#0B5D3F] font-semibold mt-1">Role: {selected}</p>}
                </div>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-700 transition-all text-sm">Cancel</button>
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all" placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                    <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all" placeholder="you@email.com" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all" placeholder="+880 XXXXXXXXXX" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Country *</label>
                    <input required value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all" placeholder="e.g. Bangladesh" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Role Preference *</label>
                  <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all">
                    <option value="">Select a role</option>
                    {roles.map((r) => <option key={r.title} value={r.title}>{r.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Skills & Experience *</label>
                  <textarea required rows={3} value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all resize-none" placeholder="Describe your relevant skills and experience..." />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Resume / CV Drive Link (Google Drive, OneDrive, Dropbox) *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <FileText size={16} />
                    </div>
                    <input
                      required
                      type="url"
                      value={form.resumeLink}
                      onChange={(e) => setForm({ ...form, resumeLink: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all text-sm"
                      placeholder="https://drive.google.com/file/d/... or shareable cloud link"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1.5">
                    <Info size={13} className="text-[#0B5D3F] shrink-0" />
                    Please paste a shareable Google Drive, Dropbox, or OneDrive link. Ensure link permissions are set to <strong className="font-semibold text-gray-700">"Anyone with the link can view"</strong>.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Availability *</label>
                  <select required value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all">
                    <option value="">Select availability</option>
                    <option>1–3 hours/week</option>
                    <option>3–5 hours/week</option>
                    <option>5–10 hours/week</option>
                    <option>10+ hours/week</option>
                    <option>Full-time availability</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Why do you want to volunteer with ESN? *</label>
                  <textarea required rows={4} value={form.motivation} onChange={(e) => setForm({ ...form, motivation: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all resize-none" placeholder="Tell us about your motivation and what you hope to contribute..." />
                </div>
                <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 bg-[#0B5D3F] hover:bg-[#0a5237] disabled:opacity-60 text-white py-4 rounded-xl font-bold transition-all hover:scale-[1.01]">
                  {loading ? <><RefreshCw size={16} className="animate-spin" /> Submitting…</> : <><Send size={16} /> Submit Volunteer Application</>}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {!showForm && (
          <div className="bg-gradient-to-r from-[#0B5D3F] to-[#173B63] rounded-3xl p-10 text-white text-center mt-4">
            <h3 className="text-white mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800 }}>Ready to Volunteer?</h3>
            <p className="text-white/70 mb-8 max-w-md mx-auto">Choose a role above and click "Apply" to get started with your application.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Partnership Page ──────────────────────────────────────────────────────────

function PartnerPage() {
  const types = [
    { icon: Building2, title: "Corporate Partners", desc: "Integrate environmental action into your CSR strategy. We design customized partnerships aligned with your sustainability goals.", examples: "Employee volunteering, offset programs, sponsorships", id: "corporate" },
    { icon: Globe2, title: "Government & Institutional", desc: "We partner with national and local governments to scale environmental programs and co-design policy.", examples: "MoUs, joint programs, policy advisory", id: "government" },
    { icon: BookOpen, title: "Academic & Research", desc: "Joint research, student placements, and knowledge exchange with universities and scientific institutions.", examples: "Research collaboration, fellowships, data sharing", id: "academic" },
    { icon: Heart, title: "Foundation & Philanthropy", desc: "Strategic funding partnerships with foundations to scale proven programs and pilot innovations.", examples: "Project grants, endowments, challenge funds", id: "philanthropy" },
  ];

  const [form, setForm] = useState({ orgName: "", contactName: "", email: "", phone: "", type: "", website: "", description: "", budget: "", timeline: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      saveApplication("partner", form);
      setLoading(false);
      setSubmitted(true);
    }, 1600);
  };

  if (submitted) return (
    <div className="bg-[#F6FBF8] min-h-screen">
      <PageHero title="Partner With ESN" sub="Build a meaningful partnership that drives environmental impact at scale." image="https://images.unsplash.com/photo-1521791136064-7986c2920216?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400" icon={Handshake} />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <SuccessCard title="Partnership Inquiry Received!" sub="Our partnerships team will review your inquiry and contact you within 5 business days to discuss next steps." onReset={() => { setSubmitted(false); setForm({ orgName: "", contactName: "", email: "", phone: "", type: "", website: "", description: "", budget: "", timeline: "" }); }} />
      </div>
    </div>
  );

  return (
    <div className="bg-[#F6FBF8] min-h-screen">
      <PageHero title="Partner With ESN" sub="Build a meaningful partnership that drives environmental impact at scale." image="https://images.unsplash.com/photo-1521791136064-7986c2920216?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400" icon={Handshake} />
      <div className="max-w-6xl mx-auto px-6 py-16">
        <Breadcrumb current="Partner With Us" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">
          {[["80+", "Active Partners"], ["$18M+", "Partner Funding 2025"], ["45", "Corporate Partners"], ["12", "Government Partners"]].map(([v, l]) => <StatCard key={l} value={v} label={l} />)}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-14">
          {types.map((t, i) => (
            <motion.div key={t.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-7 border border-gray-100 hover:border-[#4CAF50]/30 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#0B5D3F]/10 flex items-center justify-center mb-5"><t.icon size={22} className="text-[#0B5D3F]" /></div>
              <div className="font-bold text-gray-900 mb-2">{t.title}</div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">{t.desc}</p>
              <div className="text-xs text-gray-400"><span className="font-semibold text-[#4CAF50]">Examples: </span>{t.examples}</div>
            </motion.div>
          ))}
        </div>

        {/* Partnership Application Form */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8">
          <div className="mb-8">
            <div className="text-[#4CAF50] text-sm font-bold uppercase tracking-wider mb-2">Apply Now</div>
            <h2 className="text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.4rem, 2vw, 1.8rem)", fontWeight: 800 }}>Start a Partnership Conversation</h2>
            <p className="text-gray-500 text-sm mt-2">Fill in the form below and our team will get back to you within 5 business days.</p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Organization Name *</label>
                <input required value={form.orgName} onChange={(e) => setForm({ ...form, orgName: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all" placeholder="Your organization" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Name *</label>
                <input required value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all" placeholder="Your name" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all" placeholder="contact@org.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all" placeholder="+1 XXX-XXX-XXXX" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Partnership Type *</label>
                <select required value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all">
                  <option value="">Select type</option>
                  {types.map((t) => <option key={t.id} value={t.title}>{t.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
                <input type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all" placeholder="https://yourorg.com" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Estimated Budget / Contribution</label>
                <select value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all">
                  <option value="">Select range</option>
                  <option>Under $10,000</option>
                  <option>$10,000 – $50,000</option>
                  <option>$50,000 – $100,000</option>
                  <option>$100,000 – $500,000</option>
                  <option>$500,000+</option>
                  <option>Non-financial partnership</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Timeline</label>
                <select value={form.timeline} onChange={(e) => setForm({ ...form, timeline: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all">
                  <option value="">Select timeline</option>
                  <option>Immediate (within 1 month)</option>
                  <option>Short-term (1–3 months)</option>
                  <option>Medium-term (3–6 months)</option>
                  <option>Long-term (6+ months)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Partnership Vision *</label>
              <textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all resize-none" placeholder="Describe what you hope to achieve through this partnership..." />
            </div>
            <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 bg-[#0B5D3F] hover:bg-[#0a5237] disabled:opacity-60 text-white py-4 rounded-xl font-bold transition-all hover:scale-[1.01]">
              {loading ? <><RefreshCw size={16} className="animate-spin" /> Submitting…</> : <><Send size={16} /> Submit Partnership Inquiry</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── Membership Page ───────────────────────────────────────────────────────────

function MembershipPage() {
  const tiers = [
    { name: "Supporter", price: "$25/year", color: "#4CAF50", bg: "#F0FFF4", perks: ["ESN digital membership card", "Monthly impact newsletter", "Access to member events", "Voting rights at AGM"] },
    { name: "Advocate", price: "$100/year", color: "#0B5D3F", bg: "#F0FBF4", perks: ["All Supporter benefits", "Exclusive member webinars", "Annual report hardcopy", "Name in annual report", "Priority event registration"], highlight: true },
    { name: "Champion", price: "$500/year", color: "#173B63", bg: "#F0F4FF", perks: ["All Advocate benefits", "1:1 briefing with program team", "Recognition on ESN website", "Invitation to Leadership Summit", "Input on program priorities"] },
  ];

  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", country: "", occupation: "", reason: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      saveApplication("member", { ...form, tier: selectedTier });
      setLoading(false);
      setSubmitted(true);
    }, 1600);
  };

  if (submitted) return (
    <div className="bg-[#F6FBF8] min-h-screen">
      <PageHero title="ESN Membership" sub="Join our global community of environmental changemakers." image="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400" icon={Users} />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <SuccessCard title="Membership Application Submitted!" sub={`Your ${selectedTier} membership application has been received. You'll receive a confirmation email with payment instructions within 24 hours.`} onReset={() => { setSubmitted(false); setShowForm(false); setSelectedTier(null); setForm({ name: "", email: "", phone: "", country: "", occupation: "", reason: "" }); }} />
      </div>
    </div>
  );

  return (
    <div className="bg-[#F6FBF8] min-h-screen">
      <PageHero title="ESN Membership" sub="Join our global community of environmental changemakers and amplify your impact." image="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400" icon={Users} />
      <div className="max-w-6xl mx-auto px-6 py-16">
        <Breadcrumb current="Membership" />
        <div className="text-center mb-12">
          <div className="text-[#4CAF50] text-sm font-bold uppercase tracking-wider mb-2">Choose Your Tier</div>
          <h2 className="text-gray-900 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 800 }}>ESN Membership Plans</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Every membership tier directly funds environmental programs. Pick the level that works for you.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {tiers.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className={`bg-white rounded-2xl p-8 border-2 transition-all relative ${t.highlight ? "border-[#0B5D3F] shadow-2xl shadow-green-900/10 scale-105" : "border-gray-100 hover:border-[#4CAF50]/30 hover:shadow-lg"}`}>
              {t.highlight && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#0B5D3F] text-white text-xs font-bold px-4 py-1.5 rounded-full">Most Popular</div>}
              <div className="font-black mb-1" style={{ color: t.color, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "1.1rem" }}>{t.name}</div>
              <div className="font-black text-gray-900 mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "1.75rem" }}>{t.price}</div>
              <div className="flex flex-col gap-3 mb-8">
                {t.perks.map((p) => <div key={p} className="flex items-start gap-2"><CheckCircle2 size={14} className="text-[#4CAF50] shrink-0 mt-0.5" /><span className="text-sm text-gray-600">{p}</span></div>)}
              </div>
              <button onClick={() => { setSelectedTier(t.name); setShowForm(true); setTimeout(() => document.getElementById("mem-form")?.scrollIntoView({ behavior: "smooth" }), 50); }} className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02]" style={{ backgroundColor: t.color, color: "white" }}>
                Apply as {t.name}
              </button>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div id="mem-form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Membership Application</h3>
                  {selectedTier && <p className="text-sm text-[#0B5D3F] font-semibold mt-1">Plan: {selectedTier}</p>}
                </div>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-700 transition-all text-sm">Cancel</button>
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all" placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                    <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all" placeholder="you@email.com" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all" placeholder="Your phone" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Country *</label>
                    <input required value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all" placeholder="e.g. Bangladesh" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Occupation / Organization</label>
                  <input value={form.occupation} onChange={(e) => setForm({ ...form, occupation: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all" placeholder="e.g. Student, Engineer, Teacher" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Why do you want to join ESN? *</label>
                  <textarea required rows={4} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all resize-none" placeholder="Share your motivation..." />
                </div>
                <div className="flex items-start gap-3 bg-[#F6FBF8] rounded-xl p-4 border border-gray-100">
                  <input type="checkbox" id="mem-agree" required className="mt-0.5" />
                  <label htmlFor="mem-agree" className="text-sm text-gray-600">I agree to ESN's <Link to="/terms" className="text-[#0B5D3F] hover:underline">Terms of Membership</Link> and <Link to="/privacy" className="text-[#0B5D3F] hover:underline">Privacy Policy</Link>.</label>
                </div>
                <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 bg-[#0B5D3F] hover:bg-[#0a5237] disabled:opacity-60 text-white py-4 rounded-xl font-bold transition-all hover:scale-[1.01]">
                  {loading ? <><RefreshCw size={16} className="animate-spin" /> Submitting…</> : <><Send size={16} /> Submit Membership Application</>}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Campus Chapters Page ──────────────────────────────────────────────────────

function CampusPage() {
  const [selectedChapter, setSelectedChapter] = useState<any | null>(null);
  const [joinSubmitted, setJoinSubmitted] = useState(false);

  const chapters = [
    {
      name: "University of Dhaka Chapter",
      country: "Bangladesh",
      city: "Dhaka",
      members: 240,
      projects: 12,
      established: "2016",
      lead: "Tanvir Ahmed (Chapter President)",
      email: "dhaka.chapter@esnglobal.org",
      treesPlanted: "32,000+",
      meeting: "Wednesdays at 4:00 PM · Curzon Hall Green Yard",
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      description: "Founded in 2016, the DU Chapter is ESN's pioneer campus network in South Asia, leading weekly urban cleanups, nursery development, and climate policy symposiums.",
      keyProjects: ["Buriganga River Waste Interceptor", "Sundarbans Youth Field Delegation", "University Plastic-Free Campaign", "Eco-Seedling Distribution Drive"],
    },
    {
      name: "IIT Delhi Chapter",
      country: "India",
      city: "New Delhi",
      members: 185,
      projects: 9,
      established: "2017",
      lead: "Aarav Sharma (Chapter Lead)",
      email: "iitd.chapter@esnglobal.org",
      treesPlanted: "18,500+",
      meeting: "Thursdays at 5:30 PM · Student Activity Centre",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      description: "Engineers and researchers deploying IoT air quality monitoring sensors, decentralized solar charging stations, and campus e-waste recycling hubs.",
      keyProjects: ["Smart Campus Air Monitor Mesh", "Hostel Solar Energy Challenge", "Yamuna Floodplain Afforestation", "E-Waste Circularity Drive"],
    },
    {
      name: "University of Nairobi Chapter",
      country: "Kenya",
      city: "Nairobi",
      members: 160,
      projects: 11,
      established: "2018",
      lead: "Wanjiku Mwangi (Regional Coordinator)",
      email: "uon.chapter@esnglobal.org",
      treesPlanted: "45,000+",
      meeting: "Saturdays at 10:00 AM · Taifa Hall Green Lawn",
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      description: "Leading extensive agroforestry and indigenous seed saving projects in the Great Rift Valley in partnership with rural community schools.",
      keyProjects: ["Karura Forest Buffer Plantation", "Indigenous Tree Seedling Bank", "Green Schools Climate Fellowship", "Drought Adaptation Workshops"],
    },
    {
      name: "São Paulo State University",
      country: "Brazil",
      city: "São Paulo",
      members: 210,
      projects: 14,
      established: "2017",
      lead: "Lucas Oliveira (Chapter President)",
      email: "unesp.chapter@esnglobal.org",
      treesPlanted: "28,000+",
      meeting: "Tuesdays at 6:00 PM · Biology Department Lounge",
      image: "https://images.unsplash.com/photo-1498429089284-41f8cf3ffd39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      description: "Focuses on Atlantic Forest restoration, river basin water testing, and training indigenous youth in drone-based ecological mapping.",
      keyProjects: ["Atlantic Rainforest Corridors", "Urban River Bio-Filters", "Indigenous Youth Drone Lab", "Campus Zero-Waste Transition"],
    },
    {
      name: "University of Copenhagen",
      country: "Denmark",
      city: "Copenhagen",
      members: 130,
      projects: 7,
      established: "2019",
      lead: "Astrid Lind (Lead Organizer)",
      email: "ku.chapter@esnglobal.org",
      treesPlanted: "12,000+",
      meeting: "Mondays at 4:30 PM · Science Campus Hub",
      image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      description: "Nordic student coalition specializing in circular economy modeling, climate finance policy briefs, and Arctic ecosystem awareness.",
      keyProjects: ["Nordic Campus Carbon Audit", "Baltic Coastal Microplastic Survey", "Youth COP Delegation Policy Brief", "Circular Canteen Policy"],
    },
    {
      name: "National University of Singapore",
      country: "Singapore",
      city: "Singapore",
      members: 145,
      projects: 8,
      established: "2019",
      lead: "Cheryl Tan (Chapter Lead)",
      email: "nus.chapter@esnglobal.org",
      treesPlanted: "15,000+",
      meeting: "Fridays at 5:00 PM · UTown Eco-Auditorium",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      description: "Pioneering urban mangrove monitoring, coral nursery research, and green technology hackathons across Southeast Asian campuses.",
      keyProjects: ["Pulau Ubin Mangrove Restoration", "Southern Islands Coral Nursery", "ASEAN Eco-Innovation Hackathon", "Campus Biodiversity Census"],
    },
  ];

  return (
    <div className="bg-[#F6FBF8] min-h-screen">
      <PageHero title="Campus Chapters" sub="ESN chapters bring environmental action to universities worldwide." image="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400" icon={BookOpen} />
      <div className="max-w-6xl mx-auto px-6 py-16">
        <Breadcrumb current="Campus Chapters" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">
          {[["200+", "Campus Chapters"], ["50+", "Countries"], ["28K+", "Student Members"], ["600+", "Campus Projects"]].map(([v, l]) => <StatCard key={l} value={v} label={l} />)}
        </div>
        
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <div className="text-[#4CAF50] text-sm font-bold uppercase tracking-wider mb-1">Global Campus Network</div>
            <h2 className="text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.4rem, 2vw, 1.8rem)", fontWeight: 800 }}>Featured University Chapters</h2>
          </div>
          <span className="text-xs text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-200">
            Click any university to view chapter details
          </span>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-16">
          {chapters.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              onClick={() => setSelectedChapter(c)}
              className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-[#4CAF50]/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative h-40 overflow-hidden">
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-[#0B5D3F]">
                    Est. {c.established}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-semibold flex items-center gap-1">
                    <Globe2 size={12} className="text-[#4CAF50]" /> {c.city}, {c.country}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-gray-900 mb-2 text-base group-hover:text-[#0B5D3F] transition-colors leading-snug" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {c.name}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                    {c.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 bg-[#F6FBF8] p-3 rounded-xl border border-gray-100 text-xs">
                    <div>
                      <div className="text-[10px] text-gray-400 font-medium">Students</div>
                      <div className="font-black text-[#0B5D3F] text-sm">{c.members}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 font-medium">Projects</div>
                      <div className="font-black text-[#4CAF50] text-sm">{c.projects} active</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-5 pt-0">
                <button className="w-full py-2.5 rounded-xl bg-[#F6FBF8] group-hover:bg-[#0B5D3F] text-[#0B5D3F] group-hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5">
                  View Chapter Profile <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chapter Details Modal */}
        <AnimatePresence>
          {selectedChapter && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 relative overflow-hidden"
              >
                {/* Header Image */}
                <div className="relative h-48 sm:h-56">
                  <img src={selectedChapter.image} alt={selectedChapter.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <button
                    onClick={() => { setSelectedChapter(null); setJoinSubmitted(false); }}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all"
                  >
                    <X size={18} />
                  </button>
                  <div className="absolute bottom-4 left-6 right-6 text-white">
                    <span className="inline-block bg-[#4CAF50] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2">
                      Campus Chapter
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {selectedChapter.name}
                    </h3>
                    <div className="text-xs text-white/80 flex items-center gap-1.5 mt-1">
                      <MapPin size={13} className="text-[#4CAF50]" /> {selectedChapter.city}, {selectedChapter.country} · Established {selectedChapter.established}
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-[#F6FBF8] p-3.5 rounded-2xl text-center border border-gray-100">
                      <div className="text-lg font-black text-[#0B5D3F]">{selectedChapter.members}</div>
                      <div className="text-[11px] text-gray-500 font-medium">Student Members</div>
                    </div>
                    <div className="bg-[#F6FBF8] p-3.5 rounded-2xl text-center border border-gray-100">
                      <div className="text-lg font-black text-[#4CAF50]">{selectedChapter.projects}</div>
                      <div className="text-[11px] text-gray-500 font-medium">Active Projects</div>
                    </div>
                    <div className="bg-[#F6FBF8] p-3.5 rounded-2xl text-center border border-gray-100">
                      <div className="text-lg font-black text-[#D6A95A]">{selectedChapter.treesPlanted}</div>
                      <div className="text-[11px] text-gray-500 font-medium">Trees Planted</div>
                    </div>
                  </div>

                  {/* Overview */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">About This Chapter</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {selectedChapter.description}
                    </p>
                  </div>

                  {/* Key Initiatives */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Key Campus Initiatives</h4>
                    <div className="grid sm:grid-cols-2 gap-2.5">
                      {selectedChapter.keyProjects.map((p: string) => (
                        <div key={p} className="flex items-center gap-2 text-xs font-semibold text-gray-800 bg-[#F6FBF8] p-2.5 rounded-xl border border-gray-100">
                          <CheckCircle2 size={14} className="text-[#4CAF50] shrink-0" />
                          <span>{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Meeting Schedule & Contact */}
                  <div className="bg-[#EBF8F1] rounded-2xl p-4 border border-[#A2DCBA] text-xs space-y-2">
                    <div className="flex items-center gap-2 text-[#0B5D3F] font-bold">
                      <Calendar size={14} /> Weekly Meeting:
                    </div>
                    <div className="text-gray-700 font-medium pl-6">{selectedChapter.meeting}</div>
                    <div className="flex items-center gap-2 text-[#0B5D3F] font-bold pt-1">
                      <Mail size={14} /> Chapter Contact:
                    </div>
                    <div className="text-gray-700 font-medium pl-6">{selectedChapter.lead} · {selectedChapter.email}</div>
                  </div>

                  {/* Modal Actions */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    {joinSubmitted ? (
                      <div className="w-full bg-[#E8F5E9] text-[#0B5D3F] p-3.5 rounded-xl text-center text-xs font-bold">
                        🎉 Membership request sent to {selectedChapter.name}! The student coordinator will reach out soon.
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            saveApplication("member", {
                              name: "Campus Student Member",
                              university: selectedChapter.name,
                              type_label: `Campus Chapter Member (${selectedChapter.name})`,
                              country: selectedChapter.country,
                            });
                            setJoinSubmitted(true);
                          }}
                          className="flex-1 py-3.5 rounded-xl bg-[#0B5D3F] hover:bg-[#094c34] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                        >
                          <Users size={15} /> Join This Campus Chapter
                        </button>
                        <a
                          href={`mailto:${selectedChapter.email}?subject=Inquiry about ${encodeURIComponent(selectedChapter.name)}`}
                          className="py-3.5 px-6 rounded-xl bg-white border border-gray-200 hover:border-[#0B5D3F] text-gray-700 font-bold text-xs uppercase tracking-wider transition-all text-center"
                        >
                          Contact Lead
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        <div className="bg-white rounded-2xl p-8 border border-gray-100 mb-8 shadow-sm">
          <h3 className="text-gray-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>Start a Chapter at Your University</h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-5">Any registered student group at an accredited university can apply to become an official ESN Campus Chapter. Chapters receive training, resources, mentorship, and access to the global ESN network.</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {["Apply online with a founding team of 10+ students", "Receive onboarding training and chapter toolkit", "Launch your first environmental project within 90 days"].map((s, i) => (
              <div key={s} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-[#4CAF50] text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</div>
                <span className="text-sm text-gray-600">{s}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gradient-to-r from-[#0B5D3F] to-[#173B63] rounded-3xl p-10 text-white text-center">
          <h3 className="text-white mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800 }}>Start or Join a Chapter</h3>
          <p className="text-white/70 mb-6 max-w-md mx-auto">Contact us to connect with the nearest ESN campus chapter or start one at your institution.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-[#4CAF50] text-white px-7 py-3.5 rounded-full font-semibold hover:bg-[#43a047] transition-all hover:scale-105">Apply Now <ArrowRight size={15} /></Link>
        </div>
      </div>
    </div>
  );
}

// ─── Careers Page ──────────────────────────────────────────────────────────────

const deptColors: Record<string, string> = {
  Programs: "#0B5D3F", Research: "#173B63", Communications: "#4CAF50",
  Marketing: "#D6A95A", Finance: "#E65100", Youth: "#5B8DB8"
};

function CareersPage() {
  const defaultJobs = [
    { id: 1, title: "Program Manager — Forest Restoration", dept: "Programs", location: "Dhaka, Bangladesh", type: "Full-time", deadline: "Aug 30, 2026", salary: "$45K–$60K", desc: "Lead our flagship forest restoration programs across South Asia, managing a team of 12 field staff and 200+ community volunteers.", requirements: "5+ years program management, NGO/environmental sector experience, Fluent in Bangla + English, PMP or equivalent preferred" },
    { id: 2, title: "Research Associate — Climate Policy", dept: "Research", location: "Remote", type: "Full-time", deadline: "Sep 5, 2026", salary: "$38K–$50K", desc: "Support ESN's policy research agenda, producing evidence briefs, policy papers, and stakeholder reports.", requirements: "Master's in environmental science/policy, Strong research & writing skills, Experience with IPCC frameworks, Quantitative analysis skills" },
  ];
  const [jobListings, setJobListings, loadingJobs] = useFirestoreData<any[]>("esn_career_jobs", defaultJobs);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", country: "", resumeLink: "", linkedIn: "", coverLetter: "", noticePeriod: "", expectedSalary: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("All");

  const depts = ["All", ...Array.from(new Set(jobListings.map((j) => j.dept)))];
  const filtered = filter === "All" ? jobListings : jobListings.filter((j) => j.dept === filter);

  const handleApply = (job: any) => {
    setSelectedJob(job);
    setShowForm(true);
    setTimeout(() => document.getElementById("career-form")?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      saveApplication("career", { ...form, jobTitle: selectedJob?.title, dept: selectedJob?.dept, location: selectedJob?.location });
      setLoading(false);
      setSubmitted(true);
    }, 1800);
  };

  if (submitted) return (
    <div className="bg-[#F6FBF8] min-h-screen">
      <PageHero title="Career Opportunities" sub="Join a team of passionate people working to protect our planet." image="https://images.unsplash.com/photo-1497366216548-37526070297c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400" icon={Briefcase} />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <SuccessCard title="Application Submitted!" sub={`Your application for "${selectedJob?.title}" has been received. Our HR team will review and contact you within 5–7 business days.`} onReset={() => { setSubmitted(false); setShowForm(false); setSelectedJob(null); setForm({ name: "", email: "", phone: "", country: "", resumeLink: "", linkedIn: "", coverLetter: "", noticePeriod: "", expectedSalary: "" }); }} />
      </div>
    </div>
  );

  return (
    <div className="bg-[#F6FBF8] min-h-screen">
      <PageHero title="Career Opportunities" sub="Join a team of passionate people working to protect our planet." image="https://images.unsplash.com/photo-1497366216548-37526070297c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400" icon={Briefcase} />
      <div className="max-w-6xl mx-auto px-6 py-16">
        <Breadcrumb current="Careers" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">
          {[["120+", "Team Members"], ["25+", "Open Roles"], ["35", "Countries Hiring"], ["4.8/5", "Glassdoor Rating"]].map(([v, l]) => <StatCard key={l} value={v} label={l} />)}
        </div>

        {/* Culture block */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm mb-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="text-[#4CAF50] text-sm font-bold uppercase tracking-wider mb-2">Life at ESN</div>
              <h3 className="text-gray-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "1.4rem", fontWeight: 800 }}>Work Where Your Career Has Purpose</h3>
              <p className="text-gray-600 text-sm leading-relaxed">ESN staff are mission-driven professionals who believe that rigorous, community-led environmental work can change the world. We offer competitive salaries, flexible remote options, and a culture of genuine inclusion.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[["Flexible Hours", Clock], ["Remote Options", Globe2], ["Health Benefits", Heart], ["Learning Budget", BookOpen]].map(([label, Icon]) => (
                <div key={label as string} className="bg-[#F6FBF8] rounded-xl p-4 flex items-center gap-3 border border-gray-100">
                  <div className="w-9 h-9 bg-[#0B5D3F]/10 rounded-xl flex items-center justify-center shrink-0">
                    {/* @ts-ignore */}
                    <Icon size={16} className="text-[#0B5D3F]" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{label as string}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-3 flex-wrap mb-6">
          <span className="text-sm font-bold text-gray-500">Filter by department:</span>
          {depts.map((d) => (
            <button key={d} onClick={() => setFilter(d)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filter === d ? "bg-[#0B5D3F] text-white" : "bg-white text-gray-500 border border-gray-200 hover:border-[#4CAF50]"}`}>{d}</button>
          ))}
        </div>

        <div className="flex flex-col gap-4 mb-10">
          {filtered.map((j, i) => (
            <motion.div key={j.id} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className={`bg-white rounded-2xl p-6 border-2 transition-all ${selectedJob?.id === j.id && showForm ? "border-[#0B5D3F] shadow-lg" : "border-gray-100 hover:border-[#4CAF50]/30 hover:shadow-md"}`}>
              <div className="flex flex-col sm:flex-row gap-4 sm:items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: (deptColors[j.dept] || "#0B5D3F") + "15", color: deptColors[j.dept] || "#0B5D3F" }}>{j.dept}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{j.type}</span>
                    <span className="text-xs bg-green-50 text-[#0B5D3F] px-2.5 py-1 rounded-full font-semibold">{j.salary}</span>
                  </div>
                  <div className="font-bold text-gray-900 mb-2">{j.title}</div>
                  <p className="text-sm text-gray-500 mb-3 leading-relaxed">{j.desc}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
                    <span className="flex items-center gap-1"><MapPin size={10} /> {j.location}</span>
                    <span className="flex items-center gap-1"><Calendar size={10} /> Deadline: {j.deadline}</span>
                  </div>
                </div>
                <button onClick={() => handleApply(j)} className="flex items-center gap-2 bg-[#0B5D3F] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#0a5237] transition-all whitespace-nowrap shrink-0 self-start">
                  Apply <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Application Form */}
        <AnimatePresence>
          {showForm && selectedJob && (
            <motion.div id="career-form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 mb-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Job Application</h3>
                  <p className="text-sm text-[#0B5D3F] font-semibold mt-1">{selectedJob.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{selectedJob.dept} · {selectedJob.location}</p>
                </div>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-700 text-sm transition-all shrink-0">Cancel</button>
              </div>

              {/* Requirements */}
              <div className="bg-[#F6FBF8] rounded-2xl p-5 mb-6 border border-[#0B5D3F]/10">
                <div className="text-xs font-black text-[#0B5D3F] uppercase tracking-wider mb-3">Key Requirements</div>
                <div className="grid sm:grid-cols-2 gap-2">
                  {typeof selectedJob.requirements === 'string' 
                    ? selectedJob.requirements.split(",").map((r: string) => (
                      <div key={r} className="flex items-center gap-2 text-xs text-gray-600"><Check size={12} className="text-[#4CAF50] shrink-0" />{r.trim()}</div>
                    ))
                    : selectedJob.requirements.map((r: string) => (
                      <div key={r} className="flex items-center gap-2 text-xs text-gray-600"><Check size={12} className="text-[#4CAF50] shrink-0" />{r}</div>
                    ))
                  }
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all" placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                    <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all" placeholder="you@email.com" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all" placeholder="+1 XXX-XXX-XXXX" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Country *</label>
                    <input required value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all" placeholder="e.g. Bangladesh" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Resume / CV Drive Link (Google Drive / Dropbox / OneDrive) *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <FileText size={16} />
                    </div>
                    <input
                      required
                      type="url"
                      value={form.resumeLink}
                      onChange={(e) => setForm({ ...form, resumeLink: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all text-sm"
                      placeholder="https://drive.google.com/file/d/... (Shareable Google Drive or cloud link)"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1.5">
                    <Info size={13} className="text-[#0B5D3F] shrink-0" />
                    Paste a shareable link to your CV/Resume. Make sure file access is set to <strong className="font-semibold text-gray-700">"Anyone with the link can view"</strong>.
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">LinkedIn Profile URL</label>
                    <input type="url" value={form.linkedIn} onChange={(e) => setForm({ ...form, linkedIn: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all" placeholder="https://linkedin.com/in/..." />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Expected Salary</label>
                    <input value={form.expectedSalary} onChange={(e) => setForm({ ...form, expectedSalary: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all" placeholder="e.g. $45,000/year" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Notice Period</label>
                  <select value={form.noticePeriod} onChange={(e) => setForm({ ...form, noticePeriod: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all">
                    <option value="">Select notice period</option>
                    <option>Immediate</option>
                    <option>2 weeks</option>
                    <option>1 month</option>
                    <option>2 months</option>
                    <option>3 months</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Letter *</label>
                  <textarea required rows={5} value={form.coverLetter} onChange={(e) => setForm({ ...form, coverLetter: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all resize-none" placeholder="Why are you the right person for this role? What experience and passion do you bring?" />
                </div>
                <div className="flex items-start gap-3 bg-[#F6FBF8] rounded-xl p-4 border border-gray-100">
                  <input type="checkbox" id="career-agree" required className="mt-0.5" />
                  <label htmlFor="career-agree" className="text-sm text-gray-600">I confirm all information is accurate and I consent to ESN storing my data for recruitment purposes.</label>
                </div>
                <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 bg-[#0B5D3F] hover:bg-[#0a5237] disabled:opacity-60 text-white py-4 rounded-xl font-bold transition-all hover:scale-[1.01]">
                  {loading ? <><RefreshCw size={16} className="animate-spin" /> Submitting Application…</> : <><Send size={16} /> Submit Job Application</>}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {!showForm && (
          <div className="bg-gradient-to-r from-[#0B5D3F] to-[#173B63] rounded-3xl p-10 text-white text-center mt-4">
            <h3 className="mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800 }}>Don't See a Fit?</h3>
            <p className="text-white/70 mb-8 max-w-md mx-auto">Send us your CV and we'll keep it on file for opportunities that match your profile.</p>
            <Link to="/contact" className="inline-flex items-center gap-2 bg-[#4CAF50] text-white px-7 py-3.5 rounded-full font-semibold hover:bg-[#43a047] transition-all hover:scale-105">Send Your CV <ArrowRight size={15} /></Link>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Global Representative Page ──────────────────────────────────────────────────

function GlobalRepresentativePage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    resumeLink: "",
    linkedIn: "",
    profession: "",
    languages: "",
    motivation: "",
    experience: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await saveApplication("representative", {
      ...form,
      role: `Global Country Representative (${form.country || "Global"})`,
      type_label: "Country Representative",
    });
    setLoading(false);
    setSubmitted(true);
  };

  const pillars = [
    {
      icon: Globe2,
      title: "National Chapter Leadership",
      desc: "Establish, coordinate, and scale localized environmental chapters, tree plantations, and youth advocacy circles in your country.",
      color: "text-[#0B5D3F]",
      bg: "bg-[#0B5D3F]/10",
    },
    {
      icon: Users,
      title: "Grassroots Mobilization",
      desc: "Empower youth, volunteers, students, and indigenous communities through climate literacy workshops and restoration initiatives.",
      color: "text-[#4CAF50]",
      bg: "bg-[#4CAF50]/10",
    },
    {
      icon: Handshake,
      title: "Policy & Strategic Alliances",
      desc: "Connect with environmental ministries, academic institutions, and regional NGOs to amplify grassroots environmental policy.",
      color: "text-[#173B63]",
      bg: "bg-[#173B63]/10",
    },
    {
      icon: Trophy,
      title: "Global Delegations & Grants",
      desc: "Represent your country at international COP conferences, UNEP forums, and access project micro-grants from ESN International.",
      color: "text-[#D6A95A]",
      bg: "bg-[#D6A95A]/10",
    },
  ];

  return (
    <div className="pt-28 pb-20">
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-16">
        <div className="flex items-center gap-2 text-xs text-gray-600 mb-6">
          <Link to="/" className="hover:text-[#0B5D3F]">Home</Link>
          <ChevronRight size={12} />
          <Link to="/volunteer" className="hover:text-[#0B5D3F]">Get Involved</Link>
          <ChevronRight size={12} />
          <span className="text-[#0B5D3F] font-semibold">Global Representatives</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#E8F5E9] text-[#0B5D3F] text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-wider">
              <Globe2 size={13} /> Global Leadership Network
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0A3D2A] leading-tight mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Lead Environmental Action in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0B5D3F] to-[#4CAF50]">Your Country</span>
            </h1>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-8">
              Environmental Shapers Network appoints dedicated <strong>Country & Regional Representatives</strong> across 80+ nations. As an official ESN Representative, you will lead national initiatives, coordinate youth volunteers, and represent your region on global environmental stages.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Country Reps", val: "80+" },
                { label: "Active Nations", val: "190+" },
                { label: "Regional Hubs", val: "12" },
                { label: "Volunteers", val: "48K+" },
              ].map((s) => (
                <div key={s.label} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                  <div className="text-2xl font-black text-[#0B5D3F]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.val}</div>
                  <div className="text-xs text-gray-500 font-medium mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900"
                alt="ESN Global Representatives Collaboration"
                className="w-full h-80 lg:h-[450px] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-xl border border-gray-100 hidden sm:flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#4CAF50]/15 flex items-center justify-center">
                <Globe2 size={24} className="text-[#4CAF50]" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">Official Representation</div>
                <div className="text-xs text-gray-600">UN & COP Credentialed Network</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-[#0A3D2A] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Role Responsibilities & Privileges
          </h2>
          <p className="text-gray-600 text-sm">
            What you will accomplish and experience as an authorized Country Representative.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p) => (
            <div key={p.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 flex flex-col">
              <div className={`w-12 h-12 rounded-xl ${p.bg} flex items-center justify-center mb-5`}>
                <p.icon size={22} className={p.color} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-base">{p.title}</h3>
              <p className="text-gray-600 text-xs leading-relaxed flex-1">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Application Form Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6" id="apply-form">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100">
          {submitted ? (
            <SuccessCard
              title="Application Submitted Successfully!"
              sub="Thank you for stepping up to represent your country. Our Global Secretariat will review your credentials and national strategy and get back to you within 3–5 business days."
              onReset={() => setSubmitted(false)}
            />
          ) : (
            <>
              <div className="text-center max-w-xl mx-auto mb-10">
                <div className="inline-flex items-center gap-2 bg-[#0B5D3F]/10 text-[#0B5D3F] text-xs font-bold px-4 py-1.5 rounded-full mb-3 uppercase tracking-wider">
                  <UserCheck size={13} /> Official Application
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#0A3D2A]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Apply as a Country Representative
                </h2>
                <p className="text-gray-600 text-xs sm:text-sm mt-2">
                  Open to passionate environmental activists, NGO leaders, researchers, and youth pioneers worldwide.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Dr. Jane Doe"
                      className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Email Address *
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="e.g. jane.doe@example.org"
                      className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] text-sm"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Phone / WhatsApp *
                    </label>
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Country of Representation *
                    </label>
                    <input
                      required
                      type="text"
                      value={form.country}
                      onChange={(e) => setForm({ ...form, country: e.target.value })}
                      placeholder="e.g. Canada, Ghana, Japan..."
                      className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      City / Base *
                    </label>
                    <input
                      required
                      type="text"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      placeholder="e.g. Toronto, Accra, Tokyo"
                      className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] text-sm"
                    />
                  </div>
                </div>

                {/* Resume / CV Drive Link */}
                <div className="bg-[#EBF8F1] rounded-2xl p-5 border border-[#A2DCBA]">
                  <div className="flex items-center gap-2 mb-2">
                    <ExternalLink size={16} className="text-[#0B5D3F]" />
                    <label className="text-xs font-bold text-[#0B5D3F] uppercase tracking-wider">
                      Resume / CV Drive Link *
                    </label>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    Please upload your CV / Resume to Google Drive, Dropbox, or OneDrive and paste the shareable link below (ensure link sharing is set to "Anyone with the link can view").
                  </p>
                  <input
                    required
                    type="url"
                    value={form.resumeLink}
                    onChange={(e) => setForm({ ...form, resumeLink: e.target.value })}
                    placeholder="https://drive.google.com/file/d/..."
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#4CAF50]/40 focus:outline-none focus:border-[#0B5D3F] text-sm text-gray-800"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      LinkedIn Profile URL
                    </label>
                    <input
                      type="url"
                      value={form.linkedIn}
                      onChange={(e) => setForm({ ...form, linkedIn: e.target.value })}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Current Profession / Background *
                    </label>
                    <input
                      required
                      type="text"
                      value={form.profession}
                      onChange={(e) => setForm({ ...form, profession: e.target.value })}
                      placeholder="e.g. Environmental Scientist, NGO Director"
                      className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Languages Spoken
                  </label>
                  <input
                    type="text"
                    value={form.languages}
                    onChange={(e) => setForm({ ...form, languages: e.target.value })}
                    placeholder="e.g. English, French, Spanish, Arabic"
                    className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    National Environmental Vision & Strategy *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.motivation}
                    onChange={(e) => setForm({ ...form, motivation: e.target.value })}
                    placeholder="What are the key environmental challenges in your country, and what specific campaigns or chapters would you organize as ESN Representative?"
                    className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] text-sm resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Leadership & Community Experience *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={form.experience}
                    onChange={(e) => setForm({ ...form, experience: e.target.value })}
                    placeholder="Briefly describe your previous experience in volunteering, team leadership, youth mobilization, or project management."
                    className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] text-sm resize-none"
                  />
                </div>

                <div className="flex items-start gap-3 bg-[#F6FBF8] p-4 rounded-xl border border-gray-100">
                  <input required type="checkbox" id="rep-agree" className="mt-0.5 accent-[#0B5D3F]" />
                  <label htmlFor="rep-agree" className="text-xs text-gray-600 leading-relaxed">
                    I confirm that the information provided is true and accurate, and I agree to represent ESN’s mission and ethical values in my home country.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-[#0B5D3F] hover:bg-[#094c34] text-white font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#0B5D3F]/20 disabled:opacity-60 hover:scale-[1.01]"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" /> Submitting Credentials…
                    </>
                  ) : (
                    <>
                      <Send size={16} /> Submit Representative Application
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Router ────────────────────────────────────────────────────────────────────

export default function GetInvolvedPage() {
  const { pathname } = useLocation();
  if (pathname === "/volunteer") return <VolunteerPage />;
  if (pathname === "/membership") return <MembershipPage />;
  if (pathname === "/campus-chapters") return <CampusPage />;
  if (pathname === "/partner") return <PartnerPage />;
  if (pathname === "/careers") return <CareersPage />;
  if (pathname === "/global-representatives" || pathname === "/representatives") return <GlobalRepresentativePage />;
  return <VolunteerPage />;
}
