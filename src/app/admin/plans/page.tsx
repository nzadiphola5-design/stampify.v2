"use client";
import { DollarSign, TrendingUp, Users, CreditCard, Check, Zap, Star } from "lucide-react";
import { adminMockBusinesses } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const planConfig = {
  starter: { price: 0, color: "text-dark-300", bg: "bg-dark-700/50", border: "border-white/10", label: "Gratuit" },
  growth: { price: 29, color: "text-brand-400", bg: "bg-brand-500/10", border: "border-brand-500/30", label: "29$/mois" },
  pro: { price: 79, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30", label: "79$/mois" },
};

export default function AdminPlansPage() {
  const byPlan = {
    starter: adminMockBusinesses.filter(b => b.plan === "starter"),
    growth: adminMockBusinesses.filter(b => b.plan === "growth"),
    pro: adminMockBusinesses.filter(b => b.plan === "pro"),
  };

  const mrr = byPlan.growth.length * 29 + byPlan.pro.length * 79;
  const arr = mrr * 12;

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Plans & Revenus</h1>
        <p className="text-dark-400 text-sm mt-0.5">Abonnements actifs et métriques financières</p>
      </div>

      {/* Revenue KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "MRR", value: `${mrr}$`, icon: DollarSign, color: "text-brand-400 bg-brand-500/15 border-brand-500/20" },
          { label: "ARR (proj.)", value: `${arr.toLocaleString()}$`, icon: TrendingUp, color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/20" },
          { label: "Clients payants", value: String(byPlan.growth.length + byPlan.pro.length), icon: CreditCard, color: "text-cyan-400 bg-cyan-500/15 border-cyan-500/20" },
          { label: "ARPU", value: `${(mrr / Math.max(byPlan.growth.length + byPlan.pro.length, 1)).toFixed(0)}$`, icon: Zap, color: "text-purple-400 bg-purple-500/15 border-purple-500/20" },
        ].map(k => (
          <div key={k.label} className="glass-card p-5">
            <div className={`p-2.5 rounded-xl w-fit border mb-3 ${k.color}`}>
              <k.icon size={18} />
            </div>
            <p className="text-2xl font-bold text-white">{k.value}</p>
            <p className="text-xs text-dark-400 mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Plan breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(["starter", "growth", "pro"] as const).map(plan => {
          const config = planConfig[plan];
          const businesses = byPlan[plan];
          return (
            <div key={plan} className={cn("glass-card p-6 border", config.border)}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {plan === "pro" && <Star size={16} className="text-purple-400" />}
                  <h3 className="font-bold text-white capitalize text-lg">{plan}</h3>
                </div>
                <div className="text-right">
                  <p className={cn("font-bold", config.color)}>{config.label}</p>
                  <p className="text-xs text-dark-500">{businesses.length} commerces</p>
                </div>
              </div>

              <div className={cn("p-3 rounded-xl mb-4", config.bg)}>
                <p className={cn("text-2xl font-bold", config.color)}>
                  {plan === "starter" ? "0$" : `${businesses.length * config.price}$`}
                  <span className="text-sm font-normal text-dark-500 ml-1">/mois</span>
                </p>
              </div>

              <div className="space-y-2.5">
                {businesses.length === 0 ? (
                  <p className="text-sm text-dark-500 text-center py-2">Aucun commerce</p>
                ) : businesses.map(biz => (
                  <div key={biz.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/3 transition-colors">
                    <div className="w-7 h-7 bg-gradient-to-br from-brand-500 to-accent-purple rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {biz.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">{biz.name}</p>
                      <p className="text-xs text-dark-500">{biz.active_clients} clients</p>
                    </div>
                    <Check size={12} className="text-emerald-400 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
