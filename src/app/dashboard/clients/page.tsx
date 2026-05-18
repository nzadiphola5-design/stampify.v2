"use client";
import { useState, useEffect } from "react";
import { Search, UserPlus, Download, MoreHorizontal, ChevronRight, X, Gift, AlertCircle, Smartphone } from "lucide-react";
import { useBusiness } from "@/lib/supabase/business-context";
import { createClient } from "@/lib/supabase/client";
import { cn, formatDate } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";
import ProgressBar from "@/components/ui/ProgressBar";
import StampGrid from "@/components/ui/StampGrid";

type Client = {
  id: string; customer_name: string; phone: string | null; email: string | null;
  wallet_type: string | null; last_scan_at: string | null; created_at: string;
  current_stamps: number; current_points: number;
};

const tabs = ["Tous", "Actifs", "Inactifs", "Récompense dispo"];

export default function ClientsPage() {
  const { business } = useBusiness();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("Tous");
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (!business) return;
    const supabase = createClient();
    const load = async () => {
      const { data: cards } = await supabase
        .from("loyalty_cards")
        .select("*")
        .eq("business_id", business.id)
        .order("created_at", { ascending: false });

      if (!cards || cards.length === 0) { setLoading(false); return; }

      const cardIds = cards.map(c => c.id);
      const [stampsRes, pointsRes] = await Promise.all([
        supabase.from("stamp_states").select("card_id, current_stamps").in("card_id", cardIds),
        supabase.from("points_states").select("card_id, current_points").in("card_id", cardIds),
      ]);

      const stampsMap = Object.fromEntries((stampsRes.data ?? []).map(s => [s.card_id, s.current_stamps]));
      const pointsMap = Object.fromEntries((pointsRes.data ?? []).map(s => [s.card_id, s.current_points]));

      setClients(cards.map(c => ({
        ...c,
        current_stamps: stampsMap[c.id] ?? 0,
        current_points: pointsMap[c.id] ?? 0,
      })));
      setLoading(false);
    };
    load();
  }, [business]);

  const now = new Date();
  const isInactive = (last?: string | null) => !last || (now.getTime() - new Date(last).getTime()) / 86400000 > 30;

  const filtered = clients.filter(c => {
    const stamps = c.current_stamps;
    if (search && !c.customer_name.toLowerCase().includes(search.toLowerCase()) && !c.phone?.includes(search)) return false;
    if (tab === "Actifs") return !isInactive(c.last_scan_at);
    if (tab === "Inactifs") return isInactive(c.last_scan_at);
    if (tab === "Récompense dispo") return stamps >= (business?.goal ?? 10);
    return true;
  });

  const selectedClient = selected ? clients.find(c => c.id === selected) : null;
  const goal = business?.goal ?? 10;

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Mes clients</h1>
          <p className="text-dark-400 text-sm mt-0.5">{clients.length} clients · {clients.filter(c => !isInactive(c.last_scan_at)).length} actifs ce mois</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2 text-sm py-2.5"><Download size={16} />Exporter</button>
          <button className="btn-primary flex items-center gap-2 text-sm py-2.5"><UserPlus size={16} />Ajouter manuellement</button>
        </div>
      </div>

      <div className="flex gap-6">
        <div className={cn("glass-card p-6 transition-all", selected ? "flex-1" : "w-full")}>
          <div className="flex flex-col sm:flex-row gap-4 mb-5">
            <div className="flex gap-1 bg-dark-900 p-1 rounded-xl">
              {tabs.map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap",
                    tab === t ? "bg-brand-500/20 text-brand-300 border border-brand-500/30" : "text-dark-400 hover:text-white")}>
                  {t}
                </button>
              ))}
            </div>
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher par nom ou téléphone..." className="input-field pl-9 py-2 text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-3 py-2 text-xs text-dark-500 font-medium border-b border-white/5 mb-1">
            <span>Client</span><span className="hidden sm:block">Progression</span>
            <span className="hidden md:block">Wallet</span><span className="hidden md:block">Dernière visite</span><span />
          </div>

          {loading ? (
            <div className="py-12 flex justify-center"><div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center"><p className="text-dark-500 text-sm">{clients.length === 0 ? "Aucun client encore. Partagez votre QR code !" : "Aucun client trouvé"}</p></div>
          ) : (
            <div className="space-y-0.5">
              {filtered.map(c => {
                const stamps = business?.mode === "stamps" ? c.current_stamps : c.current_points;
                const inactive = isInactive(c.last_scan_at);
                const hasReward = stamps >= goal;
                return (
                  <div key={c.id} onClick={() => setSelected(selected === c.id ? null : c.id)}
                    className={cn("grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 items-center px-3 py-3.5 rounded-xl transition-all cursor-pointer",
                      selected === c.id ? "bg-brand-500/10 border border-brand-500/20" : "hover:bg-white/3")}>
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar name={c.customer_name} size="sm" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{c.customer_name}</p>
                        <p className="text-xs text-dark-500 truncate">{c.phone || c.email}</p>
                      </div>
                      {hasReward && <span className="badge-success hidden sm:inline-flex">🎁 Récompense</span>}
                      {inactive && !hasReward && <span className="badge-warning hidden sm:inline-flex"><AlertCircle size={10} /> Inactif</span>}
                    </div>
                    <div className="hidden sm:flex items-center gap-2">
                      <ProgressBar value={stamps} max={goal} />
                      <span className="text-xs text-dark-400 whitespace-nowrap">{stamps}/{goal}</span>
                    </div>
                    <div className="hidden md:flex items-center gap-1.5">
                      {c.wallet_type
                        ? <span className={cn("text-xs font-medium", c.wallet_type === "apple" ? "text-white" : "text-green-400")}>{c.wallet_type === "apple" ? "🍎 Apple" : "🤖 Google"}</span>
                        : <span className="text-xs text-dark-500">—</span>}
                    </div>
                    <div className="hidden md:block">
                      <p className={cn("text-xs", inactive ? "text-amber-400" : "text-dark-400")}>{c.last_scan_at ? formatDate(c.last_scan_at) : "Jamais"}</p>
                    </div>
                    <ChevronRight size={14} className={cn("text-dark-600 transition-all", selected === c.id ? "rotate-90 text-brand-400" : "")} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {selectedClient && (
          <div className="w-80 flex-shrink-0 space-y-4 animate-slide-in">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-white">Détails</h3>
                <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"><X size={15} className="text-dark-400" /></button>
              </div>
              <div className="flex flex-col items-center mb-6">
                <Avatar name={selectedClient.customer_name} size="lg" className="mb-3" />
                <h4 className="font-semibold text-white">{selectedClient.customer_name}</h4>
                <p className="text-sm text-dark-400">{selectedClient.phone || selectedClient.email}</p>
                {selectedClient.wallet_type && (
                  <span className="badge-primary mt-2">{selectedClient.wallet_type === "apple" ? "🍎 Apple Wallet" : "🤖 Google Wallet"}</span>
                )}
              </div>
              <div className="mb-5">
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-dark-400">Progression</span>
                  <span className="text-white font-semibold">{selectedClient.current_stamps}/{goal}</span>
                </div>
                <StampGrid current={selectedClient.current_stamps} goal={goal} size="sm" />
              </div>
              <div className="space-y-2.5 text-sm border-t border-white/5 pt-4">
                <div className="flex justify-between">
                  <span className="text-dark-400">Inscrit le</span>
                  <span className="text-dark-200">{formatDate(selectedClient.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-400">Dernière visite</span>
                  <span className={cn(isInactive(selectedClient.last_scan_at) ? "text-amber-400" : "text-dark-200")}>
                    {selectedClient.last_scan_at ? formatDate(selectedClient.last_scan_at) : "Jamais"}
                  </span>
                </div>
              </div>
              <div className="mt-5 space-y-2">
                {selectedClient.current_stamps >= goal && (
                  <button className="w-full btn-primary flex items-center justify-center gap-2 text-sm py-2.5"><Gift size={15} />Appliquer la récompense</button>
                )}
                <button className="w-full btn-secondary flex items-center justify-center gap-2 text-sm py-2.5"><Smartphone size={15} />Envoyer push</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
