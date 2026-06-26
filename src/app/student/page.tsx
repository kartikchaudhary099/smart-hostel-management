"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2, LogOut, Bell, Utensils, MessageSquareWarning, Star, PenLine, CheckCircle, XCircle, Clock } from "lucide-react";
import { useMockData } from "@/lib/MockDataContext";
import { cn } from "@/lib/utils";

export default function StudentDashboard() {
  const router = useRouter();
  const { user, logout, notices, menu, complaints, addComplaint, foodReviews, addFoodReview, nameUpdates, requestNameUpdate } = useMockData();
  const [mounted, setMounted] = useState(false);

  // Form states
  const [cCategory, setCCategory] = useState("Maintenance");
  const [cTitle, setCTitle] = useState("");
  const [cDetails, setCDetails] = useState("");
  
  const [fRating, setFRating] = useState(5);
  const [fReview, setFReview] = useState("");

  // Name update state
  const [newName, setNewName] = useState("");
  const [nameMsg, setNameMsg] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    setMounted(true);
    if (!user) {
      router.push("/login");
    } else if (user.role !== "student") {
      router.push("/");
    }
  }, [user, router]);

  if (!mounted || !user || user.role !== "student") return null;

  const handleLogComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    await addComplaint(cCategory, cTitle, cDetails);
    setCTitle(""); setCDetails("");
  };

  const handleReviewFood = async (e: React.FormEvent) => {
    e.preventDefault();
    await addFoodReview(fRating, fReview);
    setFReview(""); setFRating(5);
  };

  const handleNameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const result = await requestNameUpdate(newName.trim());
    setNameMsg({ text: result.message, ok: result.success });
    if (result.success) setNewName("");
  };

  const myComplaints = complaints.filter(c => c.studentId === user.id);
  const myNameRequests = nameUpdates.filter(n => n.studentId === user.id);
  const hasPendingNameRequest = myNameRequests.some(n => n.status === "Pending");

  return (
    <div className="min-h-screen bg-background text-on-surface font-title-md">
      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-outline-variant/30 bg-surface-dim/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="text-primary" size={20} />
            <span className="font-headline-md text-headline-md font-bold">Student Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container/50 border border-outline-variant/50 text-body-sm">
              <span className="w-2 h-2 rounded-full bg-primary" />
              {user.name} ({user.roomId ? (user as any).room?.roomNumber || user.roomId : "Unassigned"})
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
          <h1 className="font-headline-lg text-headline-lg font-bold mb-2">Welcome back, {user.name.split(' ')[0]}</h1>
          <p className="text-on-surface-variant text-body-lg">View notices, check the menu, and manage your complaints.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-bento-gap">
          {/* Notices Section */}
          <div className="bento-card flex flex-col h-[400px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary-container/20 text-primary rounded-lg">
                <Bell size={20} />
              </div>
              <h2 className="font-headline-md text-headline-md font-bold">Notice Board</h2>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
              {notices.length === 0 ? (
                <p className="text-on-surface-variant text-body-sm text-center mt-4">No notices yet.</p>
              ) : (
                notices.map(n => (
                  <div key={n.id} className="p-4 bg-surface-container-low border border-outline-variant/50 rounded-xl">
                    <p className="text-body-sm font-bold text-on-surface mb-1">{n.title}</p>
                    <p className="text-body-sm text-on-surface-variant mb-2">{n.content}</p>
                    <p className="text-label-caps text-outline text-right">- {n.authorName}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Menu & Review Section */}
          <div className="bento-card flex flex-col h-[400px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-tertiary-container/20 text-tertiary rounded-lg">
                <Utensils size={20} />
              </div>
              <h2 className="font-headline-md text-headline-md font-bold">Food Menu & Reviews</h2>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
              <div>
                <h3 className="text-body-sm font-bold text-on-surface-variant mb-3">Today's Menu Overview</h3>
                <div className="space-y-2">
                  {menu.slice(0,3).map(m => (
                    <div key={m.id} className="text-body-sm flex gap-4 p-2 bg-surface-container-low rounded-lg border border-outline-variant/50">
                      <span className="w-20 text-on-surface-variant font-bold">{m.meal}</span>
                      <span className="text-on-surface">{m.description}</span>
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleReviewFood} className="border-t border-outline-variant/50 pt-4 space-y-3">
                <h3 className="text-body-sm font-bold text-on-surface-variant flex items-center gap-2"><Star size={14} className="text-tertiary" /> Review Food</h3>
                <div className="flex items-center gap-2">
                  <span className="text-label-caps text-on-surface-variant">Rating:</span>
                  {[1,2,3,4,5].map(r => (
                    <button key={r} type="button" onClick={() => setFRating(r)} className={cn("text-lg", fRating >= r ? "text-tertiary" : "text-surface-container-highest")}>
                      ★
                    </button>
                  ))}
                </div>
                <input 
                  type="text" placeholder="Your review..." required value={fReview} onChange={e => setFReview(e.target.value)}
                  className="w-full bg-surface-container-highest border border-outline-variant rounded-lg px-4 py-2 text-body-sm focus:border-tertiary focus:outline-none focus:ring-1 focus:ring-tertiary transition-all text-on-surface placeholder:text-on-surface-variant"
                />
                <button type="submit" className="w-full bg-tertiary-container/20 text-tertiary hover:bg-tertiary-container/30 font-bold py-2 rounded-lg text-body-sm transition-all">
                  Submit Review
                </button>
              </form>
            </div>
          </div>

          {/* Complaints Section */}
          <div className="bento-card flex flex-col h-[400px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-error-container/20 text-error rounded-lg">
                <MessageSquareWarning size={20} />
              </div>
              <h2 className="font-headline-md text-headline-md font-bold">My Complaints</h2>
            </div>
            
            <form onSubmit={handleLogComplaint} className="space-y-3 mb-4 pb-4 border-b border-outline-variant/50">
              <select value={cCategory} onChange={e => setCCategory(e.target.value)} className="w-full bg-surface-container-highest border border-outline-variant rounded-lg px-4 py-2 text-body-sm focus:border-error focus:outline-none focus:ring-1 focus:ring-error transition-all text-on-surface">
                <option value="Maintenance">Maintenance</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Internet">Internet</option>
                <option value="Food Quality">Food Quality</option>
                <option value="Other">Other</option>
              </select>
              <input 
                type="text" placeholder="Title" required value={cTitle} onChange={e => setCTitle(e.target.value)}
                className="w-full bg-surface-container-highest border border-outline-variant rounded-lg px-4 py-2 text-body-sm focus:border-error focus:outline-none focus:ring-1 focus:ring-error transition-all text-on-surface placeholder:text-on-surface-variant"
              />
              <textarea 
                placeholder="Details..." required value={cDetails} onChange={e => setCDetails(e.target.value)} rows={2}
                className="w-full bg-surface-container-highest border border-outline-variant rounded-lg px-4 py-2 text-body-sm focus:border-error focus:outline-none focus:ring-1 focus:ring-error transition-all resize-none text-on-surface placeholder:text-on-surface-variant custom-scrollbar"
              />
              <button type="submit" className="w-full bg-error-container/20 text-error hover:bg-error-container/30 font-bold py-2 rounded-lg text-body-sm transition-all">
                Log Complaint
              </button>
            </form>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {myComplaints.length === 0 ? (
                <p className="text-on-surface-variant text-body-sm text-center">No complaints logged.</p>
              ) : (
                myComplaints.map(c => (
                  <div key={c.id} className="p-3 bg-surface-container-low border border-outline-variant/50 rounded-xl flex flex-col gap-1">
                    <div className="flex justify-between items-start">
                      <span className="text-label-caps font-bold text-on-surface">{c.title}</span>
                      <span className={cn("text-label-caps font-bold px-1.5 py-0.5 rounded", 
                        c.status === "Open" ? "bg-error-container/20 text-error" : 
                        c.status === "In Progress" ? "bg-tertiary-container/20 text-tertiary" : "bg-primary-container/20 text-primary"
                      )}>{c.status}</span>
                    </div>
                    <span className="text-label-caps text-outline">{c.category}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Name Update Request Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-bento-gap">
          <div className="bento-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-accent-violet/20 text-accent-violet rounded-lg">
                <PenLine size={20} />
              </div>
              <h2 className="font-headline-md text-headline-md font-bold">Request Name Correction</h2>
            </div>

            {hasPendingNameRequest ? (
              <div className="flex items-center gap-3 p-4 bg-tertiary-container/20 border border-tertiary/20 rounded-xl text-tertiary text-body-sm font-bold">
                <Clock size={16} />
                <span>You have a pending name update request. Please wait for approval.</span>
              </div>
            ) : (
              <form onSubmit={handleNameUpdate} className="space-y-4">
                <div>
                  <label className="text-label-caps text-on-surface-variant block mb-1.5 font-bold">Current Name</label>
                  <p className="text-body-sm font-bold text-on-surface bg-surface-container-low border border-outline-variant/50 rounded-lg px-4 py-2">{user.name}</p>
                </div>
                <div>
                  <label className="text-label-caps text-on-surface-variant block mb-1.5 font-bold">Corrected Name</label>
                  <input
                    type="text"
                    placeholder="Enter correct spelling of your name"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    required
                    className="w-full bg-surface-container-highest border border-outline-variant rounded-lg px-4 py-2 text-body-sm focus:border-accent-violet focus:outline-none focus:ring-1 focus:ring-accent-violet transition-all text-on-surface placeholder:text-on-surface-variant"
                  />
                </div>
                {nameMsg && (
                  <div className={cn("flex items-center gap-2 text-label-caps p-2 rounded border font-bold", nameMsg.ok ? "bg-primary-container/10 border-primary/20 text-primary" : "bg-error-container/10 border-error/20 text-error")}>
                    {nameMsg.ok ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    {nameMsg.text}
                  </div>
                )}
                <button type="submit" className="w-full bg-accent-violet/20 text-accent-violet hover:bg-accent-violet/30 font-bold py-2 rounded-lg text-body-sm transition-all">
                  Submit Request
                </button>
              </form>
            )}
          </div>

          {/* My Name Update History */}
          <div className="bento-card">
            <h2 className="font-headline-md text-headline-md font-bold mb-6">My Name Request History</h2>
            <div className="space-y-3 custom-scrollbar overflow-y-auto max-h-[300px] pr-2">
              {myNameRequests.length === 0 ? (
                <p className="text-on-surface-variant text-body-sm text-center py-4">No name update requests yet.</p>
              ) : (
                myNameRequests.map(req => (
                  <div key={req.id} className="p-3 bg-surface-container-low border border-outline-variant/50 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-body-sm text-on-surface font-bold">{req.newName}</p>
                      <p className="text-label-caps text-outline mt-0.5">{new Date(req.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={cn("text-label-caps font-bold px-2 py-1 rounded-full", 
                      req.status === "Pending" ? "bg-tertiary-container/20 text-tertiary" :
                      req.status === "Approved" ? "bg-primary-container/20 text-primary" : "bg-error-container/20 text-error"
                    )}>
                      {req.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
