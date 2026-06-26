"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, ArrowRight, UserCircle, ShieldCheck, Key, Home, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useMockData } from "@/lib/MockDataContext";

export default function LoginPage() {
  const [role, setRole] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { login, user } = useMockData();

  useEffect(() => {
    if (user) {
      if (user.role === "student") router.push("/student");
      else if (user.role === "warden") router.push("/warden");
      else if (user.role === "chief_warden") router.push("/chief-warden");
      else if (user.role === "author") router.push("/author");
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    setError("");
    setSubmitting(true);

    let result = await login(email, password, role);

    // If they picked warden but are actually chief warden
    if (!result.success && role === "warden") {
      result = await login(email, password, "chief_warden");
    }

    if (!result.success) {
      setError(result.error || "Invalid credentials or role.");
    }
    setSubmitting(false);
  };

  const isEmailValid = (emailStr: string) => {
    return emailStr.includes("@") && emailStr.includes(".");
  };

  const isFormValid = () => {
    if (!role) return false;
    if (!password.trim()) return false;
    if (role === "author") return email.trim() !== "";
    return isEmailValid(email);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex items-center justify-center p-4 selection:bg-primary-container/30 relative font-title-md">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-container/20 via-background to-background -z-10" />
      
      <Link href="/" className="absolute top-6 right-6 flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors bg-surface-container/50 border border-outline-variant/50 px-4 py-2 rounded-full text-body-sm font-medium backdrop-blur-md hover:bg-surface-container">
        <Home size={16} />
        Home
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-xl bg-primary-container/20 flex items-center justify-center mb-4 border border-primary/30 shadow-[0_0_15px_rgba(94,92,230,0.3)]">
            <Building2 className="text-primary" size={24} />
          </div>
          <h1 className="font-headline-lg text-headline-lg font-bold tracking-tight text-on-surface">
            HostelPro
          </h1>
          <p className="text-on-surface-variant mt-2 text-center text-body-sm">Sign in to your account</p>
        </div>

        <div className="bento-card">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <label className="text-body-sm font-bold text-on-surface">Select your role</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => { setRole("student"); setError(""); }}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-200",
                    role === "student" 
                      ? "border-primary bg-primary-container/10 text-primary shadow-[0_0_10px_rgba(94,92,230,0.2)]" 
                      : "border-outline-variant bg-surface-container-high text-on-surface-variant hover:border-outline hover:bg-surface-container-highest"
                  )}
                >
                  <UserCircle size={20} />
                  <span className="font-bold text-label-caps">Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setRole("warden"); setError(""); }}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-200",
                    role === "warden" || role === "chief_warden"
                      ? "border-primary bg-primary-container/10 text-primary shadow-[0_0_10px_rgba(94,92,230,0.2)]" 
                      : "border-outline-variant bg-surface-container-high text-on-surface-variant hover:border-outline hover:bg-surface-container-highest"
                  )}
                >
                  <ShieldCheck size={20} />
                  <span className="font-bold text-label-caps">Warden</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setRole("author"); setError(""); setEmail(""); setPassword(""); }}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-200",
                    role === "author" 
                      ? "border-primary bg-primary-container/10 text-primary shadow-[0_0_10px_rgba(94,92,230,0.2)]" 
                      : "border-outline-variant bg-surface-container-high text-on-surface-variant hover:border-outline hover:bg-surface-container-highest"
                  )}
                >
                  <Key size={20} />
                  <span className="font-bold text-label-caps">Author</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-body-sm font-bold text-on-surface-variant block mb-1.5">{role === "author" ? "Name" : "Email"}</label>
                <input 
                  type={role === "author" ? "text" : "email"} 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === "author" ? "Enter your name" : "name@example.com"}
                  className="w-full bg-surface-container-highest border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-on-surface-variant"
                  required
                />
              </div>
              <div>
                <label className="text-body-sm font-bold text-on-surface-variant block mb-1.5">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface-container-highest border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-on-surface-variant"
                  required
                />
              </div>
              {error && (
                <p className="text-error text-label-caps font-bold bg-error-container/20 p-2 rounded border border-error/20">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isFormValid() || submitting}
              className="w-full bg-accent-violet hover:opacity-90 disabled:bg-surface-container-highest disabled:text-on-surface-variant text-on-primary-container font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 group"
            >
              {submitting ? <Loader2 size={18} className="animate-spin" /> : (
                <>
                  Sign In
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
