import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

import { getInitialTestimonials } from "../../pages/admin/sections/TestimonialsView";
import { useFirestoreData } from "../../../lib/useFirestore";

export function TestimonialsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [testimonials] = useFirestoreData<any[]>("esn_testimonials", getInitialTestimonials());
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  return (
    <section ref={ref} className="py-16 bg-white overflow-hidden relative">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-0 w-80 h-80 bg-[#0B5D3F]/3 rounded-full translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#4CAF50]/3 rounded-full -translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-[#D6A95A]/15 text-[#D6A95A] text-sm font-semibold px-5 py-2 rounded-full mb-5">
            <Star size={14} fill="currentColor" />
            Testimonials
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B5D3F] mb-6">
            Voices from Our <span className="text-[#4CAF50]">Global Network</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            What partners, volunteers, researchers, and governments say about working with ESN.
          </p>
        </motion.div>

        {/* Desktop Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden md:grid md:grid-cols-2 gap-8"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="bg-[#F6FBF8] rounded-3xl p-8 border border-gray-100 hover:border-[#0B5D3F]/15 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative group"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote size={60} className="text-[#0B5D3F]" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-5">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} size={14} className="text-[#D6A95A]" fill="#D6A95A" />
                ))}
              </div>

              <p className="text-gray-700 leading-relaxed mb-6 relative z-10">"{t.quote}"</p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-5 border-t border-gray-100">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#0B5D3F]/20 shrink-0">
                  <ImageWithFallback
                    src={t.avatar}
                    alt={t.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.name}</div>
                  <div className="text-sm text-[#0B5D3F] font-medium">{t.role}</div>
                  <div className="text-xs text-gray-400">{t.org} · {t.country}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <div className="relative overflow-hidden rounded-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.4 }}
                className="bg-[#F6FBF8] rounded-3xl p-8 border border-gray-100"
              >
                <div className="flex gap-1 mb-5">
                  {[...Array(testimonials[current].rating)].map((_, j) => (
                    <Star key={j} size={14} className="text-[#D6A95A]" fill="#D6A95A" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6">"{testimonials[current].quote}"</p>
                <div className="flex items-center gap-4 pt-5 border-t border-gray-100">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#0B5D3F]/20">
                    <ImageWithFallback src={testimonials[current].avatar} alt={testimonials[current].name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonials[current].name}</div>
                    <div className="text-sm text-[#0B5D3F]">{testimonials[current].role}</div>
                    <div className="text-xs text-gray-400">{testimonials[current].country}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-4 mt-6">
            <button onClick={prev} className="w-10 h-10 rounded-full bg-[#F6FBF8] border border-gray-200 flex items-center justify-center hover:bg-[#0B5D3F] hover:text-white hover:border-[#0B5D3F] transition-all">
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === current ? "w-6 bg-[#0B5D3F]" : "bg-gray-300"}`}
                />
              ))}
            </div>
            <button onClick={next} className="w-10 h-10 rounded-full bg-[#F6FBF8] border border-gray-200 flex items-center justify-center hover:bg-[#0B5D3F] hover:text-white hover:border-[#0B5D3F] transition-all">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
