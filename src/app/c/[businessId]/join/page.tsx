"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Stamp, User, Phone, Mail, ArrowRight, Check, Smartphone, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import StampGrid from "@/components/ui/StampGrid";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";

type Business = Database["public"]["Tables"]["businesses"]["Row"];
type Step = "form" | "wallet" | "success";

export default function ClientJoinPage() {
  const { businessId } = useParams();
  const [biz, setBiz] = useState<Business | null>(null);
  const [bizLoading, setBizLoading] = useState(true);
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [contactType, setContactType] = useState<"phone" | "email">("phone");
  const [loading, setLoading] = useState(false);
  const [walletLoading, setWalletLoading] = useState<"apple" | "google" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<"apple" | "google" | null>(null);
  const [cardId, setCardId] = useState<string>("");

  useEffect(() => {
    const supabase = createClient();
    supabase.from("businesses").select("*").eq("id", businessId as string).single()
      .then(({ data }) => { setBiz(data); setBizLoading(false); });
  }, [businessId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!biz) return;
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const newCardId = crypto.randomUUID();

      const { error: cardErr } = await supabase.from("loyalty_cards").insert({
        id: newCardId,
        business_id: biz.id,
        customer_name: name,
        phone: contactType === "phone" ? contact : null,
        email: contactType === "email" ? contact : null,
      });

      if (cardErr) { setError("Erreur lors de la création. Réessayez."); setLoading(false); return; }

      if (biz.mode === "stamps") {
        await supabase.from("stamp_states").insert({ card_id: newCardId, business_id: biz.id, current_stamps: 0, goal_stamps: biz.goal, total_rewards_given: 0 });
      } else {
        await supabase.from("points_states").insert({ card_id: newCardId, business_id: biz.id, current_points: 0, total_points_earned: 0, total_rewards_given: 0 });
      }

      setCardId(newCardId);
      setLoading(false);
      setStep("wallet");
    } catch {
      setError("Erreur réseau. Réessayez.");
      setLoading(false);
    }
  };

  const handleAddWallet = async (type: "apple" | "google") => {
    if (!biz) return;
    setWalletLoading(type);
    setError(null);
    try {
      const endpoint = type === "apple" ? "/api/wallet/apple" : "/api/wallet/google";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId, businessId: biz.id, customerName: name, stamps: 0, goal: biz.goal, reward: biz.reward_description, businessName: biz.name, mode: biz.mode, points: 0 }),
      });
      const data = await res.json();

      if (type === "apple") {
        setWalletType("apple"); setStep("success");
      } else {
        if (!data.demo && data.saveUrl) window.open(data.saveUrl, "_blank");
        setWalletType("google"); setStep("success");
      }

      const supabase = createClient();
      await supabase.from("loyalty_cards").update({ wallet_type: type, pass_serial: data.objectId ?? data.passSerial ?? null }).eq("id", cardId);
    } catch {
      setError("Impossible de générer la carte. Réessayez.");
    } finally {
      setWalletLoading(null);
    }
  };

  if (bizLoading) return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!biz) return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-white font-semibold text-lg mb-2">Programme introuvable</p>
        <p className="text-dark-400 text-sm">Ce lien n&apos;est plus valide.</p>
      </div>
    </div>
  );

  const bizInitial = biz.name.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center px-4 py-8">
      <div className="fixed inset-0 bg-grid opacity-50 pointer-events-none" />
      <div className="fixed inset-0 bg-hero-gradient pointer-events-none" />

      <div className="relative w-full max-w-sm">
        {/* Business branding header */}
        <div className="flex items-center gap-3 mb-6 justify-center">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-purple flex items-center justify-center shadow-glow flex-shrink-0">
            <span className="text-white font-bold text-lg">{bizInitial}</span>
          </div>
          <div>
            <p className="text-white font-semibold text-lg leading-tight">{biz.name}</p>
            <p className="text-dark-400 text-xs">{biz.type} · {biz.city}</p>
          </div>
        </div>

        {/* Card preview */}
        <div className="wallet-card p-5 mb-6 animate-float">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-dark-400 uppercase tracking-widest">Carte de fidélité</p>
              <p className="text-lg font-bold text-white">{biz.name}</p>
              <p className="text-xs text-dark-500">{biz.type} · {biz.city}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-accent-purple rounded-2xl flex items-center justify-center shadow-glow">
              <Stamp size={22} className="text-white" />
            </div>
          </div>
          {biz.mode === "stamps" ? (
            <>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {Array.from({ length: Math.min(biz.goal, 10) }).map((_, i) => (
                  <div key={i} className="w-7 h-7 rounded-full border border-white/15 opacity-40" />
                ))}
              </div>
              <p className="text-xs text-dark-400">0 / {biz.goal} · Objectif : <strong className="text-white">{biz.reward_description}</strong></p>
            </>
          ) : (
            <>
              <p className="text-3xl font-bold text-white mb-2">0 <span className="text-base text-dark-400 font-normal">pts</span></p>
              <p className="text-xs text-dark-400 mt-1.5">Objectif : <strong className="text-white">{biz.goal} pts = {biz.reward_description}</strong></p>
            </>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-sm text-red-300">
            <AlertCircle size={14} className="flex-shrink-0" />{error}
          </div>
        )}

        {step === "form" && (
          <div className="glass-card p-6 animate-slide-up">
            <div className="mb-5">
              <h1 className="text-xl font-bold text-white">Rejoindre le programme</h1>
              <p className="text-dark-400 text-sm mt-1">Votre carte sera dans votre wallet en 60 secondes.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Votre prénom</label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="Marie" className="input-field pl-10 text-sm" required />
                </div>
              </div>
              <div>
                <label className="label">Téléphone ou email</label>
                <div className="flex gap-2 mb-2">
                  {(["phone", "email"] as const).map(t => (
                    <button key={t} type="button" onClick={() => setContactType(t)}
                      className={cn("flex-1 text-xs py-2 rounded-xl border transition-all flex items-center justify-center gap-1.5",
                        contactType === t ? "bg-brand-500/20 border-brand-500/40 text-brand-300" : "bg-dark-800 border-white/8 text-dark-400 hover:border-white/20")}>
                      {t === "phone" ? <><Phone size={12} />Téléphone</> : <><Mail size={12} />Email</>}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  {contactType === "phone" ? <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" /> : <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />}
                  <input type={contactType === "phone" ? "tel" : "email"} value={contact} onChange={e => setContact(e.target.value)}
                    placeholder={contactType === "phone" ? "514-555-0100" : "vous@exemple.com"} className="input-field pl-10 text-sm" required />
                </div>
              </div>
              <button type="submit" disabled={loading || !name || !contact} className="btn-primary w-full flex items-center justify-center gap-2 py-3.5">
                {loading ? <Loader2 size={18} className="animate-spin" /> : <><span>Créer ma carte</span><ArrowRight size={16} /></>}
              </button>
            </form>
            <p className="text-xs text-dark-600 text-center mt-4">Aucune app à télécharger · Données sécurisées</p>
          </div>
        )}

        {step === "wallet" && (
          <div className="glass-card p-6 animate-slide-up">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-brand-500 to-accent-purple rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Smartphone size={24} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Ajouter à votre wallet</h2>
              <p className="text-dark-400 text-sm mt-1">Accessible hors connexion, toujours sur vous.</p>
            </div>
            <div className="space-y-3">
              <button onClick={() => handleAddWallet("apple")} disabled={!!walletLoading}
                className="w-full flex items-center gap-4 p-4 bg-white text-dark-900 rounded-2xl font-semibold hover:bg-gray-100 transition-all disabled:opacity-60">
                <div className="w-10 h-10 bg-dark-900 rounded-xl flex items-center justify-center flex-shrink-0">
                  {walletLoading === "apple" ? <Loader2 size={18} className="text-white animate-spin" /> : <span className="text-lg">🍎</span>}
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold">Ajouter à Apple Wallet</p>
                  <p className="text-xs text-gray-500">iPhone · Apple Watch</p>
                </div>
                <ArrowRight size={16} className="ml-auto text-gray-400" />
              </button>
              <button onClick={() => handleAddWallet("google")} disabled={!!walletLoading}
                className="w-full flex items-center gap-4 p-4 bg-dark-800 border border-white/10 text-white rounded-2xl font-semibold hover:bg-dark-700 transition-all disabled:opacity-60">
                <div className="w-10 h-10 bg-green-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                  {walletLoading === "google" ? <Loader2 size={18} className="text-green-400 animate-spin" /> : <span className="text-lg">🤖</span>}
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold">Ajouter à Google Wallet</p>
                  <p className="text-xs text-dark-400">Android · Wear OS</p>
                </div>
                <ArrowRight size={16} className="ml-auto text-dark-500" />
              </button>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="glass-card p-8 text-center animate-slide-up">
            <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-accent-purple rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-glow animate-pulse-glow">
              <Check size={28} className="text-white" strokeWidth={3} />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Carte ajoutée ! 🎉</h2>
            <p className="text-dark-400 text-sm mb-5">
              Bonjour <strong className="text-white">{name}</strong> ! Votre carte <strong className="text-white">{biz.name}</strong> est dans votre {walletType === "apple" ? "Apple Wallet" : "Google Wallet"}.
            </p>
            <div className="p-4 bg-brand-500/10 border border-brand-500/20 rounded-xl mb-5">
              <StampGrid current={0} goal={Math.min(biz.goal, 10)} size="sm" className="justify-center" />
              <p className="text-xs text-dark-400 mt-2 text-center">0 / {biz.goal} · {biz.reward_description}</p>
            </div>
            <p className="text-xs text-dark-500">Vous recevrez des notifications push pour suivre votre progression.</p>
          </div>
        )}
      </div>
    </div>
  );
}
