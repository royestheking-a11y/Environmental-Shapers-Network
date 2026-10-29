import { useParams, Link, useLocation } from "react-router";
import { motion, useInView, AnimatePresence } from "motion/react";
import { useRef, useMemo, useState, useEffect } from "react";
import {
  ArrowRight, Users, BookOpen, Calendar, ChevronRight, Globe2,
  CheckCircle2, MapPin, Star, TrendingUp, TreePine, Waves, Sun,
  ShieldAlert, Bug, GraduationCap, Microscope, Edit3, Sparkles,
  X, Sliders, Save, Plus, Trash2, ExternalLink
} from "lucide-react";
import { ImageWithFallback } from "../components/ui/ImageWithFallback";
import { useFirestoreData, saveFirestoreData } from "../../lib/useFirestore";
import { logAdminActivity } from "../../lib/activityLogger";
import { getInitialPrograms, resolveIcon, ProgramData } from "./admin/sections/ProgramsView";
import { getInitialEvents, ESNEvent, DEFAULT_EVENTS_PAGE_SETTINGS, EventsPageSettings } from "./admin/sections/EventsView";
import { getInitialProjects, Project } from "./admin/sections/ProjectsView";
import { RollingCarousel } from "../components/ui/RollingCarousel";

const programData: Record<string, {
  slug: string;
  label: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  heroImage: string;
  stats: { value: string; label: string }[];
  highlights: string[];
  cards: { title: string; desc: string; tag: string }[];
  stories: { name: string; role: string; quote: string; country: string }[];
  ctaTitle?: string;
  ctaDesc?: string;
  ctaLink1?: { text: string; url: string };
  ctaLink2?: { text: string; url: string };
}> = {
  youth: {
    slug: "youth",
    label: "Youth Programs",
    tagline: "Empowering the Next Generation of Environmental Leaders",
    description: "Young people are not just the future — they are vital actors in environmental change right now. ESN's Youth Programs equip young people aged 15–30 with the knowledge, skills, networks, and platforms to design and lead environmental action in their communities and beyond.",
    icon: Users,
    heroImage: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1400",
    stats: [
      { value: "48K+", label: "Youth Members" },
      { value: "120+", label: "Countries" },
      { value: "800+", label: "Youth-Led Projects" },
      { value: "92%", label: "Report Increased Capacity" },
    ],
    highlights: [
      "Young Environmental Leaders (YEL) Fellowship — 12-month intensive program",
      "Green Schools Initiative in 50+ countries",
      "Youth COP delegation support and UNFCCC accreditation",
      "ESN Youth Innovation Fund — micro-grants for youth ideas",
      "Online learning hub with certified environmental courses",
      "Mentorship matching with senior ESN professionals",
    ],
    cards: [
      { title: "YEL Fellowship", tag: "Flagship", desc: "A transformative 12-month program connecting 100 young leaders per cohort from across the globe. Fellows design and implement community environmental projects with ESN mentorship and seed funding." },
      { title: "Green Schools Initiative", tag: "Education", desc: "Working with 2,000+ schools in 50 countries to embed environmental education into curricula, establish eco-clubs, and implement sustainability projects on school grounds." },
      { title: "Youth Innovation Fund", tag: "Funding", desc: "Micro-grants of $500–$5,000 for youth-led environmental projects. Over 400 projects funded to date spanning tree planting, waste management, renewable energy, and advocacy." },
      { title: "Climate Negotiation Training", tag: "Advocacy", desc: "Preparing young people to engage in UN climate negotiations, regional environmental summits, and national policy processes with confidence and credibility." },
    ],
    stories: [
      { name: "Aisha Diallo", role: "YEL Fellow 2024", quote: "The fellowship gave me the tools and confidence to launch a solar cooperative serving 400 families in my village.", country: "Senegal" },
      { name: "Ravi Sharma", role: "Green Schools Lead", quote: "Our school eco-club has planted 8,000 trees and inspired the municipality to create an urban forest policy.", country: "India" },
      { name: "Sofia Hernandez", role: "Youth Negotiator", quote: "ESN trained me to present Colombia's youth climate demands at COP29. It was the most impactful experience of my life.", country: "Colombia" },
    ],
    ctaTitle: "Join the Youth Movement",
    ctaDesc: "Apply for the YEL Fellowship, join a Green School, or fund a young leader's environmental project.",
    ctaLink1: { text: "Apply Now", url: "/contact" },
    ctaLink2: { text: "Fund a Youth Project", url: "/donate" }
  },
  "forest-restoration": {
    slug: "forest-restoration",
    label: "Forest Restoration",
    tagline: "Breathing Life Back into Degraded Landscapes",
    description: "Forests are the lungs of our planet. Our Forest Restoration program works with local communities to plant native species, restore degraded lands, and utilize digital ecosystem monitoring to ensure long-term survivability and carbon sequestration.",
    icon: TreePine,
    heroImage: "https://images.unsplash.com/photo-1511497584788-876760111969?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1400",
    stats: [
      { value: "100M+", label: "Trees Planted" },
      { value: "45", label: "Countries" },
      { value: "2M", label: "Hectares Restored" },
      { value: "150K", label: "Local Jobs" },
    ],
    highlights: [
      "Community-led native tree nursery establishment",
      "Drone and satellite-based survival monitoring",
      "Agroforestry training for local farmers",
      "Reforestation of critical watersheds",
      "Carbon credit certification for local communities",
      "Biodiversity corridors for endangered species",
    ],
    cards: [
      { title: "Amazon Revival", tag: "Flagship", desc: "Working with indigenous communities to restore 500,000 hectares of degraded rainforest using native species and sustainable agroforestry." },
      { title: "Great Green Wall Support", tag: "Partnership", desc: "Partnering with African nations to plant drought-resistant trees across the Sahel, combating desertification and creating green jobs." },
      { title: "Mangrove Shield", tag: "Coastal", desc: "Restoring critical mangrove ecosystems in Southeast Asia to protect coastlines from storm surges and sequester blue carbon." },
      { title: "Urban Canopy Initiative", tag: "Urban", desc: "Bringing green spaces back to heavily polluted urban centers by planting millions of trees in partnership with city governments." },
    ],
    stories: [
      { name: "Maria Santos", role: "Community Leader", quote: "Restoring the forest means restoring our livelihood. We are planting trees that will feed our grandchildren.", country: "Brazil" },
      { name: "David Ochieng", role: "Nursery Manager", quote: "We've grown over 50,000 seedlings this year. It's not just about planting trees, it's about growing hope.", country: "Kenya" },
      { name: "Siti Aminah", role: "Conservationist", quote: "The mangroves protect our village from floods and bring back the fish. The impact is immediate and profound.", country: "Indonesia" },
    ],
    ctaTitle: "Support Forest Restoration",
    ctaDesc: "Fund a tree nursery, sponsor a planting campaign, or partner with us to restore critical landscapes.",
    ctaLink1: { text: "Donate Now", url: "/donate" },
    ctaLink2: { text: "Partner With Us", url: "/contact" }
  },
  "ocean-action": {
    slug: "ocean-action",
    label: "Ocean & Coastal Action",
    tagline: "Protecting the Blue Heart of Our Planet",
    description: "Our oceans are under unprecedented threat from pollution, overfishing, and climate change. We work to establish Marine Protected Areas, restore coral reefs, and combat plastic pollution through community-driven initiatives.",
    icon: Waves,
    heroImage: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1400",
    stats: [
      { value: "35+", label: "Coastal Nations" },
      { value: "1M+", label: "Tons of Plastic Removed" },
      { value: "50", label: "Protected Areas" },
      { value: "85%", label: "Coral Survival Rate" },
    ],
    highlights: [
      "Deep-ocean plastic recovery and recycling",
      "Establishment of community-governed Marine Protected Areas (MPAs)",
      "Coral reef restoration using 3D printed structures",
      "Sustainable fisheries training for coastal communities",
      "Mangrove and seagrass bed conservation",
      "Advocacy for the High Seas Treaty",
    ],
    cards: [
      { title: "Coral Rescue Network", tag: "Restoration", desc: "Deploying innovative coral gardening techniques and 3D printed reefs to restore 100+ degraded reef systems globally." },
      { title: "Plastic-Free Seas", tag: "Action", desc: "Mobilizing thousands of volunteers and specialized vessels to intercept river plastic before it reaches the ocean." },
      { title: "Blue Carbon Habitats", tag: "Conservation", desc: "Protecting and restoring seagrass meadows that absorb carbon up to 35 times faster than tropical rainforests." },
      { title: "Sustainable Coasts", tag: "Community", desc: "Empowering local fishing communities with the tools and knowledge to manage their marine resources sustainably." },
    ],
    stories: [
      { name: "Carlos Mendoza", role: "Marine Biologist", quote: "Seeing the coral reefs come back to life after years of degradation is the most rewarding work I've ever done.", country: "Mexico" },
      { name: "Amina Hassan", role: "Fisheries Coordinator", quote: "The new MPA has allowed fish stocks to recover, securing a sustainable future for our coastal communities.", country: "Somalia" },
      { name: "Liam Chen", role: "Cleanup Volunteer", quote: "Every piece of plastic we remove is a victory for marine life. We are proving that collective action works.", country: "Taiwan" },
    ],
    ctaTitle: "Protect Our Oceans",
    ctaDesc: "Support a coral restoration project or join a coastal cleanup initiative.",
    ctaLink1: { text: "Take Action", url: "/volunteer" },
    ctaLink2: { text: "Fund Ocean Projects", url: "/donate" }
  },
  "clean-energy": {
    slug: "clean-energy",
    label: "Climate-Smart Energy Access",
    tagline: "Powering the Future with Clean, Community-Owned Energy",
    description: "We are accelerating the transition away from fossil fuels by providing affordable, renewable energy solutions to off-grid communities. We believe energy access is a fundamental human right that must be met sustainably.",
    icon: Sun,
    heroImage: "https://images.unsplash.com/photo-1509391366360-2e959784a276?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1400",
    stats: [
      { value: "10M+", label: "People Powered" },
      { value: "500+", label: "Solar Micro-Grids" },
      { value: "2M", label: "Tons CO2 Averted" },
      { value: "100%", label: "Community Owned" },
    ],
    highlights: [
      "Installation of community-owned solar micro-grids",
      "Distribution of clean cookstoves to reduce indoor pollution",
      "Training local technicians in renewable energy maintenance",
      "Advocating for decentralized renewable energy policies",
      "Micro-hydro projects in mountainous regions",
      "Solar-powered water pumping for agriculture",
    ],
    cards: [
      { title: "Solar Villages", tag: "Flagship", desc: "Bringing reliable, renewable electricity to remote villages, transforming healthcare, education, and local economies." },
      { title: "Clean Cooking Initiative", tag: "Health", desc: "Distributing highly efficient biomass and solar cookstoves, dramatically reducing deforestation and respiratory diseases." },
      { title: "Women in Energy", tag: "Empowerment", desc: "Training and employing women as solar technicians and clean energy entrepreneurs in rural communities." },
      { title: "Micro-Hydro Networks", tag: "Infrastructure", desc: "Harnessing the power of small streams to provide constant, clean energy to isolated mountain communities." },
    ],
    stories: [
      { name: "Grace Njoroge", role: "Solar Technician", quote: "I used to walk miles for kerosene. Now I maintain the solar grid that powers my entire village.", country: "Kenya" },
      { name: "Rajesh Kumar", role: "Farmer", quote: "The solar water pump changed everything. We can irrigate year-round without buying expensive, polluting diesel.", country: "India" },
      { name: "Elena Rojas", role: "Teacher", quote: "Having lights in the school means adult literacy classes can happen at night. It's transformed our community.", country: "Peru" },
    ],
    ctaTitle: "Power the Transition",
    ctaDesc: "Help us build solar micro-grids and provide clean energy access to those who need it most.",
    ctaLink1: { text: "Donate for Energy", url: "/donate" },
    ctaLink2: { text: "Learn More", url: "/about" }
  },
  "climate-adaptation": {
    slug: "climate-adaptation",
    label: "Climate Adaptation & Resilience",
    tagline: "Building Resilient Communities in a Changing World",
    description: "As climate change impacts intensify, vulnerable communities bear the brunt. We work to build adaptive capacity through nature-based infrastructure, early warning systems, and climate-resilient agriculture.",
    icon: ShieldAlert,
    heroImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1400",
    stats: [
      { value: "50+", label: "Vulnerable Regions" },
      { value: "3M+", label: "Farmers Trained" },
      { value: "1,200", label: "Warning Systems" },
      { value: "20M+", label: "Lives Protected" },
    ],
    highlights: [
      "Implementation of climate-smart agricultural practices",
      "Building nature-based flood defenses (wetlands, mangroves)",
      "Deploying community-managed early warning systems",
      "Drought-resistant crop seed banks",
      "Rainwater harvesting and water conservation infrastructure",
      "Mainstreaming adaptation into local government planning",
    ],
    cards: [
      { title: "Climate-Smart Farming", tag: "Agriculture", desc: "Training smallholder farmers in regenerative agriculture techniques that increase yields while surviving extreme weather." },
      { title: "Coastal Defenses", tag: "Infrastructure", desc: "Restoring natural barriers like mangroves and reefs to protect vulnerable coastal communities from storm surges and sea-level rise." },
      { title: "Water Security", tag: "Resource", desc: "Building innovative rainwater harvesting systems and restoring watersheds to ensure reliable water supply during extended droughts." },
      { title: "Early Warning Networks", tag: "Safety", desc: "Equipping remote communities with affordable technology to receive advance warnings of floods, cyclones, and extreme weather." },
    ],
    stories: [
      { name: "Tariq Ali", role: "Farmer", quote: "The new resilient seed varieties survived the floods. Without them, my family would have had nothing this year.", country: "Bangladesh" },
      { name: "Sela Vatu", role: "Community Leader", quote: "We relocated our village and planted mangroves. We are adapting, but we need the world to stop the warming.", country: "Fiji" },
      { name: "Fatima Diallo", role: "Water Committee", quote: "The new rainwater catchment system means our girls go to school instead of walking half the day for water.", country: "Mali" },
    ],
    ctaTitle: "Support Resilience",
    ctaDesc: "Help vulnerable communities adapt to the climate crisis with sustainable, nature-based solutions.",
    ctaLink1: { text: "Give Today", url: "/donate" },
    ctaLink2: { text: "Get Involved", url: "/volunteer" }
  },
  "biodiversity": {
    slug: "biodiversity",
    label: "Biodiversity & Wildlife",
    tagline: "Safeguarding the Web of Life",
    description: "We are in the midst of the sixth mass extinction. Our biodiversity program focuses on protecting critical habitats, combating wildlife trafficking, and ensuring human-wildlife coexistence through community-based conservation.",
    icon: Bug,
    heroImage: "https://images.unsplash.com/photo-1518331647614-7a1f04cd34cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1400",
    stats: [
      { value: "2,000+", label: "Species Protected" },
      { value: "5M", label: "Hectares Protected" },
      { value: "3,500", label: "Community Rangers" },
      { value: "90%", label: "Poaching Reduction" },
    ],
    highlights: [
      "Training and equipping local community wildlife rangers",
      "AI-powered camera trap networks for habitat monitoring",
      "Anti-poaching and anti-trafficking intelligence sharing",
      "Human-wildlife conflict mitigation programs",
      "Advocating for the 30x30 global biodiversity target",
      "Securing indigenous land rights for conservation",
    ],
    cards: [
      { title: "Community Rangers", tag: "Protection", desc: "Employing local community members as wildlife rangers, turning poachers into protectors and providing sustainable livelihoods." },
      { title: "Tech for Nature", tag: "Innovation", desc: "Deploying acoustic sensors, AI camera traps, and drones to monitor elusive species and detect illegal logging or poaching in real-time." },
      { title: "Safe Corridors", tag: "Habitats", desc: "Working with landowners to establish protected migration corridors for large mammals, reducing human-wildlife conflict." },
      { title: "Endangered Rescue", tag: "Species", desc: "Targeted interventions to save critically endangered species from the brink of extinction through habitat protection and breeding programs." },
    ],
    stories: [
      { name: "John Kamau", role: "Head Ranger", quote: "Protecting the elephants is protecting our heritage. When the wildlife thrives, our community thrives through eco-tourism.", country: "Kenya" },
      { name: "Mei Lin", role: "Conservation Scientist", quote: "The AI acoustic sensors helped us discover a population of gibbons we thought were locally extinct. It gave us hope.", country: "China" },
      { name: "Carlos Perez", role: "Indigenous Leader", quote: "Our ancestors have protected this forest for millennia. Legal recognition of our lands is the best conservation strategy.", country: "Brazil" },
    ],
    ctaTitle: "Protect Wildlife",
    ctaDesc: "Sponsor a community ranger or fund habitat protection initiatives.",
    ctaLink1: { text: "Donate", url: "/donate" },
    ctaLink2: { text: "Explore Campaigns", url: "/campaigns" }
  },
  "education": {
    slug: "education",
    label: "Environmental Education",
    tagline: "Empowering Minds to Change the World",
    description: "Education is the foundation of long-term environmental stewardship. We integrate climate literacy and sustainability into school curricula, train educators, and provide open-access digital learning tools to millions of students worldwide.",
    icon: GraduationCap,
    heroImage: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1400",
    stats: [
      { value: "5M+", label: "Students Reached" },
      { value: "15,000", label: "Schools Enrolled" },
      { value: "50,000", label: "Teachers Trained" },
      { value: "80", label: "Countries" },
    ],
    highlights: [
      "Development of comprehensive K-12 climate curricula",
      "Teacher training programs in environmental science",
      "Establishing school eco-clubs and green campuses",
      "Open-source digital sustainability learning platform",
      "Policy advocacy for mandatory climate education",
      "Interactive outdoor nature-based learning programs",
    ],
    cards: [
      { title: "Green Campuses", tag: "Infrastructure", desc: "Helping schools transition to zero-waste, solar-powered campuses that serve as living laboratories for students." },
      { title: "Climate Curriculum", tag: "Curriculum", desc: "Providing open-source, scientifically accurate, and locally relevant climate change lesson plans for all grade levels." },
      { title: "Teacher Academy", tag: "Training", desc: "Equipping educators with the knowledge and pedagogical tools to confidently teach complex environmental subjects." },
      { title: "Eco-Scholars", tag: "Youth", desc: "A gamified digital platform where students can earn badges for completing environmental challenges in their communities." },
    ],
    stories: [
      { name: "Sarah Jenkins", role: "Science Teacher", quote: "The ESN curriculum made climate science accessible and actionable for my students. They're no longer anxious; they're empowered.", country: "UK" },
      { name: "Aliou Ndoye", role: "Student", quote: "Through our school eco-club, we planted 500 trees and started a recycling program for the whole town.", country: "Senegal" },
      { name: "Maria Gonzalez", role: "Principal", quote: "Becoming a Green Campus reduced our energy costs by 40% and completely transformed the students' relationship with nature.", country: "Mexico" },
    ],
    ctaTitle: "Transform Education",
    ctaDesc: "Sponsor a school's transition to a Green Campus or help us translate our curriculum into more languages.",
    ctaLink1: { text: "Support Education", url: "/donate" },
    ctaLink2: { text: "Access Resources", url: "/knowledge-hub" }
  },
  "research": {
    slug: "research",
    label: "Environmental Research",
    tagline: "Actionable Insights for a Sustainable Future",
    description: "We conduct peer-reviewed, policy-relevant research across ecosystems and climate systems. Our goal is to produce actionable insights that shape global environmental policy and drive effective conservation strategies.",
    icon: Microscope,
    heroImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1400",
    stats: [
      { value: "300+", label: "Research Papers" },
      { value: "50", label: "Partner Institutes" },
      { value: "10,000+", label: "Citations" },
      { value: "15", label: "Policy Changes" },
    ],
    highlights: [
      "Ecosystem vulnerability assessments",
      "Carbon sequestration quantification in novel ecosystems",
      "Socio-economic impacts of climate change on indigenous communities",
      "Developing new methodologies for biodiversity tracking",
      "Publishing the annual State of Global Ecosystems report",
      "Translating complex science into actionable policy briefs",
    ],
    cards: [
      { title: "Climate Modeling", tag: "Climate", desc: "Using advanced computational models to predict localized impacts of climate change, helping communities prepare effectively." },
      { title: "Biodiversity Mapping", tag: "Conservation", desc: "Creating high-resolution maps of global biodiversity hotspots to guide international conservation funding." },
      { title: "Policy Labs", tag: "Advocacy", desc: "Collaborating with governments to translate our scientific findings into enforceable, effective environmental policies." },
      { title: "Citizen Science", tag: "Community", desc: "Engaging thousands of volunteers globally to collect vital environmental data, massively expanding our research capacity." },
    ],
    stories: [
      { name: "Dr. Elena Rossi", role: "Lead Researcher", quote: "Our data directly influenced the UN's new guidelines on coastal protection. That's the power of actionable science.", country: "Italy" },
      { name: "Samuel Osei", role: "Policy Analyst", quote: "ESN's research provided the evidence we needed to pass the national ban on single-use plastics.", country: "Ghana" },
      { name: "Dr. Chen Wei", role: "Ecologist", quote: "The citizen science app allowed us to track the migration patterns of endangered birds across 12 countries simultaneously.", country: "Singapore" },
    ],
    ctaTitle: "Advance the Science",
    ctaDesc: "Fund critical environmental research or partner with our scientific team.",
    ctaLink1: { text: "Read Our Reports", url: "/insights" },
    ctaLink2: { text: "Partner With Us", url: "/contact" }
  }
};

