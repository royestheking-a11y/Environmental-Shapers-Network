import os
import re

# File paths
home_path = "/Users/mdsunny/Downloads/Premium Environmental Network Website/src/app/pages/Home.tsx"
dashboard_path = "/Users/mdsunny/Downloads/Premium Environmental Network Website/src/app/pages/admin/AdminDashboard.tsx"
faq_admin_path = "/Users/mdsunny/Downloads/Premium Environmental Network Website/src/app/pages/admin/sections/FAQAdminView.tsx"
faq_section_path = "/Users/mdsunny/Downloads/Premium Environmental Network Website/src/app/components/home/FAQSection.tsx"
contact_section_path = "/Users/mdsunny/Downloads/Premium Environmental Network Website/src/app/components/home/ContactSection.tsx"

# 1. Create FAQAdminView.tsx
faq_admin_content = """import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Search, Edit3, Trash2, AlertCircle } from "lucide-react";

export interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export function getInitialFAQs(): FAQ[] {
  try {
    const saved = localStorage.getItem("esn_faq_admin");
    if (saved) return JSON.parse(saved);
  } catch {}
  return [
    { id: 1, question: "How does ESN ensure transparency with donations?", answer: "We publish comprehensive quarterly financial reports and send all donors direct impact summaries detailing exactly where and how their funds were deployed." },
    { id: 2, question: "Can I volunteer if I don't have a background in environmental science?", answer: "Absolutely! We welcome volunteers from all backgrounds. Whether you have skills in marketing, logistics, education, or simply a passion for nature, there is a place for you." },
    { id: 3, question: "Where are your reforestation projects located?", answer: "Currently, our primary reforestation efforts are concentrated across Southeast Asia, Sub-Saharan Africa, and parts of South America, partnering directly with indigenous communities." },
    { id: 4, question: "How do I partner my organization with ESN?", answer: "You can reach out through our contact form. Our partnership team reviews all inquiries and typically responds within 3-5 business days." }
  ];
}

export default function FAQAdminView() {
  const [faqs, setFaqs] = useState<FAQ[]>(getInitialFAQs);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<FAQ>>({ question: "", answer: "" });

  const saveFaqs = (newData: FAQ[]) => {
    setFaqs(newData);
    localStorage.setItem("esn_faq_admin", JSON.stringify(newData));
  };

  const handleSave = () => {
    if (!formData.question || !formData.answer) return;
    if (editingId !== null) {
      saveFaqs(faqs.map(f => f.id === editingId ? { ...f, ...formData } as FAQ : f));
      setEditingId(null);
    } else {
      const newId = faqs.length > 0 ? Math.max(...faqs.map(f => f.id)) + 1 : 1;
      saveFaqs([...faqs, { ...formData, id: newId } as FAQ]);
    }
    setShowAdd(false);
  };

  const handleDelete = (id: number) => {
    saveFaqs(faqs.filter(f => f.id !== id));
    setDeleteConfirmId(null);
  };

  const filtered = faqs.filter(f => 
    f.question.toLowerCase().includes(search.toLowerCase()) || 
    f.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage FAQs</h2>
          <p className="text-gray-500 text-sm">Update the Q/A section displayed on the homepage.</p>
        </div>
        <button 
          onClick={() => { setFormData({ question: "", answer: "" }); setEditingId(null); setShowAdd(true); }}
          className="flex items-center gap-2 bg-[#0B5D3F] hover:bg-[#0a5237] text-white px-4 py-2 rounded-xl transition-colors font-medium text-sm"
        >
          <Plus size={16} /> Add FAQ
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search FAQs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4CAF50] transition-colors text-sm"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map(faq => (
          <div key={faq.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <h3 className="font-bold text-gray-900 mb-1">{faq.question}</h3>
              <p className="text-gray-500 text-sm">{faq.answer}</p>
            </div>
            <div className="flex items-start gap-2 shrink-0">
              <button onClick={() => { setEditingId(faq.id); setFormData(faq); setShowAdd(true); }} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Edit3 size={16} />
              </button>
              <button onClick={() => setDeleteConfirmId(faq.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">{editingId ? "Edit FAQ" : "Add FAQ"}</h3>
              </div>
              <div className="p-6 space-y-4 bg-gray-50/50">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Question</label>
                  <input type="text" value={formData.question} onChange={e => setFormData({ ...formData, question: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4CAF50] bg-white" placeholder="E.g., How does ESN work?" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Answer</label>
                  <textarea rows={4} value={formData.answer} onChange={e => setFormData({ ...formData, answer: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4CAF50] bg-white resize-none" placeholder="Provide a detailed answer..." />
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-white">
                <button onClick={() => setShowAdd(false)} className="px-5 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={handleSave} className="px-5 py-2.5 rounded-xl font-medium bg-[#0B5D3F] text-white hover:bg-[#0a5237] transition-colors">Save FAQ</button>
              </div>
            </motion.div>
          </div>
        )}

        {deleteConfirmId && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6 text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete FAQ?</h3>
              <p className="text-gray-500 mb-6 text-sm">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-3 rounded-xl font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors">Cancel</button>
                <button onClick={() => handleDelete(deleteConfirmId)} className="flex-1 py-3 rounded-xl font-medium bg-red-600 text-white hover:bg-red-700 transition-colors">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
"""

