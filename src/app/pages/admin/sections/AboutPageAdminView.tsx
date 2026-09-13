import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Edit3, Trash2, AlertCircle, Save, LayoutTemplate, Users, History, AlignLeft, Image as ImageIcon, Target, Globe2 } from "lucide-react";
import { useFirestoreData, saveFirestoreData } from "../../../../lib/useFirestore";
import { logAdminActivity } from "../../../../lib/activityLogger";
import { resolveIcon } from "./ProgramsView";
import { ImageUploadField } from "../../../components/ui/ImageUploadField";

// Types
export interface AboutHeroData {
  title1: string;
  title2: string;
  description: string;
  foundedText: string;
}

export interface AboutStoryData {
  headline1: string;
  headline2: string;
  quoteText: string;
  quoteAuthor: string;
  paragraph1: string;
  paragraph2: string;
  paragraph3: string;
}

export interface AboutMilestone {
  id: number;
  year: string;
  title: string;
  desc: string;
  iconName: string;
  color: string;
}

export interface AboutTeamMember {
  id: number;
  name: string;
  role: string;
  country: string;
  bio: string;
  img: string;
  tags: string[];
  category: "Advisor" | "BD" | "Global" | "Founder";
}

export interface VisionMissionItem {
  id: number;
  title: string;
  description: string;
}

export interface AboutVisionMissionData {
  missionItems: VisionMissionItem[];
  visionItems: VisionMissionItem[];
  megaVisionTitle: string;
  megaVisionDescription: string;
}

export interface GlobalPresenceRegion {
  id: number;
  region: string;
  countries: string;
  iconName: string;
  color: string;
}

export interface AboutGlobalPresenceData {
  description: string;
  regions: GlobalPresenceRegion[];
  milestoneTitle: string;
  milestoneLocationDate: string;
  milestoneProgress: number;
  milestoneGoal: string;
}

// Initial Data
export const initialHeroData: AboutHeroData = {
  title1: "Shaping the World's",
  title2: "Environmental Future",
  description: "We are a global movement of scientists, advocates, and community leaders united by one conviction: a healthy planet is not a privilege — it is the foundation of human dignity.",
  foundedText: "Founded 2019 · Dhaka, Bangladesh"
};

export const initialStoryData: AboutStoryData = {
  headline1: "Born from Urgency,",
  headline2: "Sustained by Purpose",
  quoteText: "\"When the floods came and scientists confirmed climate change as the cause, we realized that hope without action was just a comfortable lie. We had to build something real.\"",
  quoteAuthor: "Imran Hossain & Abu Hanif · Co-Founders",
  paragraph1: "ESN was born in the summer of 2019, weeks after Bangladesh recorded its worst monsoon flooding in a generation. Scientists from MIT and IPCC confirmed what local communities already feared — climate change was amplifying these disasters. A group of young people, led by Imran Hossain and Abu Hanif, responded not with despair but with a plan.",
  paragraph2: "They planted 1,000 mangrove seedlings in the Sundarbans that first weekend. Within six months, 400 volunteers had joined. Within a year, they had their first international chapter in Kolkata. What followed was not a slow institutional climb but an organic explosion of communities joining a movement they felt was genuinely theirs.",
  paragraph3: "Today ESN operates in 80+ countries — but the ethos remains unchanged: local ownership, global solidarity, science-driven humility, and a refusal to accept that the world's poorest communities should bear the heaviest burden of a crisis they did least to create."
};

