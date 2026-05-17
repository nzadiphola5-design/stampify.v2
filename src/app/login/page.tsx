"use client";
import Link from "next/link";
import { useState, Suspense } from "react";
import { Stamp, Mail, Lock, ArrowRight, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const IS_DEMO = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("YOUR_PROJECT");

function LoginForm() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (IS_DEMO) {
      await new Promise(r => setTimeout(r, 700));
      router.push(email.includes("admin") ? "/admin" : redirect);
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push(email === "admin@stampify.app" ? "/admin" : redirect);
    router.refresh();
  };

  return (
    <div className="glass-card p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Bon retour !</h1>
        <p className="text-dark-400 mt-1 text-sm">Connectez-vous à votre espace commerçant.</p>
      </div>

      {IS_DEMO && (
        <div className="mb-5 p-3 bg-brand-500/10 border border-brand-500/20 rounded-xl text-xs text-brand-300">
          <strong>Mode démo :</strong> utilisez <code className="bg-brand-500/20 px-1 rounded">admin@stampify.app</code> pour l&apos;admin, ou n&apos;importe quel email pour le dashboard.
        </div>
      )}

      {error && (
        <div className="mb-5 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-sm text-red-300">
          <AlertCircle size={15} className="flex-shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="label">Adresse email</label>
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="vous@exemple.com" className="input-field pl-11" required />
          </div>
        </div>

        <div>
          <label className="label">Mot de passe</label>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
            <input type={show ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" className="input-field pl-11 pr-11" required />
            <button type="button" onClick={() => setShow(!show)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors">
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-sm text-brand-400 hover:text-brand-300 transition-colors">
            Mot de passe oublié ?
          </Link>
        </div>

        <button type="submit" disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2 py-3.5">
          {loading
            ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <><span>Se connecter</span><ArrowRight size={16} /></>}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-white/5 text-center">
        <p className="text-sm text-dark-400">
          Pas encore de compte ?{" "}
          <Link href="/signup" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
            Créer un compte gratuit
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4 py-24">
      <div className="fixed inset-0 bg-grid pointer-events-none" />
      <div className="fixed inset-0 bg-hero-gradient pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-accent-purple rounded-xl flex items-center justify-center shadow-glow">
              <Stamp size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl text-white">Stampify</span>
          </Link>
        </div>

        <Suspense fallback={<div className="glass-card p-8 text-center text-dark-400">Chargement...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
