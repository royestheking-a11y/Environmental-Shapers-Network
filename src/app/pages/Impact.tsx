import { useState, useRef } from "react";
import { motion, useInView } from "motion/react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { TreePine, Droplets, Wind, Globe2, Users, Target, TrendingUp, Award, Leaf, Calculator, ArrowRight, Sparkles } from "lucide-react";
import { useFirestoreData } from "../../lib/useFirestore";
import { getInitialStats, StatItem } from "./admin/sections/StatsAdminView";

const carbonData = [
  { month: "Jan", reduced: 8500 },
  { month: "Feb", reduced: 9200 },
  { month: "Mar", reduced: 11000 },
  { month: "Apr", reduced: 13400 },
  { month: "May", reduced: 15800 },
  { month: "Jun", reduced: 18200 },
  { month: "Jul", reduced: 21000 },
  { month: "Aug", reduced: 19500 },
  { month: "Sep", reduced: 22000 },
  { month: "Oct", reduced: 20800 },
  { month: "Nov", reduced: 17600 },
  { month: "Dec", reduced: 15000 },
];

const thematicBreakdown = [
  { name: "Forest Restoration", value: 35, color: "#0B5D3F" },
  { name: "Marine Conservation", value: 20, color: "#173B63" },
  { name: "Renewable Energy", value: 18, color: "#D6A95A" },
  { name: "Climate Advocacy", value: 15, color: "#4CAF50" },
  { name: "Community Programs", value: 12, color: "#5B8DB8" },
];

const sdgProgress = [
  { sdg: "SDG 13", label: "Climate Action", progress: 68, color: "#4CAF50" },
  { sdg: "SDG 15", label: "Life on Land", progress: 74, color: "#0B5D3F" },
  { sdg: "SDG 14", label: "Life Below Water", progress: 56, color: "#173B63" },
  { sdg: "SDG 6", label: "Clean Water", progress: 62, color: "#5B8DB8" },
  { sdg: "SDG 7", label: "Clean Energy", progress: 45, color: "#D6A95A" },
];

function formatCount(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M+";
  if (n >= 1000) return (n / 1000).toFixed(0) + "K+";
  return n.toLocaleString() + "+";
}

