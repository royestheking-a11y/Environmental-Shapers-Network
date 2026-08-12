import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Menu, X, ChevronDown, Search, Bell,
  Leaf, TreePine, Wind, Droplets, Sun, Mountain,
  Users, BookOpen, BarChart3, Calendar, HeartHandshake,
  ArrowRight, Globe2
} from "lucide-react";
const esnLogoWhite = "/logo-white.png";
const esnLogo = "/logo.png";

const searchIndex = [
  { title: "Home", href: "/", desc: "ESN main page" },
  { title: "About ESN", href: "/about", desc: "Our story, mission, and team" },
  { title: "Projects", href: "/projects", desc: "All 470+ global projects" },
  { title: "Impact Dashboard", href: "/impact", desc: "Data, charts, and results" },
  { title: "Contact Us", href: "/contact", desc: "Get in touch with the team" },
  { title: "Donate", href: "/donate", desc: "Support our environmental mission" },
  { title: "Climate Change", href: "/thematic-areas/climate", desc: "Tackling global warming" },
  { title: "Forest Restoration", href: "/thematic-areas/forests", desc: "Reforestation programs" },
  { title: "Marine Conservation", href: "/thematic-areas/marine", desc: "Ocean protection projects" },
  { title: "Renewable Energy", href: "/thematic-areas/energy", desc: "Clean energy transitions" },
  { title: "Youth Programs", href: "/programs/youth", desc: "Empowering next generation" },
  { title: "Events & Campaigns", href: "/contact", desc: "Join our movement" },
];

type NavItem = {
  label: string;
  href: string;
  mega: boolean;
  items?: { label: string; href: string; icon: any; desc: string }[];
};

