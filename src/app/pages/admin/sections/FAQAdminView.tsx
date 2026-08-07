import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Search, Edit3, Trash2, AlertCircle } from "lucide-react";

export interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export function getInitialFAQs(): FAQ[] {
  return [
    { id: 1, question: "How does ESN ensure transparency with donations?", answer: "We publish comprehensive quarterly financial reports and send all donors direct impact summaries detailing exactly where and how their funds were deployed." },
    { id: 2, question: "Can I volunteer if I don't have a background in environmental science?", answer: "Absolutely! We welcome volunteers from all backgrounds. Whether you have skills in marketing, logistics, education, or simply a passion for nature, there is a place for you." },
    { id: 3, question: "Where are your reforestation projects located?", answer: "Currently, our primary reforestation efforts are concentrated across Southeast Asia, Sub-Saharan Africa, and parts of South America, partnering directly with indigenous communities." },
    { id: 4, question: "How do I partner my organization with ESN?", answer: "You can reach out through our contact form. Our partnership team reviews all inquiries and typically responds within 3-5 business days." }
  ];
}

import { useFirestoreData } from "../../../../lib/useFirestore";

export default function FAQAdminView() {
  const [faqs, setFaqs, loading] = useFirestoreData<FAQ[]>("esn_faq_admin", getInitialFAQs());
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<FAQ>>({ question: "", answer: "" });

  const saveFaqs = (newData: FAQ[]) => {
    setFaqs(newData);
    
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
