"use client";
import { Check, QrCode } from "lucide-react";

// ─── Apple Wallet Card Content ───────────────────────────────────────────────
function AppleWalletCard({ color = "#6366f1", businessName = "Salon Élite", stamps = 7, goal = 10, reward = "1 coupe gratuite", logoLetter = "S" }: {
  color?: string; businessName?: string; stamps?: number; goal?: number; reward?: string; logoLetter?: string;
}) {
  return (
    <div style={{ background: "#1c1c1e", minHeight: 480, paddingTop: 4 }}>
      {/* Status bar */}
      <div className="flex justify-between items-center px-5 py-2">
        <span className="text-white text-[11px] font-semibold">9:41</span>
        <div className="flex gap-1.5 items-center">
          <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
            <rect x="0" y="4" width="2.5" height="7" rx="1" fill="white" fillOpacity="0.35"/>
            <rect x="3.5" y="2.5" width="2.5" height="8.5" rx="1" fill="white" fillOpacity="0.6"/>
            <rect x="7" y="1" width="2.5" height="10" rx="1" fill="white" fillOpacity="0.8"/>
            <rect x="10.5" y="0" width="2.5" height="11" rx="1" fill="white"/>
            <rect x="14" y="3" width="2" height="7" rx="1" fill="white" fillOpacity="0.3"/>
          </svg>
          <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
            <path d="M1 7.5C2.8 5.5 4.7 4.5 7 4.5S11.2 5.5 13 7.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            <path d="M3.5 9.5C4.8 8.2 5.8 7.5 7 7.5s2.2.7 3.5 2" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            <circle cx="7" cy="11" r="1" fill="white"/>
          </svg>
          <div className="flex items-center gap-0.5">
            <div className="w-[22px] h-[11px] rounded-sm border border-white/50 flex items-center px-0.5">
              <div className="h-[7px] rounded-[1px] bg-green-400" style={{ width: "75%" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic island */}
      <div className="flex justify-center mb-3">
        <div style={{ width: 120, height: 34, background: "#000", borderRadius: 20 }} />
      </div>

      {/* Apple Wallet label */}
      <div className="px-4 mb-3">
        <p className="text-white/40 text-[11px] font-medium uppercase tracking-widest">Wallet</p>
      </div>

      {/* Card */}
      <div className="px-3">
        <div className="rounded-[20px] overflow-hidden shadow-xl">
          {/* Card header */}
          <div className="px-5 pt-5 pb-4" style={{ background: color }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-white/60 text-[9px] uppercase tracking-[0.2em] font-medium">CARTE DE FIDÉLITÉ</p>
                <p className="text-white font-bold text-[15px] mt-1 leading-tight">{businessName}</p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center font-bold text-white text-[15px] shadow-inner">
                {logoLetter}
              </div>
            </div>
          </div>

          {/* Card body */}
          <div className="px-5 py-4" style={{ background: "#2c2c2e" }}>
            {/* Stamps */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {Array.from({ length: Math.min(goal, 10) }).map((_, i) => (
                <div key={i}
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
                  style={i < stamps
                    ? { background: color, border: `2px solid ${color}` }
                    : { border: "1.5px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.04)" }
                  }>
                  {i < stamps && <Check size={11} strokeWidth={3} className="text-white" />}
                </div>
              ))}
            </div>

            <p className="text-white/40 text-[10px] mb-1">
              {stamps}/{goal} tampons
              {goal - stamps > 0
                ? ` · encore ${goal - stamps} pour`
                : " · "}
              <span className="text-white/80 font-medium"> {reward}</span>
            </p>

            {/* Divider */}
            <div className="my-3 border-t border-white/8" />

            {/* Bottom row */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/30 text-[9px] uppercase tracking-wider mb-0.5">Client</p>
                <p className="text-white text-[12px] font-semibold">Marie D.</p>
              </div>
              <div className="w-12 h-12 bg-white rounded-xl p-2 shadow-lg">
                <QrCode size={32} className="text-black" />
              </div>
            </div>
          </div>
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center gap-1.5 mt-4">
          {[0,1,2].map(i => (
            <div key={i} className="rounded-full" style={{ width: i === 0 ? 16 : 6, height: 6, background: i === 0 ? "white" : "rgba(255,255,255,0.25)" }} />
          ))}
        </div>
      </div>

      {/* Home bar */}
      <div className="flex justify-center mt-6 pb-2">
        <div className="w-28 h-1 rounded-full bg-white/30" />
      </div>
    </div>
  );
}

// ─── Google Wallet Card Content ──────────────────────────────────────────────
function GoogleWalletCard({ color = "#6366f1", businessName = "Salon Élite", stamps = 7, goal = 10, reward = "1 coupe gratuite", logoLetter = "S" }: {
  color?: string; businessName?: string; stamps?: number; goal?: number; reward?: string; logoLetter?: string;
}) {
  return (
    <div style={{ background: "#202124", minHeight: 480 }}>
      {/* Status bar */}
      <div className="flex justify-between items-center px-5 pt-3 pb-1">
        <span className="text-white text-[11px] font-medium">9:41</span>
        <div className="flex gap-1.5 items-center">
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
            <rect x="0" y="5" width="2" height="5" rx="0.5" fill="white" fillOpacity="0.4"/>
            <rect x="3" y="3.5" width="2" height="6.5" rx="0.5" fill="white" fillOpacity="0.6"/>
            <rect x="6" y="2" width="2" height="8" rx="0.5" fill="white" fillOpacity="0.8"/>
            <rect x="9" y="0" width="2" height="10" rx="0.5" fill="white"/>
          </svg>
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
            <path d="M1 7C3 4.5 4.8 3.5 7 3.5S11 4.5 13 7" stroke="white" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M3.5 9C4.8 7.5 5.8 7 7 7s2.2.5 3.5 2" stroke="white" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <div className="flex items-center gap-0.5">
            <div className="w-[22px] h-[11px] rounded-sm border border-white/40 flex items-center px-0.5">
              <div className="h-[7px] rounded-[1px] bg-green-400" style={{ width: "70%" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Punch hole */}
      <div className="flex justify-center mb-2">
        <div style={{ width: 12, height: 12, background: "#000", borderRadius: "50%" }} />
      </div>

      {/* Google Wallet header */}
      <div className="px-4 flex items-center gap-2 mb-4">
        <svg width="20" height="20" viewBox="0 0 48 48">
          <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
        <span className="text-white/60 text-[12px] font-medium tracking-wide">Google Wallet</span>
      </div>

      {/* Card */}
      <div className="px-3">
        <div className="rounded-[18px] overflow-hidden shadow-xl">
          {/* Color band */}
          <div className="px-4 py-4 flex items-center gap-3" style={{ background: color }}>
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center font-bold text-white text-[16px] shadow-inner flex-shrink-0">
              {logoLetter}
            </div>
            <div>
              <p className="text-white font-bold text-[15px] leading-tight">{businessName}</p>
              <p className="text-white/65 text-[10px] mt-0.5">Programme de fidélité</p>
            </div>
          </div>

          {/* White body */}
          <div className="bg-white px-4 py-4">
            {/* Stamps */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {Array.from({ length: Math.min(goal, 10) }).map((_, i) => (
                <div key={i}
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={i < stamps
                    ? { background: color }
                    : { border: "1.5px solid #e5e7eb", background: "#f9fafb" }
                  }>
                  {i < stamps && <Check size={10} strokeWidth={3} className="text-white" />}
                </div>
              ))}
            </div>

            <div className="flex items-end justify-between">
              <div>
                <p className="text-gray-400 text-[9px] uppercase tracking-wider mb-0.5">Progression</p>
                <p className="text-gray-900 font-bold text-[12px]">{stamps}/{goal} tampons</p>
                <p className="text-[10px] mt-0.5 font-medium" style={{ color }}>{reward}</p>
              </div>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm" style={{ background: color + "18" }}>
                <QrCode size={24} style={{ color }} />
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-white/25 text-[9px] mt-3">Appuyez pour afficher le code</p>
      </div>

      {/* Home indicator */}
      <div className="flex justify-center mt-6 pb-2">
        <div className="w-24 h-1 rounded-full bg-white/20" />
      </div>
    </div>
  );
}

// ─── Phone frames ────────────────────────────────────────────────────────────
function IPhoneFrame({ children, tilt = 0 }: { children: React.ReactNode; tilt?: number }) {
  return (
    <div style={{ transform: `rotate(${tilt}deg)` }}>
      <div style={{
        width: 260, borderRadius: 42, padding: 7,
        background: "linear-gradient(160deg, #48484a 0%, #1c1c1e 100%)",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.13), 0 30px 70px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.18)",
        position: "relative",
      }}>
        <div style={{ borderRadius: 36, overflow: "hidden", background: "#000" }}>{children}</div>
        {/* Volume buttons */}
        <div style={{ position: "absolute", left: -3, top: 90, width: 3, height: 30, background: "#3a3a3c", borderRadius: "2px 0 0 2px" }} />
        <div style={{ position: "absolute", left: -3, top: 130, width: 3, height: 55, background: "#3a3a3c", borderRadius: "2px 0 0 2px" }} />
        <div style={{ position: "absolute", left: -3, top: 195, width: 3, height: 55, background: "#3a3a3c", borderRadius: "2px 0 0 2px" }} />
        {/* Power */}
        <div style={{ position: "absolute", right: -3, top: 110, width: 3, height: 65, background: "#3a3a3c", borderRadius: "0 2px 2px 0" }} />
      </div>
    </div>
  );
}

function AndroidFrame({ children, tilt = 0 }: { children: React.ReactNode; tilt?: number }) {
  return (
    <div style={{ transform: `rotate(${tilt}deg)` }}>
      <div style={{
        width: 252, borderRadius: 34, padding: 6,
        background: "linear-gradient(160deg, #2d2d2d 0%, #111 100%)",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.08), 0 30px 70px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.1)",
        position: "relative",
      }}>
        <div style={{ borderRadius: 29, overflow: "hidden", background: "#000" }}>{children}</div>
        {/* Side buttons */}
        <div style={{ position: "absolute", right: -3, top: 100, width: 3, height: 45, background: "#2d2d2d", borderRadius: "0 2px 2px 0" }} />
        <div style={{ position: "absolute", right: -3, top: 155, width: 3, height: 65, background: "#2d2d2d", borderRadius: "0 2px 2px 0" }} />
      </div>
    </div>
  );
}

// ─── Exported component ──────────────────────────────────────────────────────
export default function WalletMockups({
  color = "#6366f1", businessName = "Salon Élite",
  stamps = 7, goal = 10, reward = "1 coupe gratuite", logoLetter = "S",
  mode,
}: {
  color?: string; businessName?: string; stamps?: number; goal?: number; reward?: string; logoLetter?: string;
  mode?: "apple" | "google"; // single-phone mode for narrow containers
}) {
  const props = { color, businessName, stamps, goal, reward, logoLetter };

  // ── Single-phone mode (settings preview panel) ──────────────────────────
  if (mode) {
    return (
      <div className="relative flex flex-col items-center justify-center" style={{ minHeight: 480 }}>
        <div className="absolute rounded-full blur-[80px] opacity-20 pointer-events-none"
          style={{ width: 260, height: 260, top: "10%", left: "50%", transform: "translateX(-50%)", background: color }} />

        <div className="animate-float relative z-10">
          {mode === "apple" ? (
            <>
              <IPhoneFrame tilt={0}><AppleWalletCard {...props} /></IPhoneFrame>
              <div className="flex items-center justify-center gap-1.5 mt-3">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-white/50">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <span className="text-[11px] text-white/45 font-medium">Apple Wallet</span>
              </div>
            </>
          ) : (
            <>
              <AndroidFrame tilt={0}><GoogleWalletCard {...props} /></AndroidFrame>
              <div className="flex items-center justify-center gap-1.5 mt-3">
                <svg width="13" height="13" viewBox="0 0 48 48">
                  <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                <span className="text-[11px] text-white/45 font-medium">Google Wallet</span>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // ── Dual-phone mode (hero section) ─────────────────────────────────────
  return (
    <div className="relative w-full flex items-end justify-center gap-0" style={{ height: 540 }}>
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full blur-[90px] opacity-25"
          style={{ width: 300, height: 300, top: "20%", left: "10%", background: color }} />
        <div className="absolute rounded-full blur-[70px] opacity-15"
          style={{ width: 200, height: 200, top: "30%", right: "5%", background: "#22d3ee" }} />
      </div>

      {/* Google Wallet — Android (left, slightly behind) */}
      <div className="animate-float flex-shrink-0" style={{ marginRight: -32, marginBottom: 0, zIndex: 1, animationDelay: "0.5s" }}>
        <AndroidFrame tilt={-4}><GoogleWalletCard {...props} /></AndroidFrame>
        <div className="flex items-center justify-center gap-1.5 mt-3">
          <svg width="13" height="13" viewBox="0 0 48 48">
            <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          <span className="text-[11px] text-white/45 font-medium">Google Wallet</span>
        </div>
      </div>

      {/* Apple Wallet — iPhone (right, in front) */}
      <div className="animate-float flex-shrink-0" style={{ zIndex: 2, marginBottom: 24 }}>
        <IPhoneFrame tilt={4}><AppleWalletCard {...props} /></IPhoneFrame>
        <div className="flex items-center justify-center gap-1.5 mt-3">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-white/50">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
          <span className="text-[11px] text-white/45 font-medium">Apple Wallet</span>
        </div>
      </div>
    </div>
  );
}