with open(faq_admin_path, "w") as f:
    f.write(faq_admin_content)

# 2. Create FAQSection.tsx
faq_section_content = """import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { Plus, Minus, MessageCircleQuestion } from "lucide-react";
import { getInitialFAQs, FAQ } from "../../pages/admin/sections/FAQAdminView";

export function FAQSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openId, setOpenId] = useState<number | null>(1);

  useEffect(() => {
    setFaqs(getInitialFAQs());
  }, []);

  return (
    <section ref={ref} className="py-24 bg-white relative">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-[#0B5D3F]/10 text-[#0B5D3F] text-sm font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider">
            <MessageCircleQuestion size={14} className="text-[#4CAF50]" />
            Common Questions
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#0A1A0E] mb-6 leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Frequently Asked <span className="text-[#4CAF50]">Questions</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Find answers to common questions about our environmental initiatives, donations, and volunteer programs.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`border rounded-2xl overflow-hidden transition-all duration-300 ${openId === faq.id ? "bg-[#F6FBF8] border-[#4CAF50]/30 shadow-md" : "bg-white border-gray-100 hover:border-gray-200"}`}
            >
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="font-bold text-gray-900 text-lg pr-8" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {faq.question}
                </span>
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openId === faq.id ? "bg-[#0B5D3F] text-white" : "bg-gray-100 text-gray-500"}`}>
                  {openId === faq.id ? <Minus size={16} /> : <Plus size={16} />}
                </div>
              </button>
              <AnimatePresence>
                {openId === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
"""

with open(faq_section_path, "w") as f:
    f.write(faq_section_content)

