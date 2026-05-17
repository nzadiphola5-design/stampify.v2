"use client";
import {
  Store, Users, QrCode, Bell, DollarSign, TrendingUp,
  Activity, Shield, ArrowRight, ChevronRight, Check, Zap
} from "lucide-react";
import Link from "next/link";
import StatCard from "@/components/ui/StatCard";
import { mockAdminStats, adminMockBusinesses, mockRevenueHistory } from "@/lib/mock-data";
import { cn, formatDate } from "@/lib/utils";
import {
  AreaChart, Area, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, Legend
} from "recharts";

const planColors = { starter: "#6366f1", growth: "#06b6d4", pro: "#a855f7" };

export default function AdminPage() {
  const stats = mockAdminStats;

  const planData = [
    { name: "Starter", value: stats.plan_distribution.starter, color: planColors.starter },
    { name: "Growth", value: stats.plan_distribution.growth, color: planColors.growth },
    { name: "Pro", value: stats.plan_distribution.pro, color: planColors.pro },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield size={16} className="text-accent-purple" />
            <span className="text-xs text-accent-purple font-medium uppercase tracking-widest">Admin Panel</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Vue d'ensemble</h1>
          <p className="text-dark-400 text-sm mt-0.5">
            {new Date().toLocaleDateString("fr-CA", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 glass rounded-xl">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-sm text-emerald-300">Tous les systèmes opérationnels</span>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard title="Commerces total" value={stats.total_businesses} icon={Store} trend={8} color="brand" />
        <StatCard title="Commerces actifs" value={stats.active_businesses} icon={Activity} color="emerald" />
        <StatCard title="Cartes total" value={stats.total_cards} icon={Users} trend={15} color="cyan" />
        <StatCard title="Scans aujourd'hui" value={stats.total_scans_today} icon={QrCode} trend={12} color="purple" />
        <StatCard title="Push envoyées auj." value={stats.push_sent_today} icon={Bell} color="amber" />
        <StatCard title="Revenu mensuel" value={`${stats.total_revenue_monthly}$`} icon={DollarSign} trend={23} color="brand" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-white">Revenus mensuels</h2>
              <p className="text-xs text-dark-400 mt-0.5">Abonnements récurrents en CAD</p>
            </div>
            <span className="badge-success flex items-center gap-1"><TrendingUp size={12} /> +23% ce mois</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={mockRevenueHistory}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} width={45} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff" }} />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#revGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Plan Distribution Pie */}
        <div className="glass-card p-6">
          <h2 className="font-semibold text-white mb-4">Répartition des plans</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={planData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                {planData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {planData.map(p => (
              <div key={p.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                  <span className="text-dark-300">{p.name}</span>
                </div>
                <span className="font-semibold text-white">{p.value} <span className="text-dark-500 font-normal">commerces</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Businesses */}
      <div className="mt-6 glass-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-white">Commerces récents</h2>
          <Link href="/admin/businesses" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
            Voir tous <ChevronRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-3 py-2 text-xs text-dark-500 font-medium border-b border-white/5 mb-1">
          <span>Commerce</span>
          <span>Mode</span>
          <span>Clients</span>
          <span>Plan</span>
          <span>Scans auj.</span>
          <span />
        </div>

        <div className="space-y-0.5">
          {adminMockBusinesses.map(biz => (
            <Link
              key={biz.id}
              href={`/admin/businesses/${biz.id}`}
              className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 items-center px-3 py-3.5 rounded-xl hover:bg-white/3 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-accent-purple rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {biz.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{biz.name}</p>
                  <p className="text-xs text-dark-500 truncate">{biz.type} · {biz.city}</p>
                </div>
              </div>
              <span className={cn("badge", biz.mode === "stamps" ? "badge-primary" : "badge-cyan")}>
                {biz.mode === "stamps" ? "Tampons" : "Points"}
              </span>
              <span className="text-sm text-dark-200">{biz.active_clients}</span>
              <span className={cn("badge capitalize", biz.plan === "pro" ? "badge-purple" : biz.plan === "growth" ? "badge-primary" : "badge-warning")}>
                {biz.plan}
              </span>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-brand-400 rounded-full" />
                <span className="text-sm text-dark-200">{biz.scans_today}</span>
              </div>
              <ChevronRight size={14} className="text-dark-600" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
