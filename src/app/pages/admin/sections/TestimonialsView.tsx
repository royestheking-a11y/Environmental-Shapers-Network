import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Search, Edit3, Trash2, Quote, Star, AlertCircle } from "lucide-react";
import { ImageUploadField } from "../../../components/ui/ImageUploadField";

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatar: string;
  quote: string;
  org: string;
  country: string;
  rating: number;
}

export function getInitialTestimonials(): Testimonial[] {
  return [
    {
      id: 1,
      name: "Dr. Amara Diallo",
      role: "Director of Climate Research, UNEP",
      avatar: "https://images.unsplash.com/photo-1560220604-1985ebfe28b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=200",
      quote: "ESN has set a new standard for environmental NGOs. Their community-first approach combined with rigorous science makes them one of the most impactful organizations I've worked with in 25 years of climate work.",
      org: "United Nations Environment Programme",
      country: "Kenya",
      rating: 5,
    },
    {
      id: 2,
      name: "Minister Priya Nair",
      role: "Minister of Environment",
      avatar: "https://images.unsplash.com/photo-1630569266941-f8a348786bf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=200",
      quote: "The partnership with ESN transformed how our government approaches forest restoration. Their data-driven methodologies and grassroots networks are unmatched. We've restored 40,000 hectares together.",
      org: "Ministry of Environment, India",
      country: "India",
      rating: 5,
    },
    {
      id: 3,
      name: "Carlos Mendez",
      role: "Youth Climate Ambassador",
      avatar: "https://images.unsplash.com/photo-1618477462041-2b6b1920e073?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=200",
      quote: "Joining ESN changed my life. They gave me the tools, training, and global network to lead real climate action in my community. Our chapter has planted 15,000 trees and trained 300 youth leaders.",
      org: "ESN Youth Chapter, Colombia",
      country: "Colombia",
      rating: 5,
    },
    {
      id: 4,
      name: "Sarah Chen",
      role: "Corporate Sustainability Lead",
      avatar: "https://images.unsplash.com/photo-1758599669406-d5179ccefcb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=200",
      quote: "ESN's corporate partnership program helped us achieve our net-zero goals with authenticity. Their impact reporting is transparent, measurable, and auditable — exactly what we need for credible ESG commitments.",
      org: "GreenTech Solutions",
      country: "Singapore",
      rating: 5,
    },
  ];
}

import { useFirestoreData } from "../../../../lib/useFirestore";

export default function TestimonialsView() {
  const [testimonials, setTestimonials, loading] = useFirestoreData<Testimonial[]>("esn_testimonials_admin", getInitialTestimonials());
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const [formData, setFormData] = useState<Partial<Testimonial>>({
    name: "", role: "", avatar: "", quote: "", org: "", country: "", rating: 5
  });

  const saveTestimonials = (newData: Testimonial[]) => {
    setTestimonials(newData);
    
  };

  const handleSave = () => {
    if (!formData.name || !formData.quote) return;
    
    if (editingId !== null) {
      saveTestimonials(testimonials.map(t => t.id === editingId ? { ...t, ...formData } as Testimonial : t));
      setEditingId(null);
    } else {
      const newId = testimonials.length > 0 ? Math.max(...testimonials.map(t => t.id)) + 1 : 1;
      saveTestimonials([{ ...formData, id: newId } as Testimonial, ...testimonials]);
    }
    setShowAdd(false);
    setFormData({ name: "", role: "", avatar: "", quote: "", org: "", country: "", rating: 5 });
  };

  const startEdit = (t: Testimonial) => {
    setFormData(t);
    setEditingId(t.id);
    setShowAdd(true);
  };

  const confirmDelete = () => {
    if (deleteConfirmId !== null) {
      saveTestimonials(testimonials.filter(t => t.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  const filtered = (testimonials || []).filter(t => {
    if (!t) return false;
    const name = String(t.name || "").toLowerCase();
    const org = String(t.org || "").toLowerCase();
    const q = String(search || "").toLowerCase().trim();
    return !q || name.includes(q) || org.includes(q);
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-900 font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Testimonials Manager</h3>
          <p className="text-sm text-gray-400">Manage quotes and endorsements on the homepage.</p>
        </div>
        <button onClick={() => { setEditingId(null); setFormData({ name: "", role: "", avatar: "", quote: "", org: "", country: "", rating: 5 }); setShowAdd(true); }} className="flex items-center gap-2 bg-[#0B5D3F] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#0a5237] transition-all">
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-white rounded-2xl p-6 border border-[#4CAF50]/30 overflow-hidden">
            <h4 className="font-bold text-gray-900 mb-5">{editingId ? "Edit Testimonial" : "Add Testimonial"}</h4>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Name *</label>
                <input type="text" value={formData.name || ""} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Role / Title</label>
                <input type="text" value={formData.role || ""} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Organization</label>
                <input type="text" value={formData.org || ""} onChange={e => setFormData({ ...formData, org: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Country</label>
                <input type="text" value={formData.country || ""} onChange={e => setFormData({ ...formData, country: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
              </div>
              <div className="sm:col-span-2">
                <ImageUploadField
                  label="Profile Avatar / Photo"
                  value={formData.avatar || ""}
                  onChange={(url) => setFormData({ ...formData, avatar: url })}
                  folder="testimonials"
                  aspectRatio="square"
                  helpText="Upload a square headshot photo"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Rating (1-5)</label>
                <input type="number" min={1} max={5} value={formData.rating || 5} onChange={e => setFormData({ ...formData, rating: Number(e.target.value) })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Quote *</label>
                <textarea value={formData.quote || ""} onChange={e => setFormData({ ...formData, quote: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] h-24 resize-none" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleSave} className="bg-[#0B5D3F] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0a5237] transition-all">Save Testimonial</button>
              <button onClick={() => setShowAdd(false)} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-all">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirmId !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-3xl p-8 max-w-sm w-full text-center">
              <AlertCircle size={32} className="text-red-500 mx-auto mb-4" />
              <h4 className="font-bold text-gray-900 mb-2">Delete Testimonial?</h4>
              <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={confirmDelete} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600">Yes, Delete</button>
                <button onClick={() => setDeleteConfirmId(null)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-6">
        <div className="relative max-w-sm mb-6">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search testimonials..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none" />
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map(t => (
            <div key={t.id} className="border border-gray-100 rounded-2xl p-5 hover:border-[#0B5D3F]/20 transition-all relative group">
              <Quote size={24} className="text-[#0B5D3F]/10 absolute top-5 right-5" />
              <div className="flex items-center gap-4 mb-4">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{t.name}</h4>
                  <div className="text-xs text-gray-500">{t.role}</div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3 italic">"{t.quote}"</p>
              <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                <div className="flex gap-1 text-[#4CAF50]">
                  {[...Array(t.rating || 5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => startEdit(t)} className="p-1.5 text-gray-400 hover:bg-[#0B5D3F]/10 hover:text-[#0B5D3F] rounded-lg">
                    <Edit3 size={15} />
                  </button>
                  <button onClick={() => setDeleteConfirmId(t.id)} className="p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-lg">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
