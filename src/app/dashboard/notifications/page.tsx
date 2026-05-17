"use client";
import { useState } from "react";
import { Bell, Send, Check, Clock, X, AlertCircle, Zap, Users, ChevronRight } from "lucide-react";
import { mockPushLogs, mockClients, mockBusiness } from "@/lib/mock-data";
import { cn, formatDate, formatTime } from "@/lib/utils";

const triggerLabels: Record<string, { label: string; icon: string }> = {
  welcome: { label: "Bienvenue", icon: "🎉" },
  halfway: { label: "50% atteint", icon: "⚡" },
  one_away: { label: "Avant-dernier tampon", icon: "🔥" },
  reward_earned: { label: "Récompense obtenue", icon: "🎁" },
  inactivity_30: { label: "Inactivité 30 jours", icon: "💤" },
  inactivity_60: { label: "Inactivité 60 jours + bonus", icon: "💫" },
};

export default function NotificationsPage() {
  const [manualMsg, setManualMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const biz = mockBusiness;

  const handleSend = async () => {
    if (!manualMsg.trim()) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 1200));
    setSending(false);
    setSent(true);
    setManualMsg("");
    setTimeout(() => setSent(false), 3000);
  };

  const stats = {
    sent: mockPushLogs.filter(p => p.status === "sent").length,
    failed: mockPushLogs.filter(p => p.status === "failed").length,
    rate: "42%",
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Notifications Push</h1>
        <p className="text-dark-400 text-sm mt-0.5">
          Via Apple Wallet & Google Wallet · Zéro SMS · Zéro email
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Logs + Manual */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Envoyées ce mois", value: "47", icon: Send, color: "text-brand-400 bg-brand-500/15 border-brand-500/20" },
              { label: "Taux d'ouverture", value: stats.rate, icon: Zap, color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/20" },
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

          {/* Push Manual */}
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
                <p className="text-sm text-emerald-300 font-medium">Push envoyé à {mockClients.length} clients !</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-dark-400 mb-4">
                  Envoyez un message personnalisé à tous vos clients.
                  Sera reçu directement sur leur écran de verrouillage.
                </p>
                <textarea
                  value={manualMsg}
                  onChange={e => setManualMsg(e.target.value)}
                  placeholder="Ex : Offre spéciale ce week-end — 20% de rabais sur toutes les coupes. Venez nous voir !"
                  rows={3}
                  maxLength={100}
                  className="input-field resize-none text-sm"
                />
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-dark-500">{manualMsg.length}/100 caractères</span>
                  <button
                    onClick={handleSend}
                    disabled={!manualMsg.trim() || sending}
                    className="btn-primary flex items-center gap-2 text-sm py-2.5"
                  >
                    {sending ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send size={14} />
                    )}
                    Envoyer à {mockClients.length} clients
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Push Log */}
          <div className="glass-card p-6">
            <h2 className="font-semibold text-white mb-5">Historique des notifications</h2>
            <div className="space-y-2">
              {mockPushLogs.map(log => {
                const trigger = triggerLabels[log.trigger_type] || { label: log.trigger_type, icon: "📢" };
                const client = mockClients.find(c => c.id === log.card_id);
                return (
                  <div key={log.id} className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/3 transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-dark-800 border border-white/8 flex items-center justify-center text-base flex-shrink-0">
                      {trigger.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-white">{client?.customer_name || "Client"}</span>
                        <span className="text-xs text-dark-500">·</span>
                        <span className="text-xs text-dark-400">{trigger.label}</span>
                      </div>
                      <p className="text-xs text-dark-500 mt-1 truncate">"{log.message}"</p>
                      <p className="text-xs text-dark-600 mt-0.5 flex items-center gap-1">
                        <Clock size={10} />
                        {formatDate(log.sent_at)} à {formatTime(log.sent_at)}
                      </p>
                    </div>
                    <span className={cn("badge flex-shrink-0", log.status === "sent" ? "badge-success" : log.status === "failed" ? "badge-danger" : "badge-warning")}>
                      {log.status === "sent" ? <><Check size={10} /> Envoyée</> : log.status === "failed" ? <><X size={10} /> Échouée</> : "En attente"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Rules */}
        <div className="space-y-4">
          <div className="glass-card p-6">
            <h3 className="font-semibold text-white mb-4">Règles automatiques</h3>
            <p className="text-xs text-dark-400 mb-4">Ces notifications sont envoyées automatiquement par Stampify selon l'activité de vos clients.</p>
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
