"use client";
import { useParams } from "next/navigation";
import {
  ArrowLeft, Stamp, TrendingUp, Users, QrCode, Bell, Gift,
  AlertCircle, Clock, Check, ChevronRight, Send
} from "lucide-react";
import Link from "next/link";
import { adminMockBusinesses, mockClients, mockStampStates, mockTransactions, mockPushLogs } from "@/lib/mock-data";
import { cn, formatDate, formatTime } from "@/lib/utils";
import StatCard from "@/components/ui/StatCard";
import ProgressBar from "@/components/ui/ProgressBar";

export default function AdminBusinessDetailPage() {
  const { id } = useParams();
  const biz = adminMockBusinesses.find(b => b.id === id) || adminMockBusinesses[0];

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <Link href="/admin/businesses" className="flex items-center gap-2 text-sm text-dark-400 hover:text-white transition-colors mb-4">
          <ArrowLeft size={14} />
          Retour aux commerces
        </Link>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-brand-500 to-accent-purple rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-glow">
              {biz.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{biz.name}</h1>
              <p className="text-dark-400 text-sm mt-0.5">{biz.type} · {biz.city}</p>
              <div className="flex gap-2 mt-2">
                <span className={cn("badge", biz.mode === "stamps" ? "badge-primary" : "badge-cyan")}>
                  {biz.mode === "stamps" ? "Tampons" : "Points"}
                </span>
                <span className={cn("badge capitalize", biz.plan === "pro" ? "bg-purple-500/20 text-purple-300 border-purple-500/30" : biz.plan === "growth" ? "badge-primary" : "badge-warning")}>
                  {biz.plan}
                </span>
                <span className="badge-success">Actif</span>
              </div>
            </div>
          </div>
          <button className="btn-secondary flex items-center gap-2 text-sm py-2.5">
            <Send size={14} />
            Envoyer push
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Clients actifs" value={biz.active_clients} icon={Users} color="brand" />
        <StatCard title="Scans aujourd'hui" value={biz.scans_today} icon={QrCode} color="cyan" />
        <StatCard title="Récompenses ce mois" value={biz.rewards_this_month} icon={Gift} color="emerald" />
        <StatCard title="Clients inactifs" value={biz.inactive_clients} icon={AlertCircle} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Program details */}
        <div className="glass-card p-6">
          <h2 className="font-semibold text-white mb-5">Programme de fidélité</h2>
          <div className="space-y-3">
            {[
              { label: "Mode", value: biz.mode === "stamps" ? "Tampons" : "Points" },
              { label: "Objectif", value: `${biz.goal} ${biz.mode === "stamps" ? "tampons" : "points"}` },
              { label: "Récompense", value: biz.reward_description },
              { label: "Inscrit depuis", value: formatDate(biz.created_at) },
            ].map(r => (
              <div key={r.label} className="flex justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-sm text-dark-400">{r.label}</span>
                <span className="text-sm font-medium text-white">{r.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top clients */}
        <div className="glass-card p-6">
          <h2 className="font-semibold text-white mb-5">Top clients</h2>
          <div className="space-y-3">
            {mockClients.slice(0, 5).map(c => {
              const stamps = mockStampStates[c.id] ?? 0;
              return (
                <div key={c.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-accent-purple rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {c.customer_name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">{c.customer_name}</p>
                    <ProgressBar value={stamps} max={biz.goal} className="mt-1" />
                  </div>
                  <span className="text-xs text-dark-400">{stamps}/{biz.goal}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent transactions */}
        <div className="glass-card p-6">
          <h2 className="font-semibold text-white mb-5">Transactions récentes</h2>
          <div className="space-y-2">
            {mockTransactions.slice(0, 5).map(tx => (
              <div key={tx.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
                  tx.type === "reward" ? "bg-amber-500/20" : tx.type === "bonus" ? "bg-purple-500/20" : "bg-brand-500/20"
                )}>
                  {tx.type === "reward" ? <Gift size={12} className="text-amber-400" /> : tx.type === "bonus" ? <Bell size={12} className="text-purple-400" /> : <Stamp size={12} className="text-brand-400" />}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-white">{tx.customer_name}</p>
                  <p className="text-xs text-dark-500 flex items-center gap-1">
                    <Clock size={9} />
                    {formatTime(tx.created_at)}
                  </p>
                </div>
                <span className={cn("badge text-xs", tx.type === "reward" ? "badge-warning" : tx.type === "bonus" ? "bg-purple-500/20 text-purple-300 border-purple-500/30 badge" : "badge-primary")}>
                  {tx.type === "reward" ? "Récompense" : tx.type === "bonus" ? "Bonus" : "Scan"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Push log */}
        <div className="glass-card p-6">
          <h2 className="font-semibold text-white mb-5">Notifications push</h2>
          <div className="space-y-2">
            {mockPushLogs.map(log => (
              <div key={log.id} className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0">
                <div className="w-7 h-7 bg-dark-800 rounded-lg flex items-center justify-center text-sm flex-shrink-0">
                  {log.trigger_type === "reward_earned" ? "🎁" : log.trigger_type.includes("inactivity") ? "💤" : "⚡"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-dark-300 truncate">"{log.message}"</p>
                  <p className="text-xs text-dark-600 mt-0.5">{formatDate(log.sent_at)}</p>
                </div>
                <span className={cn("badge text-xs flex-shrink-0", log.status === "sent" ? "badge-success" : "badge-danger")}>
                  {log.status === "sent" ? "✓" : "✗"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
