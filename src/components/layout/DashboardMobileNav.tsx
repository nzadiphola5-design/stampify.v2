"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, QrCode, Bell, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Accueil" },
  { href: "/dashboard/clients", icon: Users, label: "Clients" },
  { href: "/dashboard/scan", icon: QrCode, label: "Scanner" },
  { href: "/dashboard/notifications", icon: Bell, label: "Push" },
  { href: "/dashboard/settings", icon: Settings, label: "Config" },
];

export default function DashboardMobileNav() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-dark-950/95 border-t border-white/5 backdrop-blur-xl safe-bottom">
      <div className="flex items-center justify-around py-2">
        {items.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link key={href} href={href} className={cn(
              "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all",
              active ? "text-brand-400" : "text-dark-500 hover:text-dark-300"
            )}>
              <Icon size={20} className={href === "/dashboard/scan" ? (active ? "" : "text-dark-400") : ""} />
              <span className="text-xs">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
