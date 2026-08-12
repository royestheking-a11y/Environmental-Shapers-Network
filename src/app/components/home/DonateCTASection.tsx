import { Link } from "react-router";
import { HeartHandshake } from "lucide-react";

export function DonateCTASection() {
  return (
    <section className="py-12 flex justify-center items-center px-4 relative z-10">
      <div className="w-full max-w-6xl bg-gradient-to-r from-[#0A3D2A] to-[#0f2845] rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl overflow-hidden relative">
        
        {/* Decorative subtle background shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#4CAF50]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10 text-center md:text-left">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10 shadow-inner backdrop-blur-sm">
            <HeartHandshake size={32} className="text-[#4CAF50]" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-white text-2xl md:text-3xl font-bold mb-3 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Make a Difference Today
            </h3>
            <p className="text-white/70 text-sm md:text-base max-w-xl leading-relaxed">
              100% of your donation goes directly to environmental projects. We provide the platform, tools, and global network to turn your vision into action.
            </p>
          </div>
        </div>
        
        <div className="shrink-0 relative z-10 w-full md:w-auto">
          <Link
            to="/donate"
            className="flex items-center justify-center w-full md:w-auto bg-[#4CAF50] hover:bg-[#43a047] text-white font-bold py-4 px-8 rounded-full shadow-[0_8px_30px_rgb(76,175,80,0.3)] hover:shadow-[0_8px_30px_rgb(76,175,80,0.5)] transition-all duration-300 hover:-translate-y-1"
          >
            Donate Now
          </Link>
        </div>

      </div>
    </section>
  );
}
