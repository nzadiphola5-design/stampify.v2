"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Stamp, LayoutDashboard, Store, Users, Bell, CreditCard, BarChart3, Settings, LogOut, Shield, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Vue d'ensemble" },
  { href: "/admin/businesses", icon: Store, label: "Commerces" },
  { href: "/admin/clients", icon: Users, label: "Clients" },
  { href: "/admin/notifications", icon: Bell, label: "Notifications" },
  { href: "/admin/plans", icon: CreditCard, label: "Plans & Revenus" },
  { href: "/admin/analytics", icon: BarChart3, label: "Analytiques" },
  { href: "/admin/settings", icon: Settings, label: "Paramètres" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-dark-950/95 border-r border-white/5 backdrop-blur-xl z-40 flex flex-col">
      <div className="p-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-accent-purple to-brand-500 rounded-xl flex items-center justify-center shadow-glow-purple">
            <Stamp size={18} className="text-white" />
          </div>
          <div>
            <span className="font-bold text-lg text-white">Stampify</span>
            <div className="flex items-center gap-1">
              <Shield size={10} className="text-accent-purple" />
              <span className="text-xs text-accent-purple font-medium">Admin</span>
            </div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link key={href} href={href} className={active ? "sidebar-item-active" : "sidebar-item"}>
              <Icon size={18} />
              <span className="text-sm">{label}</span>
              {active && <ChevronRight size={14} className="ml-auto opacity-50" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/5">
        <Link href="/" className="sidebar-item">
          <LogOut size={18} />
          <span className="text-sm">Déconnexion</span>
        </Link>
      </div>
    </aside>
  );
}
