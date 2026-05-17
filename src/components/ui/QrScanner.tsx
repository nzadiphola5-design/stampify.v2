"use client";
import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, Flashlight, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface QrScannerProps {
  onScan: (result: string) => void;
  onError?: (error: string) => void;
  active?: boolean;
  className?: string;
}

export default function QrScanner({ onScan, onError, active = true, className }: QrScannerProps) {
  const scannerRef = useRef<HTMLDivElement>(null);
  const [scannerInstance, setScannerInstance] = useState<any>(null);
  const [hasCamera, setHasCamera] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [torch, setTorch] = useState(false);
  const [cameras, setCameras] = useState<{ id: string; label: string }[]>([]);
  const [activeCamIdx, setActiveCamIdx] = useState(0);

  const startScanner = async (html5QrCode: any, cameraId?: string) => {
    try {
      const config = {
        fps: 10,
        qrbox: { width: 220, height: 220 },
        aspectRatio: 1.0,
        formatsToSupport: [0], // QR_CODE only
      };
      const deviceId = cameraId || (cameras[activeCamIdx]?.id ?? { facingMode: "environment" });
      await html5QrCode.start(
        typeof deviceId === "string" ? { deviceId: { exact: deviceId } } : deviceId,
        config,
        (decodedText: string) => {
          onScan(decodedText);
        },
        undefined
      );
      setScanning(true);
    } catch (err: any) {
      setHasCamera(false);
      onError?.(err.message || "Caméra inaccessible");
    }
  };

  useEffect(() => {
    if (!active || !scannerRef.current) return;

    let html5QrCode: any;

    const init = async () => {
      const { Html5Qrcode, Html5QrcodeScanner } = await import("html5-qrcode");
      html5QrCode = new Html5Qrcode(scannerRef.current!.id);
      setScannerInstance(html5QrCode);

      // Get available cameras
      try {
        const devices = await Html5Qrcode.getCameras();
        if (devices.length > 0) {
          setCameras(devices);
          await startScanner(html5QrCode, devices[devices.length - 1]?.id); // prefer back camera
        } else {
          setHasCamera(false);
          onError?.("Aucune caméra détectée");
        }
      } catch (err: any) {
        setHasCamera(false);
        onError?.(err.message);
      }
    };

    init();

    return () => {
      if (html5QrCode?.isScanning) {
        html5QrCode.stop().catch(() => {});
      }
    };
  }, [active]);

  const switchCamera = async () => {
    if (!scannerInstance || cameras.length < 2) return;
    if (scannerInstance.isScanning) await scannerInstance.stop();
    const nextIdx = (activeCamIdx + 1) % cameras.length;
    setActiveCamIdx(nextIdx);
    await startScanner(scannerInstance, cameras[nextIdx].id);
  };

  return (
    <div className={cn("relative", className)}>
      {/* Scanner container */}
      <div
        id="qr-scanner-container"
        ref={scannerRef}
        className={cn(
          "w-full rounded-2xl overflow-hidden bg-dark-900",
          !hasCamera && "hidden"
        )}
        style={{ minHeight: 280 }}
      />

      {/* Overlay UI — scan frame corners */}
      {scanning && hasCamera && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="relative w-52 h-52">
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-brand-400 rounded-tl-sm" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-brand-400 rounded-tr-sm" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-brand-400 rounded-bl-sm" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-brand-400 rounded-br-sm" />
            {/* Scan line animation */}
            <div className="absolute left-1 right-1 h-0.5 bg-gradient-to-r from-transparent via-brand-400 to-transparent top-0 animate-[scanline_2s_ease-in-out_infinite]" />
          </div>
        </div>
      )}

      {/* Camera controls */}
      {scanning && hasCamera && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-3 pointer-events-auto">
          {cameras.length > 1 && (
            <button
              onClick={switchCamera}
              className="p-2 glass rounded-xl text-dark-300 hover:text-white transition-colors"
              title="Changer de caméra"
            >
              <RefreshCw size={16} />
            </button>
          )}
        </div>
      )}

      {/* No camera fallback */}
      {!hasCamera && (
        <div className="flex flex-col items-center justify-center p-10 text-center">
          <CameraOff size={36} className="text-dark-500 mb-3" />
          <p className="text-dark-400 text-sm font-medium">Caméra inaccessible</p>
          <p className="text-dark-600 text-xs mt-1">Autorisez l&apos;accès à la caméra dans les paramètres du navigateur.</p>
        </div>
      )}

      <style jsx global>{`
        @keyframes scanline {
          0%, 100% { top: 0; }
          50% { top: calc(100% - 2px); }
        }
        #qr-scanner-container video { border-radius: 12px; }
        #qr-scanner-container #qr-shaded-region { border-radius: 12px; }
      `}</style>
    </div>
  );
}
