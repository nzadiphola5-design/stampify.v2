"use client";
import { Bell, Send, Check, X, Clock, Zap, AlertCircle } from "lucide-react";
import { mockPushLogs, mockClients, adminMockBusinesses } from "@/lib/mock-data";
import { cn, formatDate, formatTime } from "@/lib/utils";

const triggerLabels: Record<string, { label: string; icon: string }> = {
  welcome: { label: "Bienvenue", icon: "🎉" },
  halfway: { label: "50% atteint", icon: "⚡" },
  one_away: { label: "Avant-dernier", icon: "🔥" },
  reward_earned: { label: "Récompense", icon: "🎁" },
  inactivity_30: { label: "Inactivité 30j", icon: "💤" },
  inactivity_60: { label: "Inactivité 60j", icon: "💫" },
};

export default function AdminNotificationsPage() {
  const allPushLogs = [...mockPushLogs, ...mockPushLogs].map((p, i) => ({ ...p, id: `p${i}` }));
  const sent = allPushLogs.filter(p => p.status === "sent").length;
  const failed = allPushLogs.filter(p => p.status === "failed").length;

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Notifications Push</h1>
        <p className="text-dark-400 text-sm mt-0.5">Historique global des notifications wallet</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Envoyées aujourd'hui", value: "421", color: "text-brand-400 bg-brand-500/15 border-brand-500/20", icon: Send },
          { label: "Taux de livraison", value: "98.1%", color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/20", icon: Check },
          { label: "Taux d'ouverture moyen", value: "42%", color: "text-cyan-400 bg-cyan-500/15 border-cyan-500/20", icon: Zap },
          { label: "Échouées", value: String(failed), color: "text-amber-400 bg-amber-500/15 border-amber-500/20", icon: AlertCircle },
        ].map(s => (
          <div key={s.label} className="glass-card p-4">
            <div className={cn("p-2 rounded-lg w-fit border mb-3", s.color)}><s.icon size={16} /></div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-dark-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Push Log Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="font-semibold text-white">Journal des notifications</h2>
          <span className="badge-primary">{allPushLogs.length} entrées</span>
        </div>

        <div className="grid grid-cols-[auto_2fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-3 text-xs text-dark-500 font-medium bg-dark-900/50 border-b border-white/5">
          <span>Icône</span>
          <span>Message</span>
          <span>Client</span>
          <span>Commerce</span>
          <span>Heure</span>
          <span>Statut</span>
        </div>

        <div className="divide-y divide-white/3 max-h-[500px] overflow-y-auto">
          {allPushLogs.map((log) => {
            const trigger = triggerLabels[log.trigger_type] || { label: log.trigger_type, icon: "📢" };
            const client = mockClients.find(c => c.id === log.card_id);
            const biz = adminMockBusinesses[0];
            return (
              <div key={log.id} className="grid grid-cols-[auto_2fr_1fr_1fr_1fr_1fr] gap-4 items-center px-6 py-3.5 hover:bg-white/2 transition-colors">
                <span className="text-lg">{trigger.icon}</span>
                <p className="text-xs text-dark-300 truncate">"{log.message}"</p>
                <p className="text-xs text-dark-200 truncate">{client?.customer_name || "—"}</p>
                <p className="text-xs text-dark-400 truncate">{biz.name}</p>
                <p className="text-xs text-dark-500 flex items-center gap-1">
                  <Clock size={10} />
                  {formatTime(log.sent_at)}
                </p>
                <span className={cn("badge", log.status === "sent" ? "badge-success" : log.status === "failed" ? "badge-danger" : "badge-warning")}>
                  {log.status === "sent" ? <><Check size={10} /> Envoyée</> : log.status === "failed" ? <><X size={10} /> Échec</> : "Attente"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
