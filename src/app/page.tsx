"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, ArrowRight, ShieldCheck, UserCircle, Calendar, CreditCard, BellRing, Sparkles, LayoutDashboard, CheckSquare } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useMockData } from "@/lib/MockDataContext";

const features = [
  {
    icon: <ShieldCheck className="w-6 h-6 text-tertiary" />,
    title: "Secure Access",
    description: "Role-based dashboards for students and wardens with enhanced security."
  },
  {
    icon: <Calendar className="w-6 h-6 text-primary" />,
    title: "Leave Management",
    description: "Students can easily apply for leaves and wardens can approve them instantly."
  },
  {
    icon: <BellRing className="w-6 h-6 text-accent-violet" />,
    title: "Instant Complaints",
    description: "Raise maintenance or facility issues quickly and track their resolution status."
  },
  {
    icon: <Building2 className="w-6 h-6 text-primary-container" />,
    title: "Room Allocation",
    description: "Smart and visual room allocation system to easily manage hostel occupancy."
  },
  {
    icon: <CreditCard className="w-6 h-6 text-error" />,
    title: "Fee Tracking",
    description: "Keep track of upcoming and pending fee payments directly from the dashboard."
  },
  {
    icon: <UserCircle className="w-6 h-6 text-secondary" />,
    title: "Student Profiles",
    description: "Comprehensive student directory with all necessary emergency contact details."
  }
];

const heroHighlights = [
  {
    icon: <LayoutDashboard className="w-8 h-8 text-primary" />,
    title: "Centralized Dashboard",
    description: "A unified view for administrators to monitor operations at a glance."
  },
  {
    icon: <CheckSquare className="w-8 h-8 text-tertiary" />,
    title: "Paperless Administration",
    description: "Digitize records, approvals, and daily logs effortlessly."
  }
];

export default function LandingPage() {
  const [currentHighlightIdx, setCurrentHighlightIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHighlightIdx((prev) => (prev + 1) % heroHighlights.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const { users } = useMockData();
  const chiefWarden = users.find(u => u.role === "chief_warden");
  const wardens = users.filter(u => u.role === "warden");
  return (
    <div className="min-h-screen bg-background text-on-surface font-title-md overflow-x-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-container/20 via-background to-background -z-10" />
      <div className="fixed top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent blur-[1px] opacity-50" />
      
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl border-b border-outline-variant/30 bg-surface-dim/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary-container/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(94,92,230,0.3)]">
              <Building2 className="text-primary" size={20} />
            </div>
            <span className="font-headline-md text-headline-md font-bold tracking-tight text-on-surface">
              HostelPro
            </span>
          </div>
          <Link href="/login">
            <button className="px-5 py-2.5 rounded-full text-body-sm font-bold bg-surface-container-high border border-outline-variant hover:bg-surface-container-highest transition-all flex items-center gap-2 group text-on-surface">
              Login to Portal
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center text-center max-w-4xl mx-auto pt-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-container/10 border border-primary-container/30 text-primary text-label-caps font-bold mb-8 uppercase tracking-wider">
              <Sparkles size={16} />
              <span>Next-Generation Hostel Management</span>
            </div>
            
            <h1 className="font-display-xl text-display-xl font-bold tracking-tight mb-8">
              Welcome to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-tertiary to-primary animate-gradient-x">
                Hostel Operations
              </span>
            </h1>
            
            <p className="text-body-lg text-on-surface-variant mb-12 max-w-2xl leading-relaxed">
              A comprehensive hostel management solution handling student onboarding, automated room allocation, real-time notices, mess menus, and quick complaint resolution seamlessly.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/login">
                <button className="px-8 py-4 rounded-full bg-accent-violet hover:opacity-90 text-on-primary-container font-bold transition-all shadow-lg flex items-center gap-2 group">
                  Login to Portal
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>

            {/* Warden Contact Section */}
            <div className="mt-12 p-6 rounded-2xl bg-surface-container-low border border-outline-variant max-w-lg mx-auto w-full text-left bento-card">
              <h3 className="font-headline-md text-headline-md mb-2">Warden Contacts</h3>
              <p className="text-on-surface-variant mb-4 text-body-sm">Need immediate assistance? Reach out to the wardens.</p>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2">
                  <span className="text-on-surface-variant text-body-sm">Chief Warden {chiefWarden && `(${chiefWarden.name})`}</span>
                  <span className="font-mono text-primary text-body-sm">{chiefWarden?.email || "Not Assigned"}</span>
                </div>
                {wardens.map((w, idx) => (
                  <div key={w.id} className="flex items-center justify-between border-b border-outline-variant/50 pb-2 last:border-0 last:pb-0">
                    <span className="text-on-surface-variant text-body-sm">Warden {idx + 1} ({w.name})</span>
                    <span className="font-mono text-primary text-body-sm">{w.email}</span>
                  </div>
                ))}
                {wardens.length === 0 && (
                  <div className="text-body-sm text-outline italic mt-2">No normal wardens assigned yet.</div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Abstract UI Preview Graphic */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mt-24 relative max-w-5xl mx-auto"
          >
            <div className="aspect-[16/9] rounded-[var(--radius-xl)] border border-outline-variant bg-surface-container/50 backdrop-blur-3xl shadow-2xl overflow-hidden relative group flex items-center justify-center bento-card p-0">
              <div className="w-full h-full relative flex items-center justify-center p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentHighlightIdx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="flex flex-col items-center text-center max-w-2xl"
                  >
                    <div className="h-24 w-24 rounded-3xl bg-surface-container-high flex items-center justify-center mb-8 shadow-2xl border border-outline-variant/50">
                      {heroHighlights[currentHighlightIdx].icon}
                    </div>
                    <h2 className="font-headline-lg text-headline-lg font-bold mb-6 text-on-surface">
                      {heroHighlights[currentHighlightIdx].title}
                    </h2>
                    <p className="font-body-lg text-body-lg text-on-surface-variant">
                      {heroHighlights[currentHighlightIdx].description}
                    </p>
                  </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] pointer-events-none rounded-[var(--radius-xl)]" />
              </div>
            </div>
            
            {/* Glow effects behind preview */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary-container/20 blur-[120px] -z-10 rounded-full" />
          </motion.div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-24 relative border-t border-outline-variant/30 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-headline-lg font-bold mb-4">Everything you need</h2>
            <p className="font-body-lg text-on-surface-variant max-w-xl mx-auto">
              Purpose-built hostel infrastructure that replaces physical registers, notice boards, and complaint queues with a single, auditable, role-driven platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-bento-gap">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bento-card group"
              >
                <div className="h-12 w-12 rounded-xl bg-surface-container-high flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="font-headline-md text-headline-md mb-3">{feature.title}</h3>
                <p className="font-body-sm text-on-surface-variant leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-outline-variant bg-surface-container-lowest text-center text-on-surface-variant font-label-caps">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Building2 size={16} className="text-primary" />
            <span className="font-bold text-on-surface uppercase">HostelPro Operations</span>
          </div>
          <p>© {new Date().getFullYear()} HostelPro. Version 2.4.1</p>
        </div>
      </footer>
    </div>
  );
}
