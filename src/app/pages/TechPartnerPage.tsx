import { motion } from "motion/react";
import { ChevronRight, Code, ExternalLink, Mail, Monitor, Smartphone, Server } from "lucide-react";
import { Link } from "react-router";

export default function TechPartnerPage() {
  return (
    <div className="bg-[#F6FBF8] min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 bg-gradient-to-br from-[#0B5D3F] via-[#173B63] to-[#0a1a0e] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm font-bold px-5 py-2 rounded-full mb-6 uppercase tracking-wider backdrop-blur-md">
              <Code size={14} /> Technology Partner
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-10">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-2xl">
                <img src="/logo-white.png" alt="ESN" className="h-16 w-auto object-contain" />
              </div>
              <div className="text-white/40 font-light text-2xl hidden md:block">×</div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-2xl">
                <img src="/rizqaratech.png" alt="Rizqara Tech" className="h-16 w-auto object-contain" />
              </div>
            </div>
            
            <h1 className="text-white mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 900 }}>
              Digital Excellence for Global Impact
            </h1>
            <p className="text-white/70 max-w-2xl mx-auto text-lg">
              The Environmental Shapers Network platform was engineered and designed by Rizqara Tech, 
              bringing premium digital experiences to the forefront of environmental action.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-12">
          <Link to="/" className="hover:text-[#0B5D3F] transition-all">Home</Link>
          <ChevronRight size={14} />
          <span className="text-gray-700 font-medium">Technology Partner</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <div className="text-[#4CAF50] text-sm font-bold uppercase tracking-wider mb-2">About Our Partner</div>
            <h2 className="text-gray-900 mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 800 }}>
              Building the Future of Digital Experiences
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6 text-lg">
              Rizqara Tech is a premium software development and digital design agency. They specialize in creating high-performance, scalable, and visually stunning web and mobile applications for forward-thinking organizations.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8 text-lg">
              Through their partnership with ESN, they have provided a cutting-edge digital infrastructure that empowers our global network of volunteers, donors, and partners to collaborate seamlessly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="https://www.rizqara.tech" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#0B5D3F] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#0a5237] transition-all hover:scale-105 shadow-xl shadow-green-900/20">
                <ExternalLink size={18} />
                Visit www.rizqara.tech
              </a>
              <a href="mailto:rizqaratech@gmail.com" className="inline-flex items-center justify-center gap-2 bg-white text-[#0B5D3F] border-2 border-[#0B5D3F]/20 px-8 py-4 rounded-xl font-bold hover:border-[#0B5D3F] transition-all hover:shadow-lg">
                <Mail size={18} />
                rizqaratech@gmail.com
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-[#4CAF50]/10 rounded-2xl flex items-center justify-center mb-6">
                <Monitor className="text-[#4CAF50]" size={28} />
              </div>
              <h3 className="font-bold text-gray-900 text-xl mb-3">Web Development</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Premium, responsive web applications built with modern frameworks and state-of-the-art architecture.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow sm:translate-y-8">
              <div className="w-14 h-14 bg-[#173B63]/10 rounded-2xl flex items-center justify-center mb-6">
                <Smartphone className="text-[#173B63]" size={28} />
              </div>
              <h3 className="font-bold text-gray-900 text-xl mb-3">Mobile Apps</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Native and cross-platform mobile experiences designed for engagement and performance.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-[#D6A95A]/10 rounded-2xl flex items-center justify-center mb-6">
                <Server className="text-[#D6A95A]" size={28} />
              </div>
              <h3 className="font-bold text-gray-900 text-xl mb-3">Cloud Solutions</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Scalable cloud infrastructure, APIs, and database design for robust enterprise solutions.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow sm:translate-y-8">
              <div className="w-14 h-14 bg-[#0B5D3F]/10 rounded-2xl flex items-center justify-center mb-6">
                <Code className="text-[#0B5D3F]" size={28} />
              </div>
              <h3 className="font-bold text-gray-900 text-xl mb-3">UI/UX Design</h3>
              <p className="text-gray-500 text-sm leading-relaxed">User-centric interface design focusing on aesthetics, accessibility, and conversion.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
