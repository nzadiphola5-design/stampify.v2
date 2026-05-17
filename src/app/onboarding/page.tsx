"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Stamp, Store, Scissors, Coffee, ShoppingCart, Wrench, Car,
  ArrowRight, ArrowLeft, Check, Gift, TrendingUp, QrCode, Sparkles,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";

const businessTypes = [
  { value: "Coiffeur", label: "Coiffeur / Barbier", icon: Scissors },
  { value: "Café", label: "Café / Restaurant", icon: Coffee },
  { value: "Épicerie", label: "Épicerie / Dépanneur", icon: ShoppingCart },
  { value: "Garage", label: "Mécanique / Garage", icon: Wrench },
  { value: "Lavage auto", label: "Lavage auto", icon: Car },
  { value: "Autre", label: "Autre commerce", icon: Store },
];

type Mode = "stamps" | "points";

interface FormData {
  name: string;
  type: string;
  city: string;
  mode: Mode | null;
  goal: number;
  reward: string;
  pointsRate: number;
}

const CITIES = ["Montréal", "Québec", "Ottawa", "Laval", "Longueuil", "Gatineau", "Sherbrooke", "Trois-Rivières"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>({
    name: "",
    type: "",
    city: "",
    mode: null,
    goal: 10,
    reward: "",
    pointsRate: 10,
  });
  const [loading, setLoading] = useState(false);

  const update = (key: keyof FormData, val: FormData[typeof key]) =>
    setForm(f => ({ ...f, [key]: val }));

  const canNext = () => {
    if (step === 1) return form.name && form.type && form.city;
    if (step === 2) return form.mode !== null;
    if (step === 3) return form.reward;
    return true;
  };

  const finish = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center px-4 py-16">
      <div className="fixed inset-0 bg-grid pointer-events-none" />
      <div className="fixed inset-0 bg-hero-gradient pointer-events-none" />

      {/* Header */}
      <div className="relative w-full max-w-2xl mb-8">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-accent-purple rounded-xl flex items-center justify-center shadow-glow">
            <Stamp size={17} className="text-white" />
          </div>
          <span className="font-bold text-lg text-white">Stampify</span>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0">
          {[1, 2, 3].map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                step > s ? "bg-brand-500 text-white" : step === s ? "bg-gradient-to-br from-brand-500 to-accent-purple text-white shadow-glow" : "bg-dark-800 text-dark-500 border border-white/10"
              )}>
                {step > s ? <Check size={14} strokeWidth={3} /> : s}
              </div>
              {i < 2 && <div className={cn("w-20 h-0.5 transition-all", step > s ? "bg-brand-500" : "bg-dark-800")} />}
            </div>
          ))}
        </div>
        <div className="flex gap-0 mt-2">
          {["Mon compte", "Mon commerce", "Mon programme"].map((l, i) => (
            <div key={l} className="flex items-center">
              <p className={cn("text-xs w-8 text-center", step > i + 1 ? "text-brand-400" : step === i + 1 ? "text-white font-medium" : "text-dark-500")}>{l.split(" ")[0]}<br />{l.split(" ").slice(1).join(" ")}</p>
              {i < 2 && <div className="w-20" />}
            </div>
          ))}
        </div>
      </div>

      {/* Card */}
      <div className="relative w-full max-w-2xl glass-card p-8 animate-slide-up">

        {/* Step 1 — Commerce info */}
        {step === 1 && (
          <div>
            <div className="mb-8">
              <span className="badge-primary mb-3">Étape 1</span>
              <h1 className="text-2xl font-bold text-white">Parlez-nous de votre commerce</h1>
              <p className="text-dark-400 mt-1">3 informations suffisent pour démarrer.</p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="label">Nom de votre commerce <span className="text-dark-500">(affiché sur la carte)</span></label>
                <input
                  value={form.name}
                  onChange={e => update("name", e.target.value)}
                  placeholder="Ex : Salon Élite, Café Lumière..."
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">Type de commerce</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {businessTypes.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => update("type", value)}
                      className={cn(
                        "p-3 rounded-xl border text-sm font-medium text-left flex items-center gap-2.5 transition-all",
                        form.type === value
                          ? "bg-brand-500/20 border-brand-500/50 text-white shadow-glow"
                          : "bg-dark-800/50 border-white/8 text-dark-300 hover:border-white/20 hover:text-white"
                      )}
                    >
                      <Icon size={16} className={form.type === value ? "text-brand-400" : "text-dark-500"} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">Ville</label>
                <div className="relative">
                  <select
                    value={form.city}
                    onChange={e => update("city", e.target.value)}
                    className="input-field appearance-none pr-10"
                  >
                    <option value="">Choisir une ville</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    <option value="Autre">Autre</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 — Mode choice */}
        {step === 2 && (
          <div>
            <div className="mb-8">
              <span className="badge-cyan mb-3">Étape 2</span>
              <h1 className="text-2xl font-bold text-white">Quel type de programme de fidélité ?</h1>
              <p className="text-dark-400 mt-1">Choisissez le mode qui convient le mieux à votre commerce.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <button
                onClick={() => update("mode", "stamps")}
                className={cn(
                  "p-6 rounded-2xl border text-left transition-all group",
                  form.mode === "stamps"
                    ? "bg-brand-500/15 border-brand-500/50 shadow-glow"
                    : "bg-dark-800/50 border-white/8 hover:border-brand-500/30"
                )}
              >
                <div className={cn("p-3 rounded-xl w-fit mb-4 border", form.mode === "stamps" ? "bg-brand-500/20 border-brand-500/40" : "bg-dark-700 border-white/10")}>
                  <Stamp size={24} className={form.mode === "stamps" ? "text-brand-400" : "text-dark-400"} />
                </div>
                <h3 className="font-bold text-white text-lg mb-1">Mode Tampons</h3>
                <p className="text-sm text-dark-400 mb-4">1 visite = 1 tampon. Simple et universel.</p>
                <div className="flex flex-wrap gap-1.5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className={cn("w-8 h-8 rounded-full flex items-center justify-center", i < 4 ? "bg-gradient-to-br from-brand-500 to-accent-purple" : "border border-white/15")}>
                      {i < 4 && <Check size={12} className="text-white" strokeWidth={3} />}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-dark-500 mt-3">Idéal : coiffeurs, cafés, lavages auto</p>
                {form.mode === "stamps" && <div className="mt-4 flex items-center gap-1.5 text-brand-400 text-sm font-medium"><Check size={14} strokeWidth={3} /> Sélectionné</div>}
              </button>

              <button
                onClick={() => update("mode", "points")}
                className={cn(
                  "p-6 rounded-2xl border text-left transition-all",
                  form.mode === "points"
                    ? "bg-cyan-500/10 border-cyan-500/50 shadow-glow-cyan"
                    : "bg-dark-800/50 border-white/8 hover:border-cyan-500/30"
                )}
              >
                <div className={cn("p-3 rounded-xl w-fit mb-4 border", form.mode === "points" ? "bg-cyan-500/15 border-cyan-500/30" : "bg-dark-700 border-white/10")}>
                  <TrendingUp size={24} className={form.mode === "points" ? "text-cyan-400" : "text-dark-400"} />
                </div>
                <h3 className="font-bold text-white text-lg mb-1">Mode Points</h3>
                <p className="text-sm text-dark-400 mb-4">1$ dépensé = points. Flexible.</p>
                <div>
                  <p className="text-3xl font-bold text-white">340 <span className="text-base text-dark-400 font-normal">pts</span></p>
                  <div className="h-2 bg-dark-800 rounded-full mt-2 overflow-hidden">
                    <div className="h-full w-[68%] bg-gradient-to-r from-cyan-500 to-brand-400 rounded-full" />
                  </div>
                </div>
                <p className="text-xs text-dark-500 mt-3">Idéal : épiceries, mécaniciens, boutiques</p>
                {form.mode === "points" && <div className="mt-4 flex items-center gap-1.5 text-cyan-400 text-sm font-medium"><Check size={14} strokeWidth={3} /> Sélectionné</div>}
              </button>
            </div>

            <div className="mt-5 p-4 bg-dark-800/50 border border-white/5 rounded-xl">
              <p className="text-xs text-dark-400">
                💡 <strong className="text-dark-200">Conseil :</strong> Vous pouvez modifier ce choix dans les 30 premiers jours.
                Après, votre programme et vos clients seront adaptés à ce mode.
              </p>
            </div>
          </div>
        )}

        {/* Step 3 — Reward config */}
        {step === 3 && (
          <div>
            <div className="mb-8">
              <span className="badge-purple mb-3">Étape 3</span>
              <h1 className="text-2xl font-bold text-white">Configurez votre récompense</h1>
              <p className="text-dark-400 mt-1">Définissez ce que vos clients vont gagner.</p>
            </div>

            <div className="space-y-5">
              {form.mode === "stamps" ? (
                <>
                  <div>
                    <label className="label flex items-center gap-1.5">
                      Objectif de tampons
                      <span className="text-xs text-dark-500">(combien de visites pour la récompense ?)</span>
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min={5}
                        max={20}
                        value={form.goal}
                        onChange={e => update("goal", Number(e.target.value))}
                        className="flex-1 accent-brand-500"
                      />
                      <div className="w-16 text-center">
                        <span className="text-2xl font-bold text-white">{form.goal}</span>
                        <p className="text-xs text-dark-500">tampons</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {Array.from({ length: form.goal }).map((_, i) => (
                        <div key={i} className={cn("rounded-full flex items-center justify-center transition-all", i < Math.floor(form.goal * 0.6) ? "w-7 h-7 bg-gradient-to-br from-brand-500 to-accent-purple" : i === form.goal - 1 ? "w-7 h-7 border-2 border-amber-400/50 bg-amber-500/10" : "w-7 h-7 border border-white/10")}>
                          {i < Math.floor(form.goal * 0.6) ? <Check size={10} className="text-white" strokeWidth={3} /> : i === form.goal - 1 ? <Gift size={10} className="text-amber-400" /> : null}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="label flex items-center gap-1.5">
                      Description de la récompense
                      <span className="text-xs text-dark-500">(affiché sur la carte du client)</span>
                    </label>
                    <input
                      value={form.reward}
                      onChange={e => update("reward", e.target.value)}
                      placeholder="Ex : 1 coupe gratuite, café offert, 10$ de rabais..."
                      className="input-field"
                    />
                    <div className="flex gap-2 mt-2">
                      {["1 coupe gratuite", "Café offert", "Lavage gratuit"].map(s => (
                        <button key={s} onClick={() => update("reward", s)} className="text-xs px-3 py-1.5 bg-dark-800 border border-white/8 rounded-full text-dark-300 hover:text-white hover:border-brand-500/30 transition-all">
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="label">Taux de points</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[{ rate: 5, label: "1$ = 5 pts" }, { rate: 10, label: "1$ = 10 pts" }, { rate: 1, label: "1$ = 1 pt" }].map(({ rate, label }) => (
                        <button
                          key={rate}
                          onClick={() => update("pointsRate", rate)}
                          className={cn(
                            "p-3 rounded-xl border text-sm text-center transition-all",
                            form.pointsRate === rate ? "bg-brand-500/20 border-brand-500/40 text-white" : "bg-dark-800 border-white/8 text-dark-400 hover:border-white/20"
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="label">Première récompense</label>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <input
                          type="number"
                          placeholder="Ex : 500"
                          value={form.goal || ""}
                          onChange={e => update("goal", Number(e.target.value))}
                          className="input-field"
                          min={1}
                        />
                        <p className="text-xs text-dark-500 mt-1">Points requis</p>
                      </div>
                      <div className="flex-1">
                        <input
                          value={form.reward}
                          onChange={e => update("reward", e.target.value)}
                          placeholder="Ex : 5$ de rabais"
                          className="input-field"
                        />
                        <p className="text-xs text-dark-500 mt-1">Description</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Preview */}
              {form.reward && (
                <div className="p-4 glass border-brand-500/20 rounded-xl animate-slide-up">
                  <p className="text-xs text-brand-400 font-medium mb-2 flex items-center gap-1.5"><Sparkles size={12} /> Aperçu de la notification</p>
                  <p className="text-sm text-dark-200">
                    "Félicitations ! Vous avez gagné : <strong className="text-white">{form.reward}</strong>.
                    Montrez cette notification en caisse."
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Success step */}
        {step === 4 && (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-gradient-to-br from-brand-500 to-accent-purple rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-glow animate-pulse-glow">
              <QrCode size={36} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">Votre programme est prêt ! 🎉</h1>
            <p className="text-dark-400 max-w-sm mx-auto mb-8">
              Votre QR code est généré. Votre carte numérique est créée.
              Votre lien de partage est prêt. Imprimez votre QR code et accueillez votre premier client fidèle.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: form.name || "Votre commerce", sub: form.type || "Commerce" },
                { label: form.mode === "stamps" ? `${form.goal} tampons` : `${form.goal} points`, sub: "Pour la récompense" },
                { label: form.reward || "Récompense", sub: "À gagner" },
              ].map((item) => (
                <div key={item.label} className="glass-card p-3 text-center">
                  <p className="text-sm font-semibold text-white truncate">{item.label}</p>
                  <p className="text-xs text-dark-500 mt-0.5">{item.sub}</p>
                </div>
              ))}
            </div>

            <button onClick={finish} disabled={loading} className="btn-primary inline-flex items-center gap-2 text-base py-3.5 px-8">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Accéder à mon tableau de bord
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        )}

        {/* Navigation */}
        {step < 4 && (
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/5">
            {step > 1 ? (
              <button onClick={() => setStep(s => s - 1)} className="btn-ghost flex items-center gap-2">
                <ArrowLeft size={16} />
                Retour
              </button>
            ) : (
              <div />
            )}
            <button
              onClick={() => step === 3 ? setStep(4) : setStep(s => s + 1)}
              disabled={!canNext()}
              className="btn-primary flex items-center gap-2"
            >
              {step === 3 ? "Créer mon programme" : "Continuer"}
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
