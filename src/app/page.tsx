import Link from "next/link";
import {
  Stamp, Zap, Smartphone, Bell, BarChart3, Shield, ArrowRight,
  Users, QrCode, Gift, TrendingUp, Star, Sparkles, Check,
} from "lucide-react";
import WalletMockups from "@/components/ui/WalletMockups";

const features = [
  { icon: Stamp, title: "Tampons ou Points", desc: "Choisissez le mode selon votre commerce. Tampons pour les visites régulières, points pour les montants variables.", color: "bg-brand-500/15 border-brand-500/20 text-brand-400" },
  { icon: Smartphone, title: "Apple & Google Wallet", desc: "Vos clients ajoutent leur carte en 1 tap. Aucune application à télécharger — tout passe par le wallet natif.", color: "bg-cyan-500/15 border-cyan-500/20 text-cyan-400" },
  { icon: Bell, title: "Push Notifications Auto", desc: "Relancez vos clients automatiquement : 50% de l'objectif, avant la récompense, après inactivité.", color: "bg-purple-500/15 border-purple-500/20 text-purple-400" },
  { icon: QrCode, title: "Scan en 2 secondes", desc: "Le client montre son QR, vous scannez. Conçu pour la caisse, pas pour les techniciens.", color: "bg-emerald-500/15 border-emerald-500/20 text-emerald-400" },
  { icon: BarChart3, title: "Tableau de bord clair", desc: "4 chiffres clés à l'ouverture : clients actifs, scans du jour, récompenses, clients à relancer.", color: "bg-amber-500/15 border-amber-500/20 text-amber-400" },
  { icon: Shield, title: "Zéro frais variables", desc: "Pas de coût par SMS ou email. Les push wallet sont incluses dans votre abonnement mensuel.", color: "bg-pink-500/15 border-pink-500/20 text-pink-400" },
];

const steps = [
  { step: "01", title: "Créez votre compte", desc: "Email + mot de passe. Aucune carte bancaire requise.", icon: Zap },
  { step: "02", title: "Configurez votre programme", desc: "Nommez votre commerce, choisissez Tampons ou Points, définissez votre récompense.", icon: Gift },
  { step: "03", title: "Imprimez votre QR code", desc: "Un PDF 10×10cm généré automatiquement, prêt à coller sur votre comptoir.", icon: QrCode },
  { step: "04", title: "Accueillez vos clients fidèles", desc: "Vos clients scannent, accumulent et reviennent. Automatiquement.", icon: Users },
];

const plans = [
  {
    name: "Starter", price: "Gratuit", sub: "bêta", desc: "Parfait pour tester Stampify",
    features: ["1 commerce", "100 clients max", "Mode tampons", "Push automatiques", "QR code imprimable"],
    notIncluded: ["Mode points", "Push manuel", "Support prioritaire"],
    cta: "Commencer gratuitement", href: "/signup", highlight: false,
  },
  {
    name: "Growth", price: "29$", sub: "/ mois", desc: "Pour les commerces en croissance",
    features: ["1 commerce", "500 clients max", "Tampons ET Points", "Push automatiques", "1 push manuel / mois", "Tableau de bord complet", "Support email"],
    notIncluded: ["Support prioritaire"],
    cta: "Démarrer l'essai", href: "/signup?plan=growth", highlight: true,
  },
  {
    name: "Pro", price: "79$", sub: "/ mois", desc: "Pour les commerces ambitieux",
    features: ["3 commerces", "5 000 clients max", "Tampons ET Points", "Push automatiques", "4 push manuels / mois", "Tableau de bord avancé", "Support prioritaire"],
    notIncluded: [],
    cta: "Contacter l'équipe", href: "/signup?plan=pro", highlight: false,
  },
];

