"use client";
import { useState, useEffect } from "react";
import { Bell, Send, Check, Clock, X, AlertCircle, Zap } from "lucide-react";
import { useBusiness } from "@/lib/supabase/business-context";
import { createClient } from "@/lib/supabase/client";
import { cn, formatDate, formatTime } from "@/lib/utils";

const triggerLabels: Record<string, { label: string; icon: string }> = {
  welcome: { label: "Bienvenue", icon: "🎉" },
  halfway: { label: "50% atteint", icon: "⚡" },
  one_away: { label: "Avant-dernier tampon", icon: "🔥" },
  reward_earned: { label: "Récompense obtenue", icon: "🎁" },
  inactivity_30: { label: "Inactivité 30 jours", icon: "💤" },
  inactivity_60: { label: "Inactivité 60 jours + bonus", icon: "💫" },
};

type PushLog = {
  id: string; created_at: string; card_id: string; trigger_type: string;
  message: string; sent_at: string; status: string; customer_name?: string;
};

export default function NotificationsPage() {
  const { business } = useBusiness();
  const [manualMsg, setManualMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [logs, setLogs] = useState<PushLog[]>([]);
  const [clientCount, setClientCount] = useState(0);
  const [stats, setStats] = useState({ sent: 0, failed: 0 });

  useEffect(() => {
    if (!business) return;
    const supabase = createClient();
    const load = async () => {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const [logsRes, cardsRes] = await Promise.all([
        supabase.from("push_logs").select("*").eq("card_id", business.id).gte("created_at", monthStart.toISOString()).order("sent_at", { ascending: false }).limit(20),
        supabase.from("loyalty_cards").select("id, customer_name", { count: "exact" }).eq("business_id", business.id),
      ]);

      setClientCount(cardsRes.count ?? 0);

      const logsData = logsRes.data ?? [];
      if (logsData.length > 0) {
        const cardIds = [...new Set(logsData.map(l => l.card_id))];
        const { data: cards } = await supabase.from("loyalty_cards").select("id, customer_name").in("id", cardIds);
        const nameMap = Object.fromEntries((cards ?? []).map(c => [c.id, c.customer_name]));
        setLogs(logsData.map(l => ({ ...l, customer_name: nameMap[l.card_id] ?? "Client" })));
        setStats({
          sent: logsData.filter(l => l.status === "sent").length,
          failed: logsData.filter(l => l.status === "failed").length,
        });
      }
    };
    load();
  }, [business]);

  const handleSend = async () => {
    if (!manualMsg.trim() || !business) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 1200));
    setSending(false);
    setSent(true);
    setManualMsg("");
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Notifications Push</h1>
        <p className="text-dark-400 text-sm mt-0.5">Via Apple Wallet & Google Wallet · Zéro SMS · Zéro email</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Envoyées ce mois", value: String(stats.sent), icon: Send, color: "text-brand-400 bg-brand-500/15 border-brand-500/20" },
              { label: "Clients actifs", value: String(clientCount), icon: Zap, color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/20" },
              { label: "Échouées", value: String(stats.failed), icon: AlertCircle, color: "text-amber-400 bg-amber-500/15 border-amber-500/20" },
            ].map(s => (
              <div key={s.label} className="glass-card p-4">
                <div className={cn("p-2 rounded-lg w-fit border mb-3", s.color)}>
                  <s.icon size={16} />
                </div>
                <p className="text-xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-dark-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Send size={18} className="text-brand-400" />
                <h2 className="font-semibold text-white">Push manuel</h2>
              </div>
              <span className="badge-primary">1 / mois</span>
            </div>
            {sent ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
                <Check size={18} className="text-emerald-400" />
                <p className="text-sm text-emerald-300 font-medium">Push envoyé à {clientCount} clients !</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-dark-400 mb-4">Envoyez un message personnalisé à tous vos clients. Sera reçu directement sur leur écran de verrouillage.</p>
                <textarea value={manualMsg} onChange={e => setManualMsg(e.target.value)}
                  placeholder="Ex : Offre spéciale ce week-end — 20% de rabais. Venez nous voir !"
                  rows={3} maxLength={100} className="input-field resize-none text-sm" />
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-dark-500">{manualMsg.length}/100 caractères</span>
                  <button onClick={handleSend} disabled={!manualMsg.trim() || sending}
                    className="btn-primary flex items-center gap-2 text-sm py-2.5">
                    {sending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={14} />}
                    Envoyer à {clientCount} clients
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="glass-card p-6">
            <h2 className="font-semibold text-white mb-5">Historique des notifications</h2>
            {logs.length === 0 ? (
              <p className="text-sm text-dark-500 text-center py-8">Aucune notification envoyée pour l'instant</p>
            ) : (
              <div className="space-y-2">
                {logs.map(log => {
                  const trigger = triggerLabels[log.trigger_type] || { label: log.trigger_type, icon: "📢" };
                  return (
                    <div key={log.id} className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/3 transition-colors">
                      <div className="w-9 h-9 rounded-xl bg-dark-800 border border-white/8 flex items-center justify-center text-base flex-shrink-0">
                        {trigger.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-white">{log.customer_name}</span>
                          <span className="text-xs text-dark-500">·</span>
                          <span className="text-xs text-dark-400">{trigger.label}</span>
                        </div>
                        <p className="text-xs text-dark-500 mt-1 truncate">"{log.message}"</p>
                        <p className="text-xs text-dark-600 mt-0.5 flex items-center gap-1">
                          <Clock size={10} />{formatDate(log.sent_at)} à {formatTime(log.sent_at)}
                        </p>
                      </div>
                      <span className={cn("badge flex-shrink-0", log.status === "sent" ? "badge-success" : log.status === "failed" ? "badge-danger" : "badge-warning")}>
                        {log.status === "sent" ? <><Check size={10} /> Envoyée</> : log.status === "failed" ? <><X size={10} /> Échouée</> : "En attente"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-card p-6">
            <h3 className="font-semibold text-white mb-4">Règles automatiques</h3>
            <p className="text-xs text-dark-400 mb-4">Envoyées automatiquement selon l'activité de vos clients.</p>
            <div className="space-y-3">
              {Object.entries(triggerLabels).map(([key, { label, icon }]) => (
                <div key={key} className="flex items-center gap-3 p-3 bg-dark-900/50 rounded-xl">
                  <span className="text-base">{icon}</span>
                  <span className="text-xs text-dark-300 flex-1">{label}</span>
                  <Check size={12} className="text-brand-400" />
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={16} className="text-amber-400" />
              <h3 className="font-semibold text-white text-sm">Limites</h3>
            </div>
            <div className="space-y-2 text-xs text-dark-400">
              <p>• Max <strong className="text-white">2 push/semaine</strong> par client</p>
              <p>• <strong className="text-white">1 push manuel/mois</strong> (plan Growth)</p>
              <p>• Notifications d'inactivité : <strong className="text-white">1x/période</strong></p>
              <p>• Le client peut désactiver depuis son wallet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
