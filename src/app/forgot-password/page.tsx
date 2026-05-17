"use client";
import Link from "next/link";
import { useState } from "react";
import { Stamp, Mail, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    setSent(true);
  };

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
          {sent ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-brand-500/20 border border-brand-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Check size={24} className="text-brand-400" strokeWidth={3} />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Email envoyé !</h2>
              <p className="text-dark-400 text-sm mb-6">
                Si un compte existe avec <strong className="text-white">{email}</strong>, vous recevrez un lien de réinitialisation.
              </p>
              <Link href="/login" className="btn-ghost flex items-center justify-center gap-2 text-sm">
                <ArrowLeft size={14} /> Retour à la connexion
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">Mot de passe oublié ?</h1>
                <p className="text-dark-400 mt-1 text-sm">Entrez votre email pour recevoir un lien de réinitialisation.</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="label">Adresse email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="vous@exemple.com" className="input-field pl-11" required />
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3.5">
                  {loading
                    ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <><span>Envoyer le lien</span><ArrowRight size={16} /></>}
                </button>
              </form>
              <div className="mt-5 text-center">
                <Link href="/login" className="text-sm text-dark-400 hover:text-white flex items-center justify-center gap-1.5 transition-colors">
                  <ArrowLeft size={14} /> Retour à la connexion
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
