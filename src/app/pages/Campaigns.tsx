import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowRight, Target, Users, Calendar, Megaphone, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { getInitialCampaigns, Campaign } from "./admin/sections/CampaignsView";
import { resolveIcon } from "./admin/sections/ProgramsView";
import { ImageWithFallback } from "../components/ui/ImageWithFallback";
import { useFirestoreData } from "../../lib/useFirestore";

function ProgressBar({ goal, raised, color }: { goal: number; raised: number; color: string }) {
  const pct = Math.min(100, Math.round((raised / goal) * 100));
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-gray-500">{pct}% funded</span>
        <span className="text-gray-500">{raised.toLocaleString()} / {goal.toLocaleString()}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 1.2, ease: "easeOut" }}
          className="h-full rounded-full" style={{ backgroundColor: color }} />
      </div>
    </div>
  );
}

export default function Campaigns() {
  const [allCampaigns] = useFirestoreData<Campaign[]>("esn_campaigns_admin", getInitialCampaigns());

  const active = allCampaigns.filter(c => c.status === "active");
  const completed = allCampaigns.filter(c => c.status === "completed");
  const filteredCampaigns = active;

  return (
    <div className="bg-[#F6FBF8] min-h-screen">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B5D3F] via-[#0a3d28] to-[#173B63]" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#4CAF50]/10 blur-3xl" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white text-sm font-bold px-5 py-2 rounded-full mb-6 uppercase tracking-wider">
              <Megaphone size={14} />
              Active Campaigns
            </div>
            <h1 className="text-white mb-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900 }}>
              Join the Movement.<br />Fund Real Change.
            </h1>
            <p className="text-white/70 text-lg max-w-xl mx-auto mb-10">
              Every campaign is a targeted effort to solve a specific environmental crisis. Your contribution directly funds on-the-ground action.
            </p>
            <div className="flex items-center justify-center gap-10 flex-wrap">
              {[["$42M+", "Raised in 2025"], ["140K+", "Campaign Donors"], ["6", "Active Campaigns"], ["1B+", "Lives Impacted"]].map(([v, l]) => (
                <div key={l} className="text-center">
                  <div className="text-white text-2xl font-black" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{v}</div>
                  <div className="text-white/60 text-xs">{l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Active Campaigns */}
        <div className="text-[#4CAF50] text-sm font-bold uppercase tracking-wider mb-2">Current</div>
        <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.4rem, 2vw, 1.8rem)", fontWeight: 800 }} className="text-gray-900 mb-8">Active Campaigns</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredCampaigns.map((campaign, i) => {
            const progress = Math.min(100, Math.round((campaign.raised / campaign.goal) * 100));
            const Icon = resolveIcon("Target");
            return (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all group flex flex-col h-full"
              >
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback src={campaign.image} alt={campaign.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold" style={{ color: campaign.color }}>
                    {campaign.category}
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full capitalize">{campaign.status}</span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#0B5D3F] transition-colors">{campaign.title}</h3>
                  <p className="text-gray-500 text-sm mb-6 line-clamp-2">{campaign.description}</p>
                  
                  <div className="mt-auto">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-bold text-gray-900">${campaign.raised.toLocaleString()} raised</span>
                      <span className="text-gray-500">of ${campaign.goal.toLocaleString()}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-6">
                      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%`, backgroundColor: campaign.color }} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50 mb-6">
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Volunteers</div>
                        <div className="font-bold text-gray-900">{campaign.volunteers?.toLocaleString() || 0}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Ends</div>
                        <div className="font-bold text-gray-900">{campaign.endDate}</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link
                        to={`/donate?campaign=${encodeURIComponent(campaign.title)}`}
                        className="flex-1 py-3 rounded-xl text-white font-bold text-sm text-center shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-1.5"
                        style={{ backgroundColor: campaign.color }}
                      >
                        <Heart size={14} fill="currentColor" /> Donate Now
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Completed */}
        <div className="text-[#4CAF50] text-sm font-bold uppercase tracking-wider mb-2">Completed</div>
        <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.4rem, 2vw, 1.8rem)", fontWeight: 800 }} className="text-gray-900 mb-6">Past Campaigns</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {completed.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 opacity-90 group hover:opacity-100 hover:shadow-lg transition-all">
              <div className="relative h-44 overflow-hidden">
                <img src={c.image} alt={c.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-3 right-3">
                  <span className="bg-gray-700 text-white text-xs font-bold px-3 py-1 rounded-full">Completed</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-gray-900 mb-2">{c.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">{c.description}</p>
                <div className="flex items-center gap-2 text-sm text-[#0B5D3F] font-bold">
                  <Target size={14} />
                  Goal Achieved — ${c.raised.toLocaleString()} raised
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-gradient-to-r from-[#0B5D3F] to-[#173B63] rounded-3xl p-12 text-white text-center">
          <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800 }} className="mb-3">Propose a Campaign</h3>
          <p className="text-white/70 mb-8 max-w-md mx-auto">Have an environmental initiative that deserves global support? Partner with ESN to amplify your campaign.</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/partner" className="inline-flex items-center gap-2 bg-[#4CAF50] text-white px-7 py-3.5 rounded-full font-semibold hover:bg-[#43a047] transition-all hover:scale-105">
              Partner With Us <ArrowRight size={15} />
            </Link>
            <Link to="/donate" className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-7 py-3.5 rounded-full font-semibold hover:bg-white/20 transition-all">
              General Donation
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