# 3. Create ContactSection.tsx
contact_section_content = """import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { Send, MapPin, Mail, Phone } from "lucide-react";
import { useSettings } from "../../utils/useSettings";

export function ContactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const settings = useSettings();
  
  const [form, setForm] = useState({ firstName: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      try {
        const messages = JSON.parse(localStorage.getItem("esn_messages") || "[]");
        messages.push({ ...form, lastName: "", organization: "", id: Date.now(), date: new Date().toISOString(), status: "unread" });
        localStorage.setItem("esn_messages", JSON.stringify(messages));
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <section ref={ref} className="py-24 bg-[#0B5D3F] relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#4CAF50]/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-20 items-center">
          {/* Info Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Let's Build a <br/><span className="text-[#4CAF50]">Greener Future</span>
            </h2>
            <p className="text-white/80 text-lg mb-10 leading-relaxed">
              Have questions or want to partner with us? Drop us a message and our team will get back to you within 24 hours.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4 text-white/90">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                  <Mail size={20} className="text-[#4CAF50]" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Email Us</h4>
                  <p className="text-white/70">{settings.contactEmail || "info@esnbd.org"}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 text-white/90">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                  <Phone size={20} className="text-[#4CAF50]" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Call Us</h4>
                  <p className="text-white/70">+880 (123) 456-7890</p>
                </div>
              </div>
              <div className="flex items-start gap-4 text-white/90">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                  <MapPin size={20} className="text-[#4CAF50]" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Headquarters</h4>
                  <p className="text-white/70">Global Eco Center, 123 Green Ave<br/>Dhaka, Bangladesh</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl shadow-black/10">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                      <input type="text" required value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className="w-full px-4 py-3.5 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                      <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3.5 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all" placeholder="you@email.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Topic *</label>
                    <select required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full px-4 py-3.5 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all text-gray-700">
                      <option value="">Select a topic</option>
                      <option>Partnership Inquiry</option>
                      <option>Donation Help</option>
                      <option>General Question</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Your Message *</label>
                    <textarea required rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3.5 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all resize-none" placeholder="How can we help?" />
                  </div>
                  <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-[#0A1A0E] hover:bg-[#173B63] text-white py-4 rounded-xl font-bold transition-all disabled:opacity-50">
                    {loading ? "Sending..." : "Send Message"} <Send size={18} />
                  </button>
                </form>
              ) : (
                <div className="py-12 text-center">
                  <div className="w-20 h-20 bg-[#4CAF50]/10 text-[#4CAF50] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Message Received!</h3>
                  <p className="text-gray-500 mb-8 max-w-sm mx-auto">Thank you for reaching out. Our team will review your message and get back to you shortly.</p>
                  <button onClick={() => { setForm({ firstName: "", email: "", subject: "", message: "" }); setSubmitted(false); }} className="text-[#0B5D3F] font-bold hover:underline">
                    Send another message
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
"""

with open(contact_section_path, "w") as f:
    f.write(contact_section_content)

# 4. Update AdminDashboard.tsx to include FAQAdminView
with open(dashboard_path, "r") as f:
    dashboard_content = f.read()

# Add import
dashboard_content = dashboard_content.replace(
    'import { MessagesView } from "./sections/MessagesView";',
    'import { MessagesView } from "./sections/MessagesView";\nimport FAQAdminView from "./sections/FAQAdminView";'
)

# Add sidebar item
dashboard_content = dashboard_content.replace(
    '{ icon: MessageSquare, label: "Testimonials", id: "testimonials" },',
    '{ icon: MessageSquare, label: "Testimonials", id: "testimonials" },\n    { icon: MessageSquare, label: "FAQ / Q&A", id: "faq" },'
)

# Add switch case
dashboard_content = dashboard_content.replace(
    'case "messages":',
    'case "faq":\n        return <FAQAdminView />;\n      case "messages":'
)

with open(dashboard_path, "w") as f:
    f.write(dashboard_content)

# 5. Update Home.tsx to include FAQSection and ContactSection
with open(home_path, "r") as f:
    home_content = f.read()

home_content = home_content.replace(
    'import { DonateCTASection } from "../components/home/DonateCTASection";',
    'import { DonateCTASection } from "../components/home/DonateCTASection";\nimport { FAQSection } from "../components/home/FAQSection";\nimport { ContactSection } from "../components/home/ContactSection";'
)

home_content = home_content.replace(
    '<DonateCTASection />\n      <div className="h-24 lg:h-32 bg-[#F6FBF8]" />\n    </main>',
    '<DonateCTASection />\n      <FAQSection />\n      <ContactSection />\n    </main>'
)

with open(home_path, "w") as f:
    f.write(home_content)

print("All components created and linked.")