const insightsData = {
  slug: "insights",
  label: "Research & Insights",
  tagline: "Science-Driven Knowledge for Environmental Action",
  description: "ESN's Research & Insights program bridges the gap between scientific evidence and practical environmental action. We produce rigorous, accessible research on biodiversity, climate, forests, and ocean systems to inform policy, programs, and public awareness.",
  icon: BookOpen,
  heroImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1400",
  stats: [
    { value: "200+", label: "Publications" },
    { value: "85", label: "Partner Universities" },
    { value: "1.4M+", label: "Annual Downloads" },
    { value: "42", label: "Research Countries" },
  ],
  highlights: [
    "Annual Global Environmental State Report",
    "Open-access journal: ESN Environmental Review",
    "Real-time biodiversity monitoring datasets",
    "Policy briefs for UNEP, CBD, and UNFCCC",
    "Citizen science data integration platform",
    "Expert advisory network of 300+ scientists",
  ],
  publications: [
    { title: "State of the World's Forests 2026", type: "Annual Report", year: "2026", downloads: "48K" },
    { title: "Biodiversity Finance Gap Analysis", type: "Policy Brief", year: "2025", downloads: "22K" },
    { title: "Youth Climate Action Efficacy Study", type: "Research Paper", year: "2025", downloads: "15K" },
    { title: "Ocean Plastic: Source to Sea", type: "Technical Report", year: "2026", downloads: "31K" },
    { title: "NbS Carbon Quantification Methods", type: "Methodology", year: "2026", downloads: "19K" },
    { title: "Climate Resilience Index 2026", type: "Data Report", year: "2026", downloads: "27K" },
  ],
};

