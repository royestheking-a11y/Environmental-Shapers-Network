import re

with open("/Users/mdsunny/Downloads/Premium Environmental Network Website/src/app/pages/About.tsx", "r") as f:
    content = f.read()

# 1. Add advisorTeam and bdTeam constants
teams = """
const advisorTeam = [
  {
    name: "Dr. Saleemul Huq (Late)",
    role: "Chief Scientific Advisor",
    country: "Bangladesh",
    bio: "Pioneering climate scientist and leading authority on climate change adaptation in developing countries.",
    img: "",
    tags: ["Climate Science", "Adaptation"],
  },
  {
    name: "Prof. Johan Rockström",
    role: "Global Strategy Advisor",
    country: "Sweden",
    bio: "Internationally recognized scientist on global sustainability issues, known for the Planetary Boundaries framework.",
    img: "",
    tags: ["Sustainability", "Earth Systems"],
  }
];

const bdTeam = [
  {
    name: "Rahim Uddin",
    role: "Country Director, BD",
    country: "Dhaka, Bangladesh",
    bio: "Oversees all operational initiatives and local community engagement across Bangladesh.",
    img: "",
    tags: ["Operations", "Local Outreach"],
  },
  {
    name: "Sumaiya Binte",
    role: "Head of Campaigns, BD",
    country: "Chittagong, Bangladesh",
    bio: "Leads national campaigns focusing on youth involvement and coastal resilience.",
    img: "",
    tags: ["Campaigns", "Youth"],
  }
];
"""
content = content.replace("const teamMembers = [", teams + "\nconst teamMembers = [")

# 2. Extract sections
def extract_section(start_marker, end_marker=None):
    start_idx = content.find(start_marker)
    if end_marker:
        end_idx = content.find(end_marker, start_idx)
        return content[start_idx:end_idx], end_idx
    else:
        return content[start_idx:], len(content)

impact_stats, impact_end = extract_section("{/* ── Impact Statistics", "{/* ── Core Values")
timeline, timeline_end = extract_section("{/* ── Timeline", "{/* ── Leadership Team")
global_team, team_end = extract_section("{/* ── Leadership Team", "{/* ── Recognition & Awards")

# 3. Create new sections
vision_mission = """
      {/* ── Vision & Mission ──────────────────────────────────────────────────────── */}
      <section className="py-28 bg-[#F6FBF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white p-10 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50">
              <div className="w-14 h-14 bg-[#0B5D3F]/10 rounded-2xl flex items-center justify-center mb-6">
                <Target size={26} className="text-[#0B5D3F]" />
              </div>
              <h3 className="text-2xl font-black text-[#0B5D3F] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Our Mission</h3>
              <p className="text-gray-600 leading-relaxed text-lg">To empower local communities, especially youth, to lead climate adaptation and environmental conservation efforts through science, advocacy, and direct action.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-[#0B5D3F] p-10 rounded-3xl shadow-xl shadow-[#0B5D3F]/20 text-white">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                <Globe2 size={26} className="text-white" />
              </div>
              <h3 className="text-2xl font-black text-white mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Our Vision</h3>
              <p className="text-white/80 leading-relaxed text-lg">A sustainable and equitable world where every community has the resources, knowledge, and power to thrive in harmony with nature.</p>
            </motion.div>
          </div>
        </div>
      </section>
"""

advisor = """
      {/* ── Advisors ─────────────────────────────────────────────────── */}
      <section className="py-28 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#D6A95A]/10 text-[#9E6B3C] text-xs font-bold px-4 py-2 rounded-full mb-5 uppercase tracking-widest">
              <Star size={12} fill="currentColor" /> Advisors
            </div>
            <h2 className="text-[#0B5D3F] mb-4">Our Advisory Board</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Guided by leading experts in climate science, policy, and community organizing.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {advisorTeam.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#F6FBF8] rounded-3xl p-8 border border-[#4CAF50]/10 hover:shadow-xl hover:shadow-[#0B5D3F]/5 transition-all group"
              >
                <h4 className="font-black text-gray-900 mb-1 text-xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{member.name}</h4>
                <p className="text-[#0B5D3F] text-sm font-semibold mb-3">{member.role}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
"""

bd_team_section = """
      {/* ── BD Team ─────────────────────────────────────────────────── */}
      <section className="py-28 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#4CAF50]/10 text-[#0B5D3F] text-xs font-bold px-4 py-2 rounded-full mb-5 uppercase tracking-widest">
              <MapPin size={12} /> BD Team
            </div>
            <h2 className="text-[#0B5D3F] mb-4">Bangladesh Leadership</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">The dedicated team leading our grassroots initiatives and national campaigns in Bangladesh.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {bdTeam.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#F6FBF8] rounded-3xl p-8 border border-[#4CAF50]/10 hover:shadow-xl hover:shadow-[#0B5D3F]/5 transition-all group"
              >
                <h4 className="font-black text-gray-900 mb-1 text-xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{member.name}</h4>
                <p className="text-[#0B5D3F] text-sm font-semibold mb-3">{member.role}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
"""

global_team = global_team.replace("The Team", "Global Team").replace("The People Behind the Mission", "Global Leadership Team")

# 4. Construct the replacement block
new_block = (
    "\n" +
    vision_mission +
    "\n" +
    impact_stats +
    "\n" +
    advisor +
    "\n" +
    global_team +
    "\n" +
    bd_team_section +
    "\n" +
    timeline +
    "\n"
)

# 5. Replace everything from Co-Founder's Message up to Recognition & Awards
start_idx = content.find("{/* ── Co-Founder's Message")
end_idx = content.find("{/* ── Recognition & Awards")

if start_idx != -1 and end_idx != -1:
    final_content = content[:start_idx] + new_block + content[end_idx:]
    with open("/Users/mdsunny/Downloads/Premium Environmental Network Website/src/app/pages/About.tsx", "w") as f:
        f.write(final_content)
    print("Successfully updated About.tsx")
else:
    print("Failed to find boundaries")
