import { useParams, Link } from "react-router";
import { motion } from "motion/react";
import {
  MapPin, Calendar, Users, Target, ChevronRight, ArrowLeft,
  TreePine, Droplets, Wind, Sun, Mountain, Globe2, Leaf,
  CheckCircle2, TrendingUp, Heart, BookOpen, ArrowRight, ExternalLink
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const projectsData = [
  {
    id: 1,
    title: "Amazon Reforestation Hub",
    tagline: "Restoring the lungs of the planet, one tree at a time.",
    location: "Pará & Amazonas States, Brazil",
    category: "Forest",
    status: "Active",
    year: 2022,
    theme: "SDG 15",
    impact: "350K trees planted",
    volunteers: 1200,
    icon: TreePine,
    color: "#0B5D3F",
    budget: "$2.4M",
    partners: ["WWF Brazil", "Amazon Conservation Association", "Brazilian Ministry of Environment"],
    img: "https://images.unsplash.com/photo-1448375240586-882707db888b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400",
    galleryImgs: [
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      "https://images.unsplash.com/photo-1426604966848-d7adac402bff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    ],
    description: "The Amazon Reforestation Hub is ESN's flagship forest restoration project in the Brazilian Amazon. Working in close collaboration with indigenous communities, smallholder farmers, and scientific institutions, the project aims to restore 50,000 hectares of degraded Amazonian land by 2027. The project employs a mixed native-species approach, planting over 200 native tree species to maximize biodiversity outcomes alongside carbon sequestration.",
    challenge: "The Amazon faces unprecedented deforestation rates driven by agricultural expansion, illegal logging, and infrastructure development. Once the world's largest continuous tropical rainforest, over 17% of the Brazilian Amazon has been cleared in the past five decades, releasing billions of tons of CO₂ and destroying irreplaceable biodiversity.",
    approach: [
      { title: "Community-Led Planting", desc: "Local communities and indigenous groups lead all planting activities, ensuring land tenure security and long-term stewardship." },
      { title: "Native Species Mix", desc: "Over 200 native species planted per site to maximize ecological diversity and resilience against climate variability." },
      { title: "Agroforestry Integration", desc: "Food-producing tree species integrated into restoration zones, providing income for local families while restoring forest cover." },
      { title: "Satellite Monitoring", desc: "Real-time satellite and drone monitoring of restored areas ensures survival rates above 85% and early detection of threats." },
    ],
    stats: [
      { value: "350K", label: "Trees Planted", icon: TreePine },
      { value: "50K ha", label: "Target Area", icon: Target },
      { value: "1,200", label: "Volunteers", icon: Users },
      { value: "48", label: "Indigenous Communities", icon: Heart },
    ],
    sdgs: ["SDG 13", "SDG 15", "SDG 1", "SDG 8"],
    timeline: [
      { year: "2022", event: "Project launch, community consultations, baseline surveys" },
      { year: "2023", event: "First 120,000 trees planted across 3 sites; community nurseries established" },
      { year: "2024", event: "Expanded to 8 sites; 350,000 trees planted; satellite monitoring launched" },
      { year: "2025", event: "Target: 500,000 trees; agroforestry pilot in 12 villages" },
      { year: "2027", event: "Final target: 1 million trees across 50,000 ha" },
    ],
  },
  {
    id: 2,
    title: "Sundarbans Mangrove Restoration",
    tagline: "Protecting South Asia's coastal shield from storm surges and sea-level rise.",
    location: "Bangladesh & West Bengal, India",
    category: "Forest",
    status: "Active",
    year: 2021,
    theme: "SDG 14",
    impact: "120 km² restored",
    volunteers: 800,
    icon: Leaf,
    color: "#4CAF50",
    budget: "$1.8M",
    partners: ["Bangladesh Forest Department", "WWF India", "IUCN Asia"],
    img: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400",
    galleryImgs: [
      "https://images.unsplash.com/photo-1484291470158-b8f8d608850d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      "https://images.unsplash.com/photo-1533130061792-64b345e4a833?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      "https://images.unsplash.com/photo-1440342359743-84fcb8c21f21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    ],
    description: "The Sundarbans — the world's largest mangrove forest — is under severe threat from rising sea levels, cyclones, and human encroachment. ESN's Sundarbans Mangrove Restoration project works across the Bangladesh-India border to replant degraded mangrove areas, protect existing stands, and build community capacity for long-term coastal stewardship. The project directly protects over 4 million coastal residents from storm surges.",
    challenge: "The Sundarbans has lost over 25% of its mangrove cover in the past three decades. Cyclones like Amphan (2020) and Yaas (2021) caused massive damage, and projected sea-level rise of 3–7mm per year threatens to inundate large portions of the delta by 2050.",
    approach: [
      { title: "Tidal Hydrology Restoration", desc: "Restoring natural tidal channels to allow mangroves to recolonize degraded areas naturally and at scale." },
      { title: "Community Forest Guards", desc: "350 trained community forest guards monitor and protect restored areas, earning living wages from the project." },
      { title: "Silvofishery Zones", desc: "Creating fish-friendly mangrove aquaculture zones that provide income for local fishing families." },
      { title: "Blue Carbon Certification", desc: "Pursuing Verified Carbon Standard (VCS) blue carbon certification to generate sustainable financing." },
    ],
    stats: [
      { value: "120 km²", label: "Area Restored", icon: Target },
      { value: "800", label: "Volunteers", icon: Users },
      { value: "4M+", label: "People Protected", icon: Heart },
      { value: "350", label: "Forest Guards", icon: Users },
    ],
    sdgs: ["SDG 13", "SDG 14", "SDG 15", "SDG 11"],
    timeline: [
      { year: "2021", event: "Project launch following Cyclone Yaas; emergency mangrove assessment" },
      { year: "2022", event: "50 km² of priority zones identified; 350 forest guards trained" },
      { year: "2023", event: "80 km² restored; blue carbon methodology validated" },
      { year: "2024", event: "120 km² milestone reached; VCS certification process begun" },
      { year: "2026", event: "Target: 200 km² restored; first carbon credits issued" },
    ],
  },
  {
    id: 3,
    title: "Pacific Coral Guardian",
    tagline: "Racing against warming oceans to save the Pacific's living reefs.",
    location: "Fiji, Palau, and Marshall Islands",
    category: "Ocean",
    status: "Completed",
    year: 2020,
    theme: "SDG 14",
    impact: "45 coral reefs monitored",
    volunteers: 320,
    icon: Droplets,
    color: "#173B63",
    budget: "$980K",
    partners: ["Coral Triangle Initiative", "NOAA Pacific", "Pew Charitable Trusts"],
    img: "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400",
    galleryImgs: [
      "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      "https://images.unsplash.com/photo-1534766438357-2b270dbd1b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      "https://images.unsplash.com/photo-1518399104032-af17f3a3e008?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    ],
    description: "The Pacific Coral Guardian project established a comprehensive monitoring and restoration network across 45 coral reef sites in three Pacific Island nations. The project combined citizen science with professional marine biology to track coral health, bleaching events, and recovery rates, while pioneering coral nursery techniques adapted for Pacific conditions.",
    challenge: "Pacific coral reefs face mass bleaching events triggered by rising ocean temperatures, acidification from CO₂ absorption, and direct human pressures from overfishing and coastal development. The 2016 and 2020 bleaching events damaged over 60% of monitored reefs.",
    approach: [
      { title: "Coral Nursery Network", desc: "Established 12 underwater coral nurseries growing heat-tolerant coral fragments for outplanting on damaged reefs." },
      { title: "Citizen Science Monitoring", desc: "Trained 320 local dive volunteers in scientific reef monitoring, creating a year-round observation network." },
      { title: "Marine Protected Areas", desc: "Supported governments in establishing 8 new Marine Protected Areas covering 180,000 km² of ocean." },
      { title: "Policy Advocacy", desc: "Evidence from monitoring informed Pacific Island positions at UNFCCC COP negotiations." },
    ],
    stats: [
      { value: "45", label: "Reefs Monitored", icon: Target },
      { value: "320", label: "Dive Volunteers", icon: Users },
      { value: "8", label: "MPAs Established", icon: Globe2 },
      { value: "12", label: "Coral Nurseries", icon: Droplets },
    ],
    sdgs: ["SDG 14", "SDG 13", "SDG 17"],
    timeline: [
      { year: "2020", event: "Project launched; baseline reef surveys completed across 45 sites" },
      { year: "2021", event: "12 coral nurseries established; 320 volunteers trained" },
      { year: "2022", event: "8 MPAs designated; 15,000 coral fragments outplanted" },
      { year: "2023", event: "Project successfully completed; monitoring network handed to local NGOs" },
    ],
  },
  {
    id: 4,
    title: "Solar Villages Initiative",
    tagline: "Bringing clean, reliable power to off-grid communities across Sub-Saharan Africa.",
    location: "Kenya, Tanzania, Uganda & Ethiopia",
    category: "Energy",
    status: "Active",
    year: 2023,
    theme: "SDG 7",
    impact: "200 villages electrified",
    volunteers: 450,
    icon: Sun,
    color: "#D6A95A",
    budget: "$3.2M",
    partners: ["GOGLA", "USAID Power Africa", "African Development Bank"],
    img: "https://images.unsplash.com/photo-1509391366360-2e959784a276?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400",
    galleryImgs: [
      "https://images.unsplash.com/photo-1617369120004-4fc70312c5e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      "https://images.unsplash.com/photo-1466611653911-95081537e5b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    ],
    description: "The Solar Villages Initiative is bringing reliable, clean energy to 200 off-grid communities across four East African countries. Each village receives a solar mini-grid system that powers homes, schools, health clinics, and small businesses. The project also trains local solar technicians, creating green jobs and ensuring long-term system maintenance.",
    challenge: "Over 600 million Africans lack access to electricity, forcing reliance on costly, polluting kerosene lamps and diesel generators. Energy poverty limits education, healthcare, and economic opportunity — and burning kerosene indoors causes severe health impacts, particularly for women and children.",
    approach: [
      { title: "Solar Mini-Grids", desc: "Custom-designed solar + battery mini-grids sized for each community's needs, from 10kW to 250kW." },
      { title: "Pay-As-You-Go", desc: "Affordable PAYG metering allows families to access electricity for as little as $0.50/day." },
      { title: "Local Technician Training", desc: "2 technicians trained per village (600 total) ensure local maintenance capacity and create green jobs." },
      { title: "Productive Use", desc: "Grain mills, refrigeration, and phone charging hubs drive economic activity beyond household lighting." },
    ],
    stats: [
      { value: "200", label: "Villages", icon: Target },
      { value: "120K+", label: "Households", icon: Heart },
      { value: "600", label: "Technicians Trained", icon: Users },
      { value: "85 MW", label: "Installed Capacity", icon: Sun },
    ],
    sdgs: ["SDG 7", "SDG 1", "SDG 8", "SDG 13"],
    timeline: [
      { year: "2023", event: "Project launch; site surveys in 200 communities; procurement of equipment" },
      { year: "2024", event: "100 villages electrified; 300 technicians trained; first grid connections" },
      { year: "2025", event: "200 villages completed; 120K households connected; productive use hubs operational" },
      { year: "2026", event: "Impact evaluation; replication funding secured for Phase 2 (500 villages)" },
    ],
  },
  {
    id: 5,
    title: "Arctic Climate Watch",
    tagline: "Monitoring the world's most sensitive climate indicator at the poles.",
    location: "Svalbard (Norway) & Iceland",
    category: "Climate",
    status: "Active",
    year: 2022,
    theme: "SDG 13",
    impact: "12 monitoring stations",
    volunteers: 150,
    icon: Wind,
    color: "#5B8DB8",
    budget: "$1.5M",
    partners: ["Norwegian Polar Institute", "University of Iceland", "WMO Arctic Programme"],
    img: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400",
    galleryImgs: [
      "https://images.unsplash.com/photo-1520885708668-e99a5c7e0e9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      "https://images.unsplash.com/photo-1477955210977-e76d0e62bd17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    ],
    description: "The Arctic Climate Watch establishes and operates 12 permanent climate monitoring stations across Svalbard and Iceland, measuring critical climate variables including sea ice extent, permafrost temperature, glacier mass balance, and atmospheric CO₂. Data feeds directly into global climate models and supports Arctic Council policy processes.",
    challenge: "The Arctic is warming 4x faster than the global average, making it both a leading indicator and an amplifier of global climate change. Yet monitoring infrastructure in the High Arctic remains sparse, leaving critical data gaps in global climate models. Melting permafrost alone could release 1.5 trillion tons of stored carbon.",
    approach: [
      { title: "Automated Sensor Networks", desc: "Solar-powered sensor stations transmit real-time climate data via satellite to research institutions worldwide." },
      { title: "Open Data Policy", desc: "All monitoring data is freely available through the Arctic Data Center, benefiting the global research community." },
      { title: "Indigenous Knowledge Integration", desc: "Sámi and Inuit traditional ecological knowledge supplements scientific measurements for holistic understanding." },
      { title: "Policy Pipeline", desc: "Findings are synthesized into policy briefs for the Arctic Council and IPCC assessment reports." },
    ],
    stats: [
      { value: "12", label: "Monitoring Stations", icon: Target },
      { value: "150", label: "Researchers", icon: Users },
      { value: "3.2TB", label: "Data Collected/Year", icon: BookOpen },
      { value: "24/7", label: "Live Monitoring", icon: Wind },
    ],
    sdgs: ["SDG 13", "SDG 14", "SDG 17"],
    timeline: [
      { year: "2022", event: "Project launch; 4 pilot stations installed in Svalbard" },
      { year: "2023", event: "8 additional stations deployed; real-time data portal launched" },
      { year: "2024", event: "12 stations fully operational; first annual Arctic Climate Report published" },
      { year: "2025", event: "Data integrated into IPCC AR7; expansion to Greenland under discussion" },
    ],
  },
  {
    id: 6,
    title: "Mountain Watershed Protector",
    tagline: "Safeguarding the freshwater sources of 150,000 Himalayan families.",
    location: "Nepal, Bhutan & Northeast India",
    category: "Community",
    status: "Active",
    year: 2021,
    theme: "SDG 6",
    impact: "150K families served",
    volunteers: 2100,
    icon: Mountain,
    color: "#0B5D3F",
    budget: "$2.1M",
    partners: ["ICIMOD", "WWF Himalayan Programme", "Asian Development Bank"],
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400",
    galleryImgs: [
      "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      "https://images.unsplash.com/photo-1575468130798-81bdb8b58ce0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    ],
    description: "Himalayan glaciers — the 'third pole' — are the freshwater lifeline of over 1.9 billion people across Asia. As glaciers retreat due to climate change, mountain communities face worsening water scarcity, more intense floods, and crop failure. The Mountain Watershed Protector project combines watershed restoration, water harvesting infrastructure, and community governance to ensure water security for 150,000 families.",
    challenge: "Himalayan glaciers are shrinking at an accelerating rate — some losing up to 8 meters of depth annually. Deforestation of mountain catchments worsens erosion and reduces water retention. Over 90% of rural communities in the project area report declining water availability compared to 20 years ago.",
    approach: [
      { title: "Catchment Reforestation", desc: "Planting of 5 million native trees in critical watershed areas to restore water retention and reduce erosion." },
      { title: "Water Harvesting Systems", desc: "Construction of 2,400 water collection tanks and spring-capping systems to capture monsoon rainfall." },
      { title: "Community Water Committees", desc: "Training and establishing community-managed water committees with legal rights to manage local water sources." },
      { title: "Early Warning Systems", desc: "Glacial lake outburst flood (GLOF) monitoring systems installed at 18 high-risk sites." },
    ],
    stats: [
      { value: "150K", label: "Families Protected", icon: Heart },
      { value: "5M", label: "Trees Planted", icon: TreePine },
      { value: "2,400", label: "Water Systems", icon: Droplets },
      { value: "2,100", label: "Volunteers", icon: Users },
    ],
    sdgs: ["SDG 6", "SDG 13", "SDG 15", "SDG 11"],
    timeline: [
      { year: "2021", event: "Baseline water security assessments in 500 villages across 3 countries" },
      { year: "2022", event: "1,200 water systems constructed; 2M trees planted in priority catchments" },
      { year: "2023", event: "150K families connected; community water committees legally registered" },
      { year: "2025", event: "5M trees milestone; GLOF systems at all 18 risk sites; impact evaluation" },
    ],
  },
  {
    id: 7,
    title: "Urban Green Corridors",
    tagline: "Weaving nature back into the fabric of Asia's rapidly growing cities.",
    location: "Jakarta, Manila, Bangkok & Ho Chi Minh City",
    category: "Community",
    status: "Active",
    year: 2023,
    theme: "SDG 11",
    impact: "40 cities engaged",
    volunteers: 3400,
    icon: Globe2,
    color: "#4CAF50",
    budget: "$2.8M",
    partners: ["C40 Cities", "UN-Habitat", "Bloomberg Philanthropies"],
    img: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400",
    galleryImgs: [
      "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      "https://images.unsplash.com/photo-1519501025264-65ba15a82390?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    ],
    description: "Southeast Asian cities are among the world's most climate-vulnerable urban areas, facing extreme heat, flooding, and air pollution. The Urban Green Corridors project creates interconnected networks of parks, street trees, green roofs, and urban forests that cool cities, manage stormwater, improve air quality, and provide mental health benefits to millions of urban residents.",
    challenge: "Southeast Asian mega-cities have less than 5m² of green space per person (vs WHO recommendation of 9m²). Urban heat islands push temperatures 5–8°C higher than surrounding areas. Rapid urbanization is covering natural drainage with concrete, intensifying flood risk with each monsoon season.",
    approach: [
      { title: "Green Infrastructure Mapping", desc: "City-wide mapping of existing green assets and identification of priority corridors for enhancement." },
      { title: "Community Greening Programs", desc: "Training 3,400+ citizen gardeners and urban farmers to plant and maintain green corridors in their neighborhoods." },
      { title: "Policy Integration", desc: "Working with city governments to embed green corridor standards in urban planning codes and zoning regulations." },
      { title: "Climate Benefits Monitoring", desc: "IoT sensors measure temperature reduction, stormwater capture, and air quality improvement from green interventions." },
    ],
    stats: [
      { value: "40", label: "Cities Engaged", icon: Globe2 },
      { value: "3,400", label: "Urban Volunteers", icon: Users },
      { value: "8M", label: "Urban Residents Benefiting", icon: Heart },
      { value: "580 ha", label: "Green Space Created", icon: Leaf },
    ],
    sdgs: ["SDG 11", "SDG 13", "SDG 3", "SDG 15"],
    timeline: [
      { year: "2023", event: "Project launch in 4 pilot cities; green corridor master plans developed" },
      { year: "2024", event: "250 ha of new green space created; 1,800 volunteers trained" },
      { year: "2025", event: "Expanded to 40 cities; 580 ha milestone; urban cooling data published" },
      { year: "2027", event: "Target: 1,000 ha across 100 cities; international urban greening standard" },
    ],
  },
  {
    id: 8,
    title: "Mediterranean Marine Reserve",
    tagline: "Protecting one of the world's most biodiverse — and threatened — seas.",
    location: "Spain, Italy, Greece & Tunisia",
    category: "Ocean",
    status: "Active",
    year: 2022,
    theme: "SDG 14",
    impact: "8 marine protected zones",
    volunteers: 600,
    icon: Droplets,
    color: "#173B63",
    budget: "$1.9M",
    partners: ["IUCN Mediterranean", "Mediterranean Action Plan", "Prince Albert II of Monaco Foundation"],
    img: "https://images.unsplash.com/photo-1503152394-c571994fd383?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400",
    galleryImgs: [
      "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      "https://images.unsplash.com/photo-1566438480900-0609be27a4be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    ],
    description: "The Mediterranean Sea is home to 7% of the world's marine species in just 0.7% of its ocean surface — yet 62% of its fish stocks are overfished and plastic pollution is 4x the global ocean average. The Mediterranean Marine Reserve project establishes and manages 8 marine protected areas (MPAs) across 4 countries, covering 45,000 km² of critical marine habitat.",
    challenge: "The Mediterranean faces a convergence of threats: overfishing, plastic pollution, habitat destruction from coastal development, invasive species, and ocean warming. Climate change is shifting species distributions northward and intensifying harmful algal blooms, threatening fisheries on which millions of people depend.",
    approach: [
      { title: "Multi-Country MPA Network", desc: "Coordinating MPA designation and management across 4 national jurisdictions through a shared governance framework." },
      { title: "Fishers as Stewards", desc: "Engaging fishing communities as MPA co-managers, developing alternative livelihoods through sustainable tourism." },
      { title: "Plastic Removal & Prevention", desc: "Deep-sea robot deployments and coastal cleanups remove accumulated plastic, while advocacy targets upstream prevention." },
      { title: "Species Recovery", desc: "Population monitoring of 15 keystone species including bluefin tuna, common dolphin, and monk seal." },
    ],
    stats: [
      { value: "8", label: "Marine Protected Areas", icon: Target },
      { value: "45K km²", label: "Ocean Protected", icon: Globe2 },
      { value: "600", label: "Marine Volunteers", icon: Users },
      { value: "15", label: "Species Monitored", icon: Droplets },
    ],
    sdgs: ["SDG 14", "SDG 13", "SDG 17"],
    timeline: [
      { year: "2022", event: "Baseline biodiversity surveys; MPA boundary negotiations begin" },
      { year: "2023", event: "4 MPAs formally designated; fisher co-management agreements signed" },
      { year: "2024", event: "8 MPAs operational; first deep-sea plastic removal missions" },
      { year: "2026", event: "5-year impact assessment; target 15 MPAs; bluefin tuna population recovery" },
    ],
  },
  {
    id: 9,
    title: "Wind Farm Community Project",
    tagline: "Demonstrating that communities can own and benefit from renewable energy.",
    location: "Denmark, Scotland & Germany",
    category: "Energy",
    status: "Completed",
    year: 2020,
    theme: "SDG 7",
    impact: "50 MW capacity installed",
    volunteers: 280,
    icon: Wind,
    color: "#D6A95A",
    budget: "$4.5M",
    partners: ["European Wind Energy Association", "Community Energy Scotland", "Danish Energy Agency"],
    img: "https://images.unsplash.com/photo-1467533003447-e295ff1b0435?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400",
    galleryImgs: [
      "https://images.unsplash.com/photo-1548337138-e87d889cc369?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      "https://images.unsplash.com/photo-1466611653911-95081537e5b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      "https://images.unsplash.com/photo-1513828583688-c52646db42da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    ],
    description: "The Wind Farm Community Project pioneered a model of community-owned wind energy across Northern Europe, demonstrating that rural communities can be the primary owners and beneficiaries of clean energy infrastructure. 12 community cooperatives were established to collectively own and operate wind turbines, with profits reinvested into local environmental and social programs.",
    challenge: "Historically, wind energy development in Europe has been dominated by large utilities, with communities receiving limited benefit from turbines in their backyards. This fuels opposition to renewable energy expansion and slows the transition away from fossil fuels.",
    approach: [
      { title: "Community Cooperative Model", desc: "Legal and financial support to establish 12 wind energy cooperatives with full community ownership and governance." },
      { title: "Capacity Building", desc: "Training community boards in energy project management, financial literacy, and regulatory compliance." },
      { title: "Revenue Sharing", desc: "Profits from electricity sales fund local environmental projects, education, and social services." },
      { title: "Policy Advocacy", desc: "Project learnings contributed to EU renewable energy community framework legislation (RED II)." },
    ],
    stats: [
      { value: "50 MW", label: "Installed Capacity", icon: Wind },
      { value: "12", label: "Community Cooperatives", icon: Users },
      { value: "280", label: "Volunteers", icon: Heart },
      { value: "€2.1M", label: "Community Revenue/Year", icon: Target },
    ],
    sdgs: ["SDG 7", "SDG 8", "SDG 11", "SDG 13"],
    timeline: [
      { year: "2020", event: "Project launch; 12 cooperatives legally established across 3 countries" },
      { year: "2021", event: "First turbines operational in Denmark; 25 MW installed" },
      { year: "2022", event: "Scotland and Germany cohorts completed; 50 MW total capacity" },
      { year: "2023", event: "Project successfully completed; model replicated in 8 more countries" },
    ],
  },
];

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const project = projectsData.find((p) => String(p.id) === id);

  if (!project) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-[#F6FBF8]">
        <div className="text-center">
          <Target size={48} className="text-gray-300 mx-auto mb-4" />
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-gray-800 mb-2">Project Not Found</h2>
          <p className="text-gray-500 mb-6">This project doesn't exist or may have been removed.</p>
          <Link to="/projects" className="inline-flex items-center gap-2 bg-[#0B5D3F] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#0a5237] transition-all">
            <ArrowLeft size={15} /> Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F6FBF8] min-h-screen">
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] flex items-end overflow-hidden">
        <ImageWithFallback src={project.img} alt={project.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a0e]/95 via-[#0a1a0e]/50 to-transparent" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 pb-14 w-full">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-white/60 mb-5">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight size={14} />
              <Link to="/projects" className="hover:text-white transition-colors">Projects</Link>
              <ChevronRight size={14} />
              <span className="text-white/80 truncate max-w-xs">{project.title}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${project.status === "Active" ? "bg-[#4CAF50] text-white" : "bg-gray-500 text-white"}`}>{project.status}</span>
              <span className="bg-[#D6A95A] text-white text-xs font-bold px-3 py-1.5 rounded-full">{project.theme}</span>
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">{project.category}</span>
            </div>
            <h1 className="text-white mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.8rem, 5vw, 3.2rem)", fontWeight: 900 }}>{project.title}</h1>
            <p className="text-white/80 text-lg mb-5 max-w-2xl">{project.tagline}</p>
            <div className="flex flex-wrap items-center gap-6 text-sm text-white/70">
              <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#4CAF50]" /> {project.location}</span>
              <span className="flex items-center gap-1.5"><Calendar size={14} className="text-[#4CAF50]" /> Since {project.year}</span>
              <span className="flex items-center gap-1.5"><Users size={14} className="text-[#4CAF50]" /> {project.volunteers.toLocaleString()} volunteers</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="bg-[#0B5D3F] py-6">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {project.stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-white text-2xl font-black mb-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.value}</div>
                <div className="text-white/60 text-xs uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 flex flex-col gap-10">
            {/* Description */}
            <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="text-[#4CAF50] text-xs font-bold uppercase tracking-wider mb-2">Overview</div>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "1.5rem" }} className="text-gray-900 mb-4">About This Project</h2>
              <p className="text-gray-600 leading-relaxed">{project.description}</p>
            </motion.section>

            {/* Challenge */}
            <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="bg-[#173B63]/5 border border-[#173B63]/10 rounded-2xl p-7">
              <div className="text-[#173B63] text-xs font-bold uppercase tracking-wider mb-2">The Challenge</div>
              <p className="text-gray-700 leading-relaxed">{project.challenge}</p>
            </motion.section>

            {/* Approach */}
            <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="text-[#4CAF50] text-xs font-bold uppercase tracking-wider mb-2">Approach</div>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "1.5rem" }} className="text-gray-900 mb-6">How We Work</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {project.approach.map((a, i) => (
                  <motion.div key={a.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                    className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-[#4CAF50]/30 hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-[#0B5D3F] text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</div>
                      <div className="font-bold text-gray-900 text-sm">{a.title}</div>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed pl-9">{a.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Gallery */}
            <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="text-[#4CAF50] text-xs font-bold uppercase tracking-wider mb-2">Gallery</div>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "1.5rem" }} className="text-gray-900 mb-5">Project Photos</h2>
              <div className="grid grid-cols-3 gap-3">
                {project.galleryImgs.map((src, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden aspect-square">
                    <ImageWithFallback src={src} alt={`${project.title} photo ${i + 1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 cursor-zoom-in" />
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Timeline */}
            <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="text-[#4CAF50] text-xs font-bold uppercase tracking-wider mb-2">Progress</div>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "1.5rem" }} className="text-gray-900 mb-6">Project Timeline</h2>
              <div className="relative pl-6">
                <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200" />
                {project.timeline.map((t, i) => (
                  <motion.div key={t.year} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                    className="relative mb-6 last:mb-0">
                    <div className="absolute -left-4 top-1 w-4 h-4 rounded-full border-2 border-[#4CAF50] bg-white" />
                    <div className="flex items-start gap-3">
                      <span className="text-xs font-black text-[#0B5D3F] bg-[#0B5D3F]/8 px-2.5 py-1 rounded-full whitespace-nowrap shrink-0">{t.year}</span>
                      <p className="text-sm text-gray-600 leading-relaxed pt-0.5">{t.event}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6 lg:sticky top-24 self-start">
            {/* Project Info Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-5">Project Details</div>
              {[
                { label: "Status", value: project.status, colored: true },
                { label: "Budget", value: project.budget },
                { label: "Started", value: String(project.year) },
                { label: "Category", value: project.category },
                { label: "Theme", value: project.theme },
                { label: "Location", value: project.location },
              ].map(({ label, value, colored }) => (
                <div key={label} className="flex items-start justify-between py-2.5 border-b border-gray-50 last:border-0">
                  <span className="text-xs text-gray-400 shrink-0">{label}</span>
                  <span className={`text-xs font-semibold text-right max-w-[60%] ${colored && value === "Active" ? "text-[#4CAF50]" : colored ? "text-gray-500" : "text-gray-700"}`}>{value}</span>
                </div>
              ))}

              <div className="mt-5">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">SDG Alignment</div>
                <div className="flex flex-wrap gap-2">
                  {project.sdgs.map(sdg => (
                    <span key={sdg} className="text-xs font-bold bg-[#0B5D3F]/8 text-[#0B5D3F] px-2.5 py-1 rounded-full">{sdg}</span>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Partners</div>
                <div className="flex flex-col gap-2">
                  {project.partners.map(p => (
                    <div key={p} className="flex items-start gap-2">
                      <CheckCircle2 size={12} className="text-[#4CAF50] shrink-0 mt-0.5" />
                      <span className="text-xs text-gray-600">{p}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link to="/donate" className="mt-6 flex items-center justify-center gap-2 bg-[#0B5D3F] text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-[#0a5237] transition-all hover:scale-[1.02]">
                <Heart size={14} /> Support This Project
              </Link>
            </div>

            {/* Share CTA */}
            <div className="bg-[#4CAF50]/8 border border-[#4CAF50]/15 rounded-2xl p-5">
              <div className="text-sm font-bold text-gray-800 mb-1">Spread the Word</div>
              <p className="text-xs text-gray-500 mb-4">Share this project with your network to amplify its impact.</p>
              <button className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-semibold hover:border-[#4CAF50]/50 transition-all">
                <ExternalLink size={13} /> Share Project
              </button>
            </div>

            {/* Volunteer CTA */}
            <div className="bg-gradient-to-br from-[#0B5D3F] to-[#173B63] rounded-2xl p-6 text-white">
              <div className="text-xs font-bold uppercase tracking-wider text-white/60 mb-2">Get Involved</div>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }} className="mb-2">Volunteer on This Project</h3>
              <p className="text-xs text-white/70 mb-5">Join {project.volunteers.toLocaleString()}+ volunteers making a difference.</p>
              <Link to="/volunteer" className="flex items-center justify-center gap-2 bg-[#4CAF50] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#43a047] transition-all">
                Apply to Volunteer <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>

        {/* Back & Related */}
        <div className="mt-16 pt-10 border-t border-gray-200 flex items-center justify-between flex-wrap gap-4">
          <Link to="/projects" className="inline-flex items-center gap-2 text-[#0B5D3F] font-semibold text-sm hover:gap-3 transition-all">
            <ArrowLeft size={15} /> Back to All Projects
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">More projects →</span>
            <Link to={`/projects/${project.id < 9 ? project.id + 1 : 1}`} className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold hover:border-[#4CAF50]/50 transition-all">
              Next Project <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