export const initialMilestones: AboutMilestone[] = [
  { id: 1, year: "2019", title: "A Movement is Born", iconName: "Sprout", color: "#4CAF50", desc: "ESN was founded in Dhaka after catastrophic monsoon floods were linked directly to climate change. Imran Hossain, Abu Hanif and fellow students pledged to turn grief into action — planting 1,000 mangrove saplings in their first weekend." },
  { id: 2, year: "2021", title: "Crossing Borders", iconName: "Globe2", color: "#0B5D3F", desc: "Expanded to India and Nepal with our first cross-border reforestation program. The 'Green Corridor' project connected degraded forest patches across three nations, covering over 8,000 hectares." },
  { id: 3, year: "2022", title: "UN Recognition", iconName: "Award", color: "#D6A95A", desc: "Received ECOSOC Special Consultative Status — one of the youngest NGOs in history to achieve this recognition. We presented at the UNFCCC COP25 in Madrid, representing 34 countries." },
  { id: 4, year: "2023", title: "50 Countries Reached", iconName: "MapPin", color: "#173B63", desc: "Active projects and campus chapters now span 50 countries across 5 continents. Launched our flagship Youth Climate Leadership program, training 4,000+ youth advocates in their first cohort." },
  { id: 5, year: "2024", title: "One Million Trees", iconName: "TreePine", color: "#4CAF50", desc: "Celebrated the planting of our 1 millionth tree — a mangrove seedling in the Sundarbans, Bangladesh. The landmark was witnessed by community leaders, diplomats, and 300 volunteers from 40 countries." },
  { id: 6, year: "2025", title: "Climate Finance Hub", iconName: "Zap", color: "#0B5D3F", desc: "Launched the ESN Climate Finance Accelerator, channeling $12M to 180 grassroots environmental projects in the Global South. Opened regional headquarters in Nairobi, Bogotá, and Jakarta." },
  { id: 7, year: "2026", title: "The Global Platform", iconName: "BookOpen", color: "#D6A95A", desc: "Launched this integrated digital platform connecting 12,000+ communities across 80+ countries. Now the largest open-source environmental data network in Asia and Africa, powering science-based action." },
];

export const initialTeamMembers: AboutTeamMember[] = [
  { id: 1, name: "Imran Hossain", role: "Co-Founder", country: "Dhaka, Bangladesh", bio: "Former flood-disaster volunteer turned global climate advocate. Imran has spoken at UN Climate COPs.", img: "", tags: ["Climate Policy", "Leadership"], category: "Founder" },
  { id: 2, name: "Abu Hanif", role: "Co-Founder", country: "Dhaka, Bangladesh", bio: "Passionate environmentalist and community leader. Abu Hanif has been instrumental in scaling our grassroots chapters globally.", img: "", tags: ["Community", "Strategy"], category: "Founder" },
  { id: 3, name: "Rahim Uddin", role: "Country Director, BD", country: "Dhaka, Bangladesh", bio: "Oversees all operational initiatives and local community engagement across Bangladesh.", img: "", tags: ["Operations", "Local Outreach"], category: "BD" },
  { id: 4, name: "Sumaiya Binte", role: "Head of Campaigns, BD", country: "Chittagong, Bangladesh", bio: "Leads national campaigns focusing on youth involvement and coastal resilience.", img: "", tags: ["Campaigns", "Youth"], category: "BD" },
  { id: 5, name: "Carlos Rodriguez", role: "Regional Director, Americas", country: "Bogotá, Colombia", bio: "Conservation biologist with 12 years in Amazonian field research. Carlos built ESN's Latin American network from 3 to 28 active countries in just four years.", img: "", tags: ["Conservation", "Biodiversity"], category: "Global" },
  { id: 6, name: "Amara Osei", role: "Director of Community Programs", country: "Accra, Ghana", bio: "Community organizer and former UN Environment Programme fellow. Amara designed ESN's grassroots engagement model now used by 6,000+ local chapters worldwide.", img: "", tags: ["Community", "Inclusion"], category: "Global" },
  { id: 7, name: "Dr. Saleemul Huq (Late)", role: "Chief Scientific Advisor", country: "Bangladesh", bio: "Pioneering climate scientist and leading authority on climate change adaptation in developing countries.", img: "", tags: ["Climate Science", "Adaptation"], category: "Advisor" },
  { id: 8, name: "Prof. Johan Rockström", role: "Global Strategy Advisor", country: "Sweden", bio: "Internationally recognized scientist on global sustainability issues, known for the Planetary Boundaries framework.", img: "", tags: ["Sustainability", "Earth Systems"], category: "Advisor" }
];


export const initialVisionMissionData: AboutVisionMissionData = {
  missionItems: [
    { id: 1, title: "Science-Backed Action", description: "Equipping communities with localized climate data to implement effective, long-term environmental conservation." },
    { id: 2, title: "Youth Leadership", description: "Training the next generation of climate advocates to take policy-level action and grassroots leadership in vulnerable areas." },
    { id: 3, title: "Policy Advocacy", description: "Working hand-in-hand with governments to ensure marginalized voices directly shape national environmental policies." }
  ],
  visionItems: [
    { id: 1, title: "Net-Zero Communities", description: "By 2050, we envision 5,000+ localized chapters successfully transitioning their economies to sustainable, zero-waste models." },
    { id: 2, title: "Climate Justice Achieved", description: "A world where the most vulnerable populations are fully protected and independently equipped to adapt to extreme weather." }
  ],
  megaVisionTitle: "A Restored Planet",
  megaVisionDescription: "Our ultimate metric for success: thriving, interconnected ecosystems where humanity operates entirely within the Earth's natural boundaries."
};