const testimonials = [
  { name: "Karim B.", role: "Barbier, Montréal", text: "En 5 minutes j'avais mon QR code imprimé. Le premier client l'a utilisé le soir même.", stars: 5 },
  { name: "Marie-Claire T.", role: "Esthéticienne, Québec", text: "Mes clientes adorent la carte dans leur iPhone. Je reçois des visites que j'aurais perdues sans les rappels.", stars: 5 },
  { name: "David L.", role: "Épicier, Ottawa", text: "Le mode points est parfait pour mon épicerie. Chaque panier = des points. Les clients reviennent.", stars: 5 },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-dark-950 overflow-x-hidden">
      <div className="fixed inset-0 bg-grid opacity-100 pointer-events-none" />
      <div className="fixed inset-0 bg-hero-gradient pointer-events-none" />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left: Copy */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-brand-500/30 text-brand-300 text-sm font-medium mb-8 animate-fade-in">
                <Sparkles size={14} />
                <span>Bêta ouverte · 6 mois gratuits pour les 50 premiers commerces</span>
              </div>

              <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-white mb-6 leading-tight animate-slide-up">
                Fidélisez vos clients.{" "}
                <span className="gradient-text">Automatiquement.</span>
              </h1>

              <p className="text-lg text-dark-300 mb-10 leading-relaxed max-w-xl">
                Stampify crée des cartes de fidélité numériques directement dans{" "}
                <span className="text-white font-medium">Apple Wallet</span> et{" "}
                <span className="text-white font-medium">Google Wallet</span>.
                Opérationnel en 5 minutes. Zéro app, zéro SMS.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Link href="/signup" className="btn-primary inline-flex items-center justify-center gap-2 text-base py-3.5 px-8">
                  Créer ma carte gratuitement
                  <ArrowRight size={18} />
                </Link>
                <Link href="#how-it-works" className="btn-secondary inline-flex items-center justify-center gap-2 text-base py-3.5 px-8">
                  Voir comment ça marche
                </Link>
              </div>

              <p className="text-sm text-dark-500 mb-10">Aucune carte bancaire · Opérationnel en 5 min · Annulable à tout moment</p>

              {/* Social proof */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-dark-400">
                <div className="flex items-center gap-2">
                  <Users size={15} className="text-brand-400" />
                  <span><strong className="text-white">6 200+</strong> cartes actives</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 size={15} className="text-cyan-400" />
                  <span><strong className="text-white">48</strong> commerces bêta</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bell size={15} className="text-purple-400" />
                  <span><strong className="text-white">40–60%</strong> taux d&apos;ouverture push</span>
                </div>
              </div>
            </div>

            {/* Right: Phone mockups */}
            <div className="relative flex justify-center lg:justify-end">
              <WalletMockups
                color="#6366f1"
                businessName="Salon Élite"
                stamps={7}
                goal={10}
                reward="1 coupe gratuite"
                logoLetter="S"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section id="features" className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge-primary">Fonctionnalités</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-4 mb-3">Tout ce dont vous avez besoin,<br />rien de plus.</h2>
            <p className="text-dark-400 max-w-xl mx-auto">Conçu pour les commerçants, pas pour les développeurs. Chaque fonctionnalité est pensée pour la simplicité.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="glass-card p-6 hover:border-white/15 transition-all duration-300">
                <div className={`p-2.5 rounded-xl w-fit border mb-4 ${f.color}`}>
                  <f.icon size={22} />
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-dark-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge-cyan">Processus</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-4 mb-3">Opérationnel en 5 minutes</h2>
            <p className="text-dark-400">Pas de formation, pas de technicien, pas de matériel spécial.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.step} className="glass-card p-6 hover:border-brand-500/20 transition-all">
                <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center mb-4">
                  <s.icon size={18} className="text-brand-400" />
                </div>
                <span className="text-xs font-mono text-brand-400 mb-2 block">{s.step}</span>
                <h3 className="font-semibold text-white mb-2 text-sm">{s.title}</h3>
                <p className="text-xs text-dark-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MODES ────────────────────────────────────────────────────────── */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="badge-purple">Deux modes</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-4 mb-3">Tampons ou Points : à vous de choisir</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-8 border-brand-500/20 hover:border-brand-500/40 transition-all">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 rounded-xl bg-brand-500/15 border border-brand-500/20">
                  <Stamp size={22} className="text-brand-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Mode Tampons</h3>
                  <p className="text-xs text-dark-400">1 visite = 1 tampon</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className={`w-9 h-9 rounded-full flex items-center justify-center ${i < 5 ? "bg-gradient-to-br from-brand-500 to-accent-purple" : "border-2 border-white/10"}`}>
                    {i < 5 && <Check size={13} className="text-white" strokeWidth={3} />}
                  </div>
                ))}
              </div>
              <p className="text-sm text-dark-300 mb-4">Idéal pour les coiffeurs, cafés, lavages auto.</p>
              {["Coiffeurs & barbiers", "Salons d'esthétique", "Cafés & restaurants", "Lavages auto"].map(t => (
                <div key={t} className="flex items-center gap-2 text-sm text-dark-300 mb-1.5">
                  <Check size={14} className="text-brand-400" />
                  {t}
                </div>
              ))}
            </div>
            <div className="glass-card p-8 border-cyan-500/20 hover:border-cyan-500/40 transition-all">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/20">
                  <TrendingUp size={22} className="text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Mode Points</h3>
                  <p className="text-xs text-dark-400">1$ = 10 points</p>
                </div>
              </div>
              <div className="mb-5">
                <p className="text-4xl font-bold text-white mb-1">340 <span className="text-lg text-dark-400 font-normal">pts</span></p>
                <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                  <div className="h-full w-[68%] bg-gradient-to-r from-cyan-500 to-brand-400 rounded-full" />
                </div>
                <p className="text-xs text-dark-400 mt-1.5">encore 160 pts pour 5$ de rabais</p>
              </div>
              <p className="text-sm text-dark-300 mb-4">Idéal pour épiceries, mécaniciens, boutiques.</p>
              {["Épiceries & dépanneurs", "Mécaniciens & garages", "Boutiques de vêtements", "Commerce en ligne"].map(t => (
                <div key={t} className="flex items-center gap-2 text-sm text-dark-300 mb-1.5">
                  <Check size={14} className="text-cyan-400" />
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="badge-success">Témoignages</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-4">Ils ont adopté Stampify</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="glass-card p-6 hover:border-white/15 transition-all">
                <div className="flex mb-3">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-dark-300 leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                <p className="text-sm font-semibold text-white">{t.name}</p>
                <p className="text-xs text-dark-500">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────────────── */}
      <section id="pricing" className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge-primary">Tarifs</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-4 mb-3">Simple, sans surprises</h2>
            <p className="text-dark-400">Pas de frais par SMS. Pas de frais par email. Tout inclus dans l&apos;abonnement.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((p) => (
              <div key={p.name} className={`glass-card p-8 flex flex-col transition-all ${p.highlight ? "border-brand-500/40 shadow-glow" : "hover:border-white/15"}`}>
                {p.highlight && <div className="badge-primary mb-4 w-fit">Populaire</div>}
                <div className="mb-6">
                  <h3 className="font-bold text-white text-lg">{p.name}</h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-4xl font-bold text-white">{p.price}</span>
                    <span className="text-dark-400 text-sm">{p.sub}</span>
                  </div>
                  <p className="text-sm text-dark-400 mt-2">{p.desc}</p>
                </div>
                <div className="space-y-2.5 flex-1 mb-6">
                  {p.features.map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-dark-200">
                      <Check size={15} className="text-brand-400 flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                  {p.notIncluded.map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-dark-600 line-through">
                      <div className="w-[15px] flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
                <Link href={p.href} className={`${p.highlight ? "btn-primary" : "btn-secondary"} text-center text-sm block`}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-8 glass-card p-6 text-center">
            <p className="text-sm text-dark-300">
              🎉 <strong className="text-white">Offre bêta :</strong> Les 50 premiers commerces obtiennent 6 mois gratuits sur le plan Growth en échange de feedback hebdomadaire.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card p-12 border-brand-500/20">
            <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-accent-purple rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow animate-pulse-glow">
              <Stamp size={28} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Prêt à fidéliser vos clients ?</h2>
            <p className="text-dark-400 mb-8 max-w-md mx-auto">Rejoignez les commerces qui utilisent déjà Stampify. Créez votre carte en 5 minutes, sans carte bancaire.</p>
            <Link href="/signup" className="btn-primary inline-flex items-center gap-2 text-base py-3.5 px-8">
              Démarrer gratuitement
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="relative border-t border-white/5 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-accent-purple rounded-xl flex items-center justify-center">
              <Stamp size={15} className="text-white" />
            </div>
            <span className="font-bold text-white">Stampify</span>
            <span className="text-dark-500 text-sm ml-1">PRD v2.0 · Mai 2026</span>
          </div>
          <div className="flex gap-6 text-sm text-dark-500">
            <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-white transition-colors">Conditions</a>
            <Link href="/admin" className="hover:text-white transition-colors">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
