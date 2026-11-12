import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Link } from "react-router";
import { ArrowRight, Heart, Leaf, Target, Users, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { getInitialCampaigns, Campaign } from "../../pages/admin/sections/CampaignsView";
import { useFirestoreData } from "../../../lib/useFirestore";
import { resolveIcon } from "../../pages/admin/sections/ProgramsView";
import { ImageWithFallback } from "../ui/ImageWithFallback";
import { RollingCarousel } from "../ui/RollingCarousel";

export function CampaignsSection() {
  const [campaignsRaw] = useFirestoreData<Campaign[]>("esn_campaigns_admin", getInitialCampaigns());
  const campaigns = campaignsRaw || [];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-16 bg-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-0 w-64 h-64 bg-[#4CAF50]/5 rounded-full translate-x-1/2" />
        <div className="absolute bottom-20 left-0 w-48 h-48 bg-[#0B5D3F]/5 rounded-full -translate-x-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Rolling Campaigns Carousel */}
        <RollingCarousel
          badge={
            <div className="inline-flex items-center gap-2 bg-[#4CAF50]/10 text-[#4CAF50] text-sm font-semibold px-5 py-2 rounded-full">
              <Heart size={14} fill="currentColor" />
              Active Campaigns
            </div>
          }
          title={
            <span>
              Join Our Active <span className="text-[#4CAF50]">Campaigns</span>
            </span>
          }
          action={
            <Link
              to="/campaigns"
              className="inline-flex items-center gap-2 bg-[#F6FBF8] border border-[#0B5D3F]/20 text-[#0B5D3F] px-6 py-3 rounded-full font-semibold hover:bg-[#0B5D3F] hover:text-white transition-all duration-300"
            >
              View All Campaigns <ArrowRight size={16} />
            </Link>
          }
          itemClassName="w-[85vw] sm:w-[340px] md:w-[380px] shrink-0 snap-start"
        >
          {campaigns.map((campaign, i) => {
            return (
              <div key={campaign.id} className="h-full">
                <div
                  className="group bg-white rounded-3xl p-6 border border-gray-100 hover:border-[#0B5D3F]/20 hover:shadow-2xl hover:shadow-[#0B5D3F]/10 transition-all duration-500 hover:-translate-y-2 h-full flex flex-col justify-between"
                >
                  <div>
                    {/* Top Badges & Date */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="bg-[#4CAF50]/15 text-[#0B5D3F] text-xs font-bold px-3 py-1 rounded-full">
                        {campaign.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                        <Calendar size={13} className="text-[#4CAF50]" />
                        <span>{campaign.endDate}</span>
                      </div>
                    </div>

                    {/* Title on Top (Upore thakbe title) */}
                    <h4 className="font-extrabold text-gray-900 text-lg mb-2 group-hover:text-[#0B5D3F] transition-colors leading-snug" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {campaign.title}
                    </h4>

                    {/* Photo in the Middle (R majkhane thakbe Photo) */}
                    <div className="relative h-48 sm:h-52 rounded-2xl overflow-hidden my-3 border border-gray-100/90 shadow-xs bg-gray-50">
                      <ImageWithFallback
                        src={campaign.image}
                        alt={campaign.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                      {campaign.sdgs && campaign.sdgs.length > 0 && (
                        <div className="absolute top-3 right-3 flex gap-1 z-10">
                          {campaign.sdgs.map((sdg) => (
                            <span key={sdg} className="bg-[#D6A95A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">{sdg}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Content below photo */}
                    <p className="text-gray-600 text-xs sm:text-sm mb-4 leading-relaxed line-clamp-2">{campaign.description}</p>

                    {/* Connected Project Link */}
                    {campaign.projectName && campaign.projectId ? (
                      <div className="mb-4 bg-[#F6FBF8] border border-emerald-100 rounded-2xl p-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-[#0B5D3F] text-white flex items-center justify-center shrink-0">
                            <Target size={13} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[9px] font-bold uppercase tracking-wider text-emerald-800">Connected Project</div>
                            <Link
                              to={`/projects/${campaign.projectId}`}
                              className="text-xs font-bold text-gray-900 hover:text-[#0B5D3F] transition-colors flex items-center gap-1 truncate"
                            >
                              <span className="truncate">{campaign.projectName}</span>
                              <ArrowRight size={11} className="shrink-0" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-4 bg-[#F6FBF8] border border-gray-100 rounded-2xl p-2.5 flex items-center gap-2.5 text-xs font-medium text-gray-500">
                        <div className="w-7 h-7 rounded-lg bg-gray-100 text-[#0B5D3F] flex items-center justify-center shrink-0">
                          <Target size={13} />
                        </div>
                        <div>
                          <div className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Campaign Scope</div>
                          <div className="text-xs font-bold text-gray-700">Global Standalone Initiative</div>
                        </div>
                      </div>
                    )}

                    {/* Stats Row */}
                    <div className="flex items-center justify-between mb-4 py-2.5 border-t border-gray-100">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                        <Users size={13} className="text-[#0B5D3F]" />
                        <span>{campaign.volunteers.toLocaleString()} volunteers</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex gap-2.5">
                    <Link
                      to={`/donate?campaign=${encodeURIComponent(campaign.title)}`}
                      className="flex-1 text-center py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white transition-all duration-300 hover:opacity-95 shadow-xs flex items-center justify-center gap-1.5"
                      style={{ backgroundColor: campaign.color }}
                    >
                      <Heart size={14} fill="currentColor" /> Donate Now
                    </Link>
                    <Link
                      to={`/donate?campaign=${encodeURIComponent(campaign.title)}`}
                      className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-[#0B5D3F]/10 hover:border-[#0B5D3F]/30 transition-all text-[#0B5D3F] shrink-0"
                      title="Support this campaign"
                    >
                      <Heart size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </RollingCarousel>

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
