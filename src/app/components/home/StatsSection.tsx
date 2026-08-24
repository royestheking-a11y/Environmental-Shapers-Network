import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import { getInitialStats } from "../../pages/admin/sections/StatsAdminView";
import { useFirestoreData } from "../../../lib/useFirestore";
import { resolveIcon } from "../../pages/admin/sections/ProgramsView";

export interface StatItem {
  iconName: string;
  value: number;
  suffix: string;
  label: string;
  description: string;
  color: string;
  bgColor: string;
}

const defaultStats: StatItem[] = [
  { iconName: "TreePine", value: 2400000, suffix: "+", label: "Trees Planted", description: "Across reforestation projects worldwide", color: "text-[#0B5D3F]", bgColor: "bg-[#0B5D3F]/10" },
  { iconName: "Users", value: 190, suffix: "+", label: "Countries Reached", description: "Our global network of change-makers", color: "text-[#173B63]", bgColor: "bg-[#173B63]/10" },
  { iconName: "Target", value: 470, suffix: "+", label: "Active Projects", description: "Environmental initiatives in progress", color: "text-[#4CAF50]", bgColor: "bg-[#4CAF50]/10" },
  { iconName: "Globe2", value: 80, suffix: "+", label: "Partner Countries", description: "International collaborations active", color: "text-[#D6A95A]", bgColor: "bg-[#D6A95A]/10" },
  { iconName: "Building2", value: 12000, suffix: "+", label: "Communities", description: "Local communities benefited globally", color: "text-[#0B5D3F]", bgColor: "bg-[#0B5D3F]/10" },
  { iconName: "Leaf", value: 150000, suffix: " MT", label: "CO₂ Reduced", description: "Metric tons of carbon sequestered", color: "text-[#4CAF50]", bgColor: "bg-[#4CAF50]/10" },
];

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(0) + "K";
  return n.toString();
}

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {formatNumber(count)}{suffix}
    </span>
  );
}

export function StatsSection() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [statsRaw] = useFirestoreData<StatItem[]>("esn_stats_admin", getInitialStats());
  const stats = statsRaw && statsRaw.length > 0 ? statsRaw : defaultStats;

  return (
    <section ref={sectionRef} className="py-16 bg-white relative overflow-hidden border-t border-gray-100">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#4CAF50]/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#0B5D3F]/5 rounded-full translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((stat, i) => {
            const Icon = resolveIcon(stat.iconName);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group text-center p-6 rounded-2xl bg-[#F6FBF8] hover:bg-white hover:shadow-xl hover:shadow-[#0B5D3F]/10 border border-transparent hover:border-[#0B5D3F]/10 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-14 h-14 ${stat.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={26} className={stat.color} />
                </div>
                <div
                  className={`text-3xl font-black ${stat.color} mb-1`}
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm font-bold text-gray-800 mb-1">{stat.label}</div>
                <div className="text-xs text-gray-400 leading-tight">{stat.description}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
