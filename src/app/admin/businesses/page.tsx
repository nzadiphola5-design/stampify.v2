"use client";
import { useState } from "react";
import {
  Search, Filter, Store, Stamp, TrendingUp, Users,
  QrCode, Check, ChevronRight, MoreHorizontal, Bell, Eye
} from "lucide-react";
import { adminMockBusinesses } from "@/lib/mock-data";
import { cn, formatDate } from "@/lib/utils";
import Link from "next/link";

const planFilters = ["Tous", "Starter", "Growth", "Pro"];
const modeFilters = ["Tous modes", "Tampons", "Points"];

export default function AdminBusinessesPage() {
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("Tous");
  const [modeFilter, setModeFilter] = useState("Tous modes");

  const filtered = adminMockBusinesses.filter(b => {
    if (search && !b.name.toLowerCase().includes(search.toLowerCase()) && !b.city.toLowerCase().includes(search.toLowerCase())) return false;
    if (planFilter !== "Tous" && b.plan !== planFilter.toLowerCase()) return false;
    if (modeFilter === "Tampons" && b.mode !== "stamps") return false;
    if (modeFilter === "Points" && b.mode !== "points") return false;
    return true;
  });

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Commerces</h1>
        <p className="text-dark-400 text-sm mt-0.5">{adminMockBusinesses.length} commerces enregistrés</p>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par nom ou ville..."
            className="input-field pl-9 py-2 text-sm"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="flex gap-1 bg-dark-900 p-1 rounded-xl">
            {planFilters.map(f => (
              <button key={f} onClick={() => setPlanFilter(f)} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all", planFilter === f ? "bg-brand-500/20 text-brand-300 border border-brand-500/30" : "text-dark-400 hover:text-white")}>
                {f}
              </button>
            ))}
          </div>
          <div className="flex gap-1 bg-dark-900 p-1 rounded-xl">
            {modeFilters.map(f => (
              <button key={f} onClick={() => setModeFilter(f)} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all", modeFilter === f ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-dark-400 hover:text-white")}>
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 text-xs text-dark-500 font-medium bg-dark-900/50 border-b border-white/5">
          <span>Commerce</span>
          <span>Mode</span>
          <span>Clients actifs</span>
          <span>Scans auj.</span>
          <span>Récompenses</span>
          <span>Plan</span>
          <span />
        </div>
        <div className="divide-y divide-white/3">
          {filtered.map(biz => (
            <div key={biz.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto] gap-4 items-center px-6 py-4 hover:bg-white/2 transition-colors group">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-accent-purple rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                  {biz.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{biz.name}</p>
                  <p className="text-xs text-dark-500">{biz.type} · {biz.city}</p>
                </div>
              </div>

              <div>
                <span className={cn("badge", biz.mode === "stamps" ? "badge-primary" : "badge-cyan")}>
                  {biz.mode === "stamps" ? <><Stamp size={10} /> Tampons</> : <><TrendingUp size={10} /> Points</>}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <Users size={13} className="text-dark-500" />
                <span className="text-sm text-dark-200">{biz.active_clients}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <div className={cn("w-1.5 h-1.5 rounded-full", biz.scans_today > 0 ? "bg-emerald-400 animate-pulse" : "bg-dark-700")} />
                <span className="text-sm text-dark-200">{biz.scans_today}</span>
              </div>

              <span className="text-sm text-dark-200">{biz.rewards_this_month}</span>

              <span className={cn("badge capitalize", biz.plan === "pro" ? "bg-purple-500/20 text-purple-300 border-purple-500/30" : biz.plan === "growth" ? "badge-primary" : "badge-warning")}>
                {biz.plan}
              </span>

              <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link href={`/admin/businesses/${biz.id}`} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
                  <Eye size={14} className="text-dark-400 hover:text-white" />
                </Link>
                <button className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
                  <Bell size={14} className="text-dark-400 hover:text-white" />
                </button>
                <button className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
                  <MoreHorizontal size={14} className="text-dark-400 hover:text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-dark-500">
          <Store size={32} className="mx-auto mb-3 opacity-30" />
          <p>Aucun commerce trouvé</p>
        </div>
      )}
    </div>
  );
}