const eventsData = {
  slug: "events",
  label: "Events & Campaigns",
  tagline: "Mobilizing Action Through Powerful Collective Moments",
  description: "ESN hosts and supports a year-round calendar of events, campaigns, and mobilization opportunities that bring together communities, organizations, governments, and individuals to take action for the environment.",
  icon: Calendar,
  heroImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1400",
  stats: [
    { value: "120+", label: "Events Per Year" },
    { value: "2.8M+", label: "Campaign Participants" },
    { value: "190+", label: "Countries Reached" },
    { value: "48", label: "Major Summits" },
  ],
  upcoming: [
    { title: "ESN World Environmental Summit 2026", date: "Sep 15–18, 2026", location: "Dhaka, Bangladesh", type: "Summit", seats: "800 seats" },
    { title: "Global Tree Planting Day", date: "Oct 5, 2026", location: "Worldwide", type: "Campaign", seats: "Open to all" },
    { title: "Youth Climate Innovation Hackathon", date: "Aug 20–22, 2026", location: "Virtual + Regional", type: "Hackathon", seats: "500 teams" },
    { title: "Marine Conservation Forum", date: "Nov 8–10, 2026", location: "Singapore", type: "Forum", seats: "300 seats" },
    { title: "COP30 Youth Delegation", date: "Nov 2026", location: "Belém, Brazil", type: "Delegation", seats: "50 delegates" },
    { title: "ESN Annual Gala & Awards", date: "Dec 12, 2026", location: "New York, USA", type: "Gala", seats: "400 seats" },
  ],
};

