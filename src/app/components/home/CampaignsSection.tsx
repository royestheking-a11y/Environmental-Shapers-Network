import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Link } from "react-router";
import { ArrowRight, Heart, Leaf, Target, Users, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { getInitialCampaigns, Campaign } from "../../pages/admin/sections/CampaignsView";
import { useFirestoreData } from "../../../lib/useFirestore";
import { resolveIcon } from "../../pages/admin/sections/ProgramsView";
import { ImageWithFallback } from "../ui/ImageWithFallback";

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const percent = Math.min((value / max) * 100, 100);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="h-2 bg-gray-100 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={inView ? { width: `${percent}%` } : {}}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

export function CampaignsSection() {
  const [campaignsRaw] = useFirestoreData<Campaign[]>("esn_campaigns_admin", getInitialCampaigns());
  const campaigns = campaignsRaw ? campaignsRaw.slice(0, 3) : [];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-16 bg-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-0 w-64 h-64 bg-[#4CAF50]/5 rounded-full translate-x-1/2" />
        <div className="absolute bottom-20 left-0 w-48 h-48 bg-[#0B5D3F]/5 rounded-full -translate-x-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 bg-[#4CAF50]/10 text-[#4CAF50] text-sm font-semibold px-5 py-2 rounded-full mb-5">
              <Heart size={14} fill="currentColor" />
              Active Campaigns
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B5D3F] mb-6">
              Join Our Active<br />
              <span className="text-[#4CAF50]">Campaigns</span>
            </h2>
          </div>
          <Link
            to="/campaigns"
            className="inline-flex items-center gap-2 bg-[#F6FBF8] border border-[#0B5D3F]/20 text-[#0B5D3F] px-6 py-3 rounded-full font-semibold hover:bg-[#0B5D3F] hover:text-white transition-all duration-300"
          >
            View All Campaigns <ArrowRight size={16} />
          </Link>
        </motion.div>

        {/* Campaigns Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign, i) => {
            return (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-[#0B5D3F]/20 hover:shadow-2xl hover:shadow-[#0B5D3F]/10 transition-all duration-500 hover:-translate-y-2"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <ImageWithFallback
                    src={campaign.image}
                    alt={campaign.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-[#0B5D3F] text-xs font-bold px-3 py-1.5 rounded-full">
                      {campaign.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 flex gap-1">
                    {campaign.sdgs.map((sdg) => (
                      <span key={sdg} className="bg-[#D6A95A] text-white text-xs font-bold px-2 py-1 rounded-full">{sdg}</span>
                    ))}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 text-white text-sm">
                      <Calendar size={14} />
                      <span>{campaign.endDate}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h4 className="font-bold text-gray-900 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {campaign.title}
                  </h4>
                  <p className="text-gray-500 text-sm mb-5 leading-relaxed line-clamp-2">{campaign.description}</p>

                  {/* Progress */}
                  <div className="mb-5">
                    <div className="flex justify-between text-xs font-semibold mb-2">
                      <span className="text-gray-600">{((campaign.raised / campaign.goal) * 100).toFixed(0)}% of goal reached</span>
                    </div>
                    <ProgressBar value={campaign.raised} max={campaign.goal} color={campaign.color} />
                    <div className="flex justify-between text-xs text-gray-400 mt-1.5">
                      <span>${campaign.raised.toLocaleString()} raised</span>
                      <span>Goal: ${campaign.goal.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center justify-between mb-5 py-3 border-t border-gray-50">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Users size={13} />
                      <span>{campaign.volunteers.toLocaleString()} volunteers</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2.5">
                    <Link
                      to={`/campaigns/${campaign.id}`}
                      className="flex-1 text-center py-3 rounded-xl font-semibold text-sm text-white transition-all duration-300 hover:scale-105"
                      style={{ backgroundColor: campaign.color }}
                    >
                      Donate Now
                    </Link>
                    <button className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-[#0B5D3F]/10 hover:border-[#0B5D3F]/30 transition-all">
                      <Heart size={16} className="text-gray-400" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Campaign CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-14 bg-gradient-to-r from-[#0B5D3F] to-[#173B63] rounded-3xl p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center shrink-0">
              <Leaf size={30} className="text-[#4CAF50]" />
            </div>
            <div>
              <h3 className="text-white mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Start Your Own Campaign
              </h3>
              <p className="text-white/70 max-w-md">
                Have a local environmental idea? We provide the platform, tools, and global network to turn your vision into action.
              </p>
            </div>
          </div>
          <Link
            to="/partner"
            className="shrink-0 bg-[#4CAF50] hover:bg-[#43a047] text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-500/30"
          >
            Launch a Campaign
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