export const initialGlobalPresenceData: AboutGlobalPresenceData = {
  description: "Our model rejects the traditional \"headquarters knows best\" approach. Every region has full autonomy over program design, funding allocation, and community partnerships — supported by a shared platform, shared data, and shared values.",
  regions: [
    { id: 1, region: "South Asia", countries: "12 countries", iconName: "MapPin", color: "#0B5D3F" },
    { id: 2, region: "Sub-Saharan Africa", countries: "22 countries", iconName: "Globe2", color: "#173B63" },
    { id: 3, region: "Latin America", countries: "18 countries", iconName: "Leaf", color: "#4CAF50" },
    { id: 4, region: "Southeast Asia", countries: "10 countries", iconName: "Sprout", color: "#0B5D3F" },
    { id: 5, region: "MENA", countries: "8 countries", iconName: "Sun", color: "#D6A95A" },
    { id: 6, region: "Europe & NA", countries: "10 countries", iconName: "TreePine", color: "#173B63" }
  ],
  milestoneTitle: "1 Million Trees Planted",
  milestoneLocationDate: "Sundarbans, Bangladesh · July 2023",
  milestoneProgress: 84,
  milestoneGoal: "Goal: 1.2M by Dec 2026"
};


export default function AboutPageAdminView() {
  const [activeTab, setActiveTab] = useState<"hero" | "story" | "milestones" | "team" | "vision" | "presence">("hero");

  const [heroData, setHeroData] = useFirestoreData<AboutHeroData>("esn_about_hero", initialHeroData);
  const [storyData, setStoryData] = useFirestoreData<AboutStoryData>("esn_about_story", initialStoryData);
  const [milestones, setMilestones] = useFirestoreData<AboutMilestone[]>("esn_about_milestones", initialMilestones);
  const [teamMembers, setTeamMembers] = useFirestoreData<AboutTeamMember[]>("esn_about_team", initialTeamMembers);
  const [visionData, setVisionData] = useFirestoreData<AboutVisionMissionData>("esn_about_vision_mission", initialVisionMissionData);
  const [presenceData, setPresenceData] = useFirestoreData<AboutGlobalPresenceData>("esn_about_global_presence", initialGlobalPresenceData);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const notifySave = (msg: string) => {
    setSaveSuccess(msg);
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  // Milestone editing state
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [editingMilestoneId, setEditingMilestoneId] = useState<number | null>(null);
  const [milestoneFormData, setMilestoneFormData] = useState<Partial<AboutMilestone>>({});

  // Team editing state
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<number | null>(null);
  const [teamFormData, setTeamFormData] = useState<Partial<AboutTeamMember>>({ tags: [] });

  const handleSaveHero = async () => {
    setIsSaving(true);
    await saveFirestoreData("esn_about_hero", heroData);
    await logAdminActivity("Updated About Page", "CMS", "Saved updates to About page Hero section.", "info");
    setIsSaving(false);
    notifySave("Hero section updated and published live!");
  };

  const handleSaveStory = async () => {
    setIsSaving(true);
    await saveFirestoreData("esn_about_story", storyData);
    await logAdminActivity("Updated About Page", "CMS", "Saved updates to Story & Quote.", "info");
    setIsSaving(false);
    notifySave("Story & Quote updated and published live!");
  };

  const handleSaveVision = async () => {
    setIsSaving(true);
    await saveFirestoreData("esn_about_vision_mission", visionData);
    await logAdminActivity("Updated About Page", "CMS", "Saved updates to Vision & Mission.", "info");
    setIsSaving(false);
    notifySave("Vision & Mission updated and published live!");
  };

  const handleSavePresence = async () => {
    setIsSaving(true);
    await saveFirestoreData("esn_about_global_presence", presenceData);
    await logAdminActivity("Updated About Page", "CMS", "Saved updates to Global Presence.", "info");
    setIsSaving(false);
    notifySave("Global Presence updated and published live!");
  };

  const handleSaveMilestone = async () => {
    if (!milestoneFormData.title || !milestoneFormData.year) return;
    let newMilestones: AboutMilestone[];
    if (editingMilestoneId !== null) {
      newMilestones = milestones.map(m => m.id === editingMilestoneId ? { ...m, ...milestoneFormData } as AboutMilestone : m);
    } else {
      const newId = milestones.length > 0 ? Math.max(...milestones.map(m => m.id)) + 1 : 1;
      newMilestones = [...milestones, { ...milestoneFormData, id: newId } as AboutMilestone];
    }
    setMilestones(newMilestones);
    await saveFirestoreData("esn_about_milestones", newMilestones);
    await logAdminActivity("Updated Milestone", "CMS", `Saved milestone "${milestoneFormData.title}" (${milestoneFormData.year}).`, "info");
    setShowAddMilestone(false);
    notifySave("Milestone saved and published live!");
  };

  const handleDeleteMilestone = async (id: number) => {
    const newMilestones = milestones.filter(m => m.id !== id);
    setMilestones(newMilestones);
    await saveFirestoreData("esn_about_milestones", newMilestones);
    await logAdminActivity("Deleted Milestone", "CMS", "Deleted a milestone from the About page timeline.", "warning");
    notifySave("Milestone deleted and updated live!");
  };

  const handleSaveTeam = async () => {
    if (!teamFormData.name || !teamFormData.role) return;
    let newTeam: AboutTeamMember[];
    if (editingTeamId !== null) {
      newTeam = teamMembers.map(t => t.id === editingTeamId ? { ...t, ...teamFormData } as AboutTeamMember : t);
    } else {
      const newId = teamMembers.length > 0 ? Math.max(...teamMembers.map(t => t.id)) + 1 : 1;
      newTeam = [...teamMembers, { ...teamFormData, id: newId } as AboutTeamMember];
    }
    setTeamMembers(newTeam);
    await saveFirestoreData("esn_about_team", newTeam);
    await logAdminActivity("Updated Team Member", "CMS", `Saved profile for ${teamFormData.name} (${teamFormData.role}).`, "info");
    setShowAddTeam(false);
    setTeamFormData({ category: "Global", tags: [], img: "" });
  };

  const handleDeleteTeam = async (id: number) => {
    const newTeam = teamMembers.filter(t => t.id !== id);
    setTeamMembers(newTeam);
    await saveFirestoreData("esn_about_team", newTeam);
    await logAdminActivity("Removed Team Member", "CMS", "Removed a team member profile from the About page.", "warning");
  };

  const tabs = [
    { id: "hero", label: "Hero Section", icon: LayoutTemplate },
    { id: "story", label: "Story & Quote", icon: AlignLeft },
    { id: "milestones", label: "Milestones", icon: History },
    { id: "team", label: "Team & Advisors", icon: Users },
    { id: "vision", label: "Vision & Mission", icon: Target },
    { id: "presence", label: "Global Presence", icon: Globe2 },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-gray-900 font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>About Page CMS</h3>
        <p className="text-sm text-gray-400">Manage all content for the About Page</p>
      </div>

      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm font-semibold"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {saveSuccess}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                activeTab === tab.id ? "bg-[#0B5D3F] text-white" : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "hero" && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="grid gap-4 mb-6">
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1.5 block">Title Part 1</label>
              <input type="text" value={heroData?.title1 || ""} onChange={e => setHeroData({ ...heroData, title1: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1.5 block">Title Part 2 (Green)</label>
              <input type="text" value={heroData?.title2 || ""} onChange={e => setHeroData({ ...heroData, title2: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1.5 block">Description</label>
              <textarea rows={3} value={heroData?.description || ""} onChange={e => setHeroData({ ...heroData, description: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1.5 block">Founded Badge Text</label>
              <input type="text" value={heroData?.foundedText || ""} onChange={e => setHeroData({ ...heroData, foundedText: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
            </div>
          </div>
          <button onClick={handleSaveHero} disabled={isSaving} className="flex items-center gap-2 bg-[#0B5D3F] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#0a5237] transition-all">
            <Save size={16} /> {isSaving ? "Saving..." : "Save Hero"}
          </button>
        </div>
      )}

      {activeTab === "story" && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="grid gap-4 mb-6">
            <div className="grid md:grid-cols-2 gap-4">
               <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Headline Part 1</label>
                <input type="text" value={storyData?.headline1 || ""} onChange={e => setStoryData({ ...storyData, headline1: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Headline Part 2 (Green Gradient)</label>
                <input type="text" value={storyData?.headline2 || ""} onChange={e => setStoryData({ ...storyData, headline2: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1.5 block">Co-Founder Quote</label>
              <textarea rows={2} value={storyData?.quoteText || ""} onChange={e => setStoryData({ ...storyData, quoteText: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1.5 block">Quote Author</label>
              <input type="text" value={storyData?.quoteAuthor || ""} onChange={e => setStoryData({ ...storyData, quoteAuthor: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1.5 block">Story Paragraph 1</label>
              <textarea rows={3} value={storyData?.paragraph1 || ""} onChange={e => setStoryData({ ...storyData, paragraph1: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1.5 block">Story Paragraph 2</label>
              <textarea rows={3} value={storyData?.paragraph2 || ""} onChange={e => setStoryData({ ...storyData, paragraph2: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1.5 block">Story Paragraph 3</label>
              <textarea rows={3} value={storyData?.paragraph3 || ""} onChange={e => setStoryData({ ...storyData, paragraph3: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
            </div>
          </div>
          <button onClick={handleSaveStory} disabled={isSaving} className="flex items-center gap-2 bg-[#0B5D3F] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#0a5237] transition-all">
            <Save size={16} /> {isSaving ? "Saving..." : "Save Story"}
          </button>
        </div>
      )}

      {activeTab === "milestones" && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
           <div className="flex justify-between items-center mb-6">
             <h4 className="font-bold text-gray-900">Journey Milestones</h4>
             <button onClick={() => { setEditingMilestoneId(null); setMilestoneFormData({ iconName: "Sprout", color: "#4CAF50" }); setShowAddMilestone(true); }} className="flex items-center gap-2 bg-[#0B5D3F] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#0a5237]">
               <Plus size={16} /> Add Milestone
             </button>
           </div>
           
           <AnimatePresence>
             {showAddMilestone && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-6 bg-[#F6FBF8] p-5 rounded-xl border border-[#4CAF50]/30 overflow-hidden">
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs font-bold text-gray-600 mb-1.5 block">Year</label>
                      <input type="text" value={milestoneFormData.year || ""} onChange={e => setMilestoneFormData({ ...milestoneFormData, year: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-600 mb-1.5 block">Title</label>
                      <input type="text" value={milestoneFormData.title || ""} onChange={e => setMilestoneFormData({ ...milestoneFormData, title: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-gray-600 mb-1.5 block">Description</label>
                      <textarea rows={2} value={milestoneFormData.desc || ""} onChange={e => setMilestoneFormData({ ...milestoneFormData, desc: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-600 mb-1.5 block">Lucide Icon Name</label>
                      <input type="text" value={milestoneFormData.iconName || ""} onChange={e => setMilestoneFormData({ ...milestoneFormData, iconName: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-600 mb-1.5 block">Color</label>
                      <div className="flex gap-2">
                        <input type="color" value={milestoneFormData.color || "#4CAF50"} onChange={e => setMilestoneFormData({ ...milestoneFormData, color: e.target.value })} className="w-10 h-10 rounded cursor-pointer" />
                        <input type="text" value={milestoneFormData.color || ""} onChange={e => setMilestoneFormData({ ...milestoneFormData, color: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleSaveMilestone} className="bg-[#0B5D3F] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#0a5237]">Save Milestone</button>
                    <button onClick={() => setShowAddMilestone(false)} className="px-4 py-2 text-gray-500 font-semibold text-sm hover:bg-gray-100 rounded-xl">Cancel</button>
                  </div>
                </motion.div>
             )}
           </AnimatePresence>

           <div className="flex flex-col gap-3">
             {milestones.map(m => (
               <div key={m.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-[#4CAF50]/30 transition-all">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white shadow-sm" style={{ backgroundColor: m.color }}>
                     {m.year}
                   </div>
                   <div>
                     <h5 className="font-bold text-gray-900">{m.title}</h5>
                     <p className="text-xs text-gray-500 line-clamp-1">{m.desc}</p>
                   </div>
                 </div>
                 <div className="flex gap-2">
                   <button onClick={() => { setEditingMilestoneId(m.id); setMilestoneFormData(m); setShowAddMilestone(true); }} className="p-2 text-gray-400 hover:text-[#0B5D3F] hover:bg-gray-50 rounded-lg"><Edit3 size={16} /></button>
                   <button onClick={() => handleDeleteMilestone(m.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                 </div>
               </div>
             ))}
           </div>
        </div>
      )}

      {activeTab === "team" && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
           <div className="flex justify-between items-center mb-6">
             <h4 className="font-bold text-gray-900">Team & Advisors</h4>
             <button onClick={() => { setEditingTeamId(null); setTeamFormData({ category: "Global", tags: [] }); setShowAddTeam(true); }} className="flex items-center gap-2 bg-[#0B5D3F] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#0a5237]">
               <Plus size={16} /> Add Member
             </button>
           </div>

           <AnimatePresence>
             {showAddTeam && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-6 bg-[#F6FBF8] p-5 rounded-xl border border-[#4CAF50]/30 overflow-hidden">
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs font-bold text-gray-600 mb-1.5 block">Name</label>
                      <input type="text" value={teamFormData.name || ""} onChange={e => setTeamFormData({ ...teamFormData, name: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-600 mb-1.5 block">Role</label>
                      <input type="text" value={teamFormData.role || ""} onChange={e => setTeamFormData({ ...teamFormData, role: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-600 mb-1.5 block">Location (Country / City)</label>
                      <input type="text" value={teamFormData.country || ""} onChange={e => setTeamFormData({ ...teamFormData, country: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-600 mb-1.5 block">Category</label>
                      <select value={teamFormData.category || "Global"} onChange={e => setTeamFormData({ ...teamFormData, category: e.target.value as any })} className="w-full px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]">
                        <option value="Founder">Founder</option>
                        <option value="BD">Bangladesh Team</option>
                        <option value="Global">Global Team</option>
                        <option value="Advisor">Advisor</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <ImageUploadField
                        label="Team Member Photo"
                        value={teamFormData.img || ""}
                        onChange={(url) => setTeamFormData({ ...teamFormData, img: url })}
                        folder="team"
                        helpText="Upload a portrait photo or profile picture for this team member"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-gray-600 mb-1.5 block">Tags (Comma separated)</label>
                      <input type="text" value={teamFormData.tags?.join(", ") || ""} onChange={e => setTeamFormData({ ...teamFormData, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })} placeholder="e.g. Climate, Science" className="w-full px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-gray-600 mb-1.5 block">Bio</label>
                      <textarea rows={2} value={teamFormData.bio || ""} onChange={e => setTeamFormData({ ...teamFormData, bio: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleSaveTeam} className="bg-[#0B5D3F] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#0a5237]">Save Member</button>
                    <button onClick={() => setShowAddTeam(false)} className="px-4 py-2 text-gray-500 font-semibold text-sm hover:bg-gray-100 rounded-xl">Cancel</button>
                  </div>
                </motion.div>
             )}
           </AnimatePresence>

           <div className="grid md:grid-cols-2 gap-3">
             {teamMembers.map(t => (
               <div key={t.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-[#4CAF50]/30 transition-all">
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                     {t.img ? <img src={t.img} alt={t.name} className="w-full h-full object-cover" /> : <Users size={18} className="text-gray-400" />}
                   </div>
                   <div>
                     <div className="flex items-center gap-2">
                       <h5 className="font-bold text-gray-900 text-sm">{t.name}</h5>
                       <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">{t.category}</span>
                     </div>
                     <p className="text-xs text-[#0B5D3F] font-semibold">{t.role}</p>
                   </div>
                 </div>
                 <div className="flex gap-2">
                   <button onClick={() => { setEditingTeamId(t.id); setTeamFormData(t); setShowAddTeam(true); }} className="p-2 text-gray-400 hover:text-[#0B5D3F] hover:bg-gray-50 rounded-lg"><Edit3 size={16} /></button>
                   <button onClick={() => handleDeleteTeam(t.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                 </div>
               </div>
             ))}
           </div>
        </div>
       )}

      {activeTab === "vision" && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-8">
          <div>
            <h4 className="font-bold text-gray-900 mb-4 border-b pb-2">Mission Steps</h4>
            {visionData.missionItems.map((item, index) => (
              <div key={item.id} className="grid md:grid-cols-3 gap-4 mb-4 items-start">
                <div className="md:col-span-1">
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Mission {index + 1} Title</label>
                  <input type="text" value={item.title} onChange={e => {
                    const newItems = [...visionData.missionItems];
                    newItems[index].title = e.target.value;
                    setVisionData({ ...visionData, missionItems: newItems });
                  }} className="w-full px-4 py-2 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Description</label>
                  <textarea rows={2} value={item.description} onChange={e => {
                    const newItems = [...visionData.missionItems];
                    newItems[index].description = e.target.value;
                    setVisionData({ ...visionData, missionItems: newItems });
                  }} className="w-full px-4 py-2 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
                </div>
              </div>
            ))}
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4 border-b pb-2">Vision Goals</h4>
            {visionData.visionItems.map((item, index) => (
              <div key={item.id} className="grid md:grid-cols-3 gap-4 mb-4 items-start">
                <div className="md:col-span-1">
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Vision {index + 1} Title</label>
                  <input type="text" value={item.title} onChange={e => {
                    const newItems = [...visionData.visionItems];
                    newItems[index].title = e.target.value;
                    setVisionData({ ...visionData, visionItems: newItems });
                  }} className="w-full px-4 py-2 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Description</label>
                  <textarea rows={2} value={item.description} onChange={e => {
                    const newItems = [...visionData.visionItems];
                    newItems[index].description = e.target.value;
                    setVisionData({ ...visionData, visionItems: newItems });
                  }} className="w-full px-4 py-2 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
                </div>
              </div>
            ))}
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4 border-b pb-2">Mega Vision Card</h4>
            <div className="grid gap-4">
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Mega Vision Title</label>
                <input type="text" value={visionData.megaVisionTitle} onChange={e => setVisionData({ ...visionData, megaVisionTitle: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Description</label>
                <textarea rows={2} value={visionData.megaVisionDescription} onChange={e => setVisionData({ ...visionData, megaVisionDescription: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
              </div>
            </div>
          </div>

          <button onClick={handleSaveVision} disabled={isSaving} className="mt-4 flex items-center gap-2 bg-[#0B5D3F] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#0a5237] transition-colors disabled:opacity-50">
            <Save size={18} /> {isSaving ? "Saving..." : "Save Vision & Mission"}
          </button>
        </div>
      )}

      {activeTab === "presence" && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-8">
          <div>
            <label className="text-xs font-bold text-gray-600 mb-1.5 block">Global Presence Description</label>
            <textarea rows={3} value={presenceData.description} onChange={e => setPresenceData({ ...presenceData, description: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4 border-b pb-2">Regions</h4>
            <div className="grid md:grid-cols-2 gap-4">
              {presenceData.regions.map((region, index) => (
                <div key={region.id} className="p-4 border border-gray-200 rounded-xl bg-[#F6FBF8]">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-600 mb-1.5 block">Region Name</label>
                      <input type="text" value={region.region} onChange={e => {
                        const newRegions = [...presenceData.regions];
                        newRegions[index].region = e.target.value;
                        setPresenceData({ ...presenceData, regions: newRegions });
                      }} className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-600 mb-1.5 block">Count Text</label>
                      <input type="text" value={region.countries} onChange={e => {
                        const newRegions = [...presenceData.regions];
                        newRegions[index].countries = e.target.value;
                        setPresenceData({ ...presenceData, regions: newRegions });
                      }} className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4 border-b pb-2">Latest Milestone Card</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Milestone Title</label>
                <input type="text" value={presenceData.milestoneTitle} onChange={e => setPresenceData({ ...presenceData, milestoneTitle: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Location & Date</label>
                <input type="text" value={presenceData.milestoneLocationDate} onChange={e => setPresenceData({ ...presenceData, milestoneLocationDate: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Goal Text</label>
                <input type="text" value={presenceData.milestoneGoal} onChange={e => setPresenceData({ ...presenceData, milestoneGoal: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Progress % (0-100)</label>
                <input type="number" min="0" max="100" value={presenceData.milestoneProgress} onChange={e => setPresenceData({ ...presenceData, milestoneProgress: Number(e.target.value) })} className="w-full px-4 py-2 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
              </div>
            </div>
          </div>

          <button onClick={handleSavePresence} disabled={isSaving} className="mt-4 flex items-center gap-2 bg-[#0B5D3F] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#0a5237] transition-colors disabled:opacity-50">
            <Save size={18} /> {isSaving ? "Saving..." : "Save Global Presence"}
          </button>
        </div>
      )}
    </div>
  );
}
