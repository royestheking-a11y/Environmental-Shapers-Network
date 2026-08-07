import { motion } from "motion/react";
import { Globe2, Microscope, GraduationCap } from "lucide-react";
import { Link } from "react-router";

import { useState, useEffect } from "react";
import { getInitialWhoWeAreFeatures } from "../../pages/admin/sections/WhoWeAreAdminView";
import { useFirestoreData } from "../../../lib/useFirestore";
import { resolveIcon } from "../../pages/admin/sections/ProgramsView";

const defaultFeatures = [
  {
    iconName: "Globe2",
    title: "Global-Local Integration",
    description: "We operate through regional hubs and grassroots networks, ensuring solutions are globally informed and locally owned.",
    color: "text-[#0A3D2A]",
    bgColor: "bg-[#E6F3EB]"
  },
  {
    iconName: "Microscope",
    title: "Evidence-Based Research",
    description: "Every program is grounded in rigorous science, co-designed with leading universities and experts.",
    color: "text-[#0A3D2A]",
    bgColor: "bg-[#E6F3EB]"
  },
  {
    iconName: "GraduationCap",
    title: "Youth-Centred Leadership",
    description: "We invest in the next generation — equipping youth with tools to drive lasting systemic change.",
    color: "text-[#0A3D2A]",
    bgColor: "bg-[#E6F3EB]"
  }
];

export function WhoWeAreSection() {
  const [featuresRaw] = useFirestoreData<any[]>("esn_who_we_are", getInitialWhoWeAreFeatures());
  
  const features = (featuresRaw || defaultFeatures).map(f => ({
    iconName: f.iconName,
    title: f.title,
    description: f.description,
    color: "text-[#0A3D2A]",
    bgColor: "bg-[#E6F3EB]"
  }));
  return (
    <section className="py-16 bg-[#F8FCF9] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-6 h-[2px] bg-[#0A3D2A]/40" />
              <span className="text-[#0A3D2A] text-xs font-bold uppercase tracking-[0.2em]">Who We Are</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-[#0A3D2A] mb-6 leading-[1.15]">
              Shaping Change Through Science, Community & Courage
            </h2>
            
            <p className="text-lg text-gray-600 mb-10 leading-relaxed font-light">
              Environmental Shapers Network (ESN) is a globally active NGO bringing together environmental scientists, frontline communities, youth advocates, researchers, and policymakers across 80+ countries. We operate at the intersection of ecology, social justice, and systemic innovation.
            </p>
            
            <div className="flex items-center gap-5 mb-10 bg-white p-3 pr-8 rounded-full shadow-xl shadow-[#0A3D2A]/5 w-fit border border-[#0A3D2A]/10">
              <div className="bg-[#0A3D2A] text-white w-14 h-14 rounded-full flex items-center justify-center text-2xl font-serif font-bold">7+</div>
              <div className="text-xs font-bold text-[#0A3D2A] uppercase tracking-widest leading-snug">Years of<br/>Global Action</div>
            </div>

            <div className="relative mb-10 w-full rounded-3xl overflow-hidden shadow-2xl shadow-gray-200/50 group">
              <div className="h-64 sm:h-80 w-full relative">
                <img 
                  src="/Representing Bangladesh's Coastal Communities on the Global Stage.jpeg" 
                  alt="Environmental landscape"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>

          </motion.div>

          <div className="space-y-8">
            {features.map((feature, index) => {
              const Icon = resolveIcon(feature.iconName);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="flex gap-6 items-start group"
                >
                  <div className={`shrink-0 w-14 h-14 ${feature.bgColor} rounded-[20px] flex items-center justify-center transition-transform duration-500 group-hover:scale-110`}>
                    <Icon size={24} className={feature.color} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif text-[#0A3D2A] mb-2">{feature.title}</h3>
                    <p className="text-gray-500 font-light leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="pt-6"
            >
              <Link to="/programs" className="inline-flex items-center justify-center bg-[#46986F] text-white px-8 py-4 rounded-full font-medium hover:bg-[#347855] transition-all duration-300 shadow-lg shadow-[#46986F]/20 hover:shadow-xl hover:shadow-[#46986F]/30 hover:-translate-y-1">
                Our Core Programs
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
