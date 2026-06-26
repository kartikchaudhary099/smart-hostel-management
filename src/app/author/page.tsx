"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Building2, LogOut, ShieldAlert, Plus, Users, Crown, Trash2, Edit2, Check, X } from "lucide-react";
import { useMockData } from "@/lib/MockDataContext";
import { cn } from "@/lib/utils";

export default function AuthorDashboard() {
  const router = useRouter();
  const { user, users, logout, addChiefWarden, addWarden, updateWardenEmail, deleteWarden, deleteChiefWarden } = useMockData();
  const [mounted, setMounted] = useState(false);

  // Form states
  const [cwName, setCwName] = useState("");
  const [cwEmail, setCwEmail] = useState("");
  const [cwPass, setCwPass] = useState("");
  
  const [wName, setWName] = useState("");
  const [wEmail, setWEmail] = useState("");
  const [wPass, setWPass] = useState("");
  const [wError, setWError] = useState("");

  const [editingWardenId, setEditingWardenId] = useState<string | null>(null);
  const [editingEmail, setEditingEmail] = useState("");

  useEffect(() => {
    setMounted(true);
    if (!user) {
      router.push("/login");
    } else if (user.role !== "author") {
      router.push("/");
    }
  }, [user, router]);

  if (!mounted || !user || user.role !== "author") return null;

  const chiefWarden = users.find(u => u.role === "chief_warden");
  const wardens = users.filter(u => u.role === "warden");

  const handleAddChiefWarden = async (e: React.FormEvent) => {
    e.preventDefault();
    await addChiefWarden(cwName, cwEmail, cwPass);
    setCwName(""); setCwEmail(""); setCwPass("");
  };

  const handleAddWarden = async (e: React.FormEvent) => {
    e.preventDefault();
    setWError("");
    const success = await addWarden(wName, wEmail, wPass);
    if (success) {
      setWName(""); setWEmail(""); setWPass("");
    } else {
      setWError("Maximum 2 Normal Wardens allowed.");
    }
  };

  const handleUpdateEmail = async (id: string) => {
    if (!editingEmail) return;
    await updateWardenEmail(id, editingEmail);
    setEditingWardenId(null);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-title-md">
      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-outline-variant/30 bg-surface-dim/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="text-primary" size={20} />
            <span className="font-headline-md text-headline-md font-bold">Author Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container/50 border border-outline-variant/50 text-body-sm">
              <span className="w-2 h-2 rounded-full bg-primary" />
              {user.name}
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
          <h1 className="font-headline-lg text-headline-lg font-bold mb-2">Hostel Administration</h1>
          <p className="text-on-surface-variant text-body-lg">Manage Chief Warden and Normal Wardens from here.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-bento-gap">
          {/* Chief Warden Section */}
          <div className="space-y-6">
            <div className="bento-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-accent-violet/20 text-accent-violet rounded-lg">
                  <Crown size={20} />
                </div>
                <h2 className="font-headline-md text-headline-md font-bold">Chief Warden</h2>
              </div>

              {chiefWarden ? (
                <div className="p-4 bg-surface-container-low border border-outline-variant/50 rounded-xl flex flex-col gap-2 group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-on-surface font-bold text-body-sm">{chiefWarden.name}</p>
                      {editingWardenId === chiefWarden.id ? (
                        <div className="flex items-center gap-2 mt-1">
                          <input 
                            type="email" 
                            value={editingEmail} 
                            onChange={(e) => setEditingEmail(e.target.value)}
                            className="bg-surface-container-highest border border-outline-variant rounded px-2 py-1 text-body-sm focus:border-accent-violet focus:outline-none focus:ring-1 focus:ring-accent-violet text-on-surface w-48"
                          />
                          <button onClick={() => handleUpdateEmail(chiefWarden.id)} className="text-primary hover:text-primary-fixed"><Check size={16}/></button>
                          <button onClick={() => setEditingWardenId(null)} className="text-error hover:text-error-container"><X size={16}/></button>
                        </div>
                      ) : (
                        <p className="text-on-surface-variant text-label-caps mt-1">{chiefWarden.email}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => { setEditingWardenId(chiefWarden.id); setEditingEmail(chiefWarden.email); }}
                        className="hidden group-hover:flex p-1.5 text-on-surface-variant hover:text-accent-violet hover:bg-accent-violet/10 rounded-md transition-all"
                        title="Edit Email"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => deleteChiefWarden(chiefWarden.id)}
                        className="hidden group-hover:flex p-1.5 text-error hover:text-error-container hover:bg-error-container/20 rounded-md transition-all"
                        title="Remove Chief Warden"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-label-caps text-primary mt-1">Currently Assigned</p>
                </div>
              ) : (
                <p className="text-on-surface-variant text-body-sm italic mb-4">No Chief Warden assigned yet.</p>
              )}

              {!chiefWarden && (
                <form onSubmit={handleAddChiefWarden} className="mt-6 space-y-4 border-t border-outline-variant/30 pt-6">
                  <h3 className="text-body-sm font-bold text-on-surface-variant">Assign Chief Warden</h3>
                  <input 
                    type="text" placeholder="Name" required value={cwName} onChange={e => setCwName(e.target.value)}
                    className="w-full bg-surface-container-highest border border-outline-variant rounded-lg px-4 py-2 text-body-sm focus:border-accent-violet focus:outline-none focus:ring-1 focus:ring-accent-violet transition-all text-on-surface placeholder:text-on-surface-variant"
                  />
                  <input 
                    type="email" placeholder="Email" required value={cwEmail} onChange={e => setCwEmail(e.target.value)}
                    className="w-full bg-surface-container-highest border border-outline-variant rounded-lg px-4 py-2 text-body-sm focus:border-accent-violet focus:outline-none focus:ring-1 focus:ring-accent-violet transition-all text-on-surface placeholder:text-on-surface-variant"
                  />
                  <input 
                    type="password" placeholder="Password" required value={cwPass} onChange={e => setCwPass(e.target.value)}
                    className="w-full bg-surface-container-highest border border-outline-variant rounded-lg px-4 py-2 text-body-sm focus:border-accent-violet focus:outline-none focus:ring-1 focus:ring-accent-violet transition-all text-on-surface placeholder:text-on-surface-variant"
                  />
                  <button type="submit" className="w-full bg-accent-violet/20 text-accent-violet hover:bg-accent-violet/30 py-2 rounded-lg font-bold transition-colors text-body-sm">
                    Assign Chief Warden
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Normal Wardens Section */}
          <div className="space-y-6">
            <div className="bento-card">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-tertiary-container/20 text-tertiary rounded-lg">
                    <ShieldAlert size={20} />
                  </div>
                  <h2 className="font-headline-md text-headline-md font-bold">Normal Wardens</h2>
                </div>
                <span className="text-label-caps bg-surface-container-highest text-on-surface-variant px-2 py-1 rounded-full font-bold">{wardens.length} / 2</span>
              </div>

              <div className="space-y-3 mb-6">
                {wardens.map(w => (
                  <div key={w.id} className="p-4 bg-surface-container-low border border-outline-variant/50 rounded-xl flex items-center justify-between group">
                    <div>
                      <p className="text-on-surface font-bold text-body-sm">{w.name}</p>
                      {editingWardenId === w.id ? (
                        <div className="flex items-center gap-2 mt-1">
                          <input 
                            type="email" 
                            value={editingEmail} 
                            onChange={(e) => setEditingEmail(e.target.value)}
                            className="bg-surface-container-highest border border-outline-variant rounded px-2 py-1 text-label-caps focus:border-tertiary focus:outline-none focus:ring-1 focus:ring-tertiary text-on-surface w-48"
                          />
                          <button onClick={() => handleUpdateEmail(w.id)} className="text-primary hover:text-primary-fixed"><Check size={14}/></button>
                          <button onClick={() => setEditingWardenId(null)} className="text-error hover:text-error-container"><X size={14}/></button>
                        </div>
                      ) : (
                        <p className="text-on-surface-variant text-label-caps mt-1">{w.email}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-outline group-hover:hidden" />
                      <button 
                        onClick={() => { setEditingWardenId(w.id); setEditingEmail(w.email); }}
                        className="hidden group-hover:flex p-1.5 text-on-surface-variant hover:text-tertiary hover:bg-tertiary-container/20 rounded-md transition-all"
                        title="Edit Email"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => deleteWarden(w.id)}
                        className="hidden group-hover:flex p-1.5 text-error hover:text-error-container hover:bg-error-container/20 rounded-md transition-all"
                        title="Remove Warden"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {wardens.length === 0 && (
                  <p className="text-on-surface-variant text-body-sm italic">No wardens assigned yet.</p>
                )}
              </div>

              {wardens.length < 2 && (
                <form onSubmit={handleAddWarden} className="mt-6 space-y-4 border-t border-outline-variant/30 pt-6">
                  <h3 className="text-body-sm font-bold text-on-surface-variant">Assign Normal Warden</h3>
                  <input 
                    type="text" placeholder="Name" required value={wName} onChange={e => setWName(e.target.value)}
                    className="w-full bg-surface-container-highest border border-outline-variant rounded-lg px-4 py-2 text-body-sm focus:border-tertiary focus:outline-none focus:ring-1 focus:ring-tertiary transition-all text-on-surface placeholder:text-on-surface-variant"
                  />
                  <input 
                    type="email" placeholder="Email" required value={wEmail} onChange={e => setWEmail(e.target.value)}
                    className="w-full bg-surface-container-highest border border-outline-variant rounded-lg px-4 py-2 text-body-sm focus:border-tertiary focus:outline-none focus:ring-1 focus:ring-tertiary transition-all text-on-surface placeholder:text-on-surface-variant"
                  />
                  <input 
                    type="password" placeholder="Password" required value={wPass} onChange={e => setWPass(e.target.value)}
                    className="w-full bg-surface-container-highest border border-outline-variant rounded-lg px-4 py-2 text-body-sm focus:border-tertiary focus:outline-none focus:ring-1 focus:ring-tertiary transition-all text-on-surface placeholder:text-on-surface-variant"
                  />
                  {wError && <p className="text-error text-label-caps font-bold">{wError}</p>}
                  <button type="submit" className="w-full bg-tertiary-container/20 text-tertiary hover:bg-tertiary-container/30 font-bold py-2 rounded-lg text-body-sm transition-all flex items-center justify-center gap-2">
                    <Plus size={16} /> Assign Warden
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