function StatCard({ value, label, i }: { value: string; label: string; i: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: i * 0.1 }}
      className="bg-white rounded-2xl p-6 border border-gray-100 text-center"
    >
      <div className="text-3xl font-black text-[#0B5D3F] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </motion.div>
  );
}

function HeroBlock({ heroImage, label, tagline, icon: Icon, breadcrumb }: any) {
  return (
    <section className="relative h-[65vh] min-h-[420px] flex items-end overflow-hidden">
      <div className="absolute inset-0">
        <ImageWithFallback src={heroImage} alt={label} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a0e]/90 via-[#0a1a0e]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1a0e]/60 to-transparent" />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-16 w-full">
        <div className="flex items-center gap-2 text-white/60 text-sm mb-5">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={13} />
          <span className="text-white/40">Programs</span>
          <ChevronRight size={13} />
          <span className="text-white">{label}</span>
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
              <Icon size={24} className="text-[#4CAF50]" />
            </div>
            <span className="text-[#4CAF50] text-sm font-bold uppercase tracking-wider">{breadcrumb}</span>
          </div>
          <h1 className="text-white mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800 }}>{label}</h1>
          <p className="text-white/75 max-w-2xl" style={{ fontSize: "clamp(1rem, 1.5vw, 1.15rem)" }}>{tagline}</p>
        </motion.div>
      </div>
    </section>
  );
}

