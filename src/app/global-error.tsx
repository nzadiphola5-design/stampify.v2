"use client";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ margin: 0, background: "#020817", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "sans-serif" }}>
        <div style={{ textAlign: "center", color: "#fff", maxWidth: 400, padding: "0 16px" }}>
          <div style={{ width: 64, height: 64, background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <AlertTriangle size={28} color="#f87171" />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Erreur critique</h2>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>{error.message || "L'application a rencontré une erreur inattendue."}</p>
          <button
            onClick={reset}
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", border: "none", borderRadius: 12, padding: "10px 24px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}
          >
            <RefreshCw size={15} />
            Recharger
          </button>
        </div>
      </body>
    </html>
  );
}
