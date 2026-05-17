"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Stamp, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/#features", label: "Fonctionnalités" },
  { href: "/#how-it-works", label: "Comment ça marche" },
  { href: "/#pricing", label: "Tarifs" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin") || pathname.startsWith("/scan") || pathname.startsWith("/onboarding")) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="mt-4 glass rounded-2xl px-6 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-accent-purple rounded-xl flex items-center justify-center shadow-glow">
              <Stamp size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">Stampify</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map(l => (
              <a key={l.href} href={l.href} className="btn-ghost text-sm">{l.label}</a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="btn-ghost text-sm">Connexion</Link>
            <Link href="/signup" className="btn-primary text-sm py-2">Démarrer gratuitement</Link>
          </div>

          <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-dark-300 hover:text-white">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden mt-2 glass rounded-2xl p-4 space-y-2 animate-slide-up">
            {links.map(l => (
              <a key={l.href} href={l.href} className="block py-2.5 px-4 text-dark-300 hover:text-white rounded-xl hover:bg-white/5" onClick={() => setOpen(false)}>
                {l.label}
              </a>
            ))}
            <div className="divider my-2" />
            <Link href="/login" className="block py-2.5 px-4 text-dark-300 hover:text-white rounded-xl hover:bg-white/5" onClick={() => setOpen(false)}>Connexion</Link>
            <Link href="/signup" className="btn-primary block text-center text-sm" onClick={() => setOpen(false)}>Démarrer gratuitement</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
