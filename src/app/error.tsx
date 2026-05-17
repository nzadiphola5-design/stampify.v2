"use client";
import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="relative text-center max-w-md">
        <div className="w-16 h-16 bg-red-500/15 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <AlertTriangle size={28} className="text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Une erreur est survenue</h2>
        <p className="text-dark-400 text-sm mb-6">{error.message || "Quelque chose s'est mal passé."}</p>
        <button
          onClick={reset}
          className="btn-primary inline-flex items-center gap-2"
        >
          <RefreshCw size={15} />
          Réessayer
        </button>
      </div>
    </div>
  );
}
