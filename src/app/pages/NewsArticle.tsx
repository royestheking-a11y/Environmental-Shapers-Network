import { useParams, Link } from "react-router";
import { motion } from "motion/react";
import { Calendar, Clock, ChevronRight, ArrowLeft, ArrowRight, Share2, BookOpen, Tag, User } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const articles = [
  {
    id: 1,
    title: "ESN Launches Largest Mangrove Restoration Project in South Asia",
    excerpt: "A landmark initiative across Bangladesh and Myanmar targets 50,000 hectares of degraded coastal mangroves over five years.",
    category: "Projects",
    date: "July 22, 2026",
    readTime: "5 min read",
    author: "ESN Communications Team",
    authorRole: "ESN Media Office",
    image: "https://images.unsplash.com/photo-1656740978447-d61858ee2f11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400",
    content: [
      { type: "p", text: "The Environmental Shapers Network (ESN) has officially launched what is being described as the largest mangrove restoration initiative in South Asian history, targeting 50,000 hectares of degraded coastal forest across Bangladesh and Myanmar over the next five years." },
      { type: "p", text: "The project, titled 'Sundarbans and Beyond: Coastal Resilience for South Asia,' was announced at a ceremony in Dhaka attended by the Minister of Environment of Bangladesh, representatives from the United Nations Environment Programme (UNEP), and senior scientists from institutions across the region." },
      { type: "h2", text: "The Scale of the Challenge" },
      { type: "p", text: "South Asia's coastal mangrove forests have lost nearly 30% of their total coverage over the past four decades, driven by aquaculture expansion, urban encroachment, and the intensifying effects of climate change. The Sundarbans, shared between Bangladesh and India, has seen particularly severe losses — with some areas losing up to 40% of mangrove density since the 1980s." },
      { type: "p", text: "Mangroves are among the most carbon-dense ecosystems on Earth, capable of sequestering up to four times more CO₂ per hectare than tropical rainforests. Their loss not only releases stored carbon but strips millions of coastal residents of protection against storm surges, cyclones, and flooding." },
      { type: "quote", text: "This project is not just about trees. It is about the millions of people whose homes, livelihoods, and lives depend on a healthy coastal ecosystem.", attribution: "Dr. Amara Diallo, ESN Executive Director" },
      { type: "h2", text: "What the Project Will Do" },
      { type: "p", text: "The five-year initiative will work across 12 coastal districts in Bangladesh and 8 townships in Myanmar's Ayeyarwady Delta. Key activities include:" },
      { type: "ul", items: ["Planting of 40 million mangrove propagules across degraded coastal zones", "Restoration of tidal hydrology in 200+ km of blocked tidal channels", "Establishment of 50 community forest management committees", "Training of 500 coastal community rangers in forest monitoring and protection", "Creation of 15 mangrove nurseries supplying locally-sourced native species", "Blue carbon baseline surveys and voluntary carbon market pathway development"] },
      { type: "p", text: "The project will be implemented in partnership with the Bangladesh Forest Department, Myanmar's Nature and Wildlife Conservation Division, WWF-Bangladesh, and a coalition of 28 local NGOs. Total funding of $12.4 million has been secured from the Green Climate Fund, the Global Environment Facility, and a consortium of international donors." },
      { type: "h2", text: "Community at the Center" },
      { type: "p", text: "ESN and its partners have emphasized that community ownership is central to the project's design. All community forest management committees will have legal authority over restoration decisions within their designated zones, and at least 60% of project employment — including rangers, nursery workers, and field coordinators — will be drawn from coastal communities, with a specific target of 40% women's participation." },
      { type: "p", text: "\"We have learned from decades of failed top-down conservation projects,\" said Priya Nair, ESN's Chief Programs Officer. \"The only way mangrove restoration succeeds long-term is when the communities who live with these forests every day have a genuine stake in their future.\"" },
      { type: "h2", text: "Expected Impact" },
      { type: "p", text: "By 2031, the project aims to restore 50,000 hectares of mangrove forest, sequester an estimated 8 million metric tons of CO₂ equivalent, protect approximately 2.5 million coastal residents from cyclone and storm surge impacts, and generate sustainable livelihoods for over 15,000 families through ecotourism, sustainable fisheries, and carbon payments." },
    ],
    relatedIds: [2, 3],
    tags: ["Mangroves", "Bangladesh", "Marine", "Restoration", "Community"],
  },
  {
    id: 2,
    title: "Youth Climate Delegates from ESN Speak at UN General Assembly",
    excerpt: "12 youth leaders from ESN Campus Chapters addressed world leaders on intergenerational climate justice.",
    category: "Policy",
    date: "July 18, 2026",
    readTime: "4 min read",
    author: "ESN Youth Programs",
    authorRole: "Youth & Leadership Team",
    image: "https://images.unsplash.com/photo-1616680214084-22670de1bc82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400",
    content: [
      { type: "p", text: "In a historic moment for youth climate advocacy, twelve young environmental leaders from ESN Campus Chapters across six continents took the floor at the United Nations General Assembly in New York, delivering powerful testimonies on the lived realities of the climate crisis and demanding urgent, transformative action." },
      { type: "p", text: "The delegation — selected through a competitive process from among ESN's 28,000 student members — represented communities on the frontlines of climate change, from a young woman from Tuvalu facing the submersion of her island nation, to a student activist from drought-stricken northern Kenya who had organized her community's first water-harvesting system." },
      { type: "h2", text: "A Platform for Youth Voices" },
      { type: "p", text: "The opportunity came through ESN's partnership with the UN Major Groups and Stakeholders process, which grants civil society organizations speaking slots during the High-Level segment of the General Assembly. It was the first time an environmental network from the Global South had organized a multi-continental youth delegation for this platform." },
      { type: "quote", text: "We are not the future. We are the present. The decisions made in this hall today will determine whether our generation has a future at all.", attribution: "Zara Ahmed, ESN Youth Delegate, Bangladesh" },
      { type: "p", text: "The delegates called on member states to immediately ratify the Global Plastics Treaty, accelerate their Nationally Determined Contributions under the Paris Agreement, and establish a dedicated $500 billion climate reparations fund for the most climate-vulnerable nations." },
      { type: "h2", text: "Building the Next Generation of Diplomats" },
      { type: "p", text: "The UNGA appearance was the culmination of a six-month preparation program that included diplomatic training, negotiation simulations, public speaking coaching, and mentorship from senior UNFCCC negotiators. All 12 delegates will now serve as ESN Climate Ambassadors, representing youth perspectives at future international climate negotiations including COP32." },
    ],
    relatedIds: [1, 3],
    tags: ["Youth", "UN", "Policy", "Climate", "Leadership"],
  },
  {
    id: 3,
    title: "New Research: Nature-Based Solutions Can Deliver 30% of Climate Mitigation",
    excerpt: "ESN researchers publish landmark study in Nature Climate Change highlighting the potential of ecosystem-based approaches.",
    category: "Research",
    date: "July 10, 2026",
    readTime: "8 min read",
    author: "ESN Research Team",
    authorRole: "Research & Policy Division",
    image: "https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400",
    content: [
      { type: "p", text: "A landmark study co-authored by researchers from ESN's Research & Policy Division and published in Nature Climate Change has found that nature-based solutions (NbS) — the protection, restoration, and sustainable management of ecosystems — can deliver up to 30% of the climate mitigation needed to limit global warming to 1.5°C by 2030." },
      { type: "p", text: "The study, titled 'Realizing the Full Climate Potential of Nature-Based Solutions: Barriers, Enablers, and Policy Pathways,' synthesizes data from over 200 peer-reviewed studies and draws on ESN's own extensive field monitoring data from projects in 80+ countries." },
      { type: "h2", text: "Key Findings" },
      { type: "ul", items: ["Current NbS efforts deliver only 8-12% of their potential mitigation due to underinvestment, poor governance, and failure to address land tenure", "Protecting existing native ecosystems is 5-10x more cost-effective than restoring degraded ones for equivalent carbon outcomes", "NbS co-benefits — biodiversity, water security, livelihoods — are systematically undervalued in current carbon markets", "Indigenous-managed territories contain 80% more carbon than non-indigenous lands of equivalent type", "Policy reforms in 15 key countries could unlock an additional $120 billion per year in NbS finance by 2030"] },
      { type: "h2", text: "Implications for Policy" },
      { type: "p", text: "The research team identified five critical policy reforms that governments should prioritize: mandatory NbS integration in national climate plans, land rights protections for indigenous and community forest managers, reformed carbon market methodologies that capture biodiversity co-benefits, public finance blending mechanisms to de-risk private NbS investment, and monitoring frameworks that track ecosystem integrity not just carbon." },
      { type: "quote", text: "We have the ecosystems. We have the science. What we lack is the political will to protect what nature has already built and give communities the rights to manage it.", attribution: "Dr. Priya Nair, ESN Chief Programs Officer and lead author" },
      { type: "p", text: "The study has already been cited in the recent IPCC Working Group III Technical Report and has been requested as background material for the upcoming CBD COP16 negotiations. ESN is presenting the findings at a side event at the upcoming Climate Week in September." },
    ],
    relatedIds: [1, 2],
    tags: ["Research", "NbS", "Climate", "Policy", "Biodiversity"],
  },
];

