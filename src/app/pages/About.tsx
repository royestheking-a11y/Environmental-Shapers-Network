import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Link } from "react-router";
import {
  Leaf, Target, Globe2, Users, Award, Calendar, ChevronRight,
  TreePine, Heart, Star, Sprout, Shield, Lightbulb, HandHeart,
  ArrowRight, Quote, MapPin, ExternalLink, Check, Zap, BookOpen, Sun
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const milestones = [
  {
    year: "2019", title: "A Movement is Born", icon: Sprout, color: "#4CAF50",
    desc: "ESN was founded in Dhaka after catastrophic monsoon floods were linked directly to climate change. Imran Hossain, Abu Hanif and fellow students pledged to turn grief into action — planting 1,000 mangrove saplings in their first weekend.",
  },
  {
    year: "2020", title: "Crossing Borders", icon: Globe2, color: "#0B5D3F",
    desc: "Expanded to India and Nepal with our first cross-border reforestation program. The 'Green Corridor' project connected degraded forest patches across three nations, covering over 8,000 hectares.",
  },
  {
    year: "2021", title: "UN Recognition", icon: Award, color: "#D6A95A",
    desc: "Received ECOSOC Special Consultative Status — one of the youngest NGOs in history to achieve this recognition. We presented at the UNFCCC COP25 in Madrid, representing 34 countries.",
  },
  {
    year: "2022", title: "50 Countries Reached", icon: MapPin, color: "#173B63",
    desc: "Active projects and campus chapters now span 50 countries across 5 continents. Launched our flagship Youth Climate Leadership program, training 4,000+ youth advocates in their first cohort.",
  },
  {
    year: "2023", title: "One Million Trees", icon: TreePine, color: "#4CAF50",
    desc: "Celebrated the planting of our 1 millionth tree — a mangrove seedling in the Sundarbans, Bangladesh. The landmark was witnessed by community leaders, diplomats, and 300 volunteers from 40 countries.",
  },
  {
    year: "2024", title: "Climate Finance Hub", icon: Zap, color: "#0B5D3F",
    desc: "Launched the ESN Climate Finance Accelerator, channeling $12M to 180 grassroots environmental projects in the Global South. Opened regional headquarters in Nairobi, Bogotá, and Jakarta.",
  },
  {
    year: "2025", title: "The Global Platform", icon: BookOpen, color: "#D6A95A",
    desc: "Launched this integrated digital platform connecting 12,000+ communities across 80+ countries. Now the largest open-source environmental data network in Asia and Africa, powering science-based action.",
  },
];

const teamMembers = [
  {
    name: "Imran Hossain",
    role: "Co-Founder",
    country: "Dhaka, Bangladesh",
    bio: "Former flood-disaster volunteer turned global climate advocate. Imran has spoken at UN Climate COPs.",
    img: "",
    tags: ["Climate Policy", "Leadership"],
  },
  {
    name: "Abu Hanif",
    role: "Co-Founder",
    country: "Dhaka, Bangladesh",
    bio: "Passionate environmentalist and community leader. Abu Hanif has been instrumental in scaling our grassroots chapters globally.",
    img: "",
    tags: ["Community", "Strategy"],
  },
  {
    name: "Carlos Rodriguez",
    role: "Regional Director, Americas",
    country: "Bogotá, Colombia",
    bio: "Conservation biologist with 12 years in Amazonian field research. Carlos built ESN's Latin American network from 3 to 28 active countries in just four years.",
    img: "",
    tags: ["Conservation", "Biodiversity"],
  },
  {
    name: "Amara Osei",
    role: "Director of Community Programs",
    country: "Accra, Ghana",
    bio: "Community organizer and former UN Environment Programme fellow. Amara designed ESN's grassroots engagement model now used by 6,000+ local chapters worldwide.",
    img: "",
    tags: ["Community", "Inclusion"],
  },
  {
    name: "Ji-yeon Park",
    role: "Chief Technology Officer",
    country: "Seoul, South Korea",
    bio: "Former Google engineer turned climate-tech founder. Ji-yeon built ESN's open-source environmental monitoring network, now tracking 2,400+ ecosystem sites globally.",
    img: "",
    tags: ["Technology", "Data"],
  },
  {
    name: "Fatima Al-Rashid",
    role: "Director of Partnerships",
    country: "Dubai, UAE",
    bio: "Negotiated ESN's landmark partnerships with UNDP, WWF, and 40+ corporate sustainability programs. Manages a portfolio of $24M in annual partner funding.",
    img: "",
    tags: ["Partnerships", "Finance"],
  },
];

const values = [
  {
    icon: Target, title: "Science-Led Action", color: "#0B5D3F",
    desc: "Every initiative we launch is grounded in peer-reviewed research and monitored with rigorous data collection. We measure what we protect.",
  },
  {
    icon: HandHeart, title: "Community First", color: "#4CAF50",
    desc: "We don't parachute in solutions. We co-design with local communities, ensuring every project is owned, managed, and celebrated by the people it serves.",
  },
  {
    icon: Shield, title: "Radical Transparency", color: "#173B63",
    desc: "Our finances, impact reports, and methodologies are fully open-access. If we fail, we say so loudly — because failure teaches us to build better.",
  },
  {
    icon: Globe2, title: "Global South Leadership", color: "#D6A95A",
    desc: "Over 70% of our leadership team comes from countries most affected by climate change. The people most impacted lead the solutions.",
  },
  {
    icon: Lightbulb, title: "Innovation Mindset", color: "#0B5D3F",
    desc: "From drone-seeding to community-led carbon markets, we embrace bold new approaches when traditional methods fall short of the scale needed.",
  },
  {
    icon: Users, title: "Intersectional Justice", color: "#4CAF50",
    desc: "Climate change and social inequality are inseparable. We center gender equity, Indigenous rights, and youth leadership in all our programs.",
  },
];

const impactStats = [
  { value: "80+", label: "Countries Active", sub: "Across 6 continents", icon: Globe2 },
  { value: "1.2M+", label: "Trees Planted", sub: "Since 2019", icon: TreePine },
  { value: "12,000+", label: "Local Chapters", sub: "In 80+ countries", icon: Users },
  { value: "$24M", label: "Annual Impact Budget", sub: "Invested in communities", icon: Heart },
  { value: "48K+", label: "Active Volunteers", sub: "Mobilized globally", icon: HandHeart },
  { value: "94%", label: "Project Success Rate", sub: "Based on 5-year reviews", icon: Award },
];

const partners = [
  "United Nations", "WWF Global", "UNDP", "GreenPeace", "IUCN", "World Bank", "C40 Cities", "Bloomberg Philanthropies"
];

const recognitions = [
  { title: "Time 100 Next", year: "2022", desc: "Imran Hossain named among the most influential emerging leaders shaping the future." },
  { title: "UN ECOSOC Status", year: "2019", desc: "Special Consultative Status with the United Nations Economic and Social Council." },
  { title: "Earthshot Prize Finalist", year: "2023", desc: "Shortlisted for Prince William's environmental prize for our Sundarbans restoration." },
  { title: "Fast Company World Changing Ideas", year: "2024", desc: "Recognized for our open-source environmental monitoring platform." },
];

export default function About() {
  const heroRef = useRef(null);

  return (
    <div className="pt-20 overflow-x-hidden">

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-[#071a0f] via-[#0B5D3F] to-[#173B63] overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/Climate Reality Leadership Corps Training | Representing Bangladesh.jpeg"
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B5D3F]/40 to-[#071a0f]/80" />
        </div>

        {/* Decorative orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#4CAF50]/15 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#D6A95A]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#173B63]/20 rounded-full blur-3xl" />

        <div className="relative w-full max-w-7xl mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left text */}
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-full mb-8 uppercase tracking-widest">
                <Leaf size={12} className="text-[#4CAF50]" /> Founded 2019 · Dhaka, Bangladesh
              </div>
              <h1 className="text-white mb-6 leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Shaping the World's<br />
                <span className="text-[#4CAF50]">Environmental Future</span>
              </h1>
              <p className="text-white/75 text-xl leading-relaxed mb-8 max-w-lg">
                We are a global movement of scientists, advocates, and community leaders united by one conviction: a healthy planet is not a privilege — it is the foundation of human dignity.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/projects" className="inline-flex items-center gap-2 bg-[#4CAF50] text-white px-7 py-3.5 rounded-full font-semibold hover:bg-[#43a047] transition-all hover:scale-105 shadow-lg shadow-[#4CAF50]/30">
                  See Our Work <ArrowRight size={16} />
                </Link>
                <Link to="/donate" className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white px-7 py-3.5 rounded-full font-semibold hover:bg-white/20 transition-all">
                  Support the Mission
                </Link>
              </div>
            </motion.div>

            {/* Right — stat cards grid */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="grid grid-cols-2 gap-4">
              {[
                { v: "80+", l: "Countries", icon: Globe2 },
                { v: "1.2M+", l: "Trees Planted", icon: TreePine },
                { v: "12K+", l: "Local Chapters", icon: Users },
                { v: "7 Yrs", l: "Of Impact", icon: Calendar },
              ].map((s, i) => (
                <motion.div
                  key={s.l}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="bg-white/10 border border-white/15 backdrop-blur-md rounded-3xl p-6 text-center hover:bg-white/15 transition-all"
                >
                  <div className="w-12 h-12 bg-[#4CAF50]/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <s.icon size={22} className="text-[#4CAF50]" />
                  </div>
                  <div className="text-3xl font-black text-white mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.v}</div>
                  <div className="text-white/60 text-sm font-medium">{s.l}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
          <span className="text-xs tracking-widest uppercase">Scroll to explore</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity }} className="w-5 h-8 border-2 border-white/30 rounded-full flex items-center justify-center">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* ── Origin Story ──────────────────────────────────────────────────────── */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 bg-[#0B5D3F]/10 text-[#0B5D3F] text-xs font-bold px-4 py-2 rounded-full mb-8 uppercase tracking-widest">
                <Heart size={12} fill="currentColor" /> Our Origin Story
              </div>
              <h2 className="text-[#0B5D3F] mb-4 leading-tight">Born from Urgency,<br />Sustained by Purpose</h2>

              {/* Pull quote */}
              <div className="relative bg-[#F6FBF8] border-l-4 border-[#4CAF50] rounded-r-2xl p-6 mb-8">
                <Quote size={24} className="text-[#4CAF50]/40 mb-2" />
                <p className="text-[#0B5D3F] italic leading-relaxed font-medium">
                  "When the floods came and scientists confirmed climate change as the cause, we realized that hope without action was just a comfortable lie. We had to build something real."
                </p>
                <div className="mt-3 text-sm font-bold text-gray-600">— Imran Hossain & Abu Hanif, Co-Founders</div>
              </div>

              <div className="flex flex-col gap-5 text-gray-600 leading-relaxed">
                <p>
                  ESN was born in the summer of 2019, weeks after Bangladesh recorded its worst monsoon flooding in a generation. Scientists from MIT and IPCC confirmed what local communities already feared — climate change was amplifying these disasters. A group of young people, led by Imran Hossain and Abu Hanif, responded not with despair but with a plan.
                </p>
                <p>
                  They planted 1,000 mangrove seedlings in the Sundarbans that first weekend. Within six months, they had 400 volunteers. Within a year, they had their first international chapter in Kolkata. What followed was not a slow institutional climb but an organic explosion of communities joining a movement they felt was genuinely theirs.
                </p>
                <p>
                  Today ESN operates in 80+ countries — but the ethos remains unchanged: local ownership, global solidarity, science-driven humility, and an absolute refusal to accept that the world's poorest communities should bear the heaviest burden of a crisis they did least to create.
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                {["Science-informed, community-owned model", "70%+ of leadership from Global South", "Open-source data, fully transparent finances"].map((t) => (
                  <div key={t} className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="w-5 h-5 bg-[#4CAF50] rounded-full flex items-center justify-center shrink-0">
                      <Check size={12} className="text-white" />
                    </div>
                    {t}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }} className="relative">
              {/* Main image */}
              <div className="rounded-3xl overflow-hidden shadow-2xl h-[480px]">
                <ImageWithFallback
                  src="/canada conference.jpeg"
                  alt="ESN planting session"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Overlay small image */}
              <div className="absolute -bottom-8 -left-8 w-44 h-44 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
                <ImageWithFallback
                  src="/represent bangladesh.jpeg"
                  alt="Volunteers"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Award badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-xl border border-[#D6A95A]/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#D6A95A]/15 rounded-xl flex items-center justify-center">
                    <Award size={22} className="text-[#D6A95A]" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">UN Recognized</div>
                    <div className="text-xs text-gray-500">ECOSOC Special Status</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Co-Founder's Message ───────────────────────────────────────────── */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#D6A95A]/15 text-[#9E6B3C] text-xs font-bold px-4 py-2 rounded-full mb-5 uppercase tracking-widest">
              <Quote size={12} fill="currentColor" /> Co-Founder's Message
            </div>
            <h2 className="text-[#0B5D3F] mb-4">A Message from Imran Hossain</h2>
          </div>
          
          <div className="bg-[#F6FBF8] rounded-3xl p-8 sm:p-12 border border-[#4CAF50]/20 shadow-xl shadow-[#0B5D3F]/5 relative">
            <Quote size={40} className="text-[#4CAF50]/20 absolute top-8 left-8" />
            <div className="relative z-10 flex flex-col gap-6 text-gray-700 leading-relaxed text-lg sm:text-xl font-medium">
              <p>
                I am a climate leader, sustainability advocate, and entrepreneur committed to advancing climate resilience through innovation, policy engagement, and community action. As the Co-Founder of the Environmental Shapers Network (ESN), I lead initiatives focused on climate adaptation, the circular economy, plastic pollution reduction, environmental education, and youth empowerment. My mission is to transform environmental challenges into scalable, nature-positive solutions that create lasting social, environmental, and economic impact.
              </p>
              <p>
                I have had the privilege of representing Bangladesh at global platforms, including the United Nations Climate Change Conferences (COP27 and COP28) and the United Nations General Assembly, where I have engaged with policymakers, scientists, and youth leaders to promote climate justice, sustainable development, and locally led adaptation.
              </p>
              <p>
                My work combines climate innovation, environmental sustainability, Geographic Information Systems (GIS), and entrepreneurship to develop practical solutions for vulnerable communities. I aspire to build resilient, low-carbon societies while empowering young people to become the next generation of climate leaders and changemakers.
              </p>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-200 flex items-center justify-between">
              <div>
                <div className="font-black text-gray-900 text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Imran Hossain</div>
                <div className="text-[#0B5D3F] font-bold text-sm">Co-Founder, ESN</div>
              </div>
              <div className="w-12 h-12 bg-[#0B5D3F] rounded-full flex items-center justify-center">
                <Leaf className="text-white" size={20} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Impact Statistics ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-[#0B5D3F] to-[#173B63] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <img src="https://images.unsplash.com/photo-1683221704109-acdeb0883037?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1920" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#4CAF50]/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-full mb-5 uppercase tracking-widest">
              <Target size={12} className="text-[#4CAF50]" /> Impact at Scale
            </div>
            <h2 className="text-white mb-4">7 Years. One Planet.<br />Measurable Impact.</h2>
            <p className="text-white/65 text-lg max-w-xl mx-auto">Every number represents communities protected, ecosystems restored, and futures secured.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {impactStats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/8 border border-white/12 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/12 transition-all group"
              >
                <div className="w-14 h-14 bg-[#4CAF50]/20 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#4CAF50]/30 transition-all">
                  <s.icon size={26} className="text-[#4CAF50]" />
                </div>
                <div className="text-4xl font-black text-white mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.value}</div>
                <div className="text-white font-semibold mb-1">{s.label}</div>
                <div className="text-white/50 text-sm">{s.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Core Values ───────────────────────────────────────────────────────── */}
      <section className="py-28 bg-[#F6FBF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#0B5D3F]/10 text-[#0B5D3F] text-xs font-bold px-4 py-2 rounded-full mb-5 uppercase tracking-widest">
              <Shield size={12} /> Our Principles
            </div>
            <h2 className="text-[#0B5D3F] mb-4">What We Stand For</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Six principles that shape every decision we make, every project we fund, and every partnership we form.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-3xl p-8 border border-gray-100 hover:shadow-xl hover:shadow-gray-100 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all" style={{ backgroundColor: v.color + "15" }}>
                  <v.icon size={26} style={{ color: v.color }} />
                </div>
                <h4 className="font-black text-gray-900 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{v.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ─────────────────────────────────────────────────────────── */}
      <section className="py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-[#0B5D3F]/10 text-[#0B5D3F] text-xs font-bold px-4 py-2 rounded-full mb-5 uppercase tracking-widest">
              <Calendar size={12} /> Our Journey
            </div>
            <h2 className="text-[#0B5D3F] mb-4">A Decade of Milestones</h2>
            <p className="text-gray-500 text-lg">From one mangrove project to a global network — every step on the map.</p>
          </motion.div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#4CAF50] via-[#0B5D3F] to-[#173B63] md:-translate-x-0.5" />

            <div className="flex flex-col gap-14">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  className={`relative flex items-start gap-0 md:gap-8 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  {/* Timeline dot — centered on the line */}
                  <div
                    className="absolute left-8 md:left-1/2 top-6 -translate-x-1/2 w-6 h-6 rounded-full border-4 border-white shadow-lg z-10 flex items-center justify-center"
                    style={{ backgroundColor: m.color }}
                  >
                    <m.icon size={10} className="text-white" />
                  </div>

                  {/* Year bubble — opposite side on desktop */}
                  <div className={`hidden md:flex md:w-1/2 items-center ${i % 2 === 0 ? "justify-end pr-12" : "justify-start pl-12"}`}>
                    <div className="text-4xl font-black" style={{ color: m.color, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{m.year}</div>
                  </div>

                  {/* Content card */}
                  <div className={`md:w-1/2 ml-20 md:ml-0 ${i % 2 === 0 ? "md:pl-12" : "md:pr-12"}`}>
                    <div className="bg-[#F6FBF8] rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:shadow-gray-100 transition-all">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: m.color + "20" }}>
                          <m.icon size={16} style={{ color: m.color }} />
                        </div>
                        <div>
                          <div className="text-xs font-black uppercase tracking-widest md:hidden" style={{ color: m.color }}>{m.year}</div>
                          <div className="font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{m.title}</div>
                        </div>
                      </div>
                      <p className="text-gray-500 text-sm leading-relaxed">{m.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Leadership Team ───────────────────────────────────────────────────── */}
      <section className="py-28 bg-[#F6FBF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#0B5D3F]/10 text-[#0B5D3F] text-xs font-bold px-4 py-2 rounded-full mb-5 uppercase tracking-widest">
              <Users size={12} /> The Team
            </div>
            <h2 className="text-[#0B5D3F] mb-4">The People Behind the Mission</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Scientists, strategists, community organizers, and technologists — united by an unshakeable belief in collective action.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-gray-100 hover:-translate-y-1 transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <ImageWithFallback
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B5D3F]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* Country badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-[#0B5D3F] text-xs font-bold px-3 py-1.5 rounded-full">
                    <MapPin size={10} />
                    {member.country}
                  </div>
                </div>
                {/* Info */}
                <div className="p-6">
                  <h4 className="font-black text-gray-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{member.name}</h4>
                  <p className="text-[#0B5D3F] text-sm font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-500 text-xs leading-relaxed mb-4">{member.bio}</p>
                  {/* Tags */}
                  <div className="flex gap-2 flex-wrap">
                    {member.tags.map((tag) => (
                      <span key={tag} className="text-xs font-bold bg-[#0B5D3F]/8 text-[#0B5D3F] px-3 py-1 rounded-full border border-[#0B5D3F]/10">{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recognition & Awards ──────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-[#D6A95A]/15 text-[#9E6B3C] text-xs font-bold px-4 py-2 rounded-full mb-5 uppercase tracking-widest">
              <Star size={12} fill="currentColor" /> Recognition
            </div>
            <h2 className="text-[#0B5D3F] mb-4">Recognized Globally</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Validation from the world's most respected institutions — though our true measure remains the ecosystems we've restored.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {recognitions.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gradient-to-br from-[#F6FBF8] to-white rounded-2xl p-6 border border-[#D6A95A]/20 hover:border-[#D6A95A]/40 hover:shadow-lg hover:shadow-[#D6A95A]/10 transition-all"
              >
                <div className="w-12 h-12 bg-[#D6A95A]/15 rounded-xl flex items-center justify-center mb-4">
                  <Award size={22} className="text-[#D6A95A]" />
                </div>
                <div className="text-xs font-black text-[#D6A95A] mb-1">{r.year}</div>
                <h4 className="font-black text-gray-900 text-sm mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{r.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{r.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Partners row */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="border-t border-gray-100 pt-12">
            <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">Trusted Partners & Affiliates</p>
            <div className="flex flex-wrap gap-4 justify-center items-center">
              {partners.map((p) => (
                <div key={p} className="px-6 py-3 bg-[#F6FBF8] rounded-xl border border-gray-100 text-sm font-bold text-gray-500 hover:bg-[#0B5D3F]/5 hover:text-[#0B5D3F] hover:border-[#0B5D3F]/20 transition-all cursor-default">
                  {p}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Global Presence ───────────────────────────────────────────────────── */}
      <section className="py-24 bg-[#F6FBF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 bg-[#0B5D3F]/10 text-[#0B5D3F] text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-widest">
                <Globe2 size={12} /> Global Presence
              </div>
              <h2 className="text-[#0B5D3F] mb-6">Rooted Locally,<br />Acting Globally</h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                Our model rejects the traditional "headquarters knows best" approach. Every region has full autonomy over program design, funding allocation, and community partnerships — supported by a shared platform, shared data, and shared values.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { region: "South Asia", countries: "12 countries", icon: MapPin, color: "#0B5D3F" },
                  { region: "Sub-Saharan Africa", countries: "22 countries", icon: Globe2, color: "#173B63" },
                  { region: "Latin America", countries: "18 countries", icon: Leaf, color: "#4CAF50" },
                  { region: "Southeast Asia", countries: "10 countries", icon: Sprout, color: "#0B5D3F" },
                  { region: "MENA", countries: "8 countries", icon: Sun, color: "#D6A95A" },
                  { region: "Europe & NA", countries: "10 countries", icon: TreePine, color: "#173B63" },
                ].map((r) => (
                  <div key={r.region} className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-xl hover:shadow-gray-100 hover:border-[#0B5D3F]/20 transition-all duration-300 group hover:-translate-y-1">
                    <div 
                      className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center transition-transform duration-300 group-hover:scale-110" 
                      style={{ backgroundColor: `${r.color}15`, color: r.color }}
                    >
                      <r.icon size={20} />
                    </div>
                    <div className="text-sm font-bold text-gray-800 group-hover:text-[#0B5D3F] transition-colors">{r.region}</div>
                    <div className="text-xs text-gray-500 font-medium mt-0.5">{r.countries}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }} className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl h-[500px]">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1580696499419-84ca9688f947?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=800"
                  alt="Global impact"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-[#0B5D3F]/50 to-transparent pointer-events-none" />
              <div className="absolute bottom-8 left-8 right-8">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 border border-white/50">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Latest Milestone</div>
                  <div className="font-black text-gray-900 mb-1">1 Million Trees Planted</div>
                  <div className="text-sm text-gray-500">Sundarbans, Bangladesh · July 2023</div>
                  <div className="mt-3 w-full bg-gray-100 rounded-full h-2">
                    <div className="h-full bg-gradient-to-r from-[#4CAF50] to-[#0B5D3F] rounded-full" style={{ width: "84%" }} />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1.5">
                    <span>1M planted</span>
                    <span>Goal: 1.2M by Dec 2026</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────────── */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#071a0f] via-[#0B5D3F] to-[#173B63]" />
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1920" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#4CAF50]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D6A95A]/10 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-full mb-8 uppercase tracking-widest">
              <Leaf size={12} className="text-[#4CAF50]" /> Join the Movement
            </div>
            <h2 className="text-white mb-6 leading-tight">
              The Planet Needs<br />
              <span className="text-[#4CAF50]">Your Chapter</span> in This Story
            </h2>
            <p className="text-white/70 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              Whether you volunteer on the ground, support us financially, or advocate in your community — there is a role for every committed person in this movement.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/volunteer" className="inline-flex items-center gap-2 bg-[#4CAF50] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#43a047] transition-all hover:scale-105 shadow-lg shadow-[#4CAF50]/30">
                Become a Volunteer <ArrowRight size={16} />
              </Link>
              <Link to="/donate" className="inline-flex items-center gap-2 bg-[#D6A95A] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#c49a4a] transition-all hover:scale-105 shadow-lg shadow-[#D6A95A]/30">
                Donate to ESN
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/20 transition-all">
                Partner With Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Spacer between final CTA and Footer */}
      <div className="h-16 lg:h-24 bg-[#F6FBF8]" />
    </div>
  );
}
