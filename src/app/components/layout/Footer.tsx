import { useState } from "react";
import { Link } from "react-router";
import { useSettings } from "../../utils/useSettings";
import { motion } from "motion/react";
import {
  MapPin, Phone, Mail, Globe, ArrowRight,
  Twitter, Facebook, Instagram, Linkedin, Youtube,
  Leaf, TreePine, Heart
} from "lucide-react";
const esnLogoWhite = "/logo-white.png";

const sdgDetails: Record<number, { title: string; desc: string }> = {
  6: { title: "Clean Water", desc: "Ensuring availability and sustainable management of water and sanitation for all." },
  7: { title: "Clean Energy", desc: "Ensuring access to affordable, reliable, sustainable, and modern energy for all." },
  11: { title: "Sustainable Cities", desc: "Making cities and human settlements inclusive, safe, resilient, and sustainable." },
  12: { title: "Responsible Consumption", desc: "Ensuring sustainable consumption and production patterns." },
  13: { title: "Climate Action", desc: "Taking urgent action to combat climate change and its impacts." },
  14: { title: "Life Below Water", desc: "Conserving and sustainably using the oceans, seas, and marine resources." },
  15: { title: "Life on Land", desc: "Protecting, restoring, and promoting sustainable use of terrestrial ecosystems." },
  17: { title: "Partnerships", desc: "Strengthening the means of implementation for sustainable development." }
};

function SDGIcon({ sdg }: { sdg: number }) {
  const [open, setOpen] = useState(false);
  const detail = sdgDetails[sdg];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        onBlur={() => setOpen(false)}
        className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-300 ${
          open ? "bg-[#4CAF50] text-white border-transparent" : "bg-white/15 text-white/60 border border-white/10 hover:bg-white/25 hover:text-white"
        }`}
      >
        {sdg}
      </button>

      {/* Popover */}
      <motion.div
        initial={false}
        animate={open ? { opacity: 1, y: 0, scale: 1, pointerEvents: "auto" } : { opacity: 0, y: 10, scale: 0.95, pointerEvents: "none" }}
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-4 rounded-xl bg-white text-gray-900 shadow-2xl origin-bottom z-50"
      >
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-black text-white bg-[#4CAF50] px-2 py-0.5 rounded-full">
              SDG {sdg}
            </span>
          </div>
          <h5 className="font-bold text-sm mb-1">{detail?.title}</h5>
          <p className="text-xs text-gray-600 leading-relaxed">{detail?.desc}</p>
        </div>
      </motion.div>
    </div>
  );
}

const footerLinks = {
  Organization: [
    { label: "About ESN", href: "/about" },
    { label: "Our Team", href: "/our-team" },
    { label: "Board & Governance", href: "/board" },
    { label: "Thematic Focus Areas", href: "/thematic-areas" },
    { label: "Annual Reports", href: "/reports" },
    { label: "Awards & Recognition", href: "/awards" },
  ],
  Programs: [
    { label: "All Programs", href: "/programs" },
    { label: "Youth Development", href: "/programs/youth" },
    { label: "Events & Campaigns", href: "/events" },
    { label: "Research & Policy", href: "/research" },
    { label: "Community Projects", href: "/projects" },
  ],
  "Get Involved": [
    { label: "Volunteer", href: "/volunteer" },
    { label: "Membership", href: "/membership" },
    { label: "Campus Chapters", href: "/campus-chapters" },
    { label: "Partner With Us", href: "/partner" },
    { label: "Career Opportunities", href: "/careers" },
  ],
  Resources: [
    { label: "Knowledge Hub", href: "/knowledge-hub" },
    { label: "Media Center", href: "/media-center" },
    { label: "Impact Dashboard", href: "/impact" },
    { label: "Contact Us", href: "/contact" },
    { label: "Admin Login", href: "/admin" },
  ],
};

const socials = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export function Footer() {
  const settings = useSettings();
  
  return (
    <footer className="relative bg-[#0a1f14] text-white overflow-hidden">
      {/* Animated Mountains SVG */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none">
        <svg viewBox="0 0 1440 120" className="w-full" preserveAspectRatio="none">
          <path
            d="M0,80 L120,40 L240,70 L360,20 L480,60 L600,10 L720,50 L840,25 L960,55 L1080,15 L1200,45 L1320,30 L1440,60 L1440,0 L0,0 Z"
            fill="#F6FBF8"
          />
        </svg>
      </div>

      {/* Newsletter Section */}
      <div className="relative pt-24 pb-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Leaf size={18} className="text-[#4CAF50]" />
                <span className="text-[#4CAF50] text-sm font-semibold uppercase tracking-widest">Stay Connected</span>
              </div>
              <h3 className="text-white mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Join Our Green Movement
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Get the latest updates on environmental campaigns, research insights, and volunteer opportunities from across the globe.
              </p>
            </div>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-5 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#4CAF50] transition-colors duration-200"
              />
              <button className="bg-[#4CAF50] hover:bg-[#43a047] text-white px-6 py-3.5 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 hover:scale-105 whitespace-nowrap">
                Subscribe <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <img src={esnLogoWhite} alt="ESN" className="h-14 w-auto mb-6" />
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              {settings.siteName} is a global platform for environmental action, innovation, and collaboration. {settings.tagline}
            </p>
            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#4CAF50] flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <s.icon size={16} />
                </a>
              ))}
            </div>

            {/* Contact Info */}
            <div className="mt-8 flex flex-col gap-3">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <MapPin size={15} className="text-[#4CAF50] shrink-0" />
                <span>Dhaka, Bangladesh | Global Offices in 12 Countries</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Mail size={15} className="text-[#4CAF50] shrink-0" />
                <span>{settings.contactEmail || "info@esnglobal.org"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Globe size={15} className="text-[#4CAF50] shrink-0" />
                <span>www.esnglobal.org</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2 text-sm text-gray-400 bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                <span className="text-gray-500">Organization:</span>
                <span className="text-white font-medium text-left sm:text-right">Environmental Shapers Network</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                <span className="text-gray-500">Charity ID:</span>
                <span className="text-white font-medium text-left sm:text-right">S-121367</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                <span className="text-gray-500">User ID:</span>
                <span className="text-white font-medium text-left sm:text-right">enviro.sn@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {title}
                </h4>
                <ul className="flex flex-col gap-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="text-gray-400 hover:text-[#4CAF50] text-sm transition-colors duration-200 hover:translate-x-1 inline-block"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* SDG Logos */}
        <div className="mt-16 pt-10 border-t border-white/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <span className="text-xs text-gray-500 uppercase tracking-widest whitespace-nowrap">Aligned with</span>
              <div className="flex flex-wrap gap-2">
                {[13, 14, 15, 6, 7, 11, 12, 17].map((sdg) => (
                  <SDGIcon key={sdg} sdg={sdg} />
                ))}
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap">UN SDGs</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <TreePine size={14} className="text-[#4CAF50]" />
              <span>2,400,000+ trees planted globally</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} {settings.siteName}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-gray-500 hover:text-[#4CAF50] text-xs transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-500 hover:text-[#4CAF50] text-xs transition-colors">Terms of Service</Link>
            <Link to="/cookie-policy" className="text-gray-500 hover:text-[#4CAF50] text-xs transition-colors">Cookie Policy</Link>
            <Link to="/accessibility" className="text-gray-500 hover:text-[#4CAF50] text-xs transition-colors">Accessibility</Link>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            Developed by <Link to="/tech-partner" className="text-[#4CAF50] hover:underline font-bold transition-all hover:text-[#43a047]">Rizqara Tech</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
