import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Link } from "react-router";
import { Heart, TreePine, Users, Globe2, Leaf, Sparkles, CheckCircle2 } from "lucide-react";


const currencyConfigs = {
  BDT: {
    symbol: "৳",
    tiers: [
      { amount: 2500, label: "Seed Planter", impact: "Plants 5 trees in a reforestation zone", icon: Leaf, popular: false },
      { amount: 10000, label: "Grove Guardian", impact: "Restores 0.1 acres of degraded habitat", icon: TreePine, popular: true },
      { amount: 50000, label: "Forest Champion", impact: "Supports a community nursery for 1 month", icon: Globe2, popular: false },
      { amount: 100000, label: "Earth Defender", impact: "Funds a youth climate workshop in a school", icon: Users, popular: false },
    ]
  },
  USD: {
    symbol: "$",
    tiers: [
      { amount: 25, label: "Seed Planter", impact: "Plants 5 trees in a reforestation zone", icon: Leaf, popular: false },
      { amount: 100, label: "Grove Guardian", impact: "Restores 0.1 acres of degraded habitat", icon: TreePine, popular: true },
      { amount: 500, label: "Forest Champion", impact: "Supports a community nursery for 1 month", icon: Globe2, popular: false },
      { amount: 1000, label: "Earth Defender", impact: "Funds a youth climate workshop in a school", icon: Users, popular: false },
    ]
  },
  EUR: {
    symbol: "€",
    tiers: [
      { amount: 25, label: "Seed Planter", impact: "Plants 5 trees in a reforestation zone", icon: Leaf, popular: false },
      { amount: 100, label: "Grove Guardian", impact: "Restores 0.1 acres of degraded habitat", icon: TreePine, popular: true },
      { amount: 500, label: "Forest Champion", impact: "Supports a community nursery for 1 month", icon: Globe2, popular: false },
      { amount: 1000, label: "Earth Defender", impact: "Funds a youth climate workshop in a school", icon: Users, popular: false },
    ]
  }
};


export function DonateCTASection() {
  const [currency, setCurrency] = useState<"BDT" | "USD" | "EUR">("BDT");
  const activeCurrency = currencyConfigs[currency];
  const activeTiers = activeCurrency.tiers;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 relative bg-[#F6FBF8] overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#4CAF50]/5 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#0B5D3F]/5 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-10 lg:items-end justify-between mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 bg-[#4CAF50]/10 text-[#0B5D3F] text-sm font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider">
              <Heart size={14} className="text-[#4CAF50]" fill="currentColor" />
              Make a Difference Today
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#0A1A0E] mb-6 leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Your Donation Plants <br/>
              <span className="text-[#4CAF50]">Real Forests</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              100% of your donation goes directly to environmental projects. Zero overhead on nature restoration. Every rupiah, dollar, and euro counts.
            </p>
          </motion.div>
          
          <motion.div
             initial={{ opacity: 0, x: 30 }}
             animate={inView ? { opacity: 1, x: 0 } : {}}
             transition={{ duration: 0.6, delay: 0.2 }}
             className="flex flex-col sm:flex-row items-center gap-4 shrink-0"
          >
            <Link
              to="/donate"
              className="flex items-center justify-center gap-2 bg-[#0A1A0E] hover:bg-[#173B63] text-white px-8 py-4 rounded-full font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl w-full sm:w-auto"
            >
              <Heart size={18} fill="currentColor" className="text-[#4CAF50]" />
              Donate Now
            </Link>
            <Link
              to="/volunteer"
              className="flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 hover:border-[#4CAF50] hover:text-[#0B5D3F] px-8 py-4 rounded-full font-bold transition-all duration-300 hover:shadow-lg w-full sm:w-auto"
            >
              <Users size={18} />
              Volunteer Instead
            </Link>
          </motion.div>
        </div>

        
        {/* Currency Selector */}
        <div className="flex justify-center mb-8 relative z-10">
          <div className="flex items-center gap-2 bg-white rounded-full p-1.5 shadow-sm border border-gray-200">
            {(["BDT", "USD", "EUR"] as const).map(c => (
              <button 
                key={c} 
                onClick={() => setCurrency(c)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${currency === c ? 'bg-[#0A1A0E] text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Donation Tiers */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {activeTiers.map((tier, i) => (
            <motion.div
              key={tier.amount}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 + i * 0.1 }}
              className={`relative bg-white rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 cursor-pointer group ${tier.popular ? "border-2 border-[#4CAF50] shadow-xl shadow-[#4CAF50]/10" : "border border-gray-100 shadow-sm hover:shadow-xl"}`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4CAF50] text-white text-[11px] font-bold px-4 py-1 rounded-full z-10 shadow-md uppercase tracking-wider flex items-center gap-1">
                  <Sparkles size={12} fill="currentColor" /> Most Popular
                </div>
              )}
              
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 ${tier.popular ? "bg-[#4CAF50]/10 text-[#4CAF50]" : "bg-gray-50 text-gray-400 group-hover:bg-[#4CAF50]/10 group-hover:text-[#4CAF50]"}`}>
                <tier.icon size={26} />
              </div>
              
              <div className="flex items-end gap-1 mb-2">
                <span className="text-gray-400 font-bold text-xl mb-1">{activeCurrency.symbol}</span>
                <span className="text-4xl font-black text-[#0A1A0E]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {tier.amount}
                </span>
              </div>
              
              <div className="text-[#0B5D3F] font-bold text-lg mb-3">{tier.label}</div>
              <div className="text-gray-500 text-sm leading-relaxed">{tier.impact}</div>
              
              <div className={`mt-8 w-full py-3 rounded-xl font-bold text-sm text-center transition-all ${tier.popular ? "bg-[#4CAF50] text-white shadow-md hover:bg-[#43a047]" : "bg-gray-50 text-gray-600 group-hover:bg-[#4CAF50] group-hover:text-white"}`}>
                Choose Amount
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-8 text-gray-500 text-sm font-medium border-t border-gray-200/60 pt-8"
        >
          {["100% Transparent", "Tax Deductible", "Secure Payment", "Impact Reports", "No Hidden Fees"].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[#4CAF50]/10 flex items-center justify-center">
                <CheckCircle2 size={12} className="text-[#4CAF50]" />
              </div>
              {item}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
