import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Mail, Eye, Trash2, X, CheckCircle2 } from "lucide-react";
import { useFirestoreData, saveFirestoreData } from "../../../../lib/useFirestore";

export function MessagesView() {
  const [messages, setMessages, loading] = useFirestoreData<any[]>("esn_messages", []);
  const [search, setSearch] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  const save = async (updated: any[]) => {
    setMessages(updated);
    await saveFirestoreData("esn_messages", updated);
  };

  const markRead = (id: number) => {
    save(messages.map((m: any) => (m.id === id ? { ...m, status: "read" } : m)));
  };

  const deleteMessage = (id: number) => {
    if (confirm("Are you sure you want to delete this message?")) {
      save(messages.filter((m: any) => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
    }
  };

  const filtered = messages.filter((m: any) =>
    (m.firstName + " " + m.lastName).toLowerCase().includes(search.toLowerCase()) ||
    m.subject.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-7">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Messages</h3>
          <p className="text-sm text-gray-400 mt-0.5">Manage contact form submissions</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-50 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F6FBF8] text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="text-left px-5 py-3.5">Name</th>
                <th className="text-left px-4 py-3.5">Subject</th>
                <th className="text-left px-4 py-3.5">Date</th>
                <th className="text-left px-4 py-3.5">Status</th>
                <th className="text-right px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m: any) => (
                <motion.tr
                  key={m.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`border-t border-gray-50 cursor-pointer transition-colors ${m.status === "unread" ? "bg-[#0B5D3F]/5 font-semibold" : "hover:bg-[#F6FBF8]/60 text-gray-600"}`}
                  onClick={() => { setSelectedMessage(m); if (m.status === "unread") markRead(m.id); }}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#4CAF50]/20 to-[#0B5D3F]/20 flex items-center justify-center text-xs font-black text-[#0B5D3F]">
                        {m.firstName?.charAt(0) || "U"}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-800">{m.firstName} {m.lastName}</div>
                        <div className="text-xs text-gray-400 font-normal">{m.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm">{m.subject}</td>
                  <td className="px-4 py-4 text-xs text-gray-500">{new Date(m.date).toLocaleDateString()}</td>
                  <td className="px-4 py-4">
                    {m.status === "unread" ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-500">
                        Unread
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
                        <CheckCircle2 size={11} /> Read
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteMessage(m.id); }}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400 text-sm">No messages found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMessage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Message Details</h4>
                <button onClick={() => setSelectedMessage(null)} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                  <X size={16} />
                </button>
              </div>
              <div className="flex flex-col gap-4">
                <div className="bg-[#F6FBF8] p-5 rounded-2xl">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="font-bold text-gray-900">{selectedMessage.firstName} {selectedMessage.lastName}</div>
                      <div className="text-sm text-[#0B5D3F]">{selectedMessage.email}</div>
                      {selectedMessage.organization && <div className="text-xs text-gray-500 mt-1">{selectedMessage.organization}</div>}
                    </div>
                    <div className="text-xs text-gray-400">{new Date(selectedMessage.date).toLocaleString()}</div>
                  </div>
                  <div className="font-semibold text-gray-800 mb-2 border-t border-gray-200 pt-4">Enquiry Type: {selectedMessage.subject}</div>
                  <div className="text-gray-600 text-sm whitespace-pre-wrap">{selectedMessage.message}</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
