"use client";
import { useState } from "react";
import {
  Stamp, Store, CreditCard, QrCode, Download, Check,
  Shield, Zap, AlertTriangle, Upload, TrendingUp,
  Loader2, ExternalLink, Palette, Eye, Copy, CheckCheck
} from "lucide-react";
import { mockBusiness } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import Link from "next/link";
import WalletMockups from "@/components/ui/WalletMockups";
import { QRCodeCanvas } from "qrcode.react";

const sections = ["Programme", "Commerce", "Carte", "Plan", "QR Code"];

export default function SettingsPage() {
  const biz = mockBusiness;
  const [active, setActive] = useState("Programme");
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: biz.name,
    type: biz.type,
    city: biz.city,
    goal: biz.goal,
    reward: biz.reward_description,
    mode: biz.mode,
  });

  const [planLoading, setPlanLoading] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const joinUrl = typeof window !== "undefined"
    ? `${window.location.origin}/c/${biz.id}/join`
    : `https://stampify.vercel.app/c/${biz.id}/join`;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadPNG = () => {
    const canvas = document.getElementById("qr-canvas") as HTMLCanvasElement;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `qrcode-${biz.name.toLowerCase().replace(/\s+/g, "-")}.png`;
    a.click();
  };

  // Card customization state
  const [cardColor, setCardColor] = useState("#6366f1");
  const [cardBg, setCardBg] = useState("#0f172a");
  const [cardLogoLetter, setCardLogoLetter] = useState(biz.name.charAt(0).toUpperCase());
  const [cardPreviewMode, setCardPreviewMode] = useState<"apple" | "google">("apple");
  const currentPlan = "growth"; // In prod: fetch from Supabase

  const handleSave = async () => {
    await new Promise(r => setTimeout(r, 600));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleUpgrade = async (plan: string) => {
    setPlanLoading(plan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, businessId: biz.id }),
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch {
      // silently fail in demo
    } finally {
      setPlanLoading(null);
    }
  };

  const handlePortal = async () => {
    setPlanLoading("portal");
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: null }), // In prod: real stripe_customer_id
      });
      const data = await res.json();
      if (data.portalUrl) {
        window.open(data.portalUrl, "_blank");
      }
    } catch {
      // silently fail
    } finally {
      setPlanLoading(null);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Paramètres</h1>
        <p className="text-dark-400 text-sm mt-0.5">Gérez votre programme et votre compte.</p>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-1 bg-dark-900 p-1 rounded-xl w-fit mb-6">
        {sections.map(s => (
          <button
            key={s}
            onClick={() => setActive(s)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              active === s ? "bg-brand-500/20 text-brand-300 border border-brand-500/30" : "text-dark-400 hover:text-white"
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {/* PROGRAMME */}
      {active === "Programme" && (
        <div className="max-w-2xl space-y-6 animate-fade-in">
          <div className="glass-card p-6">
            <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
              <Stamp size={18} className="text-brand-400" />
              Mode de fidélisation
            </h2>

            <div className="p-4 bg-brand-500/10 border border-brand-500/20 rounded-xl flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                {biz.mode === "stamps" ? <Stamp size={20} className="text-brand-400" /> : <TrendingUp size={20} className="text-cyan-400" />}
                <div>
                  <p className="font-medium text-white">{biz.mode === "stamps" ? "Mode Tampons" : "Mode Points"}</p>
                  <p className="text-xs text-dark-400">Mode actuel de votre programme</p>
                </div>
              </div>
              <div className="text-xs text-dark-500 flex items-center gap-1">
                <AlertTriangle size={12} className="text-amber-400" />
                Modifiable 30 premiers jours
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label">Objectif de tampons</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={5}
                    max={20}
                    value={form.goal}
                    onChange={e => setForm(f => ({ ...f, goal: Number(e.target.value) }))}
                    className="flex-1 accent-brand-500"
                  />
                  <div className="w-16 glass-card px-3 py-2 text-center">
                    <span className="text-xl font-bold text-white">{form.goal}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="label">Description de la récompense</label>
                <input
                  value={form.reward}
                  onChange={e => setForm(f => ({ ...f, reward: e.target.value }))}
                  className="input-field"
                  placeholder="Ex : 1 coupe gratuite, café offert..."
                />
                <p className="text-xs text-dark-500 mt-1">Affiché sur la carte wallet du client et dans les notifications push</p>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button onClick={handleSave} className={cn("btn-primary flex items-center gap-2 text-sm", saved ? "bg-emerald-600 from-emerald-600 to-emerald-500" : "")}>
                {saved ? <><Check size={15} /> Sauvegardé</> : "Sauvegarder"}
              </button>
            </div>
          </div>

          {/* Push preview */}
          <div className="glass-card p-6">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Shield size={18} className="text-purple-400" />
              Aperçu push notification
            </h2>
            <div className="bg-dark-900 border border-white/5 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-accent-purple rounded-xl flex items-center justify-center flex-shrink-0">
                  <Stamp size={15} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{form.name}</p>
                  <p className="text-xs text-dark-300 mt-0.5">
                    Plus qu'un tampon ! Votre prochaine visite vous rapporte <strong>{form.reward}</strong>. 🎁
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COMMERCE */}
      {active === "Commerce" && (
        <div className="max-w-2xl space-y-6 animate-fade-in">
          <div className="glass-card p-6">
            <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
              <Store size={18} className="text-cyan-400" />
              Informations du commerce
            </h2>
            <div className="space-y-4">
              <div>
                <label className="label">Nom du commerce</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-field" />
              </div>
              <div>
                <label className="label">Type de commerce</label>
                <input value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="input-field" />
              </div>
              <div>
                <label className="label">Ville</label>
                <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className="input-field" />
              </div>
              <div>
                <label className="label">Logo du commerce</label>
                <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-brand-500/30 transition-colors cursor-pointer">
                  <Upload size={24} className="text-dark-400 mx-auto mb-2" />
                  <p className="text-sm text-dark-400">Cliquez pour uploader un logo</p>
                  <p className="text-xs text-dark-600 mt-1">PNG, JPG · Max 2MB · Recommandé : 200×200px</p>
                </div>
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <button onClick={handleSave} className="btn-primary flex items-center gap-2 text-sm">
                {saved ? <><Check size={15} /> Sauvegardé</> : "Sauvegarder"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CARTE */}
      {active === "Carte" && (
        <div className="animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
            {/* Controls */}
            <div className="space-y-6">
              <div className="glass-card p-6">
                <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
                  <Palette size={18} className="text-brand-400" />
                  Personnalisation de la carte
                </h2>

                {/* Logo letter */}
                <div className="mb-5">
                  <label className="label">Initiale / Symbole affiché sur la carte</label>
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
                      style={{ background: cardColor }}>
                      {cardLogoLetter || "?"}
                    </div>
                    <input
                      value={cardLogoLetter}
                      onChange={e => setCardLogoLetter(e.target.value.slice(0, 2).toUpperCase())}
                      placeholder="S"
                      className="input-field w-20 text-center text-xl font-bold"
                      maxLength={2}
                    />
                    <p className="text-xs text-dark-500">1–2 caractères (ex: initiale du commerce)</p>
                  </div>
                </div>

                {/* Logo upload */}
                <div className="mb-5">
                  <label className="label">Logo (optionnel)</label>
                  <div className="border-2 border-dashed border-white/10 rounded-xl p-5 text-center hover:border-brand-500/30 transition-colors cursor-pointer">
                    <Upload size={20} className="text-dark-400 mx-auto mb-2" />
                    <p className="text-sm text-dark-400">Cliquez pour uploader votre logo</p>
                    <p className="text-xs text-dark-600 mt-1">PNG transparent · Max 512×512px · Max 200Ko</p>
                  </div>
                </div>

                {/* Primary color */}
                <div className="mb-5">
                  <label className="label">Couleur principale</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={cardColor}
                      onChange={e => setCardColor(e.target.value)}
                      className="w-12 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={cardColor}
                      onChange={e => setCardColor(e.target.value)}
                      className="input-field font-mono text-sm w-32"
                      placeholder="#6366f1"
                    />
                    {/* Color presets */}
                    <div className="flex gap-1.5">
                      {["#6366f1","#8b5cf6","#ec4899","#f97316","#10b981","#0ea5e9","#eab308","#ef4444"].map(c => (
                        <button key={c} onClick={() => setCardColor(c)}
                          className={cn("w-6 h-6 rounded-full border-2 transition-all", cardColor === c ? "border-white scale-110" : "border-transparent hover:scale-105")}
                          style={{ background: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Background color */}
                <div className="mb-5">
                  <label className="label">Couleur de fond de la carte</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={cardBg}
                      onChange={e => setCardBg(e.target.value)}
                      className="w-12 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={cardBg}
                      onChange={e => setCardBg(e.target.value)}
                      className="input-field font-mono text-sm w-32"
                      placeholder="#0f172a"
                    />
                    <div className="flex gap-1.5">
                      {["#0f172a","#1e1b4b","#1a0533","#0c1a0c","#1a0a00","#1c1917","#0c1a2e","#000000"].map(c => (
                        <button key={c} onClick={() => setCardBg(c)}
                          className={cn("w-6 h-6 rounded-full border-2 transition-all", cardBg === c ? "border-white scale-110" : "border-transparent hover:scale-105")}
                          style={{ background: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button onClick={handleSave} className={cn("btn-primary flex items-center gap-2 text-sm", saved ? "bg-emerald-600 from-emerald-600 to-emerald-500" : "")}>
                    {saved ? <><Check size={15} /> Sauvegardé</> : "Appliquer les changements"}
                  </button>
                </div>
              </div>
            </div>

            {/* Live Preview */}
            <div className="space-y-4">
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-white flex items-center gap-2">
                    <Eye size={18} className="text-cyan-400" />
                    Aperçu en temps réel
                  </h2>
                  {/* Toggle Apple / Google */}
                  <div className="flex gap-1 bg-dark-900 p-0.5 rounded-lg">
                    {(["apple", "google"] as const).map(m => (
                      <button key={m} onClick={() => setCardPreviewMode(m)}
                        className={cn("px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                          cardPreviewMode === m ? "bg-brand-500/20 text-brand-300 border border-brand-500/30" : "text-dark-400 hover:text-white")}>
                        {m === "apple" ? "🍎 Apple" : "🤖 Google"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center py-4" style={{ minHeight: 480 }}>
                  <WalletMockups
                    color={cardColor}
                    businessName={form.name}
                    stamps={6}
                    goal={form.goal}
                    reward={form.reward}
                    logoLetter={cardLogoLetter || form.name.charAt(0)}
                    mode={cardPreviewMode}
                  />
                </div>

                <p className="text-xs text-dark-500 text-center mt-2">
                  Les modifications s&apos;appliquent aux nouvelles cartes générées. Les cartes existantes seront mises à jour via push.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PLAN */}
      {active === "Plan" && (
        <div className="max-w-3xl animate-fade-in">
          {/* Current plan */}
          <div className="glass-card p-6 border-brand-500/30 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-brand-500/15 border border-brand-500/20">
                  <Zap size={20} className="text-brand-400" />
                </div>
                <div>
                  <p className="font-bold text-white text-lg">Plan Growth</p>
                  <p className="text-sm text-dark-400">29$ / mois · 500 clients max</p>
                </div>
              </div>
              <span className="badge-success">Actif</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm mb-5">
              {["1 commerce", "500 clients max", "Tampons ET Points", "Push automatiques", "1 push manuel/mois", "Support email"].map(f => (
                <div key={f} className="flex items-center gap-2 text-dark-200">
                  <Check size={14} className="text-brand-400" />
                  {f}
                </div>
              ))}
            </div>
            <button
              onClick={handlePortal}
              disabled={planLoading === "portal"}
              className="btn-secondary text-sm flex items-center gap-2"
            >
              {planLoading === "portal"
                ? <Loader2 size={14} className="animate-spin" />
                : <ExternalLink size={14} />}
              Gérer l'abonnement
            </button>
          </div>

          {/* Upgrade options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                id: "starter",
                name: "Starter",
                price: "Gratuit",
                features: ["100 clients", "Mode tampons uniquement", "Push automatiques"],
                highlight: false,
                action: "Downgrade",
              },
              {
                id: "pro",
                name: "Pro",
                price: "79$",
                features: ["3 commerces", "5 000 clients", "Tampons ET Points", "4 push manuels/mois", "Support prioritaire"],
                highlight: true,
                action: "Passer au Pro",
              },
            ].map(p => (
              <div key={p.id} className={cn("glass-card p-5", p.highlight && "border-accent-purple/30")}>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-white">{p.name}</h3>
                  <span className="text-sm font-bold text-white">
                    {p.price}
                    {p.price !== "Gratuit" && <span className="text-xs text-dark-400">/mois</span>}
                  </span>
                </div>
                {p.features.map(f => (
                  <div key={f} className="flex items-center gap-2 text-xs text-dark-300 mb-1.5">
                    <Check size={12} className="text-dark-500" />{f}
                  </div>
                ))}
                <button
                  onClick={() => p.id !== "starter" && handleUpgrade(p.id)}
                  disabled={!!planLoading || p.id === currentPlan}
                  className={cn(
                    "mt-4 w-full text-sm py-2 flex items-center justify-center gap-2",
                    p.highlight ? "btn-primary" : "btn-secondary",
                    p.id === currentPlan && "opacity-40 cursor-not-allowed"
                  )}
                >
                  {planLoading === p.id
                    ? <Loader2 size={14} className="animate-spin" />
                    : p.id === currentPlan ? "Plan actuel" : p.action + " →"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QR CODE */}
      {active === "QR Code" && (
        <div className="max-w-sm animate-fade-in">
          <div className="glass-card p-6">
            <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
              <QrCode size={18} className="text-brand-400" />
              Votre QR Code
            </h2>

            {/* Real QR code */}
            <div className="bg-white p-6 rounded-2xl mb-5 flex items-center justify-center">
              <QRCodeCanvas
                id="qr-canvas"
                value={joinUrl}
                size={200}
                bgColor="#ffffff"
                fgColor="#0f172a"
                level="H"
                includeMargin={false}
              />
            </div>

            <div className="space-y-3">
              {/* URL display */}
              <div className="p-3 bg-dark-900 rounded-xl text-xs text-dark-300 font-mono break-all">
                {joinUrl}
              </div>

              {/* Download PNG */}
              <button
                onClick={handleDownloadPNG}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <Download size={16} />
                Télécharger PNG
              </button>

              {/* Copy link */}
              <button
                onClick={handleCopyLink}
                className="w-full btn-secondary flex items-center justify-center gap-2 text-sm"
              >
                {copied
                  ? <><CheckCheck size={15} className="text-emerald-400" /><span className="text-emerald-400">Lien copié !</span></>
                  : <><Copy size={15} />Copier le lien de partage</>}
              </button>

              {/* Share via WhatsApp */}
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Rejoignez mon programme de fidélité ! 🎁\n${joinUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] text-sm font-medium hover:bg-[#25D366]/25 transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Partager via WhatsApp
              </a>
            </div>

            <div className="mt-5 p-3 bg-dark-900/50 border border-white/5 rounded-xl text-xs text-dark-400">
              💡 Imprimez ce QR code et collez-le sur votre comptoir. Vos clients le scannent et reçoivent leur carte wallet en 60 secondes.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