const categoryColors: Record<string, string> = {
  Projects: "#0B5D3F",
  Policy: "#173B63",
  Research: "#4CAF50",
  Events: "#D6A95A",
};

type ContentBlock = { type: string; text?: string; attribution?: string; items?: string[] };

function ContentRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="flex flex-col gap-5">
      {blocks.map((b, i) => {
        if (b.type === "p") return <p key={i} className="text-gray-600 leading-[1.85] text-base">{b.text}</p>;
        if (b.type === "h2") return <h2 key={i} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "1.4rem" }} className="text-gray-900 mt-4 mb-1">{b.text}</h2>;
        if (b.type === "quote") return (
          <blockquote key={i} className="border-l-4 border-[#4CAF50] pl-6 py-2 my-2 bg-[#0B5D3F]/4 rounded-r-xl">
            <p className="text-gray-800 italic text-lg leading-relaxed mb-2">"{b.text}"</p>
            <cite className="text-[#0B5D3F] text-sm font-semibold not-italic">— {b.attribution}</cite>
          </blockquote>
        );
        if (b.type === "ul") return (
          <ul key={i} className="flex flex-col gap-2.5 pl-0">
            {b.items?.map((item, j) => (
              <li key={j} className="flex items-start gap-3 text-gray-600 text-sm leading-relaxed">
                <div className="w-5 h-5 rounded-full bg-[#4CAF50]/15 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#4CAF50]" />
                </div>
                {item}
              </li>
            ))}
          </ul>
        );
        return null;
      })}
    </div>
  );
}

