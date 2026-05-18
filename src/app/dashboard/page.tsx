"use client";
import { useEffect, useState } from "react";
import {
  Users, QrCode, Gift, AlertCircle, Download,
  ArrowRight, Stamp, TrendingUp, ChevronRight, Clock
} from "lucide-react";
import Link from "next/link";
import StatCard from "@/components/ui/StatCard";
import { useBusiness } from "@/lib/supabase/business-context";
import { createClient } from "@/lib/supabase/client";
import { formatTime, formatDate } from "@/lib/utils";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";

type Transaction = {
  id: string; created_at: string; type: string;
  stamps_delta: number | null; customer_name: string;
};

const txTypeMap: Record<string, { label: string; color: string }> = {
  scan: { label: "Scan", color: "badge-primary" },
  reward: { label: "Récompense", color: "badge-success" },
  bonus: { label: "Bonus", color: "badge-warning" },
};

export default function DashboardPage() {
  const { business } = useBusiness();
  const [stats, setStats] = useState({ total: 0, today: 0, rewards: 0, inactive: 0 });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [chartData, setChartData] = useState<{ day: string; scans: number }[]>([]);

  useEffect(() => {
    if (!business) return;
    const supabase = createClient();

    const load = async () => {
      const now = new Date();
      const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0);
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const [cardsRes, todayRes, rewardsRes, txRes, chartRes] = await Promise.all([
        supabase.from("loyalty_cards").select("id, last_scan_at", { count: "exact" }).eq("business_id", business.id),
        supabase.from("transactions").select("id", { count: "exact" }).eq("business_id", business.id).eq("type", "scan").gte("created_at", todayStart.toISOString()),
        supabase.from("transactions").select("id", { count: "exact" }).eq("business_id", business.id).eq("type", "reward").gte("created_at", monthStart.toISOString()),
        supabase.from("transactions").select("id, created_at, type, stamps_delta, card_id").eq("business_id", business.id).order("created_at", { ascending: false }).limit(6),
        supabase.from("transactions").select("created_at").eq("business_id", business.id).eq("type", "scan").gte("created_at", sevenDaysAgo.toISOString()),
      ]);

      const inactive = (cardsRes.data ?? []).filter(c => !c.last_scan_at || new Date(c.last_scan_at) < thirtyDaysAgo).length;
      setStats({ total: cardsRes.count ?? 0, today: todayRes.count ?? 0, rewards: rewardsRes.count ?? 0, inactive });

      // Enrich transactions with customer names
      const txData = txRes.data ?? [];
      if (txData.length > 0) {
        const cardIds = [...new Set(txData.map(t => t.card_id))];
        const { data: cards } = await supabase.from("loyalty_cards").select("id, customer_name").in("id", cardIds);
        const nameMap = Object.fromEntries((cards ?? []).map(c => [c.id, c.customer_name]));
        setTransactions(txData.map(t => ({ ...t, customer_name: nameMap[t.card_id] ?? "Client" })));
      }

      // Build 7-day chart
      const days: Record<string, number> = {};
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now); d.setDate(d.getDate() - i);
        days[d.toLocaleDateString("fr-CA", { weekday: "short" })] = 0;
      }
      (chartRes.data ?? []).forEach(t => {
        const d = new Date(t.created_at).toLocaleDateString("fr-CA", { weekday: "short" });
        if (days[d] !== undefined) days[d]++;
      });
      setChartData(Object.entries(days).map(([day, scans]) => ({ day, scans })));
    };

    load();
  }, [business]);

  if (!business) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Bonjour, {business.name} 👋</h1>
          <p className="text-dark-400 text-sm mt-0.5">{new Date().toLocaleDateString("fr-CA", { weekday: "long", day: "numeric", month: "long" })}</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/scan" className="btn-primary flex items-center gap-2 text-sm py-2.5 px-5">
            <QrCode size={16} />Scanner un client
          </Link>
          <Link href="/dashboard/settings?tab=QR+Code" className="btn-secondary flex items-center gap-2 text-sm py-2.5 px-4">
            <Download size={16} />QR code
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total clients" value={stats.total} icon={Users} color="brand" />
        <StatCard title="Scans aujourd'hui" value={stats.today} icon={QrCode} color="cyan" />
        <StatCard title="Récompenses ce mois" value={stats.rewards} icon={Gift} color="emerald" />
        <StatCard title="Clients inactifs" value={stats.inactive} icon={AlertCircle} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-white">Activité des 7 derniers jours</h2>
              <p className="text-xs text-dark-400 mt-0.5">Scans quotidiens</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff" }} labelStyle={{ color: "#94a3b8", fontSize: "12px" }} />
              <Area type="monotone" dataKey="scans" stroke="#6366f1" strokeWidth={2} fill="url(#scanGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white">Votre programme</h2>
            <Link href="/dashboard/settings" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">Modifier <ChevronRight size={12} /></Link>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-brand-500/10 border border-brand-500/20 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                {business.mode === "stamps" ? <Stamp size={16} className="text-brand-400" /> : <TrendingUp size={16} className="text-cyan-400" />}
                <span className="text-sm font-medium text-white">Mode {business.mode === "stamps" ? "Tampons" : "Points"}</span>
              </div>
              <p className="text-xs text-dark-400">Objectif : <strong className="text-white">{business.goal} {business.mode === "stamps" ? "tampons" : "points"}</strong></p>
              <p className="text-xs text-dark-400 mt-0.5">Récompense : <strong className="text-white">{business.reward_description}</strong></p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-dark-400">Total clients</span>
                <span className="text-white font-semibold">{stats.total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-dark-400">Scans aujourd'hui</span>
                <span className="text-white font-semibold">{stats.today}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white">Activité récente</h2>
            <Link href="/dashboard/clients" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">Voir tout <ChevronRight size={12} /></Link>
          </div>
          {transactions.length === 0
            ? <p className="text-sm text-dark-500 text-center py-8">Aucune activité pour l'instant</p>
            : <div className="space-y-1">
                {transactions.map(tx => (
                  <div key={tx.id} className="flex items-center gap-4 py-3 px-3 rounded-xl hover:bg-white/3 transition-colors">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500/30 to-accent-purple/30 flex items-center justify-center flex-shrink-0 text-sm font-bold text-brand-300">
                      {tx.customer_name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">{tx.customer_name}</p>
                      <p className="text-xs text-dark-400 flex items-center gap-1"><Clock size={10} />{formatDate(tx.created_at)} à {formatTime(tx.created_at)}</p>
                    </div>
                    <span className={txTypeMap[tx.type]?.color ?? "badge-primary"}>{txTypeMap[tx.type]?.label ?? tx.type}</span>
                    {(tx.stamps_delta ?? 0) > 0 && <span className="text-xs text-brand-400 font-semibold">+{tx.stamps_delta}</span>}
                  </div>
                ))}
              </div>}
        </div>

        <div className="space-y-4">
          <div className="glass-card p-5">
            <h2 className="font-semibold text-white mb-4">Actions rapides</h2>
            <div className="space-y-3">
              <Link href="/dashboard/scan" className="w-full flex items-center gap-3 p-3 bg-brand-500/10 border border-brand-500/20 rounded-xl hover:bg-brand-500/15 transition-all">
                <QrCode size={18} className="text-brand-400" />
                <span className="text-sm text-white font-medium">Scanner un client</span>
                <ArrowRight size={14} className="ml-auto text-brand-400" />
              </Link>
              <Link href="/dashboard/settings" className="w-full flex items-center gap-3 p-3 bg-dark-800/50 border border-white/8 rounded-xl hover:bg-dark-700/50 transition-all">
                <Download size={18} className="text-cyan-400" />
                <span className="text-sm text-white font-medium">Télécharger QR code</span>
                <ArrowRight size={14} className="ml-auto text-dark-500" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
