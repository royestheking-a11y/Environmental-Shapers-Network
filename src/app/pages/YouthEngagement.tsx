import { YouthDevelopmentSection } from "../components/home/YouthDevelopmentSection";
import { ArrowRight, CheckCircle, Users, Globe2, BookOpen } from "lucide-react";
import { Link } from "react-router";

export default function YouthEngagement() {
  return (
    <div>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-[#E6F3EB] to-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#4CAF50]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-[#0A3D2A] mb-6 leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Youth <span className="text-[#4CAF50]">Engagement</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-10">
            Young people are not just the future—they are the present. Join a global movement of environmental shapers, learn how to lead, and take action in your community today.
          </p>
          <Link to="/volunteer" className="inline-flex items-center gap-2 bg-[#0A3D2A] hover:bg-[#173B63] text-white px-8 py-4 rounded-full font-bold transition-all hover:-translate-y-1 shadow-xl">
            Join the Movement <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* The existing youth stats and initiatives from the homepage */}
      <YouthDevelopmentSection />

      {/* How to Join & How We Work */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-16">
            
            {/* How to Join */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[#0A3D2A] text-sm font-bold uppercase tracking-[0.2em]">Getting Started</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0A3D2A] mb-8" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>How to Join</h2>
              
              <div className="space-y-8">
                {[
                  { title: "Sign Up Online", desc: "Fill out our quick registration form to become an official ESN Youth member.", icon: Users },
                  { title: "Attend Onboarding", desc: "Join a virtual orientation session to learn about our values, programs, and global network.", icon: BookOpen },
                  { title: "Connect Locally", desc: "We'll introduce you to your local Campus Chapter or regional youth leader.", icon: Globe2 }
                ].map((step, i) => (
                  <div key={i} className="flex gap-5">
                    <div className="w-14 h-14 rounded-full bg-[#E6F3EB] flex items-center justify-center shrink-0">
                      <step.icon className="text-[#0B5D3F]" size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-[#0A3D2A] mb-2">{step.title}</h4>
                      <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* How We Work */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[#0A3D2A] text-sm font-bold uppercase tracking-[0.2em]">Our Methodology</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0A3D2A] mb-8" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>How We Work</h2>
              
              <div className="bg-[#F8FCF9] p-8 rounded-3xl border border-gray-100 shadow-lg shadow-gray-200/50">
                <p className="text-gray-600 leading-relaxed mb-8">
                  We empower youth through a structured framework designed to turn passion into measurable impact. When you join, you will operate within these core pillars:
                </p>
                <ul className="space-y-4">
                  {[
                    "Capacity Building & Leadership Training",
                    "Grassroots Campaign Execution",
                    "Policy Advocacy at Local & National Levels",
                    "Cross-border Collaboration & Knowledge Sharing",
                    "Scientific Data Collection & Field Research"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4 p-2">
                      <CheckCircle className="text-[#4CAF50] shrink-0 mt-0.5" size={20} />
                      <span className="text-gray-700 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Cross-Link Opportunities: Global Representatives & Audited Impact */}
      <section className="py-20 bg-[#F6FBF8] border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 bg-[#E8F5E9] text-[#0B5D3F] text-xs font-bold px-4 py-1.5 rounded-full mb-3 uppercase tracking-wider">
              Expand Your Leadership
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0A3D2A]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Take Your Youth Leadership Further
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-[#0B5D3F] via-[#0A3D2A] to-[#173B63] p-8 sm:p-10 rounded-3xl text-white flex flex-col justify-between shadow-xl">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mb-6">
                  <Globe2 size={24} className="text-[#4CAF50]" />
                </div>
                <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Lead As a Country Representative
                </h3>
                <p className="text-white/80 text-sm leading-relaxed mb-8">
                  Ready to step onto the global stage? ESN appoints dedicated Country & Regional Representatives across 80+ nations with UN & COP credentialed seats.
                </p>
              </div>
              <Link
                to="/global-representatives"
                className="inline-flex items-center justify-center gap-2 bg-[#4CAF50] hover:bg-[#43a047] text-white px-7 py-3.5 rounded-xl font-bold text-sm transition-all shadow-md self-start"
              >
                Apply as Global Representative <ArrowRight size={16} />
              </Link>
            </div>

            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 flex flex-col justify-between shadow-sm">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#E6F3EB] flex items-center justify-center mb-6">
                  <Users size={24} className="text-[#0B5D3F]" />
                </div>
                <h3 className="text-2xl font-bold text-[#0A3D2A] mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Verified Impact & Annual Audits
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-8">
                  Explore real-time data on how youth volunteers and grassroots projects contribute to our global 2.4M+ trees planted and carbon reduction targets.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/impact"
                  className="inline-flex items-center gap-2 bg-[#0A3D2A] hover:bg-[#173B63] text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-sm"
                >
                  Impact Dashboard <ArrowRight size={14} />
                </Link>
                <Link
                  to="/reports"
                  className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-xl font-bold text-sm transition-all"
                >
                  Audit Reports <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
