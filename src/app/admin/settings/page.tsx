"use client";
import { Shield, Bell, Key, Globe, Save, Check, CreditCard, Eye, EyeOff, Loader2, AlertCircle, Trash2, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

type StripeStatus = {
  hasSecretKey: boolean;
  hasWebhookSecret: boolean;
  hasPriceGrowth: boolean;
  hasPricePro: boolean;
  secretKeyMasked: string;
  webhookSecretMasked: string;
  priceGrowth: string;
  pricePro: string;
  isConfigured: boolean;
};

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);

  // Stripe state
  const [stripeStatus, setStripeStatus] = useState<StripeStatus | null>(null);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [stripeError, setStripeError] = useState<string | null>(null);
  const [stripeSaved, setStripeSaved] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [showWebhook, setShowWebhook] = useState(false);
  const [stripeForm, setStripeForm] = useState({
    secretKey: "",
    webhookSecret: "",
    priceGrowth: "",
    pricePro: "",
  });

  useEffect(() => {
    fetch("/api/admin/stripe-config")
      .then(r => r.json())
      .then(data => {
        setStripeStatus(data);
        setStripeForm(f => ({
          ...f,
          priceGrowth: data.priceGrowth || "",
          pricePro: data.pricePro || "",
        }));
      })
      .catch(() => {});
  }, []);

  const handleStripeSave = async () => {
    setStripeLoading(true);
    setStripeError(null);
    try {
      const res = await fetch("/api/admin/stripe-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secretKey: stripeForm.secretKey || undefined,
          webhookSecret: stripeForm.webhookSecret || undefined,
          priceGrowth: stripeForm.priceGrowth,
          pricePro: stripeForm.pricePro,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStripeError(data.error || "Erreur lors de la sauvegarde");
        return;
      }
      // Refresh status
      const fresh = await fetch("/api/admin/stripe-config").then(r => r.json());
      setStripeStatus(fresh);
      setStripeForm(f => ({ ...f, secretKey: "", webhookSecret: "" }));
      setStripeSaved(true);
      setTimeout(() => setStripeSaved(false), 3000);
    } catch {
      setStripeError("Erreur réseau. Réessayez.");
    } finally {
      setStripeLoading(false);
    }
  };

  const handleStripeDisconnect = async () => {
    if (!confirm("Déconnecter Stripe ? Les paiements seront désactivés.")) return;
    await fetch("/api/admin/stripe-config", { method: "DELETE" });
    setStripeStatus(null);
    setStripeForm({ secretKey: "", webhookSecret: "", priceGrowth: "", pricePro: "" });
  };

  const handleSave = async () => {
    await new Promise(r => setTimeout(r, 600));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="animate-fade-in max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Paramètres admin</h1>
        <p className="text-dark-400 text-sm mt-0.5">Configuration de la plateforme Stampify</p>
      </div>

      <div className="space-y-6">
        {/* Platform */}
        <div className="glass-card p-6">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Globe size={18} className="text-brand-400" />
            Plateforme
          </h2>
          <div className="space-y-4">
            {[
              { label: "Nom de la plateforme", value: "Stampify", type: "text" },
              { label: "URL principale", value: "https://stampify.app", type: "url" },
              { label: "Email de support", value: "support@stampify.app", type: "email" },
            ].map(f => (
              <div key={f.label}>
                <label className="label">{f.label}</label>
                <input type={f.type} defaultValue={f.value} className="input-field" />
              </div>
            ))}
          </div>
        </div>

        {/* STRIPE */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <CreditCard size={18} className="text-violet-400" />
              Stripe — Paiements
            </h2>
            {stripeStatus?.isConfigured && (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  Connecté
                </span>
                <button onClick={handleStripeDisconnect} className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors text-dark-500 hover:text-red-400">
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>

          {stripeError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-sm text-red-300">
              <AlertCircle size={14} className="flex-shrink-0" />
              {stripeError}
            </div>
          )}

          {stripeSaved && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-sm text-emerald-300">
              <Check size={14} />
              Stripe configuré avec succès ! Les paiements sont actifs.
            </div>
          )}

          <div className="space-y-4">
            {/* Secret Key */}
            <div>
              <label className="label">
                Secret Key{" "}
                <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer"
                  className="text-brand-400 hover:text-brand-300 inline-flex items-center gap-1 ml-1">
                  Obtenir <ExternalLink size={10} />
                </a>
              </label>
              <div className="relative">
                <input
                  type={showKey ? "text" : "password"}
                  value={stripeForm.secretKey}
                  onChange={e => setStripeForm(f => ({ ...f, secretKey: e.target.value }))}
                  placeholder={stripeStatus?.secretKeyMasked || "sk_live_... ou sk_test_..."}
                  className="input-field pr-10 font-mono text-sm"
                />
                <button type="button" onClick={() => setShowKey(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors">
                  {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <p className="text-xs text-dark-500 mt-1">Laissez vide pour conserver la clé actuelle.</p>
            </div>

            {/* Webhook Secret */}
            <div>
              <label className="label">
                Webhook Secret{" "}
                <a href="https://dashboard.stripe.com/webhooks" target="_blank" rel="noopener noreferrer"
                  className="text-brand-400 hover:text-brand-300 inline-flex items-center gap-1 ml-1">
                  Configurer <ExternalLink size={10} />
                </a>
              </label>
              <div className="relative">
                <input
                  type={showWebhook ? "text" : "password"}
                  value={stripeForm.webhookSecret}
                  onChange={e => setStripeForm(f => ({ ...f, webhookSecret: e.target.value }))}
                  placeholder={stripeStatus?.webhookSecretMasked || "whsec_..."}
                  className="input-field pr-10 font-mono text-sm"
                />
                <button type="button" onClick={() => setShowWebhook(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors">
                  {showWebhook ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <p className="text-xs text-dark-500 mt-1">
                URL webhook à enregistrer :{" "}
                <code className="bg-dark-800 px-1.5 py-0.5 rounded text-brand-300">
                  https://votre-domaine.com/api/webhooks/stripe
                </code>
              </p>
            </div>

            {/* Price IDs */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Price ID — Growth (29$/mois)</label>
                <input
                  type="text"
                  value={stripeForm.priceGrowth}
                  onChange={e => setStripeForm(f => ({ ...f, priceGrowth: e.target.value }))}
                  placeholder="price_..."
                  className="input-field font-mono text-sm"
                />
              </div>
              <div>
                <label className="label">Price ID — Pro (79$/mois)</label>
                <input
                  type="text"
                  value={stripeForm.pricePro}
                  onChange={e => setStripeForm(f => ({ ...f, pricePro: e.target.value }))}
                  placeholder="price_..."
                  className="input-field font-mono text-sm"
                />
              </div>
            </div>

            <div className="p-3 bg-dark-900/60 border border-white/5 rounded-xl text-xs text-dark-400 space-y-1">
              <p>💡 Créez vos produits dans{" "}
                <a href="https://dashboard.stripe.com/products" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:underline">
                  Stripe → Product catalog
                </a>, puis copiez le Price ID de chaque plan.
              </p>
            </div>

            <button
              onClick={handleStripeSave}
              disabled={stripeLoading || (!stripeForm.secretKey && !stripeStatus?.hasSecretKey) || !stripeForm.priceGrowth || !stripeForm.pricePro}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              {stripeLoading
                ? <><Loader2 size={15} className="animate-spin" /> Vérification en cours...</>
                : stripeSaved
                  ? <><Check size={15} /> Sauvegardé</>
                  : <><CreditCard size={15} /> Connecter Stripe</>}
            </button>
          </div>
        </div>

        {/* PassKit */}
        <div className="glass-card p-6">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Key size={18} className="text-cyan-400" />
            Apple Wallet (PassKit)
          </h2>
          <div className="space-y-4">
            <div>
              <label className="label">Team ID Apple</label>
              <input type="text" defaultValue="AB12CD34EF" className="input-field font-mono" />
            </div>
            <div>
              <label className="label">Pass Type ID</label>
              <input type="text" defaultValue="pass.app.stampify.loyalty" className="input-field font-mono" />
            </div>
            <div className="flex items-center gap-3 p-3 bg-dark-900/60 border border-white/5 rounded-xl">
              <AlertCircle size={14} className="text-amber-400 flex-shrink-0" />
              <span className="text-xs text-dark-400">Configurez les certificats via <code className="text-brand-300">.env.local</code> (APPLE_SIGNER_CERT, APPLE_SIGNER_KEY)</span>
            </div>
          </div>
        </div>

        {/* Push Limits */}
        <div className="glass-card p-6">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Bell size={18} className="text-purple-400" />
            Limites push notifications
          </h2>
          <div className="space-y-4">
            <div>
              <label className="label">Max push par semaine par client</label>
              <input type="number" defaultValue={2} min={1} max={7} className="input-field w-32" />
            </div>
            <div>
              <label className="label">Push manuel par mois (plan Growth)</label>
              <input type="number" defaultValue={1} min={0} max={10} className="input-field w-32" />
            </div>
            <div>
              <label className="label">Push manuel par mois (plan Pro)</label>
              <input type="number" defaultValue={4} min={0} max={20} className="input-field w-32" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={handleSave} className={cn("btn-primary flex items-center gap-2", saved ? "bg-emerald-600 from-emerald-600 to-emerald-500" : "")}>
            {saved ? <><Check size={15} /> Sauvegardé</> : <><Save size={15} /> Sauvegarder</>}
          </button>
        </div>
      </div>
    </div>
  );
}
