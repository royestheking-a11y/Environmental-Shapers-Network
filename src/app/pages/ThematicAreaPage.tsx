import { useParams, Link } from "react-router";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { ArrowRight, TreePine, Leaf, Wind, Droplets, Sun, Mountain, MapPin, CheckCircle2, Users, Globe2, TrendingUp, ChevronRight, Target, Tent, Wheat, Shield, Building, Fish } from "lucide-react";

const areaData: Record<string, {
  slug: string;
  label: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  color: string;
  heroImage: string;
  stats: { value: string; label: string }[];
  highlights: string[];
  projects: { name: string; country: string; status: string; progress: number; image: string }[];
  sdgs: number[];
  approach: { title: string; desc: string }[];
}> = {
  "climate-change": {
    slug: "climate-change",
    label: "Climate Change",
    tagline: "Confronting the Defining Challenge of Our Era",
    description: "Climate change is the most urgent environmental challenge of our time. ESN works across the globe to reduce greenhouse gas emissions, build community resilience, and drive systemic transitions toward a low-carbon future. Our multidisciplinary approach integrates science, policy, and grassroots action.",
    icon: Wind,
    color: "#173B63",
    heroImage: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1400",
    stats: [
      { value: "150K MT", label: "CO₂ Reduced Annually" },
      { value: "85+", label: "Climate Projects" },
      { value: "42", label: "Countries Active" },
      { value: "$18M+", label: "Climate Funding Mobilized" },
    ],
    highlights: [
      "Science-based emissions reduction targets across all programs",
      "Community climate resilience building in 42 countries",
      "Policy advocacy at UNFCCC COP and regional summits",
      "Climate finance access support for developing nations",
      "Carbon accounting & MRV system for project verification",
    ],
    projects: [
      { name: "Net Zero 2040 Coalition", country: "Global", status: "Active", progress: 55, image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { name: "Climate Resilience Atlas", country: "Africa & Asia", status: "Active", progress: 70, image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { name: "Urban Heat Island Initiative", country: "Bangladesh", status: "Active", progress: 42, image: "https://images.unsplash.com/photo-1498429089284-41f8cf3ffd39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
    ],
    sdgs: [13, 11, 7, 17],
    approach: [
      { title: "Science-Based Targets", desc: "All projects align with the Paris Agreement 1.5°C pathway using IPCC-validated methodologies." },
      { title: "Policy Integration", desc: "We work with national governments to embed climate action into development planning and legislation." },
      { title: "Community Resilience", desc: "Local adaptation measures protect vulnerable communities from climate-driven disasters." },
    ],
  },
  biodiversity: {
    slug: "biodiversity",
    label: "Biodiversity",
    tagline: "Protecting the Web of Life That Sustains Us All",
    description: "Biodiversity underpins all life on Earth. ESN's biodiversity programs protect endangered species, restore degraded ecosystems, and champion the rights of indigenous communities who are the best guardians of nature. We work to halt the sixth mass extinction and reverse nature loss by 2030.",
    icon: Leaf,
    color: "#0B5D3F",
    heroImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1400",
    stats: [
      { value: "280+", label: "Species Protected" },
      { value: "1.2M ha", label: "Habitat Conserved" },
      { value: "65+", label: "Partner Communities" },
      { value: "30x30", label: "Global Target Aligned" },
    ],
    highlights: [
      "Species recovery programs for critically endangered wildlife",
      "Ecosystem corridor restoration across fragmented landscapes",
      "Indigenous-led conservation and bio-cultural heritage protection",
      "Invasive species management in island ecosystems",
      "Citizen science biodiversity monitoring networks",
    ],
    projects: [
      { name: "Jaguar Corridor Brazil", country: "Brazil", status: "Active", progress: 63, image: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { name: "Pollinator Recovery Network", country: "Europe", status: "Active", progress: 78, image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { name: "Bengal Tiger Reserve", country: "Bangladesh", status: "Active", progress: 88, image: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
    ],
    sdgs: [15, 14, 1, 17],
    approach: [
      { title: "Area-Based Conservation", desc: "Supporting the 30×30 global target to protect 30% of land and ocean by 2030." },
      { title: "Species Recovery Plans", desc: "Evidence-based programs to reverse population declines for flagship and keystone species." },
      { title: "Indigenous Partnerships", desc: "Co-designing conservation with local communities who hold generational ecological knowledge." },
    ],
  },
  forests: {
    slug: "forests",
    label: "Forest Restoration",
    tagline: "Bringing Back the Lungs of Our Planet",
    description: "Forests are essential to life on Earth — regulating climate, purifying water, harboring biodiversity, and sustaining billions of people. ESN's forest programs combine large-scale reforestation with sustainable forestry, deforestation prevention, and community forestry models that deliver both ecological and livelihood outcomes.",
    icon: TreePine,
    color: "#0B5D3F",
    heroImage: "https://images.unsplash.com/photo-1448375240586-882707db888b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1400",
    stats: [
      { value: "2.4M+", label: "Trees Planted" },
      { value: "180K ha", label: "Forest Restored" },
      { value: "120+", label: "Forest Projects" },
      { value: "38", label: "Countries" },
    ],
    highlights: [
      "Large-scale native species reforestation using seed banking",
      "Agroforestry integration for food-secure communities",
      "REDD+ program development and carbon credit verification",
      "Community forest rights and land tenure security",
      "Mangrove restoration in coastal and delta ecosystems",
    ],
    projects: [
      { name: "Amazon Reforestation Hub", country: "Brazil", status: "Active", progress: 72, image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { name: "Sundarbans Mangrove Restore", country: "Bangladesh", status: "Active", progress: 85, image: "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { name: "Congo Basin Forest Watch", country: "DRC", status: "Active", progress: 49, image: "https://images.unsplash.com/photo-1555993539-1732b0258235?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
    ],
    sdgs: [15, 13, 1, 6],
    approach: [
      { title: "Native Species Reforestation", desc: "We use locally-sourced native seeds to restore ecologically authentic forests rather than monocultures." },
      { title: "Agroforestry Systems", desc: "Combining trees with crops and livestock to create productive landscapes that support biodiversity." },
      { title: "REDD+ Carbon Markets", desc: "Linking forest conservation to carbon finance to create long-term economic incentives for communities." },
    ],
  },
  "blue-economy": {
    slug: "blue-economy",
    label: "Marine Conservation",
    tagline: "Protecting the Blue Heart of Our Planet",
    description: "Our oceans produce half the world's oxygen, absorb 30% of CO₂, and support the livelihoods of 600 million people. ESN's marine programs tackle plastic pollution, protect coral reefs and seagrass meadows, support sustainable fisheries, and fight illegal fishing that decimates ocean ecosystems.",
    icon: Droplets,
    color: "#1565C0",
    heroImage: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1400",
    stats: [
      { value: "850K kg", label: "Ocean Plastic Removed" },
      { value: "120+", label: "Marine Protected Areas" },
      { value: "45K ha", label: "Coral Area Monitored" },
      { value: "28", label: "Coastal Nations" },
    ],
    highlights: [
      "Ocean plastic cleanup and riverine plastic interception systems",
      "Coral reef restoration and bleaching recovery programs",
      "Marine Protected Area (MPA) policy and enforcement support",
      "Sustainable small-scale fisheries certification",
      "Seagrass meadow mapping and restoration",
    ],
    projects: [
      { name: "Pacific Coral Guardian", country: "Pacific Islands", status: "Active", progress: 67, image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { name: "Clean Ocean Initiative", country: "South Asia", status: "Active", progress: 74, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { name: "Bay of Bengal Fisheries", country: "Bangladesh", status: "Active", progress: 58, image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
    ],
    sdgs: [14, 13, 1, 17],
    approach: [
      { title: "Blue Carbon Ecosystems", desc: "Restoring mangroves, seagrasses and salt marshes that store carbon and protect coasts." },
      { title: "Plastic Reduction", desc: "Source-to-sea strategies targeting plastic waste from cities, rivers, and coastal communities." },
      { title: "MPA Governance", desc: "Working with governments to establish and enforce marine protected areas." },
    ],
  },
  "green-energy": {
    slug: "green-energy",
    label: "Renewable Energy",
    tagline: "Powering a Just, Clean Energy Transition",
    description: "Energy poverty and fossil fuel dependence are twin crises that ESN addresses through community-scale renewable energy programs. We deploy solar microgrids, biogas systems, and efficient cookstoves across underserved communities, reducing both emissions and energy poverty simultaneously.",
    icon: Sun,
    color: "#E65100",
    heroImage: "https://images.unsplash.com/photo-1509391366360-2e959784a276?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1400",
    stats: [
      { value: "180K+", label: "Households with Clean Energy" },
      { value: "92 MW", label: "Clean Capacity Installed" },
      { value: "75+", label: "Energy Projects" },
      { value: "62K MT", label: "CO₂ Avoided" },
    ],
    highlights: [
      "Off-grid solar systems for rural and underserved communities",
      "Biogas digesters converting agricultural waste to clean fuel",
      "Energy-efficient cookstoves reducing indoor air pollution",
      "Wind and micro-hydro installations in remote regions",
      "Energy access policy advocacy and regulatory reform",
    ],
    projects: [
      { name: "Solar Villages Initiative", country: "Africa", status: "Active", progress: 45, image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { name: "Biogas Bangladesh", country: "Bangladesh", status: "Active", progress: 80, image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { name: "Himalayan Micro-Hydro", country: "Nepal", status: "Active", progress: 60, image: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
    ],
    sdgs: [7, 13, 1, 11],
    approach: [
      { title: "Community Ownership", desc: "Energy projects are co-owned by communities to ensure long-term operation and maintenance." },
      { title: "Technology Appropriate", desc: "We match technology to local context — solar where sunlight is abundant, micro-hydro in mountain regions." },
      { title: "Gender & Equity", desc: "Clean cooking and lighting programs prioritize women and girls, who bear the greatest burden of energy poverty." },
    ],
  },
  nature: {
    slug: "nature",
    label: "Nature-Based Solutions",
    tagline: "Harnessing Nature's Power to Solve Human Challenges",
    description: "Nature-based solutions (NbS) use the power of healthy ecosystems to address societal challenges like climate change, water security, and disaster risk. ESN designs and implements NbS projects that deliver measurable outcomes for both people and planet, integrating traditional ecological knowledge with cutting-edge science.",
    icon: Mountain,
    color: "#4CAF50",
    heroImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1400",
    stats: [
      { value: "95+", label: "NbS Projects Active" },
      { value: "2.8M", label: "People Benefited" },
      { value: "350K ha", label: "Ecosystem Area" },
      { value: "33", label: "Countries Covered" },
    ],
    highlights: [
      "Green infrastructure for flood protection in urban areas",
      "Watershed restoration for water security",
      "Ecosystem-based disaster risk reduction (Eco-DRR)",
      "Soil restoration for food security and carbon sequestration",
      "Urban greening for heat reduction and air quality",
    ],
    projects: [
      { name: "Wetlands for Water Security", country: "Bangladesh", status: "Active", progress: 76, image: "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { name: "Green Urban Infrastructure", country: "India", status: "Active", progress: 52, image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { name: "Sahel Great Green Wall", country: "West Africa", status: "Active", progress: 38, image: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
    ],
    sdgs: [15, 13, 6, 11],
    approach: [
      { title: "Co-design with Communities", desc: "Solutions are designed with local people, ensuring cultural appropriateness and community ownership." },
      { title: "Integrated Monitoring", desc: "We measure ecological, social, and economic co-benefits using IUCN Global Standard frameworks." },
      { title: "Scaling & Replication", desc: "Proven models are documented and replicated in similar contexts globally." },
    ],
  },

  sdgs: {
    slug: "sdgs",
    label: "Sustainable Development Goals",
    tagline: "Mainstreaming the 2030 Agenda for Sustainable Development",
    description: "The 17 Sustainable Development Goals (SDGs) form the blueprint for our environmental action. We ensure every intervention contributes measurably to these global targets at local, national, and global levels, leaving no one behind.",
    icon: Target,
    color: "#4CAF50",
    heroImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1400",
    stats: [
      { value: "17", label: "SDGs Addressed" },
      { value: "120+", label: "Integrated Projects" },
      { value: "45", label: "Countries Supported" },
      { value: "5M+", label: "People Reached" },
    ],
    highlights: [
      "Cross-cutting SDG impact assessments for all ESN programs",
      "Capacity building for local governments on SDG localization",
      "Policy advocacy to integrate SDGs into national environmental frameworks",
      "Partnerships for the Goals (SDG 17) driving cross-sector collaboration",
    ],
    projects: [
      { name: "SDG Localisation Hub", country: "Global", status: "Active", progress: 65, image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { name: "Eco-Cities Network", country: "Asia", status: "Active", progress: 80, image: "https://images.unsplash.com/photo-1498429089284-41f8cf3ffd39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { name: "Community SDG Scorecards", country: "Africa", status: "Active", progress: 50, image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
    ],
    sdgs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
    approach: [
      { title: "Holistic Integration", desc: "We map all our environmental outcomes against the 169 SDG targets to ensure systemic impact." },
      { title: "Leave No One Behind", desc: "Prioritizing the most vulnerable and marginalized communities in all our project designs." },
      { title: "Multi-Stakeholder Partnerships", desc: "Mobilizing resources and knowledge through alliances with governments, NGOs, and the private sector." },
    ],
  },
  "displacement-migration": {
    slug: "displacement-migration",
    label: "Displacement & Migration",
    tagline: "Protecting Climate-Displaced Populations",
    description: "Climate change is driving unprecedented human mobility. We protect climate-displaced populations through rights-based policy frameworks, humanitarian response, and long-term durable solutions that address the complex intersections of climate and migration.",
    icon: Tent,
    color: "#E65100",
    heroImage: "https://images.unsplash.com/photo-1544465544-1b71aee9dfa3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1400",
    stats: [
      { value: "500K+", label: "Migrants Supported" },
      { value: "15", label: "Policy Frameworks" },
      { value: "20+", label: "Vulnerable Regions" },
      { value: "100%", label: "Rights-Based Approach" },
    ],
    highlights: [
      "Providing immediate humanitarian relief to climate refugees",
      "Advocating for international legal protection for climate-displaced persons",
      "Supporting host communities to build resilient infrastructure",
      "Facilitating planned relocations for highly vulnerable coastal populations",
    ],
    projects: [
      { name: "Coastal Retreat Initiative", country: "Pacific Islands", status: "Active", progress: 55, image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { name: "Host Community Resilience", country: "East Africa", status: "Active", progress: 70, image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { name: "Migration Policy Lab", country: "Global", status: "Active", progress: 85, image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
    ],
    sdgs: [10, 16, 13, 1],
    approach: [
      { title: "Rights-Based Protection", desc: "Ensuring human rights are at the center of all climate mobility interventions." },
      { title: "Durable Solutions", desc: "Focusing on long-term integration, return, or resettlement rather than temporary fixes." },
      { title: "Preventive Adaptation", desc: "Building resilience in origin communities to prevent forced displacement whenever possible." },
    ],
  },
  livelihoods: {
    slug: "livelihoods",
    label: "Livelihoods",
    tagline: "Building Green, Climate-Resilient Economies",
    description: "Environmental protection must go hand-in-hand with economic security. We build green, climate-resilient livelihoods for smallholder farmers, coastal communities, and forest-dependent peoples through agroecology and sustainable resource management.",
    icon: Wheat,
    color: "#4CAF50",
    heroImage: "https://images.unsplash.com/photo-1589923188900-85dae523342b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1400",
    stats: [
      { value: "1.5M", label: "Green Jobs Created" },
      { value: "300K+", label: "Farmers Trained" },
      { value: "40%", label: "Income Increase" },
      { value: "50", label: "Value Chains Developed" },
    ],
    highlights: [
      "Training in regenerative agriculture and agroecology",
      "Developing sustainable market linkages and fair-trade cooperatives",
      "Micro-finance for green entrepreneurship (especially for women)",
      "Sustainable non-timber forest product commercialization",
    ],
    projects: [
      { name: "Agroecology Academy", country: "Latin America", status: "Active", progress: 82, image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { name: "Women's Green Finance", country: "South Asia", status: "Active", progress: 68, image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { name: "Sustainable Cocoa Co-op", country: "West Africa", status: "Active", progress: 90, image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
    ],
    sdgs: [1, 8, 12, 2],
    approach: [
      { title: "Economic Empowerment", desc: "Fostering economic independence while regenerating natural ecosystems." },
      { title: "Value Addition", desc: "Helping communities capture more value from their sustainable products through processing and branding." },
      { title: "Inclusive Finance", desc: "Providing accessible capital to kickstart nature-positive businesses." },
    ],
  },
  drr: {
    slug: "drr",
    label: "Disaster Risk Reduction",
    tagline: "Strengthening Community and National Resilience",
    description: "As climate-induced extreme weather events become more frequent, we strengthen resilience through early warning systems, disaster preparedness frameworks, and nature-based DRR solutions aligned with the Sendai Framework.",
    icon: Shield,
    color: "#1565C0",
    heroImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1400",
    stats: [
      { value: "800+", label: "Early Warning Systems" },
      { value: "5M+", label: "People Protected" },
      { value: "120", label: "Local DRR Plans" },
      { value: "35%", label: "Loss Reduction" },
    ],
    highlights: [
      "Community-led disaster risk mapping and vulnerability assessments",
      "Nature-based solutions for flood mitigation (e.g., restoring wetlands)",
      "Evacuation planning and emergency shelter infrastructure",
      "Capacity building for local emergency responders",
    ],
    projects: [
      { name: "Coastal Shield Project", country: "Caribbean", status: "Active", progress: 60, image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { name: "Flood Early Warning Network", country: "South Asia", status: "Active", progress: 85, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { name: "Eco-DRR Integration", country: "Global", status: "Active", progress: 45, image: "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
    ],
    sdgs: [11, 13, 9, 3],
    approach: [
      { title: "Anticipatory Action", desc: "Moving from reactive disaster response to proactive risk mitigation and early action." },
      { title: "Nature-Based Defenses", desc: "Utilizing ecosystems like mangroves and coral reefs as the primary barrier against extreme weather." },
      { title: "Community Preparedness", desc: "Empowering locals with the knowledge and tools to act swiftly when disaster strikes." },
    ],
  },
  "urban-resilience": {
    slug: "urban-resilience",
    label: "Urban Resilience",
    tagline: "Transforming Cities into Climate-Resilient Spaces",
    description: "By 2050, 68% of the world's population will live in urban areas. We are transforming cities into climate-resilient, liveable spaces with green infrastructure, urban forests, low-carbon mobility, and integrated water and waste management.",
    icon: Building,
    color: "#0B5D3F",
    heroImage: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1400",
    stats: [
      { value: "45", label: "Partner Cities" },
      { value: "20M+", label: "Urban Residents Benefited" },
      { value: "500K+", label: "Urban Trees Planted" },
      { value: "100+", label: "Green Corridors" },
    ],
    highlights: [
      "Urban heat island mitigation through extensive canopy expansion",
      "Sustainable urban drainage systems (SUDS) to prevent flash flooding",
      "Zero-waste circular economy initiatives in metropolitan hubs",
      "Advocating for pedestrian-first and cycling infrastructure",
    ],
    projects: [
      { name: "Cool Cities Initiative", country: "Europe", status: "Active", progress: 75, image: "https://images.unsplash.com/photo-1498429089284-41f8cf3ffd39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { name: "Sponge City Pilots", country: "Asia", status: "Active", progress: 90, image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { name: "Urban Circular Hubs", country: "North America", status: "Active", progress: 55, image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
    ],
    sdgs: [11, 13, 9, 12],
    approach: [
      { title: "Green-Blue Infrastructure", desc: "Integrating natural water systems and vegetation into urban planning." },
      { title: "Inclusive Design", desc: "Ensuring low-income neighborhoods receive equitable access to green spaces and resilience upgrades." },
      { title: "Circular Economy", desc: "Designing out waste and pollution by keeping urban resources in use for as long as possible." },
    ],
  },

};

function StatCard({ value, label, i }: { value: string; label: string; i: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: i * 0.1, duration: 0.5 }}
      className="bg-white rounded-2xl p-6 border border-gray-100 text-center hover:shadow-lg transition-shadow"
    >
      <div className="text-3xl font-black text-[#0B5D3F] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </motion.div>
  );
}

export default function ThematicAreaPage() {
  const { area } = useParams<{ area: string }>();
  const data = area ? areaData[area] : null;

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F6FBF8] pt-24">
        <Globe2 size={64} className="text-gray-200 mb-6" />
        <h2 className="text-2xl font-bold text-gray-500 mb-4">Area Not Found</h2>
        <Link to="/" className="text-[#0B5D3F] font-semibold flex items-center gap-2 hover:underline">
          <ChevronRight size={16} /> Back to Home
        </Link>
      </div>
    );
  }

  const Icon = data.icon;

  return (
    <div className="bg-[#F6FBF8]">
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[480px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={data.heroImage} alt={data.label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a0e]/90 via-[#0a1a0e]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1a0e]/60 to-transparent" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 pb-16 w-full">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/60 text-sm mb-5">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={13} />
            <span className="text-white/40">Thematic Areas</span>
            <ChevronRight size={13} />
            <span className="text-white">{data.label}</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: data.color + "30" }}>
                <Icon size={24} style={{ color: "white" }} />
              </div>
              <span className="text-white/70 text-sm font-semibold uppercase tracking-wider">Thematic Area</span>
            </div>
            <h1 className="text-white mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800 }}>
              {data.label}
            </h1>
            <p className="text-white/75 max-w-2xl" style={{ fontSize: "clamp(1rem, 1.5vw, 1.15rem)" }}>
              {data.tagline}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col gap-16">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {data.stats.map((s, i) => <StatCard key={s.label} {...s} i={i} />)}
        </div>

        {/* Overview + Highlights */}
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-[#4CAF50] text-sm font-bold uppercase tracking-wider mb-3">Overview</div>
            <h2 className="text-gray-900 mb-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.5rem, 2.5vw, 2rem)", fontWeight: 800 }}>
              Our Work in {data.label}
            </h2>
            <p className="text-gray-600 leading-relaxed">{data.description}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              {data.sdgs.map((n) => (
                <div key={n} className="flex items-center gap-1.5 bg-[#0B5D3F]/10 text-[#0B5D3F] text-xs font-bold px-3 py-1.5 rounded-full">
                  <span>SDG {n}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-7 border border-gray-100"
          >
            <div className="text-sm font-bold text-gray-800 mb-5">Key Program Highlights</div>
            <div className="flex flex-col gap-3">
              {data.highlights.map((h) => (
                <div key={h} className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-[#4CAF50] shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600 leading-relaxed">{h}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Our Approach */}
        <div>
          <div className="text-center mb-10">
            <div className="text-[#4CAF50] text-sm font-bold uppercase tracking-wider mb-2">Methodology</div>
            <h2 className="text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.5rem, 2.5vw, 2rem)", fontWeight: 800 }}>
              Our Approach
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {data.approach.map((a, i) => (
              <motion.div
                key={a.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-7 border border-gray-100 hover:border-[#4CAF50]/30 hover:shadow-lg transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0B5D3F]/10 flex items-center justify-center mb-5">
                  <Icon size={18} className="text-[#0B5D3F]" />
                </div>
                <div className="font-bold text-gray-900 mb-3">{a.title}</div>
                <p className="text-sm text-gray-500 leading-relaxed">{a.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Featured Projects */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="text-[#4CAF50] text-sm font-bold uppercase tracking-wider mb-1">Featured Work</div>
              <h2 className="text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.4rem, 2vw, 1.8rem)", fontWeight: 800 }}>
                Active Projects
              </h2>
            </div>
            <Link to="/projects" className="flex items-center gap-1.5 text-[#0B5D3F] font-semibold text-sm hover:underline">
              View All <ArrowRight size={15} />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {data.projects.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow group"
              >
                <div className="relative h-44 overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 right-3">
                    <span className="bg-[#4CAF50] text-white text-xs font-bold px-3 py-1 rounded-full">{p.status}</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                    <MapPin size={12} /> {p.country}
                  </div>
                  <div className="font-bold text-gray-900 mb-3 line-clamp-1">{p.name}</div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-gray-400">Progress</span>
                    <span className="font-bold text-[#0B5D3F]">{p.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#4CAF50] rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${p.progress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#0B5D3F] to-[#173B63] rounded-3xl p-12 text-white text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="absolute w-32 h-32 rounded-full bg-white" style={{ top: `${(i * 30) % 100}%`, left: `${(i * 20) % 100}%` }} />
            ))}
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Icon size={24} className="text-[#4CAF50]" />
              <span className="text-[#4CAF50] font-bold text-sm uppercase tracking-wider">{data.label}</span>
            </div>
            <h3 className="text-white mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 800 }}>
              Join Our {data.label} Programs
            </h3>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">
              Partner with ESN to scale solutions, fund projects, or volunteer your expertise in {data.label.toLowerCase()}.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/donate" className="flex items-center gap-2 bg-[#4CAF50] hover:bg-[#43a047] text-white px-7 py-3.5 rounded-full font-semibold transition-all hover:scale-105">
                <Users size={16} /> Support This Work
              </Link>
              <Link to="/contact" className="flex items-center gap-2 bg-white/15 border border-white/30 hover:bg-white/25 text-white px-7 py-3.5 rounded-full font-semibold transition-all">
                Get In Touch <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
