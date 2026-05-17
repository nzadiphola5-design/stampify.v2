"use client";
import {
  TrendingUp, Users, QrCode, Bell, DollarSign, Zap, BarChart3
} from "lucide-react";
import { mockScanHistory, mockRevenueHistory, adminMockBusinesses } from "@/lib/mock-data";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell
} from "recharts";

const weeklyData = [
  { day: "Lun", scans: 38, rewards: 4, newClients: 7 },
  { day: "Mar", scans: 52, rewards: 7, newClients: 12 },
  { day: "Mer", scans: 45, rewards: 5, newClients: 9 },
  { day: "Jeu", scans: 67, rewards: 9, newClients: 15 },
  { day: "Ven", scans: 84, rewards: 12, newClients: 21 },
  { day: "Sam", scans: 91, rewards: 14, newClients: 18 },
  { day: "Dim", scans: 56, rewards: 8, newClients: 11 },
];

const cityData = [
  { city: "Montréal", businesses: 22, clients: 2840 },
  { city: "Québec", businesses: 11, clients: 1420 },
  { city: "Ottawa", businesses: 7, clients: 890 },
  { city: "Laval", businesses: 4, clients: 510 },
  { city: "Autres", businesses: 4, clients: 624 },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Analytiques</h1>
        <p className="text-dark-400 text-sm mt-0.5">Métriques plateforme en temps réel</p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Taux rétention M1", value: "83%", trend: "+3%", icon: Users, color: "text-brand-400 bg-brand-500/15 border-brand-500/20" },
          { label: "NPS commerçants", value: "67", trend: "+5", icon: TrendingUp, color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/20" },
          { label: "Onboarding < 5min", value: "94%", trend: "+2%", icon: Zap, color: "text-cyan-400 bg-cyan-500/15 border-cyan-500/20" },
          { label: "Taux push ouverture", value: "42%", trend: "+7%", icon: Bell, color: "text-purple-400 bg-purple-500/15 border-purple-500/20" },
        ].map(k => (
          <div key={k.label} className="glass-card p-5">
            <div className={`p-2.5 rounded-xl w-fit border mb-3 ${k.color}`}>
              <k.icon size={18} />
            </div>
            <p className="text-3xl font-bold text-white">{k.value}</p>
            <p className="text-xs text-dark-400 mt-1">{k.label}</p>
            <p className="text-xs text-emerald-400 mt-0.5">{k.trend} vs mois dernier</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <div className="glass-card p-6">
          <h2 className="font-semibold text-white mb-1">Activité hebdomadaire</h2>
          <p className="text-xs text-dark-400 mb-5">Scans, récompenses & nouveaux clients</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyData} barSize={8}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} width={30} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff" }} />
              <Bar dataKey="scans" fill="#6366f1" radius={[4,4,0,0]} />
              <Bar dataKey="newClients" fill="#06b6d4" radius={[4,4,0,0]} />
              <Bar dataKey="rewards" fill="#a855f7" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-3 justify-center">
            {[["Scans", "#6366f1"], ["Nouveaux clients", "#06b6d4"], ["Récompenses", "#a855f7"]].map(([label, color]) => (
              <div key={label} className="flex items-center gap-1.5 text-xs text-dark-400">
                <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Revenue trend */}
        <div className="glass-card p-6">
          <h2 className="font-semibold text-white mb-1">Croissance des revenus</h2>
          <p className="text-xs text-dark-400 mb-5">Abonnements mensuels récurrents (ARR trend)</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={mockRevenueHistory}>
              <defs>
                <linearGradient id="revG2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} width={45} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff" }} formatter={(v) => [`${v}$`, "Revenu"]} />
              <Area type="monotone" dataKey="revenue" stroke="#a855f7" strokeWidth={2} fill="url(#revG2)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Cities breakdown */}
        <div className="glass-card p-6">
          <h2 className="font-semibold text-white mb-5">Répartition géographique</h2>
          <div className="space-y-3">
            {cityData.map(c => (
              <div key={c.city} className="flex items-center gap-4">
                <span className="text-sm text-dark-300 w-24 flex-shrink-0">{c.city}</span>
                <div className="flex-1 h-2 bg-dark-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-500 to-accent-purple rounded-full"
                    style={{ width: `${(c.businesses / 22) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-dark-400 w-28 text-right">{c.businesses} com. · {c.clients} clients</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top performers */}
        <div className="glass-card p-6">
          <h2 className="font-semibold text-white mb-5">Top commerces ce mois</h2>
          <div className="space-y-3">
            {adminMockBusinesses
              .sort((a, b) => b.active_clients - a.active_clients)
              .slice(0, 5)
              .map((biz, i) => (
                <div key={biz.id} className="flex items-center gap-4">
                  <span className="text-dark-500 text-sm font-mono w-4">#{i + 1}</span>
                  <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-accent-purple rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {biz.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{biz.name}</p>
                    <p className="text-xs text-dark-500">{biz.city}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">{biz.active_clients}</p>
                    <p className="text-xs text-dark-500">clients</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
