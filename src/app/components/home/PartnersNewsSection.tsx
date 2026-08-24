import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Link } from "react-router";
import { ExternalLink, ArrowRight, BookOpen, Handshake, Search, Calendar, Clock, Tag, Newspaper } from "lucide-react";
import { useFirestoreData } from "../../../lib/useFirestore";
import { getInitialPartners } from "../../pages/admin/sections/PartnersView";
import { ImageWithFallback } from "../ui/ImageWithFallback";

const fallbackPartners = [
  "UNEP", "WWF", "IUCN", "GEF", "World Bank", "UNDP", "FAO", "UNESCO",
  "Greenpeace", "Nature.org", "350.org", "CI", "WCS", "AWF",
];

const fallbackNews = [
  {
    id: 1,
    title: "ESN Launches Largest Mangrove Restoration Project in South Asia",
    excerpt: "A landmark initiative across Bangladesh and Myanmar targets 50,000 hectares of degraded coastal mangroves over five years.",
    image: "https://images.unsplash.com/photo-1656740978447-d61858ee2f11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=600",
    date: "July 22, 2026",
    readTime: "5 min read",
    category: "Projects",
    featured: true,
  },
  {
    id: 2,
    title: "Youth Climate Delegates from ESN Speak at UN General Assembly",
    excerpt: "12 youth leaders from ESN Campus Chapters addressed world leaders on intergenerational climate justice.",
    image: "https://images.unsplash.com/photo-1616680214084-22670de1bc82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=600",
    date: "July 18, 2026",
    readTime: "4 min read",
    category: "Policy",
    featured: false,
  },
  {
    id: 3,
    title: "New Research: Nature-Based Solutions Can Deliver 30% of Climate Mitigation",
    excerpt: "ESN researchers publish landmark study in Nature Climate Change highlighting the potential of ecosystem-based approaches.",
    image: "https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=600",
    date: "July 10, 2026",
    readTime: "8 min read",
    category: "Research",
    featured: false,
  },
];

const categoryColors: Record<string, string> = {
  Projects: "#0B5D3F",
  Policy: "#173B63",
  Research: "#4CAF50",
  Events: "#D6A95A",
};

export function PartnersNewsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  
  const [partnersRaw] = useFirestoreData<any[]>("esn_partners_admin", getInitialPartners());
  const [cmsContent] = useFirestoreData<any[]>("esn_cms_content", fallbackNews);

  const partners: string[] = (partnersRaw && partnersRaw.length > 0)
    ? partnersRaw.map((p: any) => (typeof p === 'string' ? p : p.name))
    : fallbackPartners;

  const news = (cmsContent && cmsContent.length > 0)
    ? cmsContent.filter((item: any) => item.status === "Published" || !item.status)
    : fallbackNews;

  const featuredNews = news.find(n => n.featured) || news[0];
  const regularNews = news.filter(n => n.id !== featuredNews?.id).slice(0, 2);

  return (
    <>
      {/* News Section */}
      <section ref={ref} className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6"
          >
            <div>
              <div className="inline-flex items-center gap-2 bg-[#173B63]/10 text-[#173B63] text-sm font-semibold px-5 py-2 rounded-full mb-5">
                <Newspaper size={14} />
                Latest News
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B5D3F] mb-6">
                Stay Informed,<br />
                <span className="text-[#4CAF50]">Stay Inspired</span>
              </h2>
            </div>
            <Link
              to="/media-center"
              className="inline-flex items-center gap-2 bg-[#F6FBF8] border border-[#0B5D3F]/20 text-[#0B5D3F] px-6 py-3 rounded-full font-semibold hover:bg-[#0B5D3F] hover:text-white transition-all duration-300"
            >
              All News <ArrowRight size={16} />
            </Link>
          </motion.div>

          {/* News Layout */}
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Featured Story */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-3 group"
            >
              <div className="bg-[#F6FBF8] rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-[#0B5D3F]/8 transition-all duration-400">
                <div className="relative h-72 overflow-hidden">
                  <ImageWithFallback
                    src={news[0].image}
                    alt={news[0].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-5 left-5">
                    <span
                      className="text-white text-xs font-bold px-3 py-1.5 rounded-full"
                      style={{ backgroundColor: categoryColors[news[0].category] }}
                    >
                      {news[0].category}
                    </span>
                  </div>
                  <div className="absolute bottom-5 left-5 right-5">
                    <h3 className="text-white mb-2 line-clamp-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "1.3rem" }}>
                      {news[0].title}
                    </h3>
                    <div className="flex items-center gap-4 text-white/70 text-xs">
                      <span className="flex items-center gap-1"><Calendar size={12} />{news[0].date}</span>
                      <span className="flex items-center gap-1"><Clock size={12} />{news[0].readTime}</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-500 leading-relaxed mb-4">{news[0].excerpt}</p>
                  <Link to="/news/1" className="inline-flex items-center gap-2 text-[#0B5D3F] font-semibold hover:gap-3 transition-all">
                    Read Full Story <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Side Stories */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {news.slice(1).map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  className="group flex gap-4 bg-[#F6FBF8] rounded-2xl p-5 border border-gray-100 hover:border-[#0B5D3F]/15 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-24 h-20 rounded-xl overflow-hidden shrink-0">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag size={11} style={{ color: categoryColors[item.category] }} />
                      <span className="text-xs font-semibold" style={{ color: categoryColors[item.category] }}>{item.category}</span>
                    </div>
                    <Link to={`/news/${item.id}`}>
                      <h4 className="text-sm font-bold text-gray-900 line-clamp-2 hover:text-[#0B5D3F] transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {item.title}
                      </h4>
                    </Link>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Calendar size={11} />{item.date}</span>
                      <span className="flex items-center gap-1"><Clock size={11} />{item.readTime}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