export default function NewsArticle() {
  const { id } = useParams<{ id: string }>();
  const article = articles.find((a) => String(a.id) === id);
  const related = articles.filter((a) => article?.relatedIds.includes(a.id));

  if (!article) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-[#F6FBF8]">
        <div className="text-center">
          <BookOpen size={48} className="text-gray-300 mx-auto mb-4" />
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-gray-800 mb-2">Article Not Found</h2>
          <p className="text-gray-500 mb-6">This article doesn't exist or may have been moved.</p>
          <Link to="/media-center" className="inline-flex items-center gap-2 bg-[#0B5D3F] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#0a5237] transition-all">
            <ArrowLeft size={15} /> Go to Media Center
          </Link>
        </div>
      </div>
    );
  }

  const color = categoryColors[article.category] || "#0B5D3F";

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[420px] flex items-end overflow-hidden">
        <ImageWithFallback src={article.image} alt={article.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a0e]/95 via-[#0a1a0e]/60 to-transparent" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 pb-14 w-full">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 text-sm text-white/60 mb-4">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight size={14} />
              <Link to="/media-center" className="hover:text-white transition-colors">Media Center</Link>
              <ChevronRight size={14} />
              <span className="text-white/80 truncate max-w-xs">{article.category}</span>
            </div>
            <span className="inline-block text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4" style={{ backgroundColor: color }}>{article.category}</span>
            <h1 className="text-white mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.6rem, 4vw, 2.8rem)", fontWeight: 900, lineHeight: 1.15 }}>{article.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm">
              <span className="flex items-center gap-1.5"><User size={14} /> {article.author}</span>
              <span className="flex items-center gap-1.5"><Calendar size={14} /> {article.date}</span>
              <span className="flex items-center gap-1.5"><Clock size={14} /> {article.readTime}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article Body */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Main */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="lg:col-span-3">
            <p className="text-lg text-gray-700 leading-relaxed mb-8 pb-8 border-b border-gray-100 font-medium">{article.excerpt}</p>
            <ContentRenderer blocks={article.content as ContentBlock[]} />

            {/* Tags */}
            <div className="mt-10 pt-8 border-t border-gray-100">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider mr-1">Tags:</span>
                {article.tags.map(t => (
                  <span key={t} className="flex items-center gap-1 text-xs bg-gray-50 text-gray-600 border border-gray-200 px-3 py-1.5 rounded-full hover:border-[#4CAF50]/40 transition-colors cursor-pointer">
                    <Tag size={10} /> {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Share */}
            <div className="mt-8 flex items-center gap-3">
              <span className="text-sm text-gray-500 font-medium">Share this article:</span>
              {["Twitter/X", "LinkedIn", "Facebook", "WhatsApp"].map(s => (
                <button key={s} className="text-xs bg-gray-50 border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full hover:border-[#4CAF50]/40 hover:text-[#0B5D3F] transition-all">
                  {s}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 flex flex-col gap-5">
              {/* Author */}
              <div className="bg-[#F6FBF8] rounded-2xl p-5 border border-gray-100">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Author</div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0B5D3F] flex items-center justify-center text-white font-bold text-sm">
                    {article.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-gray-800">{article.author}</div>
                    <div className="text-xs text-gray-500">{article.authorRole}</div>
                  </div>
                </div>
              </div>

              {/* Share button */}
              <button className="flex items-center justify-center gap-2 bg-[#0B5D3F] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#0a5237] transition-all">
                <Share2 size={14} /> Share Article
              </button>

              {/* Nav */}
              <div className="flex flex-col gap-2">
                <Link to="/media-center" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#0B5D3F] transition-colors">
                  <ArrowLeft size={14} /> All News
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-20 pt-12 border-t border-gray-100">
            <div className="text-[#4CAF50] text-xs font-bold uppercase tracking-wider mb-2">More Stories</div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "1.5rem" }} className="text-gray-900 mb-8">Related Articles</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {related.map((r) => (
                <Link key={r.id} to={`/news/${r.id}`} className="group bg-[#F6FBF8] rounded-2xl overflow-hidden border border-gray-100 hover:border-[#4CAF50]/30 hover:shadow-lg transition-all">
                  <div className="h-40 overflow-hidden">
                    <ImageWithFallback src={r.image} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full mb-3 inline-block" style={{ backgroundColor: (categoryColors[r.category] || "#0B5D3F") + "15", color: categoryColors[r.category] || "#0B5D3F" }}>{r.category}</span>
                    <h4 className="font-bold text-gray-900 text-sm line-clamp-2 group-hover:text-[#0B5D3F] transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{r.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                      <Calendar size={10} /> {r.date}
                      <span>·</span>
                      <Clock size={10} /> {r.readTime}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
