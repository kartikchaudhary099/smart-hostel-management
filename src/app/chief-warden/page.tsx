"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2, LogOut, UserPlus, Home, BedDouble, MessageSquareWarning, Trash2, Users, PenLine, CheckCircle, XCircle } from "lucide-react";
import { useMockData } from "@/lib/MockDataContext";
import { cn } from "@/lib/utils";

export default function ChiefWardenDashboard() {
  const router = useRouter();
  const { user, users, rooms, logout, addStudent, deleteStudent, allotRoom, complaints, updateComplaintStatus, nameUpdates, approveNameUpdate, rejectNameUpdate } = useMockData();
  const [mounted, setMounted] = useState(false);

  // Student form state
  const [sName, setSName] = useState("");
  const [sEmail, setSEmail] = useState("");
  const [sPass, setSPass] = useState("");
  const [sAcPref, setSAcPref] = useState(false);

  // Room allocation state
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");

  useEffect(() => {
    setMounted(true);
    if (!user) {
      router.push("/login");
    } else if (user.role !== "chief_warden") {
      router.push("/");
    }
  }, [user, router]);

  if (!mounted || !user || user.role !== "chief_warden") return null;

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    await addStudent(sName, sEmail, sPass, sAcPref);
    setSName(""); setSEmail(""); setSPass(""); setSAcPref(false);
  };

  const handleAllotRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStudent && selectedRoom) {
      await allotRoom(selectedStudent, selectedRoom);
      setSelectedStudent("");
      setSelectedRoom("");
    }
  };

  const students = users.filter(u => u.role === "student");
  const unassignedStudents = students.filter(s => !s.roomId);
  const pendingNameRequests = nameUpdates.filter(n => n.status === "Pending");

  return (
    <div className="min-h-screen bg-background text-on-surface font-title-md">
      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-outline-variant/30 bg-surface-dim/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="text-accent-violet" size={20} />
            <span className="font-headline-md text-headline-md font-bold">Chief Warden Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container/50 border border-outline-variant/50 text-body-sm">
              <span className="w-2 h-2 rounded-full bg-accent-violet" />
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
          <h1 className="font-headline-lg text-headline-lg font-bold mb-2">Operations & Room Allocation</h1>
          <p className="text-on-surface-variant text-body-lg">Register students and manage room assignments.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-bento-gap">
          {/* Register Student Section */}
          <div className="bento-card h-fit">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary-container/20 text-primary rounded-lg">
                <UserPlus size={20} />
              </div>
              <h2 className="font-headline-md text-headline-md font-bold">Register Student</h2>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-4">
              <input 
                type="text" placeholder="Student Name" required value={sName} onChange={e => setSName(e.target.value)}
                className="w-full bg-surface-container-highest border border-outline-variant rounded-lg px-4 py-2 text-body-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all text-on-surface placeholder:text-on-surface-variant"
              />
              <input 
                type="email" placeholder="Student Email" required value={sEmail} onChange={e => setSEmail(e.target.value)}
                className="w-full bg-surface-container-highest border border-outline-variant rounded-lg px-4 py-2 text-body-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all text-on-surface placeholder:text-on-surface-variant"
              />
              <input 
                type="password" placeholder="Password" required value={sPass} onChange={e => setSPass(e.target.value)}
                className="w-full bg-surface-container-highest border border-outline-variant rounded-lg px-4 py-2 text-body-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all text-on-surface placeholder:text-on-surface-variant"
              />
              <div className="flex items-center gap-2 mt-2">
                <input 
                  type="checkbox" id="acPref" 
                  checked={sAcPref} onChange={e => setSAcPref(e.target.checked)}
                  className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/50 bg-surface-container-highest"
                />
                <label htmlFor="acPref" className="text-body-sm text-on-surface-variant">Prefers AC Room</label>
              </div>
              <button type="submit" className="w-full bg-primary-container/20 text-primary hover:bg-primary-container/30 font-bold py-2 rounded-lg text-body-sm transition-all mt-4">
                Register Student
              </button>
            </form>
          </div>

          {/* Room Allocation Section */}
          <div className="bento-card h-fit">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-accent-violet/20 text-accent-violet rounded-lg">
                <Home size={20} />
              </div>
              <h2 className="font-headline-md text-headline-md font-bold">Allocate Room</h2>
            </div>

            <form onSubmit={handleAllotRoom} className="space-y-4">
              <div>
                <label className="text-label-caps text-on-surface-variant mb-1.5 block font-bold">Select Student (Unassigned)</label>
                <select 
                  value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} required
                  className="w-full bg-surface-container-highest border border-outline-variant rounded-lg px-4 py-2 text-body-sm focus:border-accent-violet focus:outline-none focus:ring-1 focus:ring-accent-violet transition-all text-on-surface"
                >
                  <option value="" disabled>Choose a student...</option>
                  {unassignedStudents.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.isAcPreference ? 'AC Pref' : 'Non-AC Pref'})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-label-caps text-on-surface-variant mb-1.5 block font-bold">Select Room</label>
                <select 
                  value={selectedRoom} onChange={e => setSelectedRoom(e.target.value)} required
                  className="w-full bg-surface-container-highest border border-outline-variant rounded-lg px-4 py-2 text-body-sm focus:border-accent-violet focus:outline-none focus:ring-1 focus:ring-accent-violet transition-all text-on-surface"
                >
                  <option value="" disabled>Choose a room...</option>
                  {rooms.filter(r => r.occupants.length < r.capacity).map(r => (
                    <option key={r.id} value={r.id}>
                      {r.roomNumber} - {r.capacity} Seater {r.isAc ? '(AC)' : '(Non-AC)'} ({r.capacity - r.occupants.length} available)
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" disabled={!selectedStudent || !selectedRoom} className="w-full bg-accent-violet/20 text-accent-violet hover:bg-accent-violet/30 font-bold py-2 rounded-lg text-body-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                Allocate Room
              </button>
            </form>
          </div>
        </div>
        
        {/* Statistics Section */}
        <div className="mt-8">
          <h2 className="font-headline-md text-headline-md font-bold mb-4">Hostel Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-bento-gap">
            <div className="bento-card flex items-center justify-between">
              <div>
                <p className="text-on-surface-variant text-label-caps font-bold">Total Capacity</p>
                <p className="font-headline-md text-headline-md font-bold mt-1">500 beds</p>
              </div>
              <BedDouble className="text-outline" size={24} />
            </div>
            <div className="bento-card flex items-center justify-between">
              <div>
                <p className="text-on-surface-variant text-label-caps font-bold">Registered Students</p>
                <p className="font-headline-md text-headline-md font-bold text-primary mt-1">{students.length}</p>
              </div>
              <Users className="text-outline" size={24} />
            </div>
            <div className="bento-card flex items-center justify-between">
              <div>
                <p className="text-on-surface-variant text-label-caps font-bold">Total Rooms</p>
                <p className="font-headline-md text-headline-md font-bold text-accent-violet mt-1">{rooms.length}</p>
              </div>
              <Home className="text-outline" size={24} />
            </div>
            <div className="bento-card flex items-center justify-between">
              <div>
                <p className="text-on-surface-variant text-label-caps font-bold">AC Beds Available</p>
                <p className="font-headline-md text-headline-md font-bold text-tertiary mt-1">
                  {rooms.filter(r => r.isAc).reduce((acc, r) => acc + (r.capacity - r.occupants.length), 0)}
                </p>
              </div>
              <BedDouble className="text-outline" size={24} />
            </div>
          </div>
        </div>

        {/* Manage Students Section */}
        <div className="mt-8 bento-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-secondary-container/20 text-secondary rounded-lg">
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

        {/* Name Update Requests */}
        <div className="mt-8 bento-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary-container/20 text-primary rounded-lg">
              <PenLine size={20} />
            </div>
            <h2 className="font-headline-md text-headline-md font-bold">Name Correction Requests</h2>
            {pendingNameRequests.length > 0 && (
              <span className="ml-auto text-label-caps font-bold px-2 py-1 rounded-full bg-tertiary-container/20 text-tertiary">
                {pendingNameRequests.length} Pending
              </span>
            )}
          </div>

          <div className="space-y-3">
            {nameUpdates.length === 0 ? (
              <p className="text-on-surface-variant text-body-sm text-center py-4">No name correction requests.</p>
            ) : (
              nameUpdates.map(req => (
                <div key={req.id} className="p-4 bg-surface-container-low border border-outline-variant/50 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-body-sm text-on-surface-variant">
                      <span className="text-on-surface font-bold">{req.student.name}</span> → <span className="text-primary font-bold">{req.newName}</span>
                    </p>
                    <p className="text-label-caps text-outline mt-1">{new Date(req.createdAt).toLocaleDateString()}</p>
                  </div>
                  {req.status === "Pending" ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => approveNameUpdate(req.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-container/20 text-primary hover:bg-primary-container/30 rounded-lg text-label-caps font-bold transition-all"
                      >
                        <CheckCircle size={14} /> Approve
                      </button>
                      <button
                        onClick={() => rejectNameUpdate(req.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-error-container/20 text-error hover:bg-error-container/30 rounded-lg text-label-caps font-bold transition-all"
                      >
                        <XCircle size={14} /> Reject
                      </button>
                    </div>
                  ) : (
                    <span className={cn("text-label-caps font-bold px-2 py-1 rounded-full",
                      req.status === "Approved" ? "bg-primary-container/20 text-primary" : "bg-error-container/20 text-error"
                    )}>
                      {req.status}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Complaints Section */}
        <div className="mt-8 bento-card flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-error-container/20 text-error rounded-lg">
              <MessageSquareWarning size={20} />
            </div>
            <h2 className="font-headline-md text-headline-md font-bold">Complaints</h2>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[500px] custom-scrollbar">
            {complaints.length === 0 ? (
              <p className="text-on-surface-variant text-body-sm text-center mt-4">No complaints.</p>
            ) : (
              complaints.map(c => (
                <div key={c.id} className="p-4 bg-surface-container-low border border-outline-variant/50 rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-label-caps font-bold text-on-surface-variant bg-surface-container-highest px-2 py-1 rounded-md">{c.category}</span>
                    <select 
                      value={c.status} onChange={(e) => updateComplaintStatus(c.id, e.target.value)}
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

      </main>
    </div>
  );
}
