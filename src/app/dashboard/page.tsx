"use client";
import {
  Users, QrCode, Gift, AlertCircle, TrendingUp, Download, Send,
  Bell, ArrowRight, Stamp, Check, ChevronRight, Clock
} from "lucide-react";
import Link from "next/link";
import StatCard from "@/components/ui/StatCard";
import { mockBusiness, mockTransactions, mockClients, mockStampStates, mockScanHistory } from "@/lib/mock-data";
import { formatTime, formatDate } from "@/lib/utils";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";

const txTypeMap: Record<string, { label: string; color: string }> = {
  scan: { label: "Scan", color: "badge-primary" },
  reward: { label: "Récompense", color: "badge-success" },
  bonus: { label: "Bonus", color: "badge-warning" },
};

export default function DashboardPage() {
  const biz = mockBusiness;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Bonjour, {biz.name} 👋</h1>
          <p className="text-dark-400 text-sm mt-0.5">Voici votre tableau de bord — {new Date().toLocaleDateString("fr-CA", { weekday: "long", day: "numeric", month: "long" })}</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/scan" className="btn-primary flex items-center gap-2 text-sm py-2.5 px-5">
            <QrCode size={16} />
            Scanner un client
          </Link>
          <button className="btn-secondary flex items-center gap-2 text-sm py-2.5 px-4">
            <Download size={16} />
            QR code
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Clients actifs ce mois" value={biz.active_clients} icon={Users} trend={12} color="brand" />
        <StatCard title="Scans aujourd'hui" value={biz.scans_today} icon={QrCode} trend={5} color="cyan" />
        <StatCard title="Récompenses ce mois" value={biz.rewards_this_month} icon={Gift} trend={-3} color="emerald" />
        <StatCard title="Clients à relancer" value={biz.inactive_clients} icon={AlertCircle} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scan Activity Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-white">Activité des 7 derniers jours</h2>
              <p className="text-xs text-dark-400 mt-0.5">Scans quotidiens</p>
            </div>
            <span className="badge-primary">Ce mois</span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={mockScanHistory}>
              <defs>
                <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff" }}
                labelStyle={{ color: "#94a3b8", fontSize: "12px" }}
              />
              <Area type="monotone" dataKey="scans" stroke="#6366f1" strokeWidth={2} fill="url(#scanGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Program Summary */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white">Votre programme</h2>
            <Link href="/dashboard/settings" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
              Modifier <ChevronRight size={12} />
            </Link>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-brand-500/10 border border-brand-500/20 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Stamp size={16} className="text-brand-400" />
                <span className="text-sm font-medium text-white">Mode Tampons</span>
              </div>
              <p className="text-xs text-dark-400">Objectif : <strong className="text-white">{biz.goal} tampons</strong></p>
              <p className="text-xs text-dark-400 mt-0.5">Récompense : <strong className="text-white">{biz.reward_description}</strong></p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-dark-400">Total clients</span>
                <span className="text-white font-semibold">{mockClients.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-dark-400">Scans ce mois</span>
                <span className="text-white font-semibold">186</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-dark-400">Taux complétion</span>
                <span className="text-emerald-400 font-semibold">74%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Transactions */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white">Activité récente</h2>
            <Link href="/dashboard/clients" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
              Voir tout <ChevronRight size={12} />
            </Link>
          </div>
          <div className="space-y-1">
            {mockTransactions.slice(0, 6).map((tx) => (
              <div key={tx.id} className="flex items-center gap-4 py-3 px-3 rounded-xl hover:bg-white/3 transition-colors">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500/30 to-accent-purple/30 flex items-center justify-center flex-shrink-0 text-sm font-bold text-brand-300">
                  {tx.customer_name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{tx.customer_name}</p>
                  <p className="text-xs text-dark-400 flex items-center gap-1">
                    <Clock size={10} />
                    {formatDate(tx.created_at)} à {formatTime(tx.created_at)}
                  </p>
                </div>
                <span className={txTypeMap[tx.type].color}>{txTypeMap[tx.type].label}</span>
                {tx.stamps_delta !== undefined && tx.stamps_delta > 0 && (
                  <span className="text-xs text-brand-400 font-semibold">+{tx.stamps_delta}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="glass-card p-5">
            <h2 className="font-semibold text-white mb-4">Actions rapides</h2>
            <div className="space-y-3">
              <Link href="/dashboard/scan" className="w-full flex items-center gap-3 p-3 bg-brand-500/10 border border-brand-500/20 rounded-xl hover:bg-brand-500/15 transition-all">
                <QrCode size={18} className="text-brand-400" />
                <span className="text-sm text-white font-medium">Scanner un client</span>
                <ArrowRight size={14} className="ml-auto text-brand-400" />
              </Link>
              <button className="w-full flex items-center gap-3 p-3 bg-dark-800/50 border border-white/8 rounded-xl hover:bg-dark-700/50 hover:border-white/15 transition-all">
                <Send size={18} className="text-purple-400" />
                <span className="text-sm text-white font-medium">Push manuel</span>
                <span className="ml-auto text-xs text-dark-500 bg-dark-700 px-2 py-0.5 rounded-full">1/mois</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-dark-800/50 border border-white/8 rounded-xl hover:bg-dark-700/50 hover:border-white/15 transition-all">
                <Download size={18} className="text-cyan-400" />
                <span className="text-sm text-white font-medium">Télécharger QR code</span>
                <ArrowRight size={14} className="ml-auto text-dark-500" />
              </button>
              <Link href="/dashboard/notifications" className="w-full flex items-center gap-3 p-3 bg-dark-800/50 border border-white/8 rounded-xl hover:bg-dark-700/50 hover:border-white/15 transition-all">
                <Bell size={18} className="text-amber-400" />
                <span className="text-sm text-white font-medium">Notifications</span>
                <span className="ml-auto w-5 h-5 bg-amber-500 rounded-full text-xs flex items-center justify-center text-white font-bold">3</span>
              </Link>
            </div>
          </div>

          {/* Top clients today */}
          <div className="glass-card p-5">
            <h2 className="font-semibold text-white mb-3 text-sm">Clients d'aujourd'hui</h2>
            <div className="space-y-2">
              {mockClients.slice(0, 3).map(c => (
                <div key={c.id} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-accent-purple flex items-center justify-center text-xs font-bold text-white">
                    {c.customer_name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">{c.customer_name}</p>
                    <p className="text-xs text-dark-500">{mockStampStates[c.id]}/{biz.goal} tampons</p>
                  </div>
                  <div className="w-16 h-1.5 bg-dark-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-brand-500 to-accent-purple rounded-full" style={{ width: `${(mockStampStates[c.id] / biz.goal) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
