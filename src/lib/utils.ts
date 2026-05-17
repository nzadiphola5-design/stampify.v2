import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n.toString();
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("fr-CA", {
    day: "numeric", month: "short", year: "numeric",
  }).format(new Date(date));
}

export function formatTime(date: Date | string): string {
  return new Intl.DateTimeFormat("fr-CA", {
    hour: "2-digit", minute: "2-digit",
  }).format(new Date(date));
}

export function getInitials(name: string): string {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

export function generateColor(str: string): string {
  const colors = [
    "from-brand-500 to-brand-600",
    "from-accent-purple to-brand-500",
    "from-accent-cyan to-brand-400",
    "from-accent-pink to-accent-purple",
    "from-accent-emerald to-accent-cyan",
  ];
  const hash = str.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return colors[hash % colors.length];
}
