import { useParams, Link, Navigate } from "react-router";
import { useFirestoreData } from "../../lib/useFirestore";
import { getInitialEvents, ESNEvent } from "./admin/sections/EventsView";
import { PageHero } from "../components/ui/PageHero";
import { Calendar, MapPin, Users, Clock, Video, Globe2, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Breadcrumb } from "../components/ui/Breadcrumb";

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const [events] = useFirestoreData<ESNEvent[]>("esn_events", getInitialEvents());
  
  const event = events?.find(e => e.id.toString() === id);

  if (!event) {
    return <Navigate to="/events" replace />;
  }

  const isVirtual = event.mode === "Virtual";

  return (
    <div className="bg-[#F6FBF8] min-h-screen">
      <PageHero 
        title={event.title} 
        sub={`${event.type} • ${event.mode}`} 
        image={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1400"} 
      />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <Breadcrumb current={event.title} parents={[{ label: "Events", href: "/events" }]} />
        
        <div className="grid lg:grid-cols-[1fr_350px] gap-12 mt-8">
          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-bold text-[#0B5D3F] mb-6">About this Event</h2>
              <div className="prose prose-lg text-gray-600 max-w-none">
                <p className="whitespace-pre-line">{event.description}</p>
              </div>
              
              {event.speaker && (
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Keynote / Speaker</h3>
                  <p className="text-gray-700">{event.speaker}</p>
                </div>
              )}

              {(event.projectName || event.campaignName || event.initiativeTitle) && (
                <div className="mt-8 p-6 bg-[#F6FBF8] rounded-2xl border border-[#4CAF50]/15">
                  <h3 className="text-lg font-bold text-[#0B5D3F] mb-4">Related Initiatives</h3>
                  <div className="space-y-3 text-sm">
                    {event.projectName && (
                      <div className="flex gap-2">
                        <span className="font-semibold text-gray-700">Project:</span>
                        <Link to="/projects" className="text-[#4CAF50] hover:underline">{event.projectName}</Link>
                      </div>
                    )}
                    {event.campaignName && (
                      <div className="flex gap-2">
                        <span className="font-semibold text-gray-700">Campaign:</span>
                        <Link to="/campaigns" className="text-[#4CAF50] hover:underline">{event.campaignName}</Link>
                      </div>
                    )}
                    {event.initiativeTitle && (
                      <div className="flex gap-2">
                        <span className="font-semibold text-gray-700">Program Area:</span>
                        <span className="text-gray-600">{event.initiativeTitle}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm sticky top-32">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Event Details</h3>
              
              <div className="space-y-5 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#4CAF50]/10 flex items-center justify-center shrink-0">
                    <Calendar size={20} className="text-[#0B5D3F]" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 font-medium">Date</div>
                    <div className="text-gray-900 font-semibold">{event.date}</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#4CAF50]/10 flex items-center justify-center shrink-0">
                    <Clock size={20} className="text-[#0B5D3F]" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 font-medium">Time</div>
                    <div className="text-gray-900 font-semibold">{event.time}</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#4CAF50]/10 flex items-center justify-center shrink-0">
                    {isVirtual ? <Video size={20} className="text-[#0B5D3F]" /> : <MapPin size={20} className="text-[#0B5D3F]" />}
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 font-medium">{isVirtual ? 'Link' : 'Location'}</div>
                    <div className="text-gray-900 font-semibold">{event.location}</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#4CAF50]/10 flex items-center justify-center shrink-0">
                    <Users size={20} className="text-[#0B5D3F]" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 font-medium">Availability</div>
                    <div className="text-gray-900 font-semibold">
                      {event.registered} / {event.capacity} registered
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#4CAF50]/10 flex items-center justify-center shrink-0">
                    <Globe2 size={20} className="text-[#0B5D3F]" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 font-medium">Status</div>
                    <div className="capitalize text-gray-900 font-semibold">{event.status}</div>
                  </div>
                </div>
              </div>

              {event.status === 'upcoming' ? (
                <Link
                  to={`/contact?subject=Registration%20for%20${encodeURIComponent(event.title)}&event=${encodeURIComponent(event.title)}`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#0B5D3F] hover:bg-[#0a4d33] text-white px-6 py-4 rounded-xl font-bold transition-all hover:scale-[1.02] shadow-lg shadow-[#0B5D3F]/20"
                >
                  Register Now <ArrowRight size={18} />
                </Link>
              ) : (
                <div className="w-full text-center p-4 rounded-xl bg-gray-100 text-gray-600 font-semibold capitalize">
                  Event {event.status}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
