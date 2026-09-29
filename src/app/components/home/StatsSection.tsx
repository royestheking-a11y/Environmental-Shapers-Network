import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import { getInitialStats, StatItem } from "../../pages/admin/sections/StatsAdminView";
import { useFirestoreData } from "../../../lib/useFirestore";
import { resolveIcon } from "../../pages/admin/sections/ProgramsView";

export { type StatItem };

function formatNumber(n: number): string {
  if (isNaN(n) || n === null || n === undefined) return "0";
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1000000) return sign + (abs / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  if (abs >= 1000) return sign + (abs / 1000).toFixed(0) + "K";
  return sign + abs.toLocaleString();
}

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    if (isNaN(target)) {
      setCount(0);
      return;
    }
    const duration = 1500;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if ((increment >= 0 && current >= target) || (increment < 0 && current <= target)) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.round(current));
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

  const stats = statsRaw && statsRaw.length > 0 ? statsRaw : getInitialStats();

  return (
    <section ref={sectionRef} className="py-16 bg-white relative overflow-hidden border-t border-gray-100">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#4CAF50]/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#0B5D3F]/5 rounded-full translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-flow-col lg:auto-cols-fr gap-4 sm:gap-6">
          {stats.map((stat, i) => {
            const Icon = resolveIcon(stat.iconName);
            return (
              <motion.div
                key={stat.id ?? i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group text-center p-4 sm:p-5 lg:p-5 xl:p-6 rounded-2xl bg-[#F6FBF8] hover:bg-white hover:shadow-xl hover:shadow-[#0B5D3F]/10 border border-transparent hover:border-[#0B5D3F]/10 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 ${stat.bgColor || "bg-[#0B5D3F]/10"} rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={24} className={stat.color || "text-[#0B5D3F]"} />
                  </div>
                  <div
                    className={`text-2xl sm:text-3xl font-black ${stat.color || "text-[#0B5D3F]"} mb-1 tracking-tight`}
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    <AnimatedCounter target={Number(stat.value) || 0} suffix={stat.suffix || ""} />
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-gray-800 mb-1 leading-snug line-clamp-2">{stat.label}</div>
                </div>
                <div className="text-[11px] sm:text-xs text-gray-400 leading-tight mt-1 line-clamp-3">{stat.description}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

