"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Stamp, LayoutDashboard, Users, QrCode, Bell, Settings, LogOut, ChevronRight, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBusiness } from "@/lib/supabase/business-context";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Vue d'ensemble" },
  { href: "/dashboard/clients", icon: Users, label: "Mes clients" },
  { href: "/dashboard/scan", icon: QrCode, label: "Scanner" },
  { href: "/dashboard/notifications", icon: Bell, label: "Notifications" },
  { href: "/dashboard/settings", icon: Settings, label: "Paramètres" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { business } = useBusiness();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const name = business?.name ?? "Mon commerce";
  const type = business?.type ?? "";
  const city = business?.city ?? "";
  const plan = business?.plan ?? "starter";
  const mode = business?.mode ?? "stamps";

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-dark-950/95 border-r border-white/5 backdrop-blur-xl z-40 flex flex-col">
      <div className="p-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-accent-purple rounded-xl flex items-center justify-center shadow-glow">
            <Stamp size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg text-white">Stampify</span>
        </Link>
      </div>

      <div className="p-4">
        <div className="glass-card p-3 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-accent-purple rounded-xl flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
            {name.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{name}</p>
            <p className="text-xs text-dark-400">{type}{city ? ` · ${city}` : ""}</p>
          </div>
          <span className={cn("badge text-xs", mode === "stamps" ? "badge-primary" : "badge-cyan")}>
            {mode === "stamps" ? "Tampons" : "Points"}
          </span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link key={href} href={href} className={active ? "sidebar-item-active" : "sidebar-item"}>
              <Icon size={18} />
              <span className="text-sm">{label}</span>
              {active && <ChevronRight size={14} className="ml-auto opacity-50" />}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-2">
        <Link href="/dashboard/settings" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500/10 border border-brand-500/20 hover:bg-brand-500/15 transition-all">
          <Zap size={14} className="text-brand-400" />
          <span className="text-sm text-brand-300 font-medium capitalize">Plan {plan}</span>
          <span className="ml-auto text-xs text-brand-400/60">Gérer →</span>
        </Link>
      </div>

      <div className="p-3 border-t border-white/5">
        <button onClick={handleLogout} className="sidebar-item w-full">
          <LogOut size={18} />
          <span className="text-sm">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
