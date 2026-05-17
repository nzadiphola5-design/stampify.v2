import { cn, formatNumber } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: number;
  color?: "brand" | "cyan" | "emerald" | "purple" | "amber";
  subtitle?: string;
  className?: string;
}

const colorMap = {
  brand: { bg: "bg-brand-500/15", text: "text-brand-400", border: "border-brand-500/20", glow: "shadow-glow" },
  cyan: { bg: "bg-cyan-500/15", text: "text-cyan-400", border: "border-cyan-500/20", glow: "shadow-glow-cyan" },
  emerald: { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/20", glow: "" },
  purple: { bg: "bg-purple-500/15", text: "text-purple-400", border: "border-purple-500/20", glow: "shadow-glow-purple" },
  amber: { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/20", glow: "" },
};

export default function StatCard({ title, value, icon: Icon, trend, color = "brand", subtitle, className }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className={cn("stat-card group", className)}>
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-2.5 rounded-xl", c.bg, `border ${c.border}`)}>
          <Icon size={20} className={c.text} />
        </div>
        {trend !== undefined && (
          <span className={cn("text-xs font-semibold px-2 py-1 rounded-full", trend >= 0 ? "text-emerald-400 bg-emerald-500/10" : "text-red-400 bg-red-500/10")}>
            {trend >= 0 ? "+" : ""}{trend}%
          </span>
        )}
      </div>
      <div className="mt-1">
        <p className="text-3xl font-bold text-white tracking-tight">
          {typeof value === "number" ? formatNumber(value) : value}
        </p>
        <p className="text-sm text-dark-400 mt-1 font-medium">{title}</p>
        {subtitle && <p className="text-xs text-dark-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}
