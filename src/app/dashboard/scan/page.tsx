"use client";
import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { QrCode, Check, Search, Stamp, TrendingUp, Gift, ChevronRight, X, Camera, Keyboard, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBusiness } from "@/lib/supabase/business-context";
import { createClient } from "@/lib/supabase/client";
import StampGrid from "@/components/ui/StampGrid";
import Avatar from "@/components/ui/Avatar";

const QrScanner = dynamic(() => import("@/components/ui/QrScanner"), { ssr: false });

type ScanState = "idle" | "scanning" | "found" | "points-input" | "confirmed";
type InputMode = "camera" | "manual";

type FoundClient = {
  id: string; customer_name: string; phone: string | null; email: string | null;
  wallet_type: string | null; current_stamps: number; current_points: number;
};

export default function ScanPage() {
  const { business } = useBusiness();
  const [state, setState] = useState<ScanState>("idle");
  const [inputMode, setInputMode] = useState<InputMode>("camera");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<FoundClient[]>([]);
  const [client, setClient] = useState<FoundClient | null>(null);
  const [amount, setAmount] = useState("");
  const [newStamps, setNewStamps] = useState(0);
  const [scanError, setScanError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  const loadClient = async (cardId: string) => {
    const supabase = createClient();
    const { data: card } = await supabase.from("loyalty_cards").select("*").eq("id", cardId).single();
    if (!card) { setScanError("Carte introuvable"); return; }

    const [stampsRes, pointsRes] = await Promise.all([
      supabase.from("stamp_states").select("current_stamps").eq("card_id", cardId).single(),
      supabase.from("points_states").select("current_points").eq("card_id", cardId).single(),
    ]);

    setClient({
      ...card,
      current_stamps: stampsRes.data?.current_stamps ?? 0,
      current_points: pointsRes.data?.current_points ?? 0,
    });
    setState("found");
  };

  const handleQrResult = useCallback((decoded: string) => {
    setScanError(null);
    const cardId = decoded.replace("stampify://card/", "").trim();
    loadClient(cardId);
  }, []);

  const handleManualSearch = async (query: string) => {
    setSearch(query);
    if (!business || query.length < 2) { setSearchResults([]); return; }
    const supabase = createClient();
    const { data } = await supabase.from("loyalty_cards").select("*").eq("business_id", business.id)
      .or(`customer_name.ilike.%${query}%,phone.ilike.%${query}%`).limit(5);

    if (!data?.length) { setSearchResults([]); return; }
    const cardIds = data.map(c => c.id);
    const [stampsRes, pointsRes] = await Promise.all([
      supabase.from("stamp_states").select("card_id, current_stamps").in("card_id", cardIds),
      supabase.from("points_states").select("card_id, current_points").in("card_id", cardIds),
    ]);
    const stampsMap = Object.fromEntries((stampsRes.data ?? []).map(s => [s.card_id, s.current_stamps]));
    const pointsMap = Object.fromEntries((pointsRes.data ?? []).map(s => [s.card_id, s.current_points]));
    setSearchResults(data.map(c => ({ ...c, current_stamps: stampsMap[c.id] ?? 0, current_points: pointsMap[c.id] ?? 0 })));
  };

  const handleConfirm = async () => {
    if (!client || !business) return;
    if (business.mode === "points") { setState("points-input"); return; }
    setConfirming(true);
    const supabase = createClient();
    const newCount = client.current_stamps + 1;
    const isReward = newCount >= business.goal;

    await Promise.all([
      supabase.from("stamp_states").update({ current_stamps: isReward ? 0 : newCount, ...(isReward ? { total_rewards_given: supabase.rpc as any } : {}) }).eq("card_id", client.id),
      supabase.from("loyalty_cards").update({ last_scan_at: new Date().toISOString() }).eq("id", client.id),
      supabase.from("transactions").insert({ card_id: client.id, business_id: business.id, type: isReward ? "reward" : "scan", stamps_delta: 1 }),
    ]);
    if (isReward) {
      await supabase.from("stamp_states").update({ total_rewards_given: client.current_stamps }).eq("card_id", client.id);
    }

    setNewStamps(newCount);
    setConfirming(false);
    setState("confirmed");
    setTimeout(reset, 3500);
  };

  const handlePointsConfirm = async () => {
    if (!client || !business || !amount) return;
    setConfirming(true);
    const supabase = createClient();
    const pts = Math.floor(parseFloat(amount) * (business.points_rate ?? 10));

    await Promise.all([
      supabase.from("points_states").update({ current_points: client.current_points + pts, total_points_earned: client.current_points + pts }).eq("card_id", client.id),
      supabase.from("loyalty_cards").update({ last_scan_at: new Date().toISOString() }).eq("id", client.id),
      supabase.from("transactions").insert({ card_id: client.id, business_id: business.id, type: "scan", points_delta: pts, amount: parseFloat(amount) }),
    ]);
    setConfirming(false);
    setState("confirmed");
    setTimeout(reset, 3500);
  };

  const reset = () => { setState("idle"); setClient(null); setSearch(""); setSearchResults([]); setAmount(""); setScanError(null); };

  if (!business) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;

  const stamps = client?.current_stamps ?? 0;
  const hasReward = stamps >= business.goal;

  return (
    <div className="animate-fade-in max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Scanner un client</h1>
        <p className="text-dark-400 text-sm mt-0.5">Utilisez la caméra ou recherchez manuellement.</p>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className={cn("p-2.5 rounded-xl border", business.mode === "stamps" ? "bg-brand-500/15 border-brand-500/20" : "bg-cyan-500/15 border-cyan-500/20")}>
          {business.mode === "stamps" ? <Stamp size={18} className="text-brand-400" /> : <TrendingUp size={18} className="text-cyan-400" />}
        </div>
        <div>
          <p className="text-sm font-medium text-white">{business.mode === "stamps" ? "Mode Tampons" : "Mode Points"}</p>
          <p className="text-xs text-dark-400">{business.mode === "stamps" ? "1 scan = 1 tampon automatiquement" : "Entrez le montant après le scan"}</p>
        </div>
      </div>

      {state === "idle" && (
        <div className="space-y-4">
          <div className="flex gap-1 bg-dark-900/80 p-1 rounded-xl">
            {([["camera", Camera, "Scanner QR"], ["manual", Keyboard, "Recherche manuelle"]] as const).map(([mode, Icon, label]) => (
              <button key={mode} onClick={() => setInputMode(mode)}
                className={cn("flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all",
                  inputMode === mode ? "bg-brand-500/20 text-brand-300 border border-brand-500/30" : "text-dark-400 hover:text-white")}>
                <Icon size={15} />{label}
              </button>
            ))}
          </div>

          {inputMode === "camera" && (
            <div className="glass-card overflow-hidden">
              <QrScanner onScan={handleQrResult} onError={err => setScanError(err)} active={true} className="w-full" />
              {scanError && (
                <div className="p-3 flex items-center gap-2 bg-amber-500/10 border-t border-amber-500/20">
                  <AlertCircle size={14} className="text-amber-400 flex-shrink-0" />
                  <p className="text-xs text-amber-300">{scanError}</p>
                </div>
              )}
              <div className="p-4 text-center border-t border-white/5">
                <p className="text-xs text-dark-400">Demandez au client d&apos;ouvrir sa carte wallet et de présenter son QR code</p>
              </div>
            </div>
          )}

          {inputMode === "manual" && (
            <div className="glass-card p-5">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
                <input value={search} onChange={e => handleManualSearch(e.target.value)}
                  placeholder="Nom, prénom ou numéro de téléphone..." className="input-field pl-10 text-sm" autoFocus />
              </div>
              {search.length > 1 && (
                <div className="mt-3 space-y-1">
                  {searchResults.map(c => (
                    <button key={c.id} onClick={() => { setClient(c); setState("found"); }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left">
                      <Avatar name={c.customer_name} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium">{c.customer_name}</p>
                        <p className="text-xs text-dark-400">{c.phone || c.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-brand-400 font-medium">{c.current_stamps}/{business.goal}</p>
                        <p className="text-xs text-dark-600">tampons</p>
                      </div>
                      <ChevronRight size={14} className="text-dark-600" />
                    </button>
                  ))}
                  {searchResults.length === 0 && <p className="text-sm text-dark-500 text-center py-4">Aucun client trouvé</p>}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {state === "found" && client && (
        <div className="glass-card p-6 animate-slide-up">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-brand-400 rounded-full animate-pulse" />
              <span className="text-sm text-brand-300 font-medium">Client trouvé</span>
            </div>
            <button onClick={reset} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"><X size={15} className="text-dark-400" /></button>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <Avatar name={client.customer_name} size="lg" />
            <div>
              <h3 className="font-bold text-white text-lg">{client.customer_name}</h3>
              <p className="text-sm text-dark-400">{client.phone || client.email}</p>
            </div>
          </div>
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-3">
              <span className="text-dark-400">Progression actuelle</span>
              <span className="text-white font-semibold">{stamps} / {business.goal} tampons</span>
            </div>
            <StampGrid current={stamps} goal={business.goal} />
          </div>
          {hasReward && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl mb-5 flex items-start gap-3">
              <Gift size={20} className="text-amber-400 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white">🎁 Récompense disponible !</p>
                <p className="text-sm text-dark-300 mt-0.5">{business.reward_description}</p>
              </div>
            </div>
          )}
          <div className="flex gap-3">
            {hasReward ? (
              <button onClick={handleConfirm} disabled={confirming}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-amber-500 to-orange-400 text-white font-semibold rounded-xl hover:from-amber-400 hover:to-orange-300 transition-all disabled:opacity-60">
                <Gift size={16} />Appliquer la récompense
              </button>
            ) : (
              <button onClick={handleConfirm} disabled={confirming} className="flex-1 btn-primary flex items-center justify-center gap-2 py-3.5 disabled:opacity-60">
                {confirming ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Stamp size={16} />{business.mode === "stamps" ? "Ajouter 1 tampon" : "Entrer le montant"}</>}
              </button>
            )}
            <button onClick={reset} className="btn-secondary px-4"><X size={16} /></button>
          </div>
        </div>
      )}

      {state === "points-input" && client && (
        <div className="glass-card p-6 animate-slide-up">
          <h3 className="font-semibold text-white mb-5 flex items-center gap-2"><TrendingUp size={18} className="text-cyan-400" />Montant de la transaction</h3>
          <div className="mb-5">
            <label className="label">Montant en $</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
              placeholder="0.00" className="input-field text-2xl text-center font-bold py-4" autoFocus min="0" step="0.01" />
            {amount && parseFloat(amount) > 0 && (
              <div className="mt-3 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-center">
                <p className="text-sm text-dark-300">= <strong className="text-white text-lg">+{Math.floor(parseFloat(amount) * (business.points_rate ?? 10))} points</strong></p>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button onClick={handlePointsConfirm} disabled={!amount || parseFloat(amount) <= 0 || confirming}
              className="flex-1 btn-primary flex items-center justify-center gap-2 py-3.5 disabled:opacity-60">
              {confirming ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Check size={16} />Valider</>}
            </button>
            <button onClick={reset} className="btn-secondary px-4">Annuler</button>
          </div>
        </div>
      )}

      {state === "confirmed" && client && (
        <div className="glass-card p-8 text-center animate-slide-up">
          <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-accent-purple rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
            <Check size={28} className="text-white" strokeWidth={3} />
          </div>
          <h3 className="text-xl font-bold text-white mb-1">
            {hasReward ? "Récompense appliquée !" : business.mode === "stamps" ? "Tampon ajouté !" : "Points ajoutés !"}
          </h3>
          <p className="text-dark-400 text-sm mb-4">{client.customer_name}</p>
          {business.mode === "stamps"
            ? <StampGrid current={newStamps} goal={business.goal} size="sm" className="justify-center mb-5" />
            : <p className="text-2xl font-bold text-cyan-400 mb-5">+{Math.floor(parseFloat(amount) * (business.points_rate ?? 10))} pts</p>}
          <div className="inline-flex items-center gap-2 text-xs text-dark-500 bg-dark-800/80 px-4 py-2 rounded-full">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Enregistré · Redirection dans 3s...
          </div>
        </div>
      )}
    </div>
  );
}
