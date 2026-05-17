"use client";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showPercent?: boolean;
  color?: "brand" | "cyan" | "emerald" | "amber";
  className?: string;
}

const colorMap = {
  brand: "from-brand-500 to-accent-purple",
  cyan: "from-accent-cyan to-brand-400",
  emerald: "from-accent-emerald to-accent-cyan",
  amber: "from-amber-400 to-orange-500",
};

export default function ProgressBar({ value, max, label, showPercent, color = "brand", className }: ProgressBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className={cn("space-y-1.5", className)}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center">
          {label && <span className="text-xs text-dark-400">{label}</span>}
          {showPercent && <span className="text-xs font-semibold text-dark-300">{pct}%</span>}
        </div>
      )}
      <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-700", colorMap[color])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
