const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'ProgramPage.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// We will construct the new programData object.
// The existing programData only has 'youth'.
// We'll replace the entire `const programData` block up to `const insightsData`.

const newDataStr = `const programData: Record<string, {
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
`;

const replaceStart = content.indexOf('const programData');
const replaceEnd = content.indexOf('const insightsData');

let newContent = content.substring(0, replaceStart) + newDataStr + '\n' + content.substring(replaceEnd);

// Also need to add new icons to lucide-react import
const importMatch = newContent.match(/import \{([^}]+)\} from "lucide-react";/);
if (importMatch) {
  let icons = importMatch[1].split(',').map(s => s.trim());
  const newIcons = ['TreePine', 'Waves', 'Sun', 'ShieldAlert', 'Bug', 'GraduationCap', 'Microscope'];
  newIcons.forEach(icon => {
    if (!icons.includes(icon)) {
      icons.push(icon);
    }
  });
  newContent = newContent.replace(importMatch[0], `import { ${icons.join(', ')} } from "lucide-react";`);
}

// Now replace function YouthPage() with function GenericProgramPage({ d }: { d: any })
const youthPageRegex = /function YouthPage\(\) \{\s+const d = programData\.youth;([\s\S]*?)\}\s+function InsightsPage/m;
const youthPageMatch = newContent.match(youthPageRegex);

if (youthPageMatch) {
  let genericPage = `function GenericProgramPage({ d }: { d: any }) {\n` + youthPageMatch[1].replace(
    /Apply Now/g, '{d.ctaLink1?.text || "Apply Now"}'
  ).replace(
    /\/contact"/g, '{"' + '}' + `d.ctaLink1?.url || "/contact" }"`
  ).replace(
    /Fund a Youth Project/g, '{d.ctaLink2?.text || "Fund a Project"}'
  ).replace(
    /\/donate"/g, '{"' + '}' + `d.ctaLink2?.url || "/donate" }"`
  ).replace(
    /Join the Youth Movement/g, '{d.ctaTitle || "Join the Movement"}'
  ).replace(
    /Apply for the YEL Fellowship, join a Green School, or fund a young leader's environmental project\./g, '{d.ctaDesc}'
  ).replace(
    /Investing in Youth Leadership/g, '{d.label}'
  ).replace(
    /Youth in Their Own Words/g, 'Voices from the Field'
  ) + `}\n\nfunction InsightsPage`;

  // Fix the url replacements which got a bit messy
  genericPage = genericPage.replace(/to=\{"\}d\.ctaLink1\?\.url \|\| "\/contact" \}"/g, 'to={d.ctaLink1?.url || "/contact"}');
  genericPage = genericPage.replace(/to=\{"\}d\.ctaLink2\?\.url \|\| "\/donate" \}"/g, 'to={d.ctaLink2?.url || "/donate"}');

  newContent = newContent.replace(youthPageRegex, genericPage);
}

// Now update the `export default function ProgramPage` to use GenericProgramPage for anything in programData
const renderLogicRegex = /if \(pathname === "\/insights"\) return <InsightsPage \/>;\s+if \(pathname === "\/events"\) return <EventsPage \/>;\s+if \(program === "youth"\) return <YouthPage \/>;/;

const newRenderLogic = `if (pathname === "/insights") return <InsightsPage />;
  if (pathname === "/events") return <EventsPage />;
  if (program && programData[program]) return <GenericProgramPage d={programData[program]} />;`;

newContent = newContent.replace(renderLogicRegex, newRenderLogic);

fs.writeFileSync(filePath, newContent);
console.log('Successfully updated ProgramPage.tsx');