export default function Impact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [statsRaw] = useFirestoreData<StatItem[]>("esn_stats_admin", getInitialStats());
  const rawList = statsRaw && statsRaw.length > 0 ? statsRaw : getInitialStats();

  const treeStat = rawList.find(s => s.label.toLowerCase().includes("tree") || s.iconName === "TreePine");
  const currentTreeCount = treeStat ? treeStat.value : 2400000;
  const currentCO2 = Math.round(currentTreeCount * 0.0625);

  // Dynamic tree trend dataset based on current count
  const dynamicTreeData = [
    { year: "2018", trees: Math.round(currentTreeCount * 0.05) },
    { year: "2019", trees: Math.round(currentTreeCount * 0.15) },
    { year: "2020", trees: Math.round(currentTreeCount * 0.28) },
    { year: "2021", trees: Math.round(currentTreeCount * 0.46) },
    { year: "2022", trees: Math.round(currentTreeCount * 0.69) },
    { year: "2023", trees: Math.round(currentTreeCount * 0.88) },
    { year: "2024", trees: currentTreeCount },
  ];

  // Interactive Live Calculator state
  const [calcTrees, setCalcTrees] = useState<number>(currentTreeCount);
  const calcCO2MT = Math.round(calcTrees * 0.0625);
  const calcCO2Kg = Math.round(calcTrees * 62.5);
  const calcVehicles = Math.round(calcCO2MT / 4.6);
  const calcHectares = (calcTrees / 500).toFixed(1);

  const dynamicKpis = [
    { icon: TreePine, value: formatCount(currentTreeCount), label: "Trees Planted", change: "+18% vs last year", color: "#0B5D3F" },
    { icon: Droplets, value: `${currentCO2.toLocaleString()} MT`, label: "CO₂ Sequestered", change: `Derived from ${formatCount(currentTreeCount)} trees`, color: "#173B63" },
    { icon: Users, value: "12,000+", label: "Communities Reached", change: "+31% vs last year", color: "#4CAF50" },
    { icon: Globe2, value: "80+", label: "Countries Active", change: "+5 new countries", color: "#D6A95A" },
    { icon: Target, value: "470+", label: "Active Projects", change: "+67 new projects", color: "#0B5D3F" },
    { icon: Award, value: "24", label: "International Awards", change: "+3 this year", color: "#4CAF50" },
  ];

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0B5D3F] to-[#173B63] py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white text-sm font-semibold px-5 py-2 rounded-full mb-6">
              <TrendingUp size={14} />
              Impact Dashboard
            </div>
            <h1 className="text-white mb-4">Measuring Real Change</h1>
            <p className="text-white/70 text-lg max-w-xl mx-auto">
              Transparent, data-driven reporting of our environmental and social impact across all programs and geographies.
            </p>
          </motion.div>
        </div>
      </section>

      {/* KPIs */}
      <section ref={ref} className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {dynamicKpis.map((kpi, i) => (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08 }}
                className="bg-[#F6FBF8] rounded-2xl p-5 text-center border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: kpi.color + "15" }}>
                  <kpi.icon size={22} style={{ color: kpi.color }} />
                </div>
                <div className="text-2xl font-black mb-1" style={{ color: kpi.color, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{kpi.value}</div>
                <div className="text-xs font-bold text-gray-700 mb-1">{kpi.label}</div>
                <div className="text-xs text-[#4CAF50] font-medium">{kpi.change}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Tree-to-Carbon Calculation System */}
      <section className="py-12 bg-gradient-to-b from-white to-[#F6FBF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-[#0B5D3F] via-[#0D4B34] to-[#173B63] rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-wider mb-4">
                <Calculator size={13} className="text-[#4CAF50]" />
                Dynamic Impact Engine
              </div>
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                <div>
                  <h3 className="text-2xl md:text-3xl font-black mb-3 text-white" style={{ color: "#FFFFFF", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Tree & CO₂ Sequestration Calculator
                  </h3>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255, 255, 255, 0.85)" }}>
                    Our carbon sequestration model follows verified scientific metrics where 1 mature tree absorbs approximately <strong className="text-white">62.5 kg (0.0625 MT)</strong> of atmospheric CO₂ over its lifetime. Adjust the tree count below to view the synchronized carbon impact in real-time.
                  </p>

                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15">
                    <div className="flex justify-between items-center text-sm font-bold mb-3">
                      <span className="text-white" style={{ color: "#FFFFFF" }}>Planted Trees:</span>
                      <span className="text-[#4CAF50] font-mono text-lg font-bold">{calcTrees.toLocaleString()} trees</span>
                    </div>
                    <input
                      type="range"
                      min={10000}
                      max={10000000}
                      step={50000}
                      value={calcTrees}
                      onChange={(e) => setCalcTrees(Number(e.target.value))}
                      className="w-full h-2.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#4CAF50]"
                    />
                    <div className="flex justify-between text-[11px] mt-2" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                      <span>10K Trees</span>
                      <span>5M Trees</span>
                      <span>10M Trees</span>
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15">
                    <div className="w-10 h-10 rounded-xl bg-[#4CAF50]/20 flex items-center justify-center mb-3">
                      <Droplets size={20} className="text-[#4CAF50]" />
                    </div>
                    <div className="text-2xl font-black font-mono text-white mb-1">
                      {calcCO2MT.toLocaleString()} MT
                    </div>
                    <div className="text-xs text-white/70 font-semibold">CO₂ Sequestered</div>
                    <div className="text-[11px] text-[#4CAF50] mt-1">{calcCO2Kg.toLocaleString()} kg CO₂ captured</div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15">
                    <div className="w-10 h-10 rounded-xl bg-[#D6A95A]/20 flex items-center justify-center mb-3">
                      <Wind size={20} className="text-[#D6A95A]" />
                    </div>
                    <div className="text-2xl font-black font-mono text-white mb-1">
                      {calcVehicles.toLocaleString()}
                    </div>
                    <div className="text-xs text-white/70 font-semibold">Vehicles Offset / Year</div>
                    <div className="text-[11px] text-[#D6A95A] mt-1">Passenger car emissions neutralized</div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15">
                    <div className="w-10 h-10 rounded-xl bg-emerald-400/20 flex items-center justify-center mb-3">
                      <Leaf size={20} className="text-emerald-300" />
                    </div>
                    <div className="text-2xl font-black font-mono text-white mb-1">
                      {calcHectares} ha
                    </div>
                    <div className="text-xs text-white/70 font-semibold">Forest Canopy Restored</div>
                    <div className="text-[11px] text-emerald-300 mt-1">~500 trees / hectare density</div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15">
                    <div className="w-10 h-10 rounded-xl bg-cyan-400/20 flex items-center justify-center mb-3">
                      <TreePine size={20} className="text-cyan-300" />
                    </div>
                    <div className="text-2xl font-black font-mono text-white mb-1">
                      1 : 0.0625
                    </div>
                    <div className="text-xs text-white/70 font-semibold">Standard Ratio</div>
                    <div className="text-[11px] text-cyan-300 mt-1">16 trees = 1.0 MT CO₂ absorbed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Charts Grid */}
      <section className="py-16 bg-[#F6FBF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Tree Planting Trend */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#0B5D3F]/10 rounded-xl flex items-center justify-center">
                  <TreePine size={20} className="text-[#0B5D3F]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Tree Planting Progress</h4>
                  <p className="text-xs text-gray-400">Cumulative trees planted 2018–2024</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={dynamicTreeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                  <Tooltip formatter={(v: number) => [v.toLocaleString(), "Trees"]} />
                  <Area type="monotone" dataKey="trees" stroke="#0B5D3F" strokeWidth={2.5} fill="#0B5D3F" fillOpacity={0.18} />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Carbon Reduction */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#4CAF50]/10 rounded-xl flex items-center justify-center">
                  <Wind size={20} className="text-[#4CAF50]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Monthly CO₂ Reduction</h4>
                  <p className="text-xs text-gray-400">Metric tons sequestered monthly (2024)</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={carbonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: number) => [`${v.toLocaleString()} MT`, "CO₂ Reduced"]} />
                  <Bar dataKey="reduced" fill="#4CAF50" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Thematic Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#173B63]/10 rounded-xl flex items-center justify-center">
                  <Globe2 size={20} className="text-[#173B63]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Thematic Focus Areas</h4>
                  <p className="text-xs text-gray-400">Percentage breakdown of project themes</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie data={thematicBreakdown} cx="50%" cy="45%" outerRadius={85} dataKey="value" label={({ name, value }) => `${value}%`} labelLine={false}>
                    {thematicBreakdown.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend wrapperStyle={{ paddingTop: "20px", fontSize: "14px" }} />
                  <Tooltip formatter={(v) => [`${v}%`, "Share"]} />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* SDG Progress */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#D6A95A]/15 rounded-xl flex items-center justify-center">
                  <Target size={20} className="text-[#D6A95A]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>SDG Progress Tracker</h4>
                  <p className="text-xs text-gray-400">ESN's contribution to UN Sustainable Development Goals</p>
                </div>
              </div>
              <div className="flex flex-col gap-5">
                {sdgProgress.map((sdg) => (
                  <div key={sdg.sdg}>
                    <div className="flex justify-between text-sm mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded text-white" style={{ backgroundColor: sdg.color }}>{sdg.sdg}</span>
                        <span className="font-medium text-gray-700">{sdg.label}</span>
                      </div>
                      <span className="font-bold" style={{ color: sdg.color }}>{sdg.progress}%</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${sdg.progress}%` } : {}}
                        transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: sdg.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
