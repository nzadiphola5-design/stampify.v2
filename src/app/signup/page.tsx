"use client";
import Link from "next/link";
import { useState } from "react";
import { Stamp, Mail, Lock, ArrowRight, Eye, EyeOff, Check, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const IS_DEMO = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("YOUR_PROJECT");

export default function SignupPage() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { setError("Le mot de passe doit contenir au moins 8 caractères."); return; }
    setLoading(true);
    setError(null);

    if (IS_DEMO) {
      await new Promise(r => setTimeout(r, 700));
      router.push("/onboarding");
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${window.location.origin}/onboarding` },
    });

    setLoading(false);
    if (error) { setError(error.message); return; }

    // If email confirmation is disabled in Supabase, redirect directly
    setSuccess(true);
    setTimeout(() => router.push("/onboarding"), 1500);
  };

  const perks = ["Aucune carte bancaire requise", "Opérationnel en 5 minutes", "6 mois gratuits (offre bêta)"];

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

        <div className="glass-card p-8">
          {success ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Check size={24} className="text-emerald-400" strokeWidth={3} />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Compte créé !</h2>
              <p className="text-dark-400 text-sm">Redirection vers l&apos;onboarding...</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">Créez votre compte</h1>
                <p className="text-dark-400 mt-1 text-sm">Étape 1/3 — Email + mot de passe, c&apos;est tout.</p>
              </div>

              <div className="mb-5 space-y-1.5">
                {perks.map(p => (
                  <div key={p} className="flex items-center gap-2 text-sm text-dark-300">
                    <div className="w-4 h-4 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center flex-shrink-0">
                      <Check size={10} className="text-brand-400" strokeWidth={3} />
                    </div>
                    {p}
                  </div>
                ))}
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-sm text-red-300">
                  <AlertCircle size={15} className="flex-shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
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
                      placeholder="8 caractères minimum" className="input-field pl-11 pr-11" required />
                    <button type="button" onClick={() => setShow(!show)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white">
                      {show ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {password && (
                    <div className="mt-1.5 flex gap-1">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all ${
                          password.length > i * 2 + 1
                            ? password.length >= 12 ? "bg-emerald-400" : password.length >= 8 ? "bg-brand-400" : "bg-amber-400"
                            : "bg-dark-700"
                        }`} />
                      ))}
                    </div>
                  )}
                </div>

                <button type="submit" disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 mt-2">
                  {loading
                    ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <><span>Continuer</span><ArrowRight size={16} /></>}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-white/5 text-center">
                <p className="text-sm text-dark-400">
                  Déjà un compte ?{" "}
                  <Link href="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
                    Se connecter
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {[0, 1, 2].map(i => (
            <div key={i} className={`rounded-full transition-all ${i === 0 ? "w-6 h-2 bg-brand-500" : "w-2 h-2 bg-dark-700"}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
