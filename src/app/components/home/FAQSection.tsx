import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { Plus, Minus, MessageCircleQuestion } from "lucide-react";
import { getInitialFAQs, FAQ } from "../../pages/admin/sections/FAQAdminView";
import { useFirestoreData } from "../../../lib/useFirestore";

export function FAQSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [faqsRaw] = useFirestoreData<FAQ[]>("esn_faqs", getInitialFAQs());
  const faqs = faqsRaw || [];
  const [openId, setOpenId] = useState<number | null>(1);

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
