import { BookOpen, FileText, Download, ArrowRight, CheckCircle, ExternalLink, Sparkles } from "lucide-react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { useFirestoreData } from "../../lib/useFirestore";
import { getInitialResearchAreas, ResearchArea } from "./admin/sections/ResearchAdminView";

const defaultPublications = [
  {
    id: 1,
    title: "Global Mangrove Restoration Impact Report",
    desc: "An in-depth analysis of survival rates and biodiversity return in Southeast Asian mangrove restoration sites over a 5-year period.",
    type: "Research Paper",
    date: "Oct 2025",
  },
  {
    id: 2,
    title: "Policy Brief: Urban Climate Resilience",
    desc: "Recommendations for municipal governments to integrate nature-based solutions into urban planning and infrastructure.",
    type: "Policy Brief",
    date: "Aug 2025",
  },
  {
    id: 3,
    title: "Renewable Energy Transition in Developing Nations",
    desc: "A comprehensive study on the socioeconomic impacts of shifting to solar and wind energy grids in rural communities.",
    type: "Report",
    date: "Jun 2025",
  }
];

export default function ResearchPolicy() {
  const [researchAreas] = useFirestoreData<ResearchArea[]>("esn_research_admin", getInitialResearchAreas());
  const [cmsContent] = useFirestoreData<any[]>("esn_cms_content", []);

  // Filter research publications from CMS
  const dynamicPubs = (cmsContent || [])
    .filter((item: any) => 
      (item.status === "Published" || !item.status) &&
      (item.type === "Report" || item.type === "Research Paper" || item.type === "Policy Brief" || item.type === "Article")
    )
    .map((item: any) => ({
      id: item.id,
      title: item.title,
      desc: item.excerpt || item.summary || "Official peer-reviewed scientific paper from ESN research divisions.",
      type: item.type || "Research Paper",
      date: item.date || "2026",
      link: `/news/${item.id}`,
    }));

  const publications = dynamicPubs.length > 0 ? dynamicPubs.slice(0, 3) : defaultPublications;
  const areas = researchAreas && researchAreas.length > 0 ? researchAreas : getInitialResearchAreas();

  return (
    <div>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-[#E6F3EB] to-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#4CAF50]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 border border-[#4CAF50]/20 text-[#0A3D2A] text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider shadow-sm">
            <Sparkles size={12} className="text-[#4CAF50]" />
            Evidence-Based Action
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-[#0A3D2A] mb-6 leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Research & <span className="text-[#4CAF50]">Policy</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-10">
            Our evidence-based research informs policy decisions and drives global environmental action. Explore our latest publications, reports, and policy briefs.
          </p>
        </div>
      </section>

      {/* Latest Publications */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-12">
            <div>
              <div className="text-[#0A3D2A] text-xs font-bold uppercase tracking-[0.2em] mb-2">Latest Findings</div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0A3D2A]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Featured Publications
              </h2>
            </div>
            <Link to="/knowledge-hub" className="inline-flex items-center gap-2 text-[#0B5D3F] font-bold text-sm hover:underline">
              Explore All Research in Knowledge Hub <ArrowRight size={15} />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {publications.map((pub: any, i: number) => (
              <motion.div key={pub.id || i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-[#F8FCF9] p-8 rounded-3xl border border-gray-100 shadow-lg shadow-gray-200/50 hover:shadow-xl transition-all group flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm">
                      <FileText className="text-[#0B5D3F]" size={24} />
                    </div>
                    <span className="text-xs font-bold text-[#4CAF50] bg-green-50 px-3 py-1 rounded-full">{pub.type}</span>
                  </div>
                  <div className="text-xs text-gray-500 mb-2 font-semibold uppercase">{pub.date}</div>
                  <h3 className="text-xl font-bold text-[#0A3D2A] mb-4 group-hover:text-[#4CAF50] transition-colors">{pub.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6 text-sm line-clamp-3">{pub.desc}</p>
                </div>
                <div>
                  {pub.link ? (
                    <Link to={pub.link} className="flex items-center gap-2 text-[#0B5D3F] font-bold text-sm hover:text-[#4CAF50] transition-colors">
                      <ExternalLink size={16} /> Read Full Paper
                    </Link>
                  ) : (
                    <button onClick={() => alert(`Downloading: ${pub.title} (PDF)`)} className="flex items-center gap-2 text-[#0B5D3F] font-bold text-sm hover:text-[#4CAF50] transition-colors">
                      <Download size={16} /> Download PDF
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Research Areas */}
      <section className="py-24 bg-[#E6F3EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[#0A3D2A] text-sm font-bold uppercase tracking-[0.2em]">Our Focus</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0A3D2A] mb-8" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Key Research Areas</h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                Our global network of scientists, analysts, and policy experts focus on critical areas where evidence can directly influence meaningful climate action and environmental conservation.
              </p>
              <ul className="space-y-3">
                {areas.map((item, i) => (
                  <li key={item.id || item.slug || i}>
                    <Link to={`/research/${item.slug}`} className="flex items-center justify-between p-3 rounded-2xl bg-white border border-gray-100 hover:border-[#4CAF50] hover:shadow-md transition-all group">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="text-[#4CAF50] shrink-0" size={18} />
                        <span className="text-gray-800 font-semibold text-sm group-hover:text-[#0A3D2A] transition-colors">{item.title}</span>
                      </div>
                      <ArrowRight size={14} className="text-gray-400 group-hover:text-[#4CAF50] group-hover:translate-x-1 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link to="/contact" className="inline-flex items-center gap-2 bg-[#0A3D2A] hover:bg-[#173B63] text-white px-8 py-4 rounded-full font-bold transition-all hover:-translate-y-1 shadow-xl mt-10">
                Partner With Us <ArrowRight size={20} />
              </Link>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#4CAF50]/20 to-transparent rounded-3xl transform rotate-3" />
              <img 
                src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800" 
                alt="Research laboratory" 
                className="relative z-10 rounded-3xl shadow-2xl object-cover h-[500px] w-full"
              />
              <div className="absolute -bottom-6 -left-6 z-20 bg-white p-6 rounded-2xl shadow-xl max-w-[250px]">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-10 h-10 bg-[#E6F3EB] rounded-full flex items-center justify-center">
                    <BookOpen size={20} className="text-[#0A3D2A]" />
                  </div>
                  <div className="text-3xl font-black text-[#0A3D2A]">150+</div>
                </div>
                <div className="text-sm font-bold text-gray-600">Research Papers Published</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