function GenericProgramPage({ d }: { d: any }) {
  const Icon = d.icon;
  const [allProjects] = useFirestoreData<Project[]>("esn_projects_admin", getInitialProjects());
  const [eventsList] = useFirestoreData<ESNEvent[]>("esn_events", getInitialEvents());

  const programEvents = useMemo(() => {
    if (!eventsList || eventsList.length === 0) return [];
    return eventsList.filter((e) => e.programSlug === d.slug);
  }, [eventsList, d.slug]);

  const programProjects = useMemo(() => {
    if (!allProjects || allProjects.length === 0) return [];
    return allProjects.filter((p) => {
      if (p.programSlug && p.programSlug === d.slug) return true;
      // Fallback matching by category or name keywords
      const cat = (p.category || "").toLowerCase();
      const slug = (d.slug || "").toLowerCase();
      if (slug.includes("forest") && (cat.includes("forest") || cat.includes("agroforestry"))) return true;
      if (slug.includes("ocean") && (cat.includes("ocean") || cat.includes("marine") || cat.includes("coastal"))) return true;
      if (slug.includes("energy") && cat.includes("energy")) return true;
      if (slug.includes("adaptation") && (cat.includes("adaptation") || cat.includes("water"))) return true;
      if (slug.includes("biodiversity") && (cat.includes("biodiversity") || cat.includes("wildlife"))) return true;
      if (slug.includes("education") && cat.includes("education")) return true;
      if (slug.includes("research") && cat.includes("research")) return true;
      if (slug.includes("youth") && cat.includes("youth")) return true;
      return false;
    });
  }, [allProjects, d.slug]);

  return (
    <div className="bg-[#F6FBF8]">
      <HeroBlock heroImage={d.heroImage} label={d.label} tagline={d.tagline} icon={Icon} breadcrumb="ESN Programs" />
      <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col gap-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {d.stats.map((s: any, i: number) => <StatCard key={s.label} {...s} i={i} />)}
        </div>
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div>
            <div className="text-[#4CAF50] text-sm font-bold uppercase tracking-wider mb-3">About This Program</div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 800 }} className="text-gray-900 mb-5">{d.label}</h2>
            <p className="text-gray-600 leading-relaxed">{d.description}</p>
          </div>
          <div className="bg-white rounded-2xl p-7 border border-gray-100">
            <div className="text-sm font-bold text-gray-800 mb-5">Program Highlights</div>
            {d.highlights.map((h: string) => (
              <div key={h} className="flex items-start gap-3 mb-3">
                <CheckCircle2 size={15} className="text-[#4CAF50] shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">{h}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-center mb-10">
            <div className="text-[#4CAF50] text-sm font-bold uppercase tracking-wider mb-2">Initiatives</div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 800 }} className="text-gray-900">Program Initiatives & Action Tracks</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {d.cards.map((c: any, i: number) => (
              <motion.div key={c.title || i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-7 border border-gray-100 hover:border-[#4CAF50]/30 hover:shadow-lg transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="text-xs font-bold bg-[#4CAF50]/15 text-[#0B5D3F] px-3 py-1 rounded-full">{c.tag}</span>
                    {c.impactInsight && (
                      <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                        {c.impactInsight}
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-gray-900 mb-3 text-lg">{c.title}</div>
                  <p className="text-sm text-gray-500 leading-relaxed">{c.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Active Projects Under This Program */}
        <div>
          {programProjects.length > 0 ? (
            <RollingCarousel
              badge={<div className="text-[#4CAF50] text-sm font-bold uppercase tracking-wider">On-The-Ground Operations</div>}
              title={`Projects Under ${d.label}`}
              subtitle="Active grassroots deployments and field projects operating directly under this program umbrella."
              action={
                <Link to="/projects" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0B5D3F] hover:text-[#4CAF50] transition-colors shrink-0">
                  View All Projects <ArrowRight size={15} />
                </Link>
              }
              itemClassName="w-[85vw] sm:w-[320px] md:w-[360px] shrink-0 snap-start"
            >
              {programProjects.map((p, idx) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="h-full"
                >
                  <Link
                    to={`/projects/${p.id}`}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#4CAF50]/40 hover:shadow-xl transition-all flex flex-col h-full"
                  >
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <ImageWithFallback
                        src={p.img}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full text-white shadow-sm ${
                          p.status === "Active" ? "bg-[#4CAF50]" : p.status === "Completed" ? "bg-[#173B63]" : "bg-[#D6A95A]"
                        }`}>
                          {p.status}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs">
                        <MapPin size={12} className="text-[#4CAF50]" />
                        <span>{p.country}{p.region ? `, ${p.region}` : ""}</span>
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[11px] font-bold text-[#0B5D3F] uppercase tracking-wider">{p.category}</span>
                          {p.theme && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              {p.theme}
                            </span>
                          )}
                        </div>
                        <h3 className="font-black text-gray-900 text-lg mb-2 group-hover:text-[#0B5D3F] transition-colors line-clamp-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {p.name}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">
                          {p.tagline || p.description}
                        </p>
                      </div>
                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                        <span className="font-bold text-gray-700">{p.impact || `${p.progress}% completed`}</span>
                        <span className="text-[#0B5D3F] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          View Project <ChevronRight size={14} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </RollingCarousel>
          ) : (
            <div className="bg-white rounded-2xl p-10 border border-gray-100 text-center">
              <TreePine size={36} className="text-gray-300 mx-auto mb-3" />
              <h4 className="font-bold text-gray-700 text-base mb-1">New Projects in Development</h4>
              <p className="text-xs text-gray-400 max-w-md mx-auto mb-4">
                Field projects for {d.label} are currently being onboarded and community baseline studies prepared.
              </p>
              <Link to="/projects" className="inline-flex items-center gap-2 text-xs font-bold text-[#0B5D3F] bg-emerald-50 px-4 py-2 rounded-xl hover:bg-emerald-100 transition-colors">
                Explore All Active Projects <ArrowRight size={13} />
              </Link>
            </div>
          )}
        </div>

        {programEvents.length > 0 && (
          <div>
            <RollingCarousel
              badge={<span className="text-[#0B5D3F] text-xs font-bold uppercase tracking-[0.2em] block">Programs & Gatherings</span>}
              title={`Upcoming ${d.label} Events`}
              subtitle="Summits, campaigns, and hackathons hosted and led by ESN for this program."
              action={
                <Link to="/events" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0B5D3F] hover:text-[#4CAF50] transition-colors shrink-0">
                  View All Events <ArrowRight size={15} />
                </Link>
              }
              itemClassName="w-[85vw] sm:w-[320px] md:w-[360px] shrink-0 snap-start"
            >
              {programEvents.map((e) => (
                <Link
                  key={e.id}
                  to={`/events/${e.id}`}
                  className="group bg-[#F8FCF9] rounded-2xl overflow-hidden border border-gray-100 hover:border-[#4CAF50]/40 hover:shadow-xl transition-all flex flex-col h-full cursor-pointer"
                >
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <ImageWithFallback
                      src={e.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1400"}
                      alt={e.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white shadow-sm" style={{ color: "#0B5D3F" }}>
                        {e.type}
                      </span>
                      {e.status === "completed" && (
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-900/80 text-white backdrop-blur-sm shadow-sm">
                          Concluded
                        </span>
                      )}
                      {e.status === "ongoing" && (
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-600 text-white backdrop-blur-sm shadow-sm flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Live
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-4 text-[11px] font-bold text-gray-500 mb-2">
                        <span className="flex items-center gap-1"><Calendar size={12} className="text-[#4CAF50]" /> {e.date}</span>
                        <span className="flex items-center gap-1"><MapPin size={12} className="text-[#4CAF50]" /> {e.location}</span>
                      </div>
                      <h3 className="font-black text-gray-900 text-lg mb-2 group-hover:text-[#0B5D3F] transition-colors line-clamp-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {e.title}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">
                        {e.description}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                      <span className="font-bold text-[#4CAF50]">
                        {e.status === "completed" ? "Concluded Event" : `${e.registered || 0}/${e.capacity || 100} Registered`}
                      </span>
                      <span className="text-[#0B5D3F] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        {e.status === "completed" ? "Event Recap" : "Learn More"} <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </RollingCarousel>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-gradient-to-r from-[#0B5D3F] to-[#173B63] rounded-3xl p-12 text-white text-center">
          <Users size={32} className="text-[#4CAF50] mx-auto mb-4" />
          <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800 }} className="text-white mb-4">{d.ctaTitle || "Join the Movement"}</h3>
          <p className="text-white/70 mb-8 max-w-lg mx-auto">{d.ctaDesc}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to={d.ctaLink1?.url || "/contact"} className="bg-[#4CAF50] hover:bg-[#43a047] text-white px-7 py-3.5 rounded-full font-semibold transition-all hover:scale-105 flex items-center gap-2">
              {d.ctaLink1?.text || "Apply Now"} <ArrowRight size={16} />
            </Link>
            <Link to={d.ctaLink2?.url || "/donate"} className="bg-white/15 border border-white/30 hover:bg-white/25 text-white px-7 py-3.5 rounded-full font-semibold transition-all flex items-center gap-2">
              {d.ctaLink2?.text || "Fund a Project"}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function InsightsPage() {
  const d = insightsData;
  const Icon = d.icon;
  const typeColors: Record<string, string> = {
    "Annual Report": "#0B5D3F",
    "Policy Brief": "#173B63",
    "Research Paper": "#4CAF50",
    "Technical Report": "#1565C0",
    "Methodology": "#E65100",
    "Data Report": "#D6A95A",
  };
  return (
    <div className="bg-[#F6FBF8]">
      <HeroBlock heroImage={d.heroImage} label={d.label} tagline={d.tagline} icon={Icon} breadcrumb="ESN Programs" />
      <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col gap-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {d.stats.map((s, i) => <StatCard key={s.label} {...s} i={i} />)}
        </div>
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div>
            <div className="text-[#4CAF50] text-sm font-bold uppercase tracking-wider mb-3">Our Research Mission</div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 800 }} className="text-gray-900 mb-5">Evidence for Action</h2>
            <p className="text-gray-600 leading-relaxed">{d.description}</p>
          </div>
          <div className="bg-white rounded-2xl p-7 border border-gray-100">
            <div className="text-sm font-bold text-gray-800 mb-5">Research Capabilities</div>
            {d.highlights.map((h) => (
              <div key={h} className="flex items-start gap-3 mb-3">
                <CheckCircle2 size={15} className="text-[#4CAF50] shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">{h}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="text-[#4CAF50] text-sm font-bold uppercase tracking-wider mb-1">Latest</div>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.4rem, 2vw, 1.8rem)", fontWeight: 800 }} className="text-gray-900">Publications & Reports</h2>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {d.publications.map((p, i) => (
              <motion.div key={p.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#4CAF50]/30 hover:shadow-md transition-all flex items-start gap-4 group cursor-pointer">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: (typeColors[p.type] || "#0B5D3F") + "15" }}>
                  <BookOpen size={18} style={{ color: typeColors[p.type] || "#0B5D3F" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-900 mb-1 group-hover:text-[#0B5D3F] transition-colors">{p.title}</div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="font-semibold" style={{ color: typeColors[p.type] || "#0B5D3F" }}>{p.type}</span>
                    <span>·</span><span>{p.year}</span>
                    <span>·</span><span className="flex items-center gap-1"><TrendingUp size={10} /> {p.downloads} downloads</span>
                  </div>
                </div>
                <ArrowRight size={16} className="text-gray-300 group-hover:text-[#0B5D3F] shrink-0 mt-1 transition-colors" />
              </motion.div>
            ))}
          </div>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-gradient-to-r from-[#0B5D3F] to-[#173B63] rounded-3xl p-12 text-white text-center">
          <BookOpen size={32} className="text-[#4CAF50] mx-auto mb-4" />
          <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800 }} className="text-white mb-4">Collaborate on Research</h3>
          <p className="text-white/70 mb-8 max-w-lg mx-auto">Partner with ESN's research team, contribute data, or commission a bespoke environmental analysis.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-[#4CAF50] hover:bg-[#43a047] text-white px-7 py-3.5 rounded-full font-semibold transition-all hover:scale-105">
            Partner With Us <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

function EventsPage() {
  const [pageSettings, setPageSettings] = useFirestoreData<EventsPageSettings>("esn_events_page_settings", DEFAULT_EVENTS_PAGE_SETTINGS);
  const d = pageSettings || DEFAULT_EVENTS_PAGE_SETTINGS;
  const Icon = Calendar;
  const [eventsList] = useFirestoreData<ESNEvent[]>("esn_events", getInitialEvents());
  const typeColors: Record<string, string> = { Summit: "#0B5D3F", Campaign: "#4CAF50", Hackathon: "#173B63", Forum: "#1565C0", Delegation: "#E65100", Gala: "#D6A95A" };
  const [activeTab, setActiveTab] = useState<"all" | "upcoming" | "ongoing" | "completed">("all");
  
  // Quick in-page edit modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<EventsPageSettings>(DEFAULT_EVENTS_PAGE_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [modalTab, setModalTab] = useState<"digits" | "about" | "hero">("digits");

  useEffect(() => {
    if (pageSettings) {
      setEditForm(pageSettings);
    }
  }, [pageSettings]);

  const handleSavePageSettings = async () => {
    setIsSaving(true);
    setPageSettings(editForm);
    await saveFirestoreData("esn_events_page_settings", editForm);
    logAdminActivity("Updated Events Page CMS", "Events", "Updated Events & Campaigns page digits, about story, and settings.", "success");
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setShowEditModal(false);
    }, 1200);
  };

  const rawList = eventsList && eventsList.length > 0 ? eventsList : getInitialEvents();

  const counts = {
    all: rawList.length,
    upcoming: rawList.filter(e => e.status === "upcoming").length,
    ongoing: rawList.filter(e => e.status === "ongoing").length,
    completed: rawList.filter(e => e.status === "completed").length,
  };

  const filteredEvents = rawList.filter((e) => {
    if (activeTab === "all") return true;
    return e.status === activeTab;
  });

  const displayEvents = filteredEvents.map((e) => ({
    id: e.id,
    type: e.type,
    status: e.status,
    seats: `${e.registered || 0}/${e.capacity || 100} Seats`,
    title: e.title,
    date: `${e.date} · ${e.time || "TBD"}`,
    location: `${e.location || "Online"} (${e.mode || "Virtual"})`,
    image: e.image,
    description: e.description,
  }));

  const activeStats = (d.stats && d.stats.length > 0) ? d.stats : DEFAULT_EVENTS_PAGE_SETTINGS.stats;

  return (
    <div className="bg-[#F6FBF8]">
      <HeroBlock
        heroImage={d.heroImage || DEFAULT_EVENTS_PAGE_SETTINGS.heroImage}
        label={d.label || "Events & Campaigns"}
        tagline={d.tagline || DEFAULT_EVENTS_PAGE_SETTINGS.tagline}
        icon={Icon}
        breadcrumb={d.badge || "ESN Programs"}
      />
      <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col gap-16">
        {/* Quick Edit Bar for Digits & Section */}
        <div className="flex items-center justify-between flex-wrap gap-3 -mb-8 bg-white/95 backdrop-blur-md border border-emerald-100 rounded-2xl p-3 px-5 shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-xs font-bold text-gray-800 tracking-tight">
              Events & Campaigns · Key Movement Digits & Content
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditForm(d);
                setModalTab("digits");
                setShowEditModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0B5D3F] hover:bg-[#0a5237] text-white text-xs font-bold transition-all shadow-xs"
            >
              <Edit3 size={13} /> Edit Digits & Content
            </button>
            <Link
              to="/admin/events?tab=cms"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-colors"
            >
              Admin CMS <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="relative group/stats">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {activeStats.map((s, i) => (
              <StatCard key={s.label + i} {...s} i={i} />
            ))}
          </div>
          <button
            onClick={() => {
              setEditForm(d);
              setModalTab("digits");
              setShowEditModal(true);
            }}
            className="absolute top-2 right-2 opacity-0 group-hover/stats:opacity-100 transition-opacity bg-white/90 hover:bg-white text-[#0B5D3F] border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
          >
            <Edit3 size={12} /> Edit Digits
          </button>
        </div>

        {/* About Section */}
        <div className="group/about relative">
          <div className="flex items-center justify-between">
            <div className="text-[#4CAF50] text-sm font-bold uppercase tracking-wider mb-2">
              {d.aboutBadge || "About"}
            </div>
            <button
              onClick={() => {
                setEditForm(d);
                setModalTab("about");
                setShowEditModal(true);
              }}
              className="opacity-0 group-hover/about:opacity-100 transition-opacity inline-flex items-center gap-1 text-xs font-bold text-[#0B5D3F] hover:underline"
            >
              <Edit3 size={13} /> Edit About Section
            </button>
          </div>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 800 }} className="text-gray-900 mb-5">
            {d.aboutHeading || "Building the Movement Together"}
          </h2>
          <p className="text-gray-600 leading-relaxed max-w-2xl">{d.description || DEFAULT_EVENTS_PAGE_SETTINGS.description}</p>
        </div>

        {/* Events Listing */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <Link to={d.ctaButtonLink || "/contact?subject=Event%20Registration"} className="group/header block">
              <div className="text-[#4CAF50] text-sm font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5 group-hover/header:text-[#388E3C] transition-colors">
                {d.sectionBadge || "Global Network"}
                <ArrowRight size={13} className="opacity-0 group-hover/header:opacity-100 group-hover/header:translate-x-1 transition-all" />
              </div>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.4rem, 2vw, 1.8rem)", fontWeight: 800 }} className="text-gray-900 group-hover/header:text-[#0B5D3F] transition-colors">
                {activeTab === "completed" ? "Past & Concluded Events" : activeTab === "ongoing" ? "Live Ongoing Events" : (d.sectionHeading || "Events & Mobilizations")}
              </h2>
            </Link>
            <Link
              to={d.ctaButtonLink || "/contact?subject=Event%20Registration"}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-[#0B5D3F] bg-[#0B5D3F]/10 hover:bg-[#0B5D3F] hover:text-white transition-all w-fit"
            >
              {d.ctaButtonText || "Contact Our Events Team"} <ArrowRight size={14} />
            </Link>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 flex-wrap mb-8 pb-3 border-b border-gray-200/70">
            {[
              { id: "all" as const, label: "All Events", count: counts.all },
              { id: "upcoming" as const, label: "Upcoming", count: counts.upcoming },
              { id: "ongoing" as const, label: "Live Now", count: counts.ongoing },
              { id: "completed" as const, label: "Past Events", count: counts.completed },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-[#0B5D3F] text-white shadow-sm"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/80"
                }`}
              >
                {tab.id === "ongoing" && tab.count > 0 && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                  activeTab === tab.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {displayEvents.map((e: any, i) => {
              const isPast = e.status === "completed";
              const isLive = e.status === "ongoing";

              return (
                <motion.div
                  key={e.title + i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="h-full"
                >
                  <Link
                    to={`/events/${e.id}`}
                    className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#4CAF50]/40 hover:shadow-xl transition-all group flex flex-col justify-between h-full cursor-pointer"
                  >
                    <div>
                      {e.image && (
                        <div className="h-44 rounded-xl overflow-hidden mb-4 border border-gray-100/80">
                          <ImageWithFallback src={e.image} alt={e.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                      )}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: (typeColors[e.type] || "#0B5D3F") + "15", color: typeColors[e.type] || "#0B5D3F" }}>
                            {e.type}
                          </span>
                          {isLive && (
                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                              Live Now
                            </span>
                          )}
                          {isPast && (
                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                              ✓ Past Event
                            </span>
                          )}
                          {e.status === "upcoming" && (
                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                              Upcoming
                            </span>
                          )}
                          {e.status === "postponed" && (
                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                              Postponed
                            </span>
                          )}
                          {e.status === "cancelled" && (
                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                              Cancelled
                            </span>
                          )}
                        </div>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full shrink-0 ${
                          isPast ? "bg-gray-100 text-gray-600" : "bg-[#4CAF50]/10 text-[#4CAF50]"
                        }`}>
                          {isPast ? "Concluded" : e.seats}
                        </span>
                      </div>
                      <div className="font-bold text-gray-900 text-lg mb-3 group-hover:text-[#0B5D3F] transition-colors">{e.title}</div>
                      <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                        <span className="flex items-center gap-1.5"><Calendar size={13} className="text-[#4CAF50]" /> {e.date}</span>
                        <span className="flex items-center gap-1.5"><MapPin size={13} className="text-[#4CAF50]" /> {e.location}</span>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#0B5D3F] group-hover:text-[#4CAF50] transition-colors">
                      <span>{isPast ? "Event Recap & Impact" : "View Event Details"}</span>
                      <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        {isPast ? "View Details" : "Learn More & Register"} <ArrowRight size={13} />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {displayEvents.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
              <Calendar size={40} className="mx-auto mb-3 text-gray-300" />
              <h4 className="text-gray-800 font-bold mb-1">No Events Found</h4>
              <p className="text-xs text-gray-500 mb-4">There are currently no events matching this filter category.</p>
              <button
                onClick={() => setActiveTab("all")}
                className="text-xs font-bold text-[#0B5D3F] bg-emerald-50 px-4 py-2 rounded-xl hover:bg-emerald-100 transition-colors"
              >
                View All Events
              </button>
            </div>
          )}
        </div>

        {/* Bottom CTA Block */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-gradient-to-r from-[#0B5D3F] to-[#173B63] rounded-3xl p-12 text-white text-center">
          <Calendar size={32} className="text-[#4CAF50] mx-auto mb-4" />
          <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800 }} className="text-white mb-4">
            {d.ctaTitle || "Register for an Event"}
          </h3>
          <p className="text-white/70 mb-8 max-w-lg mx-auto">
            {d.ctaDescription || "Host, sponsor, or attend ESN events worldwide. Contact us to learn about partnership and participation opportunities."}
          </p>
          <Link to={d.ctaButtonLink || "/contact?subject=Event%20Registration"} className="inline-flex items-center gap-2 bg-[#4CAF50] hover:bg-[#43a047] text-white px-7 py-3.5 rounded-full font-semibold transition-all hover:scale-105 shadow-md">
            {d.ctaButtonText || "Contact Our Events Team"} <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>

      {/* In-Page Quick Edit Modal for Digits and Section */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#0B5D3F]/10 text-[#0B5D3F] flex items-center justify-center shrink-0">
                    <Edit3 size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Edit Events & Campaigns Section
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">Quickly edit the metric digits, story narrative, and page settings</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {saveSuccess && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  Section and digits updated successfully! Live page refreshed.
                </div>
              )}

              {/* Tabs inside modal */}
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-5">
                {[
                  { id: "digits" as const, label: "Stat Digits (120+, 2.8M+, etc.)" },
                  { id: "about" as const, label: "About Narrative" },
                  { id: "hero" as const, label: "Hero Banner & Labels" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setModalTab(t.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      modalTab === t.id
                        ? "bg-[#0B5D3F] text-white shadow-xs"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab 1: Digits */}
              {modalTab === "digits" && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-gray-800">4 Highlight Metric Counters</h4>
                      <p className="text-[11px] text-gray-500">Edit values and labels for the cards displayed at the top of the section.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newStats = [...(editForm.stats || [])];
                        newStats.push({ value: "100+", label: "New Stat" });
                        setEditForm({ ...editForm, stats: newStats });
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#0B5D3F] bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-colors"
                    >
                      <Plus size={13} /> Add Stat
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(editForm.stats || []).map((s, idx) => (
                      <div key={idx} className="p-3.5 bg-[#F6FBF8] rounded-2xl border border-gray-200 flex flex-col gap-2 relative group">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[#0B5D3F] uppercase tracking-wider">
                            Stat #{idx + 1}
                          </span>
                          {(editForm.stats || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const newStats = [...editForm.stats].filter((_, i) => i !== idx);
                                setEditForm({ ...editForm, stats: newStats });
                              }}
                              className="text-gray-400 hover:text-red-500 p-0.5 rounded"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-600 block mb-0.5">Value / Digit</label>
                          <input
                            type="text"
                            value={s.value}
                            onChange={(e) => {
                              const newStats = [...editForm.stats];
                              newStats[idx] = { ...newStats[idx], value: e.target.value };
                              setEditForm({ ...editForm, stats: newStats });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-black text-[#0B5D3F] bg-white focus:outline-none focus:border-[#4CAF50]"
                            placeholder="e.g. 120+, 2.8M+, 190+, 48"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-600 block mb-0.5">Label</label>
                          <input
                            type="text"
                            value={s.label}
                            onChange={(e) => {
                              const newStats = [...editForm.stats];
                              newStats[idx] = { ...newStats[idx], label: e.target.value };
                              setEditForm({ ...editForm, stats: newStats });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold bg-white focus:outline-none focus:border-[#4CAF50]"
                            placeholder="e.g. Events Per Year"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditForm({
                          ...editForm,
                          stats: [
                            { value: "120+", label: "Events Per Year" },
                            { value: "2.8M+", label: "Campaign Participants" },
                            { value: "190+", label: "Countries Reached" },
                            { value: "48", label: "Major Summits" },
                          ]
                        });
                      }}
                      className="text-xs text-gray-500 hover:text-gray-800 underline"
                    >
                      Reset to Standard 4 Digits (120+, 2.8M+, 190+, 48)
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 2: About Narrative */}
              {modalTab === "about" && (
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">About Section Badge</label>
                    <input
                      type="text"
                      value={editForm.aboutBadge || "About"}
                      onChange={(e) => setEditForm({ ...editForm, aboutBadge: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]"
                      placeholder="e.g. ABOUT"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">About Heading</label>
                    <input
                      type="text"
                      value={editForm.aboutHeading}
                      onChange={(e) => setEditForm({ ...editForm, aboutHeading: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold focus:outline-none focus:border-[#4CAF50]"
                      placeholder="e.g. Building the Movement Together"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">About Description</label>
                    <textarea
                      rows={4}
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] leading-relaxed"
                      placeholder="Describe the movement, events, and campaigns..."
                    />
                  </div>
                </div>
              )}

              {/* Tab 3: Hero & Header */}
              {modalTab === "hero" && (
                <div className="flex flex-col gap-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Hero Badge</label>
                      <input
                        type="text"
                        value={editForm.badge}
                        onChange={(e) => setEditForm({ ...editForm, badge: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]"
                        placeholder="e.g. ESN Programs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Page Title</label>
                      <input
                        type="text"
                        value={editForm.label}
                        onChange={(e) => setEditForm({ ...editForm, label: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold focus:outline-none focus:border-[#4CAF50]"
                        placeholder="e.g. Events & Campaigns"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Tagline / Subheading</label>
                    <input
                      type="text"
                      value={editForm.tagline}
                      onChange={(e) => setEditForm({ ...editForm, tagline: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]"
                      placeholder="e.g. Mobilizing Action Through Powerful Collective Moments"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Hero Image URL</label>
                    <input
                      type="text"
                      value={editForm.heroImage}
                      onChange={(e) => setEditForm({ ...editForm, heroImage: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#4CAF50]"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-5 border-t border-gray-100 mt-6">
                <Link
                  to="/admin/events?tab=cms"
                  className="text-xs font-bold text-[#0B5D3F] hover:underline flex items-center gap-1"
                >
                  Open Full Admin CMS <ExternalLink size={12} />
                </Link>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSavePageSettings}
                    disabled={isSaving}
                    className="px-6 py-2.5 rounded-xl bg-[#0B5D3F] hover:bg-[#0a5237] text-white text-xs font-bold shadow-md transition-all"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProgramPage() {
  const { program } = useParams<{ program: string }>();
  const location = useLocation();
  const pathname = location.pathname;
  const [allPrograms] = useFirestoreData<ProgramData[]>("esn_programs", getInitialPrograms());

  if (pathname === "/insights") return <InsightsPage />;
  if (pathname === "/events") return <EventsPage />;
  
  // Dynamic lookup for programs added or customized via the admin dashboard
  const normalizedParam = program?.toLowerCase().trim();
  const dbProgram = allPrograms?.find(p => 
    p.slug?.toLowerCase().trim() === normalizedParam ||
    p.title?.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-") === normalizedParam
  );
  const baseProgram = normalizedParam && programData[normalizedParam] ? programData[normalizedParam] : null;

  if (dbProgram) {
    const dynamicData = {
      slug: dbProgram.slug,
      label: dbProgram.title,
      tagline: dbProgram.tagline || baseProgram?.tagline || `${dbProgram.category} · ${dbProgram.reach || "Global Initiative"}`,
      description: dbProgram.desc,
      icon: resolveIcon(dbProgram.iconName),
      heroImage: dbProgram.image || baseProgram?.heroImage || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400",
      stats: (dbProgram.stats && dbProgram.stats.length > 0 && dbProgram.stats.some(s => s.value || s.label))
        ? dbProgram.stats.filter(s => s.value || s.label)
        : (baseProgram?.stats || [
            { value: dbProgram.reach || "Global", label: "Program Reach" },
            { value: "Active", label: "Field Operations" },
            { value: "Science-Led", label: "Action Model" },
            { value: "100%", label: "Impact Verified" },
          ]),
      highlights: dbProgram.highlights && dbProgram.highlights.length > 0 ? dbProgram.highlights : (baseProgram?.highlights || [
        "Community-led intervention models",
        "Transparent ecological tracking and data verification",
        "Cross-border collaboration and policy support"
      ]),
      cards: (dbProgram.initiatives && dbProgram.initiatives.length > 0)
        ? dbProgram.initiatives
        : (baseProgram?.cards || [
            { title: `${dbProgram.title} Field Action`, tag: "Operations", desc: `Direct on-the-ground execution and field deployments across partner communities.` },
            { title: "Capacity Building & Training", tag: "Education", desc: `Empowering local teams with open-source tools, technical skills, and resources.` },
            { title: "Policy & Multi-Stakeholder Coalition", tag: "Policy", desc: `Aligning program goals with regional environmental targets and SDG frameworks.` }
          ]),
      stories: baseProgram?.stories || [
        { name: "Program Participant", role: "Field Coordinator", quote: "Working within this initiative has transformed our local capacity to protect and regenerate our environment.", country: "Global" }
      ],
      ctaTitle: baseProgram?.ctaTitle || `Support ${dbProgram.title}`,
      ctaDesc: baseProgram?.ctaDesc || `Help scale our ${dbProgram.title.toLowerCase()} initiatives across vulnerable regions.`,
      ctaLink1: baseProgram?.ctaLink1 || { text: "Donate to Program", url: "/donate" },
      ctaLink2: baseProgram?.ctaLink2 || { text: "Partner With Us", url: "/contact" }
    };
    return <GenericProgramPage d={dynamicData} />;
  }

  if (baseProgram) {
    return <GenericProgramPage d={baseProgram} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F6FBF8] pt-24">
      <Globe2 size={64} className="text-gray-200 mb-6" />
      <h2 className="text-2xl font-bold text-gray-500 mb-4">Program Not Found</h2>
      <Link to="/programs" className="text-[#0B5D3F] font-semibold flex items-center gap-2 hover:underline">
        <ChevronRight size={16} /> Back to All Programs
      </Link>
    </div>
  );
}