const navItems: NavItem[] = [
  { label: "Home", href: "/", mega: false },
  { label: "About", href: "/about", mega: false },
  { 
    label: "Program", 
    href: "/programs", 
    mega: true,
    items: [
      { label: "All Programs", href: "/programs", icon: Mountain, desc: "Explore all our programs" },
      { label: "Events & Calendar", href: "/events", icon: Calendar, desc: "Upcoming events and calendar" },
      { label: "Research & Policy", href: "/research", icon: BookOpen, desc: "Our research and policy work" }
    ]
  },
  {
    label: "Engagement",
    href: "/volunteer",
    mega: true,
    items: [
      { label: "Volunteer", href: "/volunteer", icon: Users, desc: "Join us as a volunteer" },
      { label: "Campus Chapters", href: "/campus-chapters", icon: BookOpen, desc: "Join or start a campus chapter" },
      { label: "Partner With Us", href: "/partner", icon: HeartHandshake, desc: "Become a partner" }
    ]
  },
  { label: "Youth", href: "/programs/youth", mega: false },
  { label: "Impact", href: "/impact", mega: false },
  { label: "Contact", href: "/contact", mega: false },
];

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const results = query.trim().length > 1
    ? searchIndex.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.desc.toLowerCase().includes(query.toLowerCase())
    )
    : [];

  const handleSelect = (href: string) => {
    navigate(href);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-[#0a1a0e]/60 backdrop-blur-md flex items-start justify-center pt-16 px-4 sm:pt-24"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: -40, scale: 0.95, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -20, scale: 0.95, filter: "blur(10px)" }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-white/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-4 px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <div className="w-12 h-12 rounded-2xl bg-[#0B5D3F]/10 flex items-center justify-center shrink-0">
            <Search size={22} className="text-[#0B5D3F]" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What are you looking for?"
            className="flex-1 text-xl sm:text-2xl text-gray-900 bg-transparent outline-none placeholder-gray-400 font-medium"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          />
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-400 uppercase tracking-widest shadow-sm">
              ESC
            </span>
            <button onClick={onClose} className="p-2.5 rounded-full hover:bg-gray-200/50 text-gray-500 transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
          {query.trim().length > 1 && results.length === 0 && (
            <div className="py-16 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-5">
                <Search size={32} className="text-gray-300" />
              </div>
              <p className="text-lg text-gray-900 font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>No results found</p>
              <p className="text-gray-500 mt-2">We couldn't find anything matching "{query}"</p>
            </div>
          )}

          {query.trim().length <= 1 && (
            <div className="p-2">
              <div className="px-3 mb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Suggested Searches</div>
              <div className="grid sm:grid-cols-2 gap-2">
                {searchIndex.slice(0, 6).map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleSelect(item.href)}
                    className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#F6FBF8] border border-transparent hover:border-[#0B5D3F]/10 transition-all text-left group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-50 group-hover:bg-[#0B5D3F]/10 flex items-center justify-center shrink-0 transition-colors">
                      <Search size={16} className="text-gray-400 group-hover:text-[#0B5D3F] transition-colors" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-800 group-hover:text-[#0B5D3F] transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{item.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.length > 0 && (
            <div className="flex flex-col gap-1 p-2">
              <div className="px-3 mb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Search Results</div>
              {results.map((item, index) => (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  key={item.href}
                  onClick={() => handleSelect(item.href)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-[#F6FBF8] border border-transparent hover:border-[#0B5D3F]/10 transition-all text-left group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 group-hover:bg-[#0B5D3F] flex items-center justify-center shrink-0 transition-all duration-300 shadow-sm group-hover:shadow-md group-hover:shadow-[#0B5D3F]/30">
                    <Globe2 size={18} className="text-gray-400 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-bold text-gray-900 group-hover:text-[#0B5D3F] transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.title}</div>
                    <div className="text-sm text-gray-500 mt-0.5 truncate">{item.desc}</div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shadow-sm">
                    <ArrowRight size={14} className="text-[#0B5D3F]" />
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveMenu(null);
  }, [location]);

  // Keyboard shortcut for search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const navBg = scrolled || !isHomePage
    ? "bg-white/95 backdrop-blur-xl shadow-lg shadow-green-900/5"
    : "bg-transparent";

  const textColor = scrolled || !isHomePage ? "text-[#0B5D3F]" : "text-white";
  const logoSrc = scrolled || !isHomePage ? esnLogo : esnLogoWhite;

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 shrink-0">
              <img src={logoSrc} alt="ESN" className="h-12 w-auto transition-all duration-300" />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.mega && setActiveMenu(item.label)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <Link
                    to={item.href}
                    className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200
                      ${textColor} hover:bg-[#0B5D3F]/10 hover:text-[#0B5D3F]
                      ${location.pathname === item.href ? "bg-[#0B5D3F]/10 text-[#0B5D3F]" : ""}
                    `}
                  >
                    {item.label}
                    {item.mega && (
                      <ChevronDown size={14} className={`transition-transform duration-200 ${activeMenu === item.label ? "rotate-180" : ""}`} />
                    )}
                  </Link>

                  <AnimatePresence>
                    {item.mega && activeMenu === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.97 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl shadow-green-900/15 border border-green-100 overflow-hidden p-2"
                      >
                        {item.items?.map((sub) => (
                          <Link
                            key={sub.label}
                            to={sub.href}
                            className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#F6FBF8] transition-all group"
                          >
                            <div className="w-9 h-9 rounded-xl bg-[#0B5D3F]/10 flex items-center justify-center shrink-0 group-hover:bg-[#0B5D3F] transition-colors">
                              <sub.icon size={16} className="text-[#0B5D3F] group-hover:text-white transition-colors" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">{sub.label}</div>
                              <div className="text-xs text-gray-500 mt-0.5">{sub.desc}</div>
                            </div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Right Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={() => setSearchOpen(true)}
                className={`flex items-center gap-2.5 px-4 py-2 rounded-full border transition-all text-sm group
                  ${scrolled || !isHomePage
                    ? "bg-gray-50 border-gray-200/60 hover:bg-gray-100 hover:border-gray-300 text-gray-500 hover:text-[#0B5D3F]"
                    : "bg-white/10 border-white/20 hover:bg-white/20 text-white/80 hover:text-white backdrop-blur-md"
                  }`}
                title="Search"
              >
                <Search size={16} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                <span className="text-xs font-medium">Search...</span>
              </button>
              <Link
                to="/donate"
                className="flex items-center gap-2 bg-[#0B5D3F] hover:bg-[#0a5237] text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-900/25"
              >
                <HeartHandshake size={16} />
                Donate
              </Link>

            </div>

            {/* Mobile: search + hamburger */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setSearchOpen(true)}
                className={`p-2 rounded-xl transition-all ${textColor}`}
              >
                <Search size={20} />
              </button>
              <button
                className={`p-2 rounded-xl transition-all ${textColor}`}
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-[70] w-full sm:w-[400px] bg-[#0a1f14]/80 backdrop-blur-3xl shadow-2xl flex flex-col border-l border-white/10"
          >
            {/* Ambient glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#4CAF50]/20 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#173B63]/20 rounded-full blur-3xl -z-10" />

            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between h-20 px-4 sm:px-6 shrink-0 border-b border-white/10">
              <Link to="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
                <img src={esnLogoWhite} alt="ESN" className="h-12 w-auto" />
              </Link>
              <button
                className="p-2.5 rounded-xl text-white bg-white/10 hover:bg-white/20 transition-all"
                onClick={() => setMobileOpen(false)}
              >
                <X size={24} />
              </button>
            </div>

            {/* Mobile Menu Content */}
            <div className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar">
              <div className="flex flex-col gap-8">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 + 0.1 }}
                  >
                    <Link
                      to={item.href}
                      onClick={(e) => {
                        if (item.mega) e.preventDefault();
                        else setMobileOpen(false);
                      }}
                      className="flex items-center justify-between text-2xl font-bold text-white group"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      {item.label}
                      {!item.mega && <ArrowRight size={20} className="text-white/20 group-hover:text-white transition-colors" />}
                    </Link>

                    {item.mega && item.items && (
                      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 pl-5 border-l-2 border-white/10">
                        {item.items.map((sub) => (
                          <Link
                            key={sub.label}
                            to={sub.href}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-4 py-3 px-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group"
                          >
                            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-[#4CAF50] shadow-inner transition-colors duration-300">
                              <sub.icon size={18} className="text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-bold text-white mb-0.5">{sub.label}</div>
                              <div className="text-xs text-white/50 leading-tight">{sub.desc}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mobile Menu Footer */}
            <div className="p-6 shrink-0 border-t border-white/10 bg-white/5 backdrop-blur-lg">
              <Link
                to="/donate"
                onClick={() => setMobileOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-[#4CAF50] hover:bg-[#43a047] text-white py-4 rounded-2xl font-bold text-lg transition-all"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                <HeartHandshake size={20} />
                Donate Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
