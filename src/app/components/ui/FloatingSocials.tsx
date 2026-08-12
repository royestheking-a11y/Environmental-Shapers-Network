import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Facebook, Instagram, Youtube, X, Share2, MessageCircle } from "lucide-react";

export function FloatingSocials() {
  const [isOpen, setIsOpen] = useState(false);

  const socials = [
    { name: "Facebook", icon: Facebook, href: "https://facebook.com", color: "hover:text-[#1877F2]", bg: "hover:bg-[#1877F2]/10" },
    { name: "Instagram", icon: Instagram, href: "https://instagram.com", color: "hover:text-[#E4405F]", bg: "hover:bg-[#E4405F]/10" },
    { name: "Youtube", icon: Youtube, href: "https://youtube.com", color: "hover:text-[#FF0000]", bg: "hover:bg-[#FF0000]/10" }
  ];

  return (
    <div className="fixed right-8 bottom-[7rem] z-50 flex flex-col items-center">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.8 }}
            className="flex flex-col gap-3 p-3 bg-white/90 backdrop-blur-md border border-gray-100 shadow-2xl rounded-[2rem] mb-4"
          >
            {socials.map((social, idx) => {
              const Icon = social.icon;
              return (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.name}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-gray-500 transition-all duration-300 ${social.color} ${social.bg}`}
                >
                  <Icon size={22} />
                </a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-500 hover:scale-110 ${
          isOpen ? "bg-white text-gray-800" : "bg-[#0B5D3F] text-white hover:shadow-[#0B5D3F]/40"
        }`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
