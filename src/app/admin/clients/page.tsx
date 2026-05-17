"use client";
import { useState } from "react";
import { Search, Users, Smartphone, Clock, Bell, Filter } from "lucide-react";
import { mockClients, adminMockBusinesses, mockStampStates } from "@/lib/mock-data";
import { cn, formatDate } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";
import ProgressBar from "@/components/ui/ProgressBar";

export default function AdminClientsPage() {
  const [search, setSearch] = useState("");

  const filtered = mockClients.filter(c =>
    !search || c.customer_name.toLowerCase().includes(search.toLowerCase()) || c.phone?.includes(search)
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Clients</h1>
        <p className="text-dark-400 text-sm mt-0.5">Toutes les cartes de fidélité enregistrées</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total cartes", value: "6 284", color: "text-brand-400 bg-brand-500/15 border-brand-500/20", icon: Users },
          { label: "Apple Wallet", value: "3 891", color: "text-gray-300 bg-dark-700/50 border-white/10", icon: Smartphone },
          { label: "Google Wallet", value: "2 393", color: "text-green-400 bg-green-500/15 border-green-500/20", icon: Smartphone },
        ].map(s => (
          <div key={s.label} className="glass-card p-4">
            <div className={cn("p-2 rounded-lg w-fit border mb-3", s.color)}><s.icon size={16} /></div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-dark-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un client..."
              className="input-field pl-9 py-2 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-3 text-xs text-dark-500 font-medium bg-dark-900/50 border-b border-white/5">
          <span>Client</span>
          <span>Commerce</span>
          <span>Wallet</span>
          <span>Progression</span>
          <span>Dernière visite</span>
        </div>

        <div className="divide-y divide-white/3">
          {filtered.map(c => {
            const stamps = mockStampStates[c.id] ?? 0;
            const biz = adminMockBusinesses[0];
            const isInactive = !c.last_scan_at || (Date.now() - new Date(c.last_scan_at).getTime()) / (1000 * 60 * 60 * 24) > 30;
            return (
              <div key={c.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 items-center px-6 py-4 hover:bg-white/2 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar name={c.customer_name} size="sm" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{c.customer_name}</p>
                    <p className="text-xs text-dark-500 truncate">{c.phone || c.email}</p>
                  </div>
                </div>
                <p className="text-xs text-dark-300 truncate">{biz.name}</p>
                <span className={cn("text-xs font-medium", c.wallet_type === "apple" ? "text-white" : c.wallet_type === "google" ? "text-green-400" : "text-dark-500")}>
                  {c.wallet_type === "apple" ? "🍎 Apple" : c.wallet_type === "google" ? "🤖 Google" : "—"}
                </span>
                <div className="flex items-center gap-2">
                  <ProgressBar value={stamps} max={biz.goal} className="flex-1" />
                  <span className="text-xs text-dark-500 whitespace-nowrap">{stamps}/{biz.goal}</span>
                </div>
                <p className={cn("text-xs", isInactive ? "text-amber-400" : "text-dark-400")}>
                  {c.last_scan_at ? formatDate(c.last_scan_at) : "Jamais"}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
