"use client";
import { Gift, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StampGridProps {
  current: number;
  goal: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function StampGrid({ current, goal, size = "md", className }: StampGridProps) {
  const isComplete = current >= goal;
  const sizeClass = size === "sm" ? "w-8 h-8" : size === "lg" ? "w-12 h-12" : "w-10 h-10";
  const iconSize = size === "sm" ? 12 : size === "lg" ? 18 : 15;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {Array.from({ length: goal }).map((_, i) => {
        const filled = i < current;
        const isReward = i === goal - 1 && !filled;
        return (
          <div
            key={i}
            className={cn(
              sizeClass,
              "rounded-full flex items-center justify-center transition-all duration-300",
              filled
                ? "bg-gradient-to-br from-brand-500 to-accent-purple border-2 border-brand-400 shadow-glow"
                : isReward
                ? "border-2 border-amber-400/50 bg-amber-500/10"
                : "border-2 border-white/10 bg-white/3"
            )}
          >
            {filled ? (
              <Check size={iconSize} className="text-white" strokeWidth={3} />
            ) : isReward ? (
              <Gift size={iconSize} className="text-amber-400" />
            ) : null}
          </div>
        );
      })}
      {isComplete && (
        <div className={cn(sizeClass, "rounded-full flex items-center justify-center bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)]")}>
          <Gift size={iconSize} className="text-white" />
        </div>
      )}
    </div>
  );
}
