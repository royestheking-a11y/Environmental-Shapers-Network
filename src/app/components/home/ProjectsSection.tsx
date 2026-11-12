import { useState } from "react";
import { Link } from "react-router";
import {
  MapPin, ArrowRight, Filter, Calendar, CheckCircle2,
  Sparkles, TreePine, Users, Building2
} from "lucide-react";
import { ImageWithFallback } from "../ui/ImageWithFallback";
import { getInitialProjects, Project } from "../../pages/admin/sections/ProjectsView";
import { getInitialEvents, ESNEvent } from "../../pages/admin/sections/EventsView";
import { useFirestoreData } from "../../../lib/useFirestore";
import { resolveIcon } from "../../pages/admin/sections/ProgramsView";
import { RollingCarousel } from "../ui/RollingCarousel";

const typeColors: Record<string, string> = {
  Summit: "#0B5D3F",
  Campaign: "#4CAF50",
  Hackathon: "#173B63",
  Forum: "#1565C0",
  Delegation: "#E65100",
  Gala: "#D6A95A",
  Field: "#2E7D32",
  Webinar: "#00838F"
};

export function ProjectsSection() {
  const [activeTab, setActiveTab] = useState<"events" | "projects">("events");
  const [eventsList] = useFirestoreData<ESNEvent[]>("esn_events", getInitialEvents());
  const [projects] = useFirestoreData<Project[]>("esn_projects_admin", getInitialProjects());
  
  const [activeEventCategory, setActiveEventCategory] = useState("All");
  const [activeProjectCategory, setActiveProjectCategory] = useState("All");

  const eventCategories = ["All", "Summit", "Field", "Webinar", "Gala", "Hackathon"];
  const projectCategories = ["All", "Forest", "Ocean", "Climate", "Energy", "Community"];

  const rawEvents = eventsList && eventsList.length > 0 ? eventsList : getInitialEvents();
  const filteredEvents = activeEventCategory === "All"
    ? rawEvents
    : rawEvents.filter((e) => (e.type || "").toLowerCase() === activeEventCategory.toLowerCase());

  const filteredProjects = activeProjectCategory === "All"
    ? projects
    : projects.filter((p) => p.category === activeProjectCategory);

  return (
    <section className="py-16 bg-[#F6FBF8] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Section View Mode Switcher Pill */}
        <div className="flex items-center justify-center sm:justify-start mb-8">
          <div className="inline-flex items-center bg-white p-1.5 rounded-full border border-gray-200/80 shadow-xs gap-1.5">
            <button
              onClick={() => setActiveTab("events")}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${
                activeTab === "events"
                  ? "bg-[#0B5D3F] text-white shadow-md shadow-[#0B5D3F]/20"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/70"
              }`}
            >
              <Calendar size={14} className={activeTab === "events" ? "text-emerald-300" : "text-gray-500"} />
              Upcoming Events
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === "events" ? "bg-white/20 text-white" : "bg-emerald-100 text-[#0B5D3F]"}`}>
                {rawEvents.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${
                activeTab === "projects"
                  ? "bg-[#0B5D3F] text-white shadow-md shadow-[#0B5D3F]/20"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/70"
              }`}
            >
              <MapPin size={14} className={activeTab === "projects" ? "text-emerald-300" : "text-gray-500"} />
              Featured Projects
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === "projects" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                {projects.length}
              </span>
            </button>
          </div>
        </div>

        {/* 1. Rolling Events Carousel (Highlighted Default) */}
        {activeTab === "events" && (
          <RollingCarousel
            autoPlay={true}
            autoPlayInterval={4500}
            badge={
              <div className="inline-flex items-center gap-2 bg-[#0B5D3F]/10 text-[#0B5D3F] text-sm font-semibold px-5 py-2 rounded-full">
                <Calendar size={14} className="text-[#0B5D3F]" />
                Events & Mobilizations
              </div>
            }
            title={
              <span>
                Upcoming <span className="text-[#4CAF50]">Events</span> & Campaigns
              </span>
            }
            action={
              <Link
                to="/events"
                className="inline-flex items-center gap-2 bg-white border border-[#0B5D3F]/20 text-[#0B5D3F] px-6 py-3 rounded-full font-semibold hover:bg-[#0B5D3F] hover:text-white transition-all duration-300 self-start md:self-auto shadow-xs"
              >
                All Events & Campaigns <ArrowRight size={16} />
              </Link>
            }
            subHeader={
              <div className="flex items-center gap-2 flex-wrap">
                <Filter size={15} className="text-gray-400 mr-1" />
                {eventCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveEventCategory(cat)}
                    className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                      activeEventCategory === cat
                        ? "bg-[#0B5D3F] text-white shadow-md shadow-[#0B5D3F]/20"
                        : "bg-white text-gray-600 hover:bg-[#0B5D3F]/10 hover:text-[#0B5D3F] border border-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            }
            itemClassName="w-[88vw] sm:w-[350px] md:w-[380px] shrink-0 snap-start"
          >
            {filteredEvents.map((event) => {
              const isPast = event.status === "completed";
              const isLive = event.status === "ongoing";

              return (
                <div key={event.id} className="h-full">
                  <Link
                    to={`/events/${event.id}`}
                    className="group bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 hover:border-[#0B5D3F]/25 hover:shadow-2xl hover:shadow-[#0B5D3F]/10 transition-all duration-500 hover:-translate-y-2 h-full flex flex-col justify-between cursor-pointer"
                  >
                    <div>
                      {/* Top Badges & Status */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className="text-xs font-bold px-3 py-1 rounded-full"
                            style={{
                              backgroundColor: (typeColors[event.type] || "#0B5D3F") + "15",
                              color: typeColors[event.type] || "#0B5D3F"
                            }}
                          >
                            {event.type}
                          </span>
                          {isLive && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" /> Live Now
                            </span>
                          )}
                          {isPast && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                              <CheckCircle2 size={10} className="text-slate-600" /> Past
                            </span>
                          )}
                          {event.status === "upcoming" && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                              Upcoming
                            </span>
                          )}
                        </div>
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                          isPast ? "bg-gray-100 text-gray-600" : "bg-[#4CAF50]/10 text-[#4CAF50]"
                        }`}>
                          {isPast ? "Concluded" : `${event.registered || 0}/${event.capacity || 100} Seats`}
                        </span>
                      </div>

                      {/* Title on Top (Upore thakbe title) */}
                      <h3
                        className="font-extrabold text-gray-900 text-base sm:text-lg mb-2 group-hover:text-[#0B5D3F] transition-colors leading-snug line-clamp-2"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        {event.title}
                      </h3>

                      {/* Date & Location */}
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3 flex-wrap">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-[#4CAF50]" />
                          {event.date} · {event.time || "TBD"}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin size={13} className="text-[#4CAF50]" />
                          {event.location}
                        </span>
                      </div>

                      {/* Photo in the Middle (R majkhane thakbe Photo) */}
                      <div className="relative h-48 sm:h-52 rounded-2xl overflow-hidden my-3 border border-gray-100/90 shadow-xs bg-gray-50">
                        <ImageWithFallback
                          src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1400"}
                          alt={event.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute bottom-3 left-3 text-white text-[11px] font-medium flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full">
                          <Sparkles size={11} className="text-emerald-300" />
                          <span>{event.mode || "Hybrid"} Mode</span>
                        </div>
                      </div>

                      {/* Written Description below photo */}
                      {event.description && (
                        <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4">
                          {event.description}
                        </p>
                      )}
                    </div>

                    {/* Footer Row */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        {event.impactTrees ? (
                          <span className="flex items-center gap-1 text-[#0B5D3F] font-semibold">
                            <TreePine size={12} /> {(event.impactTrees || 0).toLocaleString()} trees
                          </span>
                        ) : event.speaker ? (
                          <span className="truncate max-w-[170px] text-gray-600 font-medium">
                            Speaker: {event.speaker}
                          </span>
                        ) : (
                          <span className="text-[#4CAF50] font-semibold">
                            {event.status === "completed" ? "Concluded" : "Registration Open"}
                          </span>
                        )}
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs text-[#0B5D3F] font-bold group-hover:underline shrink-0">
                        View Event <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                </div>
              );
            })}
          </RollingCarousel>
        )}

        {/* 2. Rolling Projects Carousel */}
        {activeTab === "projects" && (
          <RollingCarousel
            autoPlay={true}
            autoPlayInterval={5000}
            badge={
              <div className="inline-flex items-center gap-2 bg-[#0B5D3F]/10 text-[#0B5D3F] text-sm font-semibold px-5 py-2 rounded-full">
                <MapPin size={14} />
                Our Projects
              </div>
            }
            title={
              <span>
                Featured <span className="text-[#4CAF50]">Projects</span>
              </span>
            }
            action={
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 bg-white border border-[#0B5D3F]/20 text-[#0B5D3F] px-6 py-3 rounded-full font-semibold hover:bg-[#0B5D3F] hover:text-white transition-all duration-300 self-start md:self-auto"
              >
                All Projects <ArrowRight size={16} />
              </Link>
            }
            subHeader={
              <div className="flex items-center gap-2 flex-wrap">
                <Filter size={15} className="text-gray-400 mr-1" />
                {projectCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveProjectCategory(cat)}
                    className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                      activeProjectCategory === cat
                        ? "bg-[#0B5D3F] text-white shadow-lg shadow-[#0B5D3F]/20"
                        : "bg-white text-gray-600 hover:bg-[#0B5D3F]/10 hover:text-[#0B5D3F] border border-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            }
            itemClassName="w-[88vw] sm:w-[350px] md:w-[380px] shrink-0 snap-start"
          >
            {filteredProjects.map((project) => {
              const Icon = resolveIcon("Globe");
              return (
                <div key={project.id} className="h-full">
                  <Link
                    to={`/projects/${project.id}`}
                    className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-[#0B5D3F]/20 hover:shadow-2xl hover:shadow-[#0B5D3F]/10 transition-all duration-400 hover:-translate-y-1.5 cursor-pointer h-full flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-48 overflow-hidden">
                        <ImageWithFallback
                          src={project.img}
                          alt={project.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-600"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute top-4 left-4">
                          <span
                            className={`text-white text-xs font-bold px-3 py-1.5 rounded-full ${project.status === "Active" ? "bg-[#4CAF50]" : "bg-gray-500"}`}
                          >
                            {project.status}
                          </span>
                        </div>
                        <div className="absolute top-4 right-4">
                          <span className="bg-[#D6A95A] text-white text-xs font-bold px-2.5 py-1 rounded-full">{project.theme}</span>
                        </div>
                        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-white text-xs font-medium">
                          <MapPin size={12} />
                          {project.country}
                        </div>
                      </div>

                      <div className="p-6 pb-2">
                        <div className="flex items-start gap-3 mb-4">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: project.color + "15" }}
                          >
                            <Icon size={18} style={{ color: project.color }} />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-base mb-0.5 group-hover:text-[#0B5D3F] transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                              {project.name}
                            </h4>
                            <div className="text-xs text-gray-400">{project.startDate}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-2">
                      <div className="flex items-center justify-between py-3 border-t border-gray-50">
                        <div className="text-sm font-bold" style={{ color: project.color }}>
                          {project.impact}
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs text-[#0B5D3F] font-bold group-hover:underline">
                          View Details <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </RollingCarousel>
        )}
      </div>
    </section>
  );
}
