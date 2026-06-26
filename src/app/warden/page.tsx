"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2, LogOut, Bell, Utensils, MessageSquareWarning, Trash2, Users } from "lucide-react";
import { useMockData } from "@/lib/MockDataContext";
import { cn } from "@/lib/utils";

export default function WardenDashboard() {
  const router = useRouter();
  const { user, users, rooms, logout, addNotice, updateMenu, menu, complaints, updateComplaintStatus, deleteStudent } = useMockData();
  const [mounted, setMounted] = useState(false);

  // Form states
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeContent, setNoticeContent] = useState("");
  
  const [menuDay, setMenuDay] = useState("Monday");
  const [menuMeal, setMenuMeal] = useState("Breakfast");
  const [menuDesc, setMenuDesc] = useState("");

  useEffect(() => {
    setMounted(true);
    if (!user) {
      router.push("/login");
    } else if (user.role !== "warden" && user.role !== "chief_warden") {
      router.push("/");
    }
  }, [user, router]);

  if (!mounted || !user || (user.role !== "warden" && user.role !== "chief_warden")) return null;

  const students = users.filter(u => u.role === "student");

  const handlePostNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    await addNotice(noticeTitle, noticeContent);
    setNoticeTitle(""); setNoticeContent("");
  };

  const handleUpdateMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateMenu(menuDay, menuMeal, menuDesc);
    setMenuDesc("");
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-title-md">
      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-outline-variant/30 bg-surface-dim/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="text-primary" size={20} />
            <span className="font-headline-md text-headline-md font-bold">Warden Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container/50 border border-outline-variant/50 text-body-sm">
              <span className="w-2 h-2 rounded-full bg-primary" />
              {user.name} ({user.role === "chief_warden" ? "Chief Warden" : "Warden"})
            </div>
            <button 
              onClick={() => { logout(); router.push("/"); }}
              className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-all"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="font-headline-lg text-headline-lg font-bold mb-2">Hostel Management</h1>
          <p className="text-on-surface-variant text-body-lg">Manage notices, mess menu, and student complaints.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-bento-gap">
          {/* Post Notice Section */}
          <div className="bento-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary-container/20 text-primary rounded-lg">
                <Bell size={20} />
              </div>
              <h2 className="font-headline-md text-headline-md font-bold">Post Notice</h2>
            </div>
            <form onSubmit={handlePostNotice} className="space-y-4">
              <input 
                type="text" placeholder="Notice Title" required value={noticeTitle} onChange={e => setNoticeTitle(e.target.value)}
                className="w-full bg-surface-container-highest border border-outline-variant rounded-lg px-4 py-2 text-body-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all text-on-surface placeholder:text-on-surface-variant"
              />
              <textarea 
                placeholder="Notice Content" required value={noticeContent} onChange={e => setNoticeContent(e.target.value)} rows={4}
                className="w-full bg-surface-container-highest border border-outline-variant rounded-lg px-4 py-2 text-body-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all resize-none text-on-surface placeholder:text-on-surface-variant custom-scrollbar"
              />
              <button type="submit" className="w-full bg-primary-container/20 text-primary hover:bg-primary-container/30 font-bold py-2 rounded-lg text-body-sm transition-all">
                Publish Notice
              </button>
            </form>
          </div>

          {/* Update Menu Section */}
          <div className="bento-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-tertiary-container/20 text-tertiary rounded-lg">
                <Utensils size={20} />
              </div>
              <h2 className="font-headline-md text-headline-md font-bold">Mess Menu</h2>
            </div>
            <form onSubmit={handleUpdateMenu} className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <select value={menuDay} onChange={e => setMenuDay(e.target.value)} className="w-full bg-surface-container-highest border border-outline-variant rounded-lg px-4 py-2 text-body-sm focus:border-tertiary focus:outline-none focus:ring-1 focus:ring-tertiary transition-all text-on-surface">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select value={menuMeal} onChange={e => setMenuMeal(e.target.value)} className="w-full bg-surface-container-highest border border-outline-variant rounded-lg px-4 py-2 text-body-sm focus:border-tertiary focus:outline-none focus:ring-1 focus:ring-tertiary transition-all text-on-surface">
                  {["Breakfast", "Lunch", "Dinner"].map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <textarea 
                placeholder="Menu items description..." required value={menuDesc} onChange={e => setMenuDesc(e.target.value)} rows={3}
                className="w-full bg-surface-container-highest border border-outline-variant rounded-lg px-4 py-2 text-body-sm focus:border-tertiary focus:outline-none focus:ring-1 focus:ring-tertiary transition-all resize-none text-on-surface placeholder:text-on-surface-variant custom-scrollbar"
              />
              <button type="submit" className="w-full bg-tertiary-container/20 text-tertiary hover:bg-tertiary-container/30 font-bold py-2 rounded-lg text-body-sm transition-all">
                Update Menu
              </button>
            </form>
          </div>

          {/* Complaints Section */}
          <div className="bento-card flex flex-col h-[500px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-error-container/20 text-error rounded-lg">
                <MessageSquareWarning size={20} />
              </div>
              <h2 className="font-headline-md text-headline-md font-bold">Complaints</h2>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
              {complaints.length === 0 ? (
                <p className="text-on-surface-variant text-body-sm text-center mt-4">No complaints.</p>
              ) : (
                complaints.map(c => (
                  <div key={c.id} className="p-4 bg-surface-container-low border border-outline-variant/50 rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-label-caps font-bold text-on-surface-variant bg-surface-container-highest px-2 py-1 rounded-md">{c.category}</span>
                      <select 
                        value={c.status} onChange={(e) => updateComplaintStatus(c.id, e.target.value as any)}
                        className={cn(
                          "text-label-caps font-bold px-2 py-1 rounded-md bg-transparent border cursor-pointer focus:outline-none",
                          c.status === "Open" ? "text-error border-error/30" : 
                          c.status === "In Progress" ? "text-tertiary border-tertiary/30" : "text-primary border-primary/30"
                        )}
                      >
                        <option className="bg-surface-container-highest text-on-surface" value="Open">Open</option>
                        <option className="bg-surface-container-highest text-on-surface" value="In Progress">In Progress</option>
                        <option className="bg-surface-container-highest text-on-surface" value="Resolved">Resolved</option>
                      </select>
                    </div>
                    <p className="text-body-sm font-bold text-on-surface mb-1">{c.title}</p>
                    <p className="text-body-sm text-on-surface-variant mb-2">{c.details}</p>
                    <p className="text-label-caps text-outline">By {c.studentName} • Room {c.room}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Manage Students Section */}
        <div className="mt-8 bento-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-accent-violet/20 text-accent-violet rounded-lg">
              <Users size={20} />
            </div>
            <h2 className="font-headline-md text-headline-md font-bold">Manage Students</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.length === 0 ? (
              <p className="text-on-surface-variant text-body-sm col-span-full">No students registered yet.</p>
            ) : (
              students.map(s => (
                <div key={s.id} className="p-4 bg-surface-container-low border border-outline-variant/50 rounded-xl flex items-center justify-between group">
                  <div>
                    <p className="text-body-sm font-bold text-on-surface">{s.name}</p>
                    <p className="text-label-caps text-on-surface-variant mt-1">{s.email}</p>
                    {s.roomId ? (
                      <p className="text-label-caps text-primary mt-1">Room: {rooms.find(r => r.id === s.roomId)?.roomNumber}</p>
                    ) : (
                      <p className="text-label-caps text-tertiary mt-1">Unassigned</p>
                    )}
                  </div>
                  <button 
                    onClick={() => deleteStudent(s.id)}
                    className="p-2 text-error hover:text-error hover:bg-error-container/20 rounded-md transition-all opacity-0 group-hover:opacity-100"
                    title="Delete Student"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
