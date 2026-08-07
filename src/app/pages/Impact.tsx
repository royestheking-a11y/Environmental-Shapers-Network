import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { TreePine, Droplets, Wind, Globe2, Users, Target, TrendingUp, Award, Leaf } from "lucide-react";

const treeData = [
  { year: "2018", trees: 120000 },
  { year: "2019", trees: 350000 },
  { year: "2020", trees: 680000 },
  { year: "2021", trees: 1100000 },
  { year: "2022", trees: 1650000 },
  { year: "2023", trees: 2100000 },
  { year: "2024", trees: 2400000 },
];

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

const kpis = [
  { icon: TreePine, value: "2.4M+", label: "Trees Planted", change: "+18% vs last year", color: "#0B5D3F" },
  { icon: Droplets, value: "150,000 MT", label: "CO₂ Sequestered", change: "+24% vs last year", color: "#173B63" },
  { icon: Users, value: "12,000+", label: "Communities Reached", change: "+31% vs last year", color: "#4CAF50" },
  { icon: Globe2, value: "80+", label: "Countries Active", change: "+5 new countries", color: "#D6A95A" },
  { icon: Target, value: "470+", label: "Active Projects", change: "+67 new projects", color: "#0B5D3F" },
  { icon: Award, value: "24", label: "International Awards", change: "+3 this year", color: "#4CAF50" },
];

export default function Impact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

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
            {kpis.map((kpi, i) => (
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
                <AreaChart data={treeData}>
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
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={thematicBreakdown} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${value}%`} labelLine={false}>
                    {thematicBreakdown.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
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
